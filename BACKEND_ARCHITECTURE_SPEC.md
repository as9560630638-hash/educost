# BACKEND ARCHITECTURE & IMPLEMENTATION SPECIFICATION

**Project:** High-Scale Indian College Consultation & Discovery Platform (Shiksha-class)

**Target Scale:** 1–5+ Lakh Day-1 Users | 2,000–5,000+ Concurrent Users | 90–95% Read-Heavy Workload

**Primary Goal:** Build a fault-tolerant, low-latency, horizontally scalable Node.js backend that survives Day-1 traffic spikes without database exhaustion, cache stampedes, or OTP-bombing bill drains.

---

## 0. Coding Agent Operating Instructions

Follow these non-negotiable engineering rules across every phase:

1. **Strict TypeScript:** Enable `"strict": true`, `"noUncheckedIndexedAccess": true`, and `"exactOptionalPropertyTypes": true`. Zero `any` types.
2. **Modular Monolith with Dual Entrypoints:** Build a single clean TypeScript repository that compiles into two independently scalable runtime processes:
   * `src/server.ts` — Stateless HTTP API server (Fastify v5).
   * `src/worker.ts` — Background job processor (BullMQ workers).
3. **Never Block the Event Loop:** All SMS, email, brochure generation, search indexing, and CRM webhook calls MUST be offloaded to BullMQ queues. API endpoints must return within 50 ms on cache hits and under 150 ms on DB writes.
4. **No Single Point of Failure (SPOF) & Graceful Degradation:** Inspired by Shiksha.com's production architecture, college pages aggregate multiple widgets (overview, courses, cutoffs, reviews, similar colleges). If a secondary dependency (e.g., Typesense or a non-critical widget query) fails or times out, degrade gracefully and return partial data rather than throwing a `500` for the entire page.
5. **Dual-Redis Separation (Mandatory):** Never share a single Redis eviction policy between API caching and BullMQ queues. Use `REDIS_CACHE_URL` (`allkeys-lru`) for cache/rate-limits and `REDIS_QUEUE_URL` (`noeviction` + AOF persistence) for BullMQ.
6. **PgBouncer Safety:** Always route runtime queries through `DATABASE_URL` (transaction-mode pooler) with named prepared statements disabled (`prepare: false`), and route migrations/CLI scripts strictly through `DATABASE_DIRECT_URL`.
7. **Execution Order:** Implement strictly in the phased order defined in **Section 12**. After each phase, run typecheck, lint, and automated tests before advancing.

---

## 1. Locked Tech Stack & Exact Dependencies

| Layer | Technology | Exact Packages / Notes |
| --- | --- | --- |
| **Runtime** | **Node.js 24 LTS** (or **Node.js 26 LTS**) | Pin version in `.nvmrc` and `Dockerfile` (`node:24-alpine`). Native `fetch` and `crypto`. |
| **HTTP Framework** | **Fastify v5** | `fastify`, `@fastify/cors`, `@fastify/helmet`, `@fastify/cookie`, `@fastify/compress`, `@fastify/multipart` |
| **Validation & Types** | **Zod v4 + Fastify Type Provider** | `zod`, `fastify-type-provider-zod` (or `@fastify/type-provider-zod`) for runtime validation + compiled JSON serialization. |
| **ORM & SQL Driver** | **Drizzle ORM + `postgres.js`** | `drizzle-orm`, `drizzle-kit`, `postgres` (thin SQL-shaped builder, zero Rust engine overhead, direct SQL control for joins and cutoff range queries). |
| **Primary Database** | **PostgreSQL 16/17 + PgBouncer** | Primary for writes + Read Replica (`DATABASE_READ_URL`) for heavy analytical/read misses. |
| **Cache & Rate Limit** | **Redis 7 / Valkey (Cache Instance)** | `ioredis` — configured with `maxmemory-policy allkeys-lru`. |
| **Message Queue** | **BullMQ + Redis/Valkey (Queue Instance)** | `bullmq`, `ioredis` — configured with `maxmemory-policy noeviction` and AOF persistence. |
| **Search Engine** | **Typesense** | `typesense` — sub-20 ms typo-tolerant, faceted college/course/exam search. |
| **Object Storage** | **Cloudflare R2** | `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` (S3-compatible, $0 egress). |
| **Email Service** | **Amazon SES v2 (`ap-south-1`)** | `@aws-sdk/client-sesv2` (`SendEmailCommand`). |
| **SMS / OTP Service** | **MSG91 v5** (Primary) / **Fast2SMS** (Fallback) | Provider Adapter interface via native `fetch` (zero bloated SDKs). |
| **Bot / Abuse Defense** | **Cloudflare Turnstile** | Server-side verification against `https://challenges.cloudflare.com/turnstile/v0/siteverify`. |
| **Auth** | **Custom JWT + Google OAuth 2.0** | `jose` (RS256/HS256 JWTs), `argon2` (admin password hashing). Zero per-MAU SaaS lock-in. |
| **Observability** | **Pino + Sentry + OpenTelemetry** | Fastify built-in `pino` structured JSON logs, `@sentry/node`, Prometheus metrics (`prom-client`). |

