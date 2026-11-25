import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/d1';
import { and, eq } from 'drizzle-orm';
import type { Env } from '../types';
import { colleges } from '../db/schema';
import { encodeCursor, decodeCursor, getFromCache, putInCache } from '../lib/cache';
import { cdnUrl } from '../lib/r2';
import { AppError } from '../lib/errors';

type HonoEnv = { Bindings: Env };
const app = new Hono<HonoEnv>();

const listSchema = z.object({
  q:      z.string().max(100).optional(),
  tags:   z.string().max(500).optional(),
  sort:   z.enum(['nirf','package','fees','rating','popular']).default('popular'),
  minFee: z.coerce.number().min(0).max(50_000_000).optional(),
  maxFee: z.coerce.number().min(0).max(50_000_000).optional(),
  cursor: z.string().max(200).optional(),
  limit:  z.coerce.number().int().min(1).max(30).default(20),
});

const STATE_MAP: Record<string, string> = {
  'maharashtra': 'Maharashtra', 'tamil-nadu': 'Tamil Nadu',
  'karnataka': 'Karnataka', 'uttar-pradesh': 'Uttar Pradesh',
  'delhi': 'Delhi', 'bengaluru': 'Karnataka',
};
const OWNERSHIP_MAP: Record<string, string> = { 'govt': 'public', 'private': 'private', 'deemed': 'ppp' };

const ORDER_MAP: Record<string, string> = {
  nirf:    'nirf_rank_overall ASC NULLS LAST',
  package: 'avg_package_lpa DESC NULLS LAST',
  fees:    'min_fee_inr ASC NULLS LAST',
  rating:  'avg_rating DESC NULLS LAST',
  popular: 'popularity_score DESC NULLS LAST, id DESC',
};

// Returns parameterized SQL fragments for tag filters.
// Tags are validated to [a-z0-9-] before use — unknown tags are silently skipped.
function tagConditions(tagsParam: string | undefined): { sql: string[]; params: unknown[] } {
  const sql: string[] = [];
  const params: unknown[] = [];
  if (!tagsParam) return { sql, params };

  for (const raw of tagsParam.split(',')) {
    const tag = raw.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(tag)) continue; // reject anything that isn't safe
    if (STATE_MAP[tag])      { sql.push('state = ?');     params.push(STATE_MAP[tag]); }
    else if (OWNERSHIP_MAP[tag]) { sql.push('ownership = ?'); params.push(OWNERSHIP_MAP[tag]); }
    else if (tag === 'nirf-top50')  sql.push('nirf_rank_overall <= 50');
    else if (tag === 'nirf-top100') sql.push('nirf_rank_overall <= 100');
    else if (tag === 'naac-a')      sql.push("naac_grade IN ('A++','A+')");
    else { sql.push('tags_json LIKE ?'); params.push(`%"${tag}"%`); }
  }
  return { sql, params };
}

function collegeToCard(c: typeof colleges.$inferSelect, cdnBase: string) {
  return {
    id: c.id, slug: c.slug, name: c.name, short_name: c.short_name,
    city: c.city, state: c.state, ownership: c.ownership,
    naac_grade: c.naac_grade, nirf_rank_overall: c.nirf_rank_overall,
    avg_rating: c.avg_rating, review_count: c.review_count,
    min_fee_inr: c.min_fee_inr, avg_package_lpa: c.avg_package_lpa,
    highest_package_lpa: c.highest_package_lpa,
    logo_url: cdnUrl(cdnBase, c.logo_r2_key),
    cover_url: cdnUrl(cdnBase, c.cover_r2_key),
    tags: JSON.parse(c.tags_json) as string[],
    popularity_score: c.popularity_score,
  };
}

// GET /api/v1/colleges
app.get('/', zValidator('query', listSchema), async (c) => {
  const q = c.req.valid('query');
  const cacheKey = `v1:colleges:${JSON.stringify(q)}`;
  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  const cdnBase = c.env.R2_PUBLIC_CDN_URL;
  const cursorData = q.cursor ? decodeCursor(q.cursor) : null;

  // Build fully-parameterized WHERE clause
  const conditions = ['is_published = 1'];
  const params: unknown[] = [];

  if (q.minFee !== undefined) { conditions.push('min_fee_inr >= ?'); params.push(q.minFee); }
  if (q.maxFee !== undefined) { conditions.push('min_fee_inr <= ?'); params.push(q.maxFee); }

  const { sql: tagSql, params: tagParams } = tagConditions(q.tags);
  conditions.push(...tagSql);
  params.push(...tagParams);

  // FTS: use EXISTS subquery with ? binding — no string interpolation
  if (q.q) {
    const safe = q.q.replace(/[^\w\s-]/g, '').trim();
    if (safe) {
      conditions.push('EXISTS (SELECT 1 FROM colleges_fts WHERE college_id = colleges.id AND colleges_fts MATCH ?)');
      params.push(`"${safe}"*`);
    }
  }

  // Cursor pagination — IDs already UUID-validated in decodeCursor
  if (cursorData && q.sort === 'popular') {
    conditions.push('(popularity_score < ? OR (popularity_score = ? AND id < ?))');
    params.push(cursorData.popularityScore, cursorData.popularityScore, cursorData.id);
  }

  params.push(q.limit + 1);
  const sql = `SELECT colleges.* FROM colleges WHERE ${conditions.join(' AND ')} ORDER BY ${ORDER_MAP[q.sort] ?? 'popularity_score DESC, id DESC'} LIMIT ?`;

  const rows = await c.env.DB.prepare(sql).bind(...params).all<typeof colleges.$inferSelect>();
  const results = rows.results ?? [];
  const hasMore = results.length > q.limit;
  const items = results.slice(0, q.limit);
  const lastItem = items[items.length - 1];
  const nextCursor = hasMore && lastItem ? encodeCursor(lastItem.popularity_score, lastItem.id) : null;

  const data = {
    data: items.map(col => collegeToCard(col, cdnBase)),
    meta: { cursor: nextCursor, hasMore, total: items.length },
  };
  const cc = 'public, max-age=60, s-maxage=600, stale-while-revalidate=300';
  await putInCache(cacheKey, data, 600, { 'Cache-Control': cc });
  return c.json(data, 200, { 'Cache-Control': cc });
});

// GET /api/v1/colleges/compare
app.get('/compare', zValidator('query', z.object({ slugs: z.string().max(200) })), async (c) => {
  const slugList = c.req.valid('query').slugs.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4);
  if (slugList.length < 2) throw new AppError('BAD_REQUEST', 'At least 2 college slugs required', 400);

  const cacheKey = `v1:compare:${[...slugList].sort().join(',')}`;
  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  const cdnBase = c.env.R2_PUBLIC_CDN_URL;
  const ph = slugList.map(() => '?').join(',');
  const rows = await c.env.DB
    .prepare(`SELECT * FROM colleges WHERE slug IN (${ph}) AND is_published = 1`)
    .bind(...slugList).all<typeof colleges.$inferSelect>();

  const collegeList = rows.results ?? [];
  if (collegeList.length === 0) throw new AppError('NOT_FOUND', 'Colleges not found', 404);

  const ids = collegeList.map(cl => cl.id);
  const coursesData = await c.env.DB.prepare(`
    SELECT cc.*, c.name as course_name, c.degree_level, c.stream, c.duration_months
    FROM college_courses cc
    JOIN courses c ON cc.course_id = c.id
    WHERE cc.college_id IN (${ids.map(() => '?').join(',')})
  `).bind(...ids).all<Record<string, unknown>>();

  const coursesByCollege = new Map<string, unknown[]>();
  for (const r of (coursesData.results ?? [])) {
    const cid = r['college_id'] as string;
    coursesByCollege.set(cid, [...(coursesByCollege.get(cid) ?? []), r]);
  }

  const data = {
    data: collegeList.map(col => ({
      ...collegeToCard(col, cdnBase),
      established_year: col.established_year,
      address: col.address,
      overview: JSON.parse(col.overview_json),
      facilities: JSON.parse(col.facilities_json),
      courses: coursesByCollege.get(col.id) ?? [],
    })),
  };

  const cc = 'public, max-age=60, s-maxage=1800, stale-while-revalidate=300';
  await putInCache(cacheKey, data, 1800, { 'Cache-Control': cc });
  return c.json(data, 200, { 'Cache-Control': cc });
});