---

## 2. Repository Folder Structure

Scaffold the backend using a clean domain-modular architecture:

```text
backend/
├── src/
│   ├── server.ts                      # HTTP API entrypoint (Fastify + graceful shutdown)
│   ├── worker.ts                      # BullMQ worker entrypoint (graceful shutdown)
│   ├── app.ts                         # Fastify factory (plugins, error handler, routes)
│   ├── config/
│   │   ├── env.ts                     # Zod-validated environment config (fail-fast on boot)
│   │   ├── db.ts                      # Drizzle primary + read-replica pools (prepare: false)
│   │   ├── redis.ts                   # Separate redisCache and redisQueue ioredis clients
│   │   ├── typesense.ts               # Typesense client + collection schema bootstrap
│   │   └── r2.ts                      # Cloudflare R2 S3 client
│   ├── db/
│   │   ├── schema/
│   │   │   ├── index.ts
│   │   │   ├── users.ts               # users, refresh_tokens, oauth_accounts
│   │   │   ├── colleges.ts            # colleges, college_media, college_rankings
│   │   │   ├── courses.ts             # courses, college_courses, exams, college_cutoffs
│   │   │   ├── leads.ts               # counseling_leads, brochure_downloads, counselors
│   │   │   └── reviews.ts             # college_reviews, qa_questions, qa_answers
│   │   ├── migrations/                # Generated by drizzle-kit
│   │   └── seed.ts                    # Realistic Indian college/exam/cutoff seed script
│   ├── lib/
│   │   ├── cache.ts                   # Cache-Aside + Single-Flight Lock + TTL Jitter + Purge
│   │   ├── rate-limit.ts              # Redis Lua Sliding-Window Rate Limiter
│   │   ├── turnstile.ts               # Cloudflare Turnstile siteverify client
│   │   ├── sms/
│   │   │   ├── sms.interface.ts       # SmsProvider interface
│   │   │   ├── msg91.provider.ts      # MSG91 v5 API implementation
│   │   │   └── fast2sms.provider.ts   # Fast2SMS DLT fallback implementation
│   │   ├── email/
│   │   │   ├── ses.service.ts         # AWS SES v2 wrapper
│   │   │   └── templates/             # Welcome, Brochure link, Lead confirmation HTML
│   │   ├── jwt.ts                     # Access + Refresh token sign/verify/rotate
│   │   ├── graceful-degrade.ts        # Timeout + fallback wrapper for page widgets
│   │   └── errors.ts                  # Typed AppError classes & RFC 7807 error formatter
│   ├── queues/
│   │   ├── index.ts                   # Queue definitions (otp-sms, email, search-sync, lead-route, analytics)
│   │   └── workers/
│   │       ├── sms.worker.ts
│   │       ├── email.worker.ts
│   │       ├── search-sync.worker.ts
│   │       └── lead-routing.worker.ts # Weighted Round-Robin counselor assignment
│   ├── modules/
│   │   ├── auth/                      # auth.routes.ts, auth.service.ts, auth.schema.ts
│   │   ├── colleges/                  # listings, detail aggregator, compare, similar
│   │   ├── search/                    # Typesense faceted search + autocomplete
│   │   ├── predictor/                 # Rank-to-college cutoff range predictor
│   │   ├── leads/                     # Counseling requests + brochure gated downloads
│   │   ├── reviews/                   # Student reviews + moderation + rating aggregation
│   │   └── admin/                     # CRUD colleges/cutoffs + explicit cache purge + bulk import
│   └── plugins/
│       ├── auth.plugin.ts             # JWT verification + RBAC decorators (student, counselor, admin)
│       └── metrics.plugin.ts          # /health, /ready, /metrics endpoints
├── scripts/
│   ├── warm-cache.ts                  # Pre-launch script to warm top 1,000 college/filter URLs
│   └── reindex-typesense.ts           # Full Postgres -> Typesense zero-downtime alias swap
├── load-tests/
│   └── day1-spike.k6.js               # k6 script simulating 5,000 VUs
├── docker-compose.yml                 # Local Postgres, PgBouncer, Redis-Cache, Redis-Queue, Typesense
├── Dockerfile                         # Multi-stage minimal Alpine build
├── drizzle.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Database Architecture & Schema (PostgreSQL + Drizzle)

### 3.1 Connection Pooling & Read/Write Splitting Rules

Configure `src/config/db.ts` using two pools:

* `dbWrite` connects to `DATABASE_URL` (PgBouncer Transaction Mode) with `prepare: false` and `max: 15` per Node worker.
* `dbRead` connects to `DATABASE_READ_URL` (falls back to `DATABASE_URL` in dev) with `prepare: false` and `max: 25` per Node worker.
* `drizzle.config.ts` MUST use `DATABASE_DIRECT_URL` so schema migrations never pass through PgBouncer transaction mode.

```typescript
// src/config/db.ts (Reference pattern)
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { env } from './env';

const writeClient = postgres(env.DATABASE_URL, {
  prepare: false, // Mandatory for PgBouncer transaction pooling
  max: env.DB_WRITE_POOL_MAX,
  idle_timeout: 20,
  connect_timeout: 10,
});

const readClient = postgres(env.DATABASE_READ_URL ?? env.DATABASE_URL, {
  prepare: false,
  max: env.DB_READ_POOL_MAX,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const dbWrite = drizzle(writeClient, { schema });
export const dbRead = drizzle(readClient, { schema });
```

### 3.2 Core Relational Tables & Mandatory Indexes

Implement these tables in `src/db/schema/` using `uuid` primary keys (or `bigint` identity for high-write tables like `counseling_leads` and `college_cutoffs`):

1. **`users`**
   * Columns: `id (uuid PK)`, `email (text unique nullable)`, `phone (text unique nullable, E.164 format)`, `full_name (text)`, `role (enum: student | counselor | admin)`, `password_hash (text nullable)`, `phone_verified_at (timestamptz)`, `email_verified_at (timestamptz)`, `target_stream (text)`, `target_exam (text)`, `state (text)`, `created_at`, `updated_at`.
   * Indexes: Unique partial indexes on `phone` and `email`.

2. **`colleges`**
   * Columns: `id (uuid PK)`, `slug (text unique NOT NULL)`, `name (text NOT NULL)`, `short_name (text)`, `acronyms (text[])`, `ownership (enum: public | private | ppp)`, `established_year (int)`, `state (text NOT NULL)`, `city (text NOT NULL)`, `address (text)`, `naac_grade (text)`, `nirf_rank_overall (int)`, `nirf_rank_engineering (int)`, `nirf_rank_management (int)`, `nirf_rank_medical (int)`, `avg_rating (numeric(3,2))`, `review_count (int)`, `min_fee_inr (int)`, `max_fee_inr (int)`, `avg_package_lpa (numeric(5,2))`, `highest_package_lpa (numeric(6,2))`, `logo_r2_key (text)`, `cover_r2_key (text)`, `brochure_r2_key (text)`, `overview_json (jsonb)`, `facilities (text[])`, `popularity_score (int)`, `is_published (boolean)`, `updated_at (timestamptz)`.
   * **Composite Indexes:**
     * `idx_colleges_slug` (`slug`)
     * `idx_colleges_filter_pop` (`is_published`, `state`, `ownership`, `popularity_score DESC`, `id`) — cursor-based pagination without `OFFSET`.
     * `idx_colleges_city_pop` (`is_published`, `city`, `popularity_score DESC`, `id`).

3. **`courses` & `college_courses`**
   * `courses`: `id (uuid PK)`, `slug (text unique)`, `name (text)`, `degree_level (enum: ug | pg | diploma | phd)`, `stream (enum: engineering | management | medical | law | arts | science | design)`, `duration_months (int)`.
   * `college_courses`: `id (uuid PK)`, `college_id (FK colleges)`, `course_id (FK courses)`, `total_tuition_fee_inr (int)`, `seat_intake (int)`, `eligibility_summary (text)`, `accepted_exam_ids (uuid[])`.
   * **Composite Indexes:** `(college_id, course_id)`, `(course_id, total_tuition_fee_inr)`.

4. **`exams` & `college_cutoffs` (Powers the College Predictor)**
   * `exams`: `id (uuid PK)`, `slug (text unique)`, `name (text)`, `stream (text)`, `score_type (enum: rank | percentile | marks)`.
   * `college_cutoffs`: `id (bigserial PK)`, `college_id (FK)`, `course_id (FK)`, `exam_id (FK)`, `year (smallint NOT NULL)`, `round (smallint)`, `category (enum: general | obc_ncl | sc | st | ews | pwd)`, `quota (enum: all_india | home_state | other_state)`, `gender (enum: gender_neutral | female_only)`, `opening_value (numeric(10,2))`, `closing_value (numeric(10,2) NOT NULL)`.
   * **CRITICAL Composite B-Tree Index:**
     `CREATE INDEX idx_cutoffs_predictor ON college_cutoffs (exam_id, year, category, quota, gender, closing_value);`
     *Enables a single B-Tree range scan under 10 ms for Safe/Moderate/Ambitious bucketing.*

5. **`counseling_leads` (High-Write — Keep Indexes Minimal!)**
   * Columns: `id (bigserial PK)`, `user_id (uuid nullable FK)`, `college_id (uuid nullable FK)`, `course_id (uuid nullable FK)`, `student_name (text NOT NULL)`, `phone (text NOT NULL)`, `email (text)`, `city (text)`, `stream (text)`, `intent_type (enum: brochure_download | counseling_callback | apply_now | predictor_unlock)`, `utm_source`, `utm_medium`, `utm_campaign`, `assigned_counselor_id (uuid nullable FK)`, `status (enum: new | assigned | contacted | converted | junk)`, `idempotency_key (text unique)`, `created_at (timestamptz)`.
   * **Indexes:** Only `(idempotency_key)` unique, `(phone, college_id, intent_type, created_at DESC)`, and `(assigned_counselor_id, status, created_at DESC)`.

6. **`counselors`**
   * Columns: `id (uuid PK)`, `user_id (uuid unique FK)`, `specializations (text[])`, `daily_cap (int default 50)`, `weight (int default 1)`, `is_active (boolean default true)`.

7. **`college_reviews`**
   * Columns: `id (uuid PK)`, `college_id (FK)`, `user_id (FK)`, `rating_overall (smallint)`, `rating_placements (smallint)`, `rating_infra (smallint)`, `rating_faculty (smallint)`, `title (text)`, `pros (text)`, `cons (text)`, `status (enum: pending | approved | rejected)`, `created_at (timestamptz)`.
   * **Index:** `(college_id, status, created_at DESC)` — denormalized `avg_rating` updated via BullMQ, never `AVG()` on every page load.

---

## 4. Search Engine Specification (Typesense)

Never use SQL `ILIKE '%query%'` for college search. Sync published colleges to Typesense collection `colleges_v1` (accessed via alias `colleges` for zero-downtime reindexing).

### Collection Schema (`src/config/typesense.ts`)

```typescript
export const COLLEGES_COLLECTION_SCHEMA = {
  name: 'colleges_v1',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'slug', type: 'string', index: false },
    { name: 'name', type: 'string' },
    { name: 'short_name', type: 'string', optional: true },
    { name: 'acronyms', type: 'string[]', optional: true },
    { name: 'city', type: 'string', facet: true },
    { name: 'state', type: 'string', facet: true },
    { name: 'ownership', type: 'string', facet: true },
    { name: 'streams', type: 'string[]', facet: true },
    { name: 'degrees', type: 'string[]', facet: true },
    { name: 'exams_accepted', type: 'string[]', facet: true },
    { name: 'naac_grade', type: 'string', facet: true, optional: true },
    { name: 'min_fee_inr', type: 'int32', facet: true },
    { name: 'max_fee_inr', type: 'int32', facet: true },
    { name: 'nirf_rank_overall', type: 'int32', optional: true },
    { name: 'avg_rating', type: 'float' },
    { name: 'avg_package_lpa', type: 'float', optional: true },
    { name: 'popularity_score', type: 'int32' },
    { name: 'logo_url', type: 'string', index: false, optional: true },
  ],
  default_sorting_field: 'popularity_score',
} as const;
```

### Search Query Strategy

* **Query Weights:** `query_by: 'name,short_name,acronyms,city,state,exams_accepted'` with `query_by_weights: '5,4,4,2,1,2'`.
* **Typo Tolerance:** `num_typos: 2` — `"iit bombai"` or `"vit bhopall"` resolve cleanly.
* **Sync Pipeline:** Admin create/update/publish → BullMQ `search-sync` job → Typesense upsert.
* **Graceful Fallback:** Typesense timeout (>400 ms) → catch → `pg_trgm` / prefix query on read replica + alert log.

---

## 5. Core High-Scale Algorithms & Caching Design

### 5.1 Dual-Redis Configuration (`src/config/redis.ts`)

* **`redisCache`** (`REDIS_CACHE_URL`): `maxmemory-policy allkeys-lru`. Fast fail (`maxRetriesPerRequest: 2`, `enableOfflineQueue: false`).
* **`redisQueue`** (`REDIS_QUEUE_URL`): `maxmemory-policy noeviction` + AOF persistence. Workers: `maxRetriesPerRequest: null`. Producers: `enableOfflineQueue: false`.

### 5.2 Cache Key Taxonomy & TTLs (with ±10% Jitter)

Always add `ttl = baseTtl + random(-0.1*baseTtl, +0.1*baseTtl)` to prevent thundering herd on pre-warmed keys.

| Data Type | Redis Key Pattern | Base TTL | Invalidation Trigger |
| --- | --- | --- | --- |
| College Detail Page | `v1:college:slug:{slug}` | 3600s | Explicit `DEL` on admin update |
| Filtered Listings | `v1:list:{namespaceVer}:{sha256(sortedParams)}` | 600s | Bump `v1:ns:listings` counter |
| College Predictor | `v1:predict:{exam}:{year}:{cat}:{quota}:{bucketedRank}` | 1800s | Bump `v1:ns:cutoffs` on import |
| Search Autocomplete | `v1:ac:{lowercasePrefix}` | 900s | TTL expiry |
| OTP Hash | `v1:otp:{e164Phone}` | 300s | Deleted on successful verify |
| Rate Limits | `v1:rl:{scope}:{identifier}` | Window size | Sliding window auto-expire |
| Refresh Token | `v1:rt:{userId}:{tokenId}` | 30 days | Deleted on logout / rotation |

### 5.3 Cache-Aside + Single-Flight Stampede Protection (`src/lib/cache.ts`)

`getOrSetWithLock<T>(key, baseTtlSeconds, fetcher)`:

1. `GET key` → cache hit → return immediately.
2. Miss → attempt `SET lock:{key} {instanceId} NX PX 5000`.
3. **Lock acquired (Winner):** Execute `fetcher()`, write `SET key json EX jitteredTtl`, release lock via Lua (atomic identity check).
4. **Lock NOT acquired (Waiters):** Poll `GET key` every 40 ms × 6 attempts (~240 ms). Still empty → execute `fetcher()` as safety fallback.

### 5.4 Sliding-Window Rate Limiter (`src/lib/rate-limit.ts`)

Atomic Redis Lua Script (Sorted Set: `ZREMRANGEBYSCORE` + `ZCARD` + `ZADD` + `PEXPIRE`):

* **Global Public API (per IP):** 120 req / 60s
* **Search / Autocomplete (per IP):** 60 req / 60s
* **OTP Request (per Phone):** 3 req / 10 min AND 5 req / 24 hr + 45s minimum cooldown between resends
* **OTP Request (per IP):** 10 req / 15 min
* **OTP Verify (per Phone):** 5 failed attempts → immediately `DEL v1:otp:{phone}`

### 5.5 College Predictor Algorithm (`src/modules/predictor/`)

Given `(examSlug, year, category, quota, gender, userValue)`:

1. Look up `exam.score_type` (`rank` = lower is better; `percentile`/`marks` = higher is better).
2. Query `college_cutoffs` using `idx_cutoffs_predictor` composite index.
3. For rank-based exams (JEE Main, NEET):
   * **Safe:** `closing_value >= userValue * 1.15`
   * **Moderate:** `closing_value >= userValue * 0.90 AND < userValue * 1.15`
   * **Ambitious:** `closing_value >= userValue * 0.70 AND < userValue * 0.90`
4. Bucket rank inputs to nearest 50/100 (or 0.25 percentile) in cache key so nearby ranks share entries.

### 5.6 Weighted Round-Robin Lead Routing (`src/queues/workers/lead-routing.worker.ts`)

1. Fetch active counselors matching `lead.stream` with daily counter `v1:counselor:daily:{id}:{YYYY-MM-DD}` below `daily_cap`.
2. Select next counselor atomically via weighted Redis list/counter.
3. `INCR` + `EXPIRE 86400` daily counter, update `assigned_counselor_id`, trigger counselor email/webhook.

---

## 6. Third-Party Integrations (Exact API Contracts)

### 6.1 Cloudflare Turnstile (`src/lib/turnstile.ts`)

Mandatory on `/v1/auth/otp/request`, `/v1/leads`, `/v1/reviews`.

* **Endpoint:** `POST https://challenges.cloudflare.com/turnstile/v0/siteverify`
* **Payload:** `{ "secret": "...", "response": "client_token", "remoteip": "CF-Connecting-IP" }`
* **Rules:** 3-second timeout. Check `data.success === true` AND `data.hostname` matches allowed frontend domain. Tokens are single-use (300s expiry).