// GET /api/v1/colleges/:slug
app.get('/:slug', zValidator('param', z.object({ slug: z.string().max(100) })), async (c) => {
  const { slug } = c.req.valid('param');
  const cacheKey = `v1:college:${slug}`;
  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  const cdnBase = c.env.R2_PUBLIC_CDN_URL;
  const db = drizzle(c.env.DB);

  const college = await db.select().from(colleges)
    .where(and(eq(colleges.slug, slug), eq(colleges.is_published, true))).get();
  if (!college) throw new AppError('NOT_FOUND', 'College not found', 404);

  const [coursesRows, cutoffRows, reviewRows, similarRows] = await Promise.all([
    c.env.DB.prepare(`
      SELECT cc.*, c.name as course_name, c.degree_level, c.stream, c.duration_months
      FROM college_courses cc JOIN courses c ON cc.course_id = c.id
      WHERE cc.college_id = ? ORDER BY cc.total_tuition_fee_inr ASC
    `).bind(college.id).all<Record<string, unknown>>(),

    c.env.DB.prepare(`
      SELECT co.closing_value, co.category, co.year, co.round, e.name as exam_name, c.name as course_name
      FROM college_cutoffs co JOIN exams e ON co.exam_id = e.id JOIN courses c ON co.course_id = c.id
      WHERE co.college_id = ? AND co.year >= 2023 AND co.gender = 'gender_neutral'
      ORDER BY co.year DESC, co.closing_value ASC LIMIT 20
    `).bind(college.id).all<Record<string, unknown>>(),

    c.env.DB.prepare(`
      SELECT id, rating_overall, rating_placements, rating_infra, rating_faculty,
             title, pros, cons, created_at
      FROM college_reviews WHERE college_id = ? AND status = 'approved'
      ORDER BY created_at DESC LIMIT 5
    `).bind(college.id).all<Record<string, unknown>>(),

    c.env.DB.prepare(`
      SELECT id, slug, name, short_name, nirf_rank_overall, avg_rating, logo_r2_key
      FROM colleges WHERE state = ? AND is_published = 1 AND id != ?
      ORDER BY popularity_score DESC LIMIT 5
    `).bind(college.state, college.id).all<Record<string, unknown>>(),
  ]);

  const data = {
    data: {
      ...collegeToCard(college, cdnBase),
      established_year: college.established_year, address: college.address,
      nirf_rank_engineering: college.nirf_rank_engineering,
      nirf_rank_management: college.nirf_rank_management,
      nirf_rank_medical: college.nirf_rank_medical,
      max_fee_inr: college.max_fee_inr,
      overview: JSON.parse(college.overview_json),
      facilities: JSON.parse(college.facilities_json),
      courses: coursesRows.results ?? [],
      cutoffs_summary: cutoffRows.results ?? [],
      top_reviews: reviewRows.results ?? [],
      similar_colleges: (similarRows.results ?? []).map(s => ({
        ...s, logo_url: cdnUrl(cdnBase, s['logo_r2_key'] as string | null),
      })),
    },
  };

  const cc = 'public, max-age=60, s-maxage=3600, stale-while-revalidate=600';
  await putInCache(cacheKey, data, 3600, { 'Cache-Control': cc });
  return c.json(data, 200, { 'Cache-Control': cc });
});

// GET /api/v1/colleges/:slug/reviews
app.get('/:slug/reviews',
  zValidator('param', z.object({ slug: z.string().max(100) })),
  zValidator('query', z.object({
    cursor: z.string().optional(),
    limit:  z.coerce.number().int().min(1).max(20).default(10),
  })),
  async (c) => {
    const { slug } = c.req.valid('param');
    const { cursor, limit } = c.req.valid('query');

    const col = await c.env.DB
      .prepare('SELECT id FROM colleges WHERE slug = ? AND is_published = 1')
      .bind(slug).first<{ id: string }>();
    if (!col) throw new AppError('NOT_FOUND', 'College not found', 404);

    // Decode cursor — if it looks wrong, treat as "no cursor" rather than erroring
    let afterTs: string | null = null;
    if (cursor) {
      try { afterTs = atob(cursor); } catch { /* invalid base64 → no cursor */ }
    }

    // Fully parameterized — no string interpolation of user data
    const rows = await c.env.DB.prepare(`
      SELECT id, rating_overall, rating_placements, rating_infra, rating_faculty,
             title, pros, cons, created_at
      FROM college_reviews
      WHERE college_id = ? AND status = 'approved' AND (? IS NULL OR created_at < ?)
      ORDER BY created_at DESC LIMIT ?
    `).bind(col.id, afterTs, afterTs, limit + 1).all<Record<string, unknown>>();

    const results = rows.results ?? [];
    const hasMore = results.length > limit;
    const items = results.slice(0, limit);
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore && lastItem ? btoa(String(lastItem['created_at'])) : null;

    return c.json({ data: items, meta: { cursor: nextCursor, hasMore } }, 200, {
      'Cache-Control': 'public, max-age=60, s-maxage=600, stale-while-revalidate=120',
    });
  },
);

export default app;