### 6.2 OTP Architecture & SMS Provider Adapter (`src/lib/sms/`)

Generate OTP on backend (`crypto.randomInt(100000, 999999)`), store `HMAC-SHA256(otp, OTP_PEPPER)` + attempt count in `redisCache` (EX 300), push SMS job to BullMQ `otp-sms` queue.

* **MSG91 OTP v5 (Primary):**
  * `POST https://control.msg91.com/api/v5/otp?template_id={ID}&mobile={e164WithoutPlus}&otp={otp}&otp_expiry=5&realTimeResponse=1`
  * Headers: `authkey: {MSG91_AUTH_KEY}`, `content-type: application/json`
  * Check response `type === "success"`.
* **Fast2SMS DLT (Fallback):** Auto-failover on MSG91 5xx / timeout.

### 6.3 Transactional Email — Amazon SES v2 (`src/lib/email/ses.service.ts`)

`SESv2Client` + `SendEmailCommand`, region `ap-south-1`. Always via BullMQ `email` queue. Worker rate-limited to 12/second.

### 6.4 Media & Brochure Storage — Cloudflare R2 (`src/config/r2.ts`)

* Endpoint: `https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, `region: 'auto'`.
* **Admin uploads:** Presigned `PUT` URL (5-min expiry, MIME + size checks).
* **Student brochures:** Verify lead/OTP → return 10-min signed download URL.

---

## 7. Async Queues & Worker Reliability (BullMQ)

| Queue Name | Priority | Concurrency | Retry Strategy | Purpose |
| --- | --- | --- | --- | --- |
| `otp-sms` | High (1) | 20 | 2 attempts, 1s fixed backoff | MSG91 / Fast2SMS OTP dispatch |
| `email` | Medium (2) | 10 (SES rate-limited) | 5 attempts, exponential 2s→32s | Welcome, brochure link, counselor alert |
| `lead-route` | Medium (2) | 15 | 5 attempts, exponential | Weighted counselor assignment + CRM webhook |
| `search-sync` | Low (3) | 10 | 5 attempts, exponential | Typesense college upsert/delete |
| `aggregates` | Low (3) | 5 | 3 attempts, exponential | Recalculate avg_rating, review_count, popularity_score |

### Mandatory Worker Rules (`src/worker.ts`)

1. `worker.on('error', ...)` and `worker.on('failed', ...)` listeners — no unhandled rejections.
2. `removeOnComplete: { age: 3600, count: 1000 }`, `removeOnFail: { age: 86400 * 7 }` (inspectable DLQ without RAM exhaustion).
3. **Graceful Shutdown (`SIGINT`/`SIGTERM`):** `await worker.close()` on all workers → close DB + Redis → `process.exit(0)`.

---

## 8. REST API Contract Specification (`/api/v1`)

**Success envelope:** `{ "data": ..., "meta": { "cursor": "...", "hasMore": true } }`
**Error envelope (RFC 7807):** `{ "error": { "code": "RATE_LIMITED", "message": "...", "requestId": "..." } }`

### 8.1 Public Read Endpoints (Edge + Redis Cached)

`Cache-Control: public, max-age=60, s-maxage=600, stale-while-revalidate=300`

| Method & Path | Description | Data Source |
| --- | --- | --- |
| `GET /api/v1/colleges` | Filtered directory (cursor pagination, `limit<=30`, filter: `state`, `city`, `stream`, `ownership`, `minFee`, `maxFee`, `sort`) | CF + Redis (10m) → `dbRead` |
| `GET /api/v1/colleges/:slug` | Full detail page (overview, courses, cutoffs summary, top reviews, similar colleges) with widget-level `withFallback()` | CF + Redis (1h, single-flight) → `dbRead` |
| `GET /api/v1/colleges/compare?slugs=a,b,c` | Side-by-side comparison of 2–4 colleges | Redis (30m) → `dbRead` |
| `GET /api/v1/search` | Faceted search with hits + facet counts | Redis (5m) → Typesense → Postgres fallback |
| `GET /api/v1/search/autocomplete?q=` | Top-8 college & exam suggestions | Redis (15m) → Typesense |
| `GET /api/v1/exams` & `/:slug` | Exam metadata + linked top colleges | CF + Redis (1h) |
| `GET /api/v1/predictor` | Safe/Moderate/Ambitious college buckets | Redis (30m, bucketed) → `dbRead` |
| `GET /api/v1/colleges/:slug/reviews` | Approved reviews, cursor paginated | Redis (10m) → `dbRead` |

### 8.2 Auth Endpoints (Zero Per-MAU Cost)

| Method & Path | Protection | Behavior |
| --- | --- | --- |
| `POST /api/v1/auth/google` | Rate-limited | Verify Google ID token → upsert user → Access JWT (15m) + HttpOnly refresh cookie (30d) |
| `POST /api/v1/auth/otp/request` | **Turnstile** + Dual Rate Limit | Validate Turnstile → generate OTP → store HMAC → enqueue `otp-sms` → `202 Accepted` |
| `POST /api/v1/auth/otp/verify` | Max 5 attempts | `crypto.timingSafeEqual` HMAC check → mark `phone_verified_at` → upsert user → JWT + Refresh Token |
| `POST /api/v1/auth/refresh` | Refresh Cookie | Validate in Redis → rotate (delete old + issue new) → detects reuse theft |
| `POST /api/v1/auth/logout` | Auth JWT | Revoke refresh token in Redis → clear cookie |

### 8.3 Write & Lead Capture

| Method & Path | Protection | Behavior |
| --- | --- | --- |
| `POST /api/v1/leads` | **Turnstile** + Rate Limit + Idempotency-Key | Dedup via `idempotency_key` → write `dbWrite` → enqueue `lead-route` + `email` → `201` in <100 ms |
| `POST /api/v1/colleges/:slug/reviews` | Auth JWT + **Turnstile** | Insert `status=pending` → reject duplicate `(user_id, college_id)` |

### 8.4 Admin & Counselor (RBAC Protected)

| Method & Path | Role | Behavior |
| --- | --- | --- |
| `POST/PATCH/DELETE /api/v1/admin/colleges` | `admin` | Mutate `dbWrite` → purge `v1:college:slug:{slug}` → bump `v1:ns:listings` → enqueue `search-sync` |
| `POST /api/v1/admin/cutoffs/bulk` | `admin` | Stream CSV/JSON bulk upsert → bump `v1:ns:cutoffs` |
| `POST /api/v1/admin/uploads/presign` | `admin` | Return R2 presigned `PUT` URL |
| `PATCH /api/v1/admin/reviews/:id/moderate` | `admin` | Approve/reject → enqueue `aggregates` job |
| `GET/PATCH /api/v1/counselor/leads` | `counselor`, `admin` | Paginated assigned leads + status updates |

### 8.5 Health & Ops

* `GET /health` — Liveness probe (`200 OK` if event loop responsive).
* `GET /ready` — Readiness: checks `dbWrite`, `redisCache`, `redisQueue`.
* `GET /metrics` — Prometheus (internal-only, blocked at CF/LB).

---

## 9. Security & Anti-Abuse Checklist

1. **No OTP Gate on Public Browsing** — OTP only on lead verify / brochure unlock / phone login.
2. **Trust Proxy Correctly** — Fastify `trustProxy: true`, read IP from `CF-Connecting-IP`.
3. **Helmet & Strict CORS** — Lock `CORS_ORIGINS` to frontend domains, `credentials: true`.
4. **Payload Size Caps** — Global `bodyLimit: 1048576` (1 MB); higher only for admin bulk import.
5. **SQL Injection Prevention** — All inputs via Zod; Drizzle parameterized queries; never raw `request.body` into `.insert()`.
6. **PII Redaction in Logs** — Pino `redact: ['req.headers.authorization', 'req.headers.cookie', 'body.otp', 'body.password', 'body.phone']`.
7. **Timing-Safe OTP Verify** — `crypto.timingSafeEqual` always.

---

## 10. Environment Variables (`.env.example`)

```env
# Runtime
NODE_ENV=development
PORT=4000
HOST=0.0.0.0
APP_ORIGIN=https://yourdomain.com
ALLOWED_TURNSTILE_HOSTNAMES=yourdomain.com,www.yourdomain.com

# PostgreSQL
DATABASE_URL=postgresql://user:pass@pgbouncer-host:6432/college_db
DATABASE_READ_URL=postgresql://user:pass@pgbouncer-read-host:6432/college_db
DATABASE_DIRECT_URL=postgresql://user:pass@postgres-primary:5432/college_db
DB_WRITE_POOL_MAX=15
DB_READ_POOL_MAX=25

# Dual Redis / Valkey
REDIS_CACHE_URL=redis://:pass@redis-cache:6379/0
REDIS_QUEUE_URL=redis://:pass@redis-queue:6379/0

# Typesense
TYPESENSE_HOST=typesense
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=replace_me

# Auth & Crypto
JWT_ACCESS_SECRET=replace_with_64_char_hex
JWT_REFRESH_SECRET=replace_with_64_char_hex
OTP_HMAC_PEPPER=replace_with_64_char_hex
GOOGLE_CLIENT_ID=replace_me.apps.googleusercontent.com

# Bot Protection
CLOUDFLARE_TURNSTILE_SECRET=replace_me

# SMS / OTP (India DLT Approved)
SMS_PRIMARY_PROVIDER=msg91
MSG91_AUTH_KEY=replace_me
MSG91_OTP_TEMPLATE_ID=replace_me
FAST2SMS_API_KEY=replace_me
FAST2SMS_DLT_SENDER_ID=replace_me
FAST2SMS_DLT_MESSAGE_ID=replace_me

# Email (AWS SES Mumbai)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=replace_me
AWS_SECRET_ACCESS_KEY=replace_me
SES_FROM_EMAIL=noreply@yourdomain.com

# Object Storage (Cloudflare R2)
R2_ACCOUNT_ID=replace_me
R2_ACCESS_KEY_ID=replace_me
R2_SECRET_ACCESS_KEY=replace_me
R2_BUCKET_NAME=college-portal-assets
R2_PUBLIC_CDN_URL=https://cdn.yourdomain.com

# Observability
SENTRY_DSN=
```

---

## 11. Local Dev & Production Deployment Topology

### Local Development (`docker-compose.yml`)

5 containers:
1. `postgres:17-alpine`
2. `edoburu/pgbouncer` (`POOL_MODE=transaction`)
3. `valkey/valkey:8-alpine` — `redis-cache` (`--maxmemory 256mb --maxmemory-policy allkeys-lru`)
4. `valkey/valkey:8-alpine` — `redis-queue` (`--appendonly yes --maxmemory-policy noeviction`)
5. `typesense/typesense:27.1`

### Production Deployment

* Multi-stage `Dockerfile`: `node:24-alpine` builder → `node:24-alpine` runner, non-root `node` user.
* Same image: API (`CMD ["node", "dist/server.js"]`) or Worker (`CMD ["node", "dist/worker.js"]`).
* Minimum 2 API instances + 1–2 Worker containers behind Load Balancer.
* Cloudflare (Proxy ON + Pro WAF + Edge Caching Rules) in front of frontend and `api.yourdomain.com`.

---

## 12. Phased Implementation Plan

Execute strictly in order. Run typecheck, lint, and tests after every phase.

### Phase 1 — Project Scaffold, Config & Local Infra
TypeScript (`NodeNext`/`ES2023`), Fastify v5 + Zod v4, Pino, ESLint, Vitest. `env.ts`, `docker-compose.yml`, `db.ts`, `redis.ts`, `app.ts`, `server.ts` (graceful shutdown), `/health` + `/ready`.
**Verify:** `docker compose up -d` passes; `/ready` returns `200` checking Postgres, redisCache, redisQueue.

### Phase 2 — Database Schema, Migrations & Seed Data
All Drizzle schemas with composite indexes from Section 3.2. Migration via `DATABASE_DIRECT_URL`. Seed: 50 Indian colleges (IITs, NITs, VIT, BITS, IIMs, AIIMS, private), 20 courses, 5 exams (JEE Main, NEET, CAT, CLAT, GATE), 500+ cutoff rows, 5 counselors.
**Verify:** `EXPLAIN ANALYZE` on listing cursor query and predictor query confirms Index Scans only.

### Phase 3 — Core Infrastructure Primitives
`cache.ts` (Cache-Aside + Single-Flight + jitter + namespace invalidation), `rate-limit.ts` (Lua sliding window), `turnstile.ts` (mock bypass in `NODE_ENV=test`), BullMQ queues + `worker.ts`, SMS adapter (MSG91 + Fast2SMS), SES v2 service, R2 client.
**Verify:** (a) 50 concurrent `getOrSetWithLock` calls → `fetcher()` runs exactly once; (b) rate limiter blocks request #4 on 3/10m limit; (c) `SIGTERM` shuts down cleanly.

### Phase 4 — Auth & Public Discovery Modules
`modules/auth` (Google OAuth, Turnstile OTP, rotating Redis refresh tokens, RBAC middleware), `modules/colleges` (cursor-paginated listings, widget-isolated detail aggregator with `withFallback()`, compare), `modules/predictor` (Safe/Moderate/Ambitious engine).
**Verify:** Integration tests for full OTP lifecycle, refresh token rotation/reuse detection, cache hit headers, predictor accuracy.

### Phase 5 — Typesense Search & Async Indexing
`config/typesense.ts`, `reindex-typesense.ts` (alias swap), `search-sync.worker.ts`, `modules/search` (faceted search + autocomplete + Postgres fallback).
**Verify:** `"iit bombai"` returns top match with facet counts in <30 ms. Stopping Typesense triggers Postgres fallback without 500 errors.

### Phase 6 — Leads, Reviews & Admin API
`modules/leads` (idempotent capture + `lead-route` worker + R2 signed brochure URL), `modules/reviews` (submission, moderation, async rating aggregation), `modules/admin` (CRUD + instant Redis purge + Typesense sync + R2 presigned upload + CSV bulk cutoff import).
**Verify:** Admin college update purges cache immediately and updates Typesense within 2 seconds.

### Phase 7 — Pre-Launch Hardening & k6 Load Testing
`scripts/warm-cache.ts` (top 1,000 college/filter URLs). `load-tests/day1-spike.k6.js` (60% reads, 25% search, 10% predictor, 5% leads).

**Day-1 Acceptance Criteria (must pass before launch):**
- 3,000–5,000 VUs sustained for 10 minutes
- p95 latency <100 ms on cached reads; <300 ms on search/predictor/writes
- Error rate <0.1%
- Redis cache hit ratio >90% on read endpoints
- Zero PostgreSQL connection exhaustion in PgBouncer logs
- Zero dropped jobs when restarting a worker mid-load
