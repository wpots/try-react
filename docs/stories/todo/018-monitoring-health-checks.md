# User Story 018: Monitoring & Health Check Strategy

## 1. Title

Implement application monitoring, error tracking, and uptime health checks using free-tier services.

## 2. Goal

To have observability into the production Food Diary app: know when it is down, when errors occur, and how it performs — without any paid tooling at this stage.

## 3. Description

As a developer, I want to know about production problems before users report them. This story covers three complementary layers:

1. **Health check endpoint** — machine-readable `/api/health` route for uptime monitors
2. **Uptime monitoring** — external ping-based checks that alert on downtime (UptimeRobot, free)
3. **Error tracking** — Sentry for runtime errors and unhandled rejections (free tier)
4. **Performance / Web Vitals** — Vercel Analytics for Core Web Vitals (free for hobby plan)
5. _(Optional / future)_ **Metrics dashboard** — Grafana Cloud if richer dashboards are needed

## 4. Technical Details

| Layer             | Tool                  | Plan                                | Notes                             |
| ----------------- | --------------------- | ----------------------------------- | --------------------------------- |
| Health endpoint   | Next.js Route Handler | N/A                                 | `/api/health`                     |
| Uptime monitoring | UptimeRobot           | Free (50 monitors, 5 min intervals) | Pings `/api/health`               |
| Error tracking    | Sentry                | Free (5 k errors/month)             | Next.js SDK                       |
| Web Vitals        | Vercel Analytics      | Free (hobby)                        | Built into Vercel                 |
| Dashboards        | Grafana Cloud         | Free (10 k series)                  | Optional, adds Prometheus metrics |

### Health endpoint contract

```
GET /api/health
→ 200 OK
{
  "status": "ok",
  "version": "1.0.0",        // from package.json
  "timestamp": "2026-02-28T12:00:00.000Z",
  "checks": {
    "firebase": "ok" | "degraded",
    "env": "ok" | "missing"
  }
}

→ 503 Service Unavailable  (if any check fails)
```

## 5. Steps to Implement

### 5a. Health Check Endpoint

1. Create `apps/food-diary/src/app/api/health/route.ts`:

```ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function checkFirebase(): Promise<"ok" | "degraded"> {
  try {
    // Light check: verify env vars are set (full ping would add cold-start latency)
    const required = ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_API_KEY"];
    return required.every(k => !!process.env[k]) ? "ok" : "degraded";
  } catch {
    return "degraded";
  }
}

export async function GET() {
  const firebase = await checkFirebase();
  const env = process.env.NODE_ENV ? "ok" : "missing";
  const allOk = firebase === "ok" && env === "ok";

  return NextResponse.json(
    {
      status: allOk ? "ok" : "degraded",
      version: process.env.npm_package_version ?? "unknown",
      timestamp: new Date().toISOString(),
      checks: { firebase, env },
    },
    { status: allOk ? 200 : 503 },
  );
}
```

2. Verify locally: `curl http://localhost:3000/api/health`

---

### 5b. UptimeRobot (Uptime Monitoring)

1. Create a free account at [uptimerobot.com](https://uptimerobot.com)
2. Add a new monitor:
   - **Type:** HTTP(s)
   - **URL:** `https://your-app.vercel.app/api/health`
   - **Interval:** 5 minutes
   - **Keyword check:** `"status":"ok"` (ensures 200 with healthy body)
3. Add alert contacts: email and/or Slack webhook
4. Optionally embed the public status page URL in `README.md`

---

### 5c. Sentry (Error Tracking)

1. Create a free account at [sentry.io](https://sentry.io) and create a **Next.js** project
2. Install SDK:

   ```bash
   pnpm --filter food-diary add @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

   The wizard creates `sentry.client.config.ts`, `sentry.server.config.ts`, and updates `next.config.ts`.

3. Add environment variables:

   ```bash
   # .env.local
   SENTRY_DSN=https://xxxxx@o0.ingest.sentry.io/0
   SENTRY_ORG=your-org
   SENTRY_PROJECT=food-diary
   ```

   Add `SENTRY_DSN` to Vercel environment variables.

4. Configure `sentry.client.config.ts`:

   ```ts
   import * as Sentry from "@sentry/nextjs";

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     tracesSampleRate: 0.1, // 10% of transactions — conserve free quota
     replaysSessionSampleRate: 0,
     replaysOnErrorSampleRate: 0,
     environment: process.env.NODE_ENV,
   });
   ```

5. Add a Sentry error boundary to the root layout (optional but recommended for client errors).

6. Set up Sentry alerts:
   - Alert on: first occurrence of new issue, error spike (>10 errors/hour)
   - Notification: email or Slack

---

### 5d. Vercel Analytics (Web Vitals)

1. Enable in Vercel dashboard → Project → Analytics tab → Enable
2. Add package:
   ```bash
   pnpm --filter food-diary add @vercel/analytics
   ```
3. Add to root layout:

   ```tsx
   import { Analytics } from "@vercel/analytics/react";

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

4. Core Web Vitals (LCP, FID, CLS) will appear in the Vercel Analytics dashboard.

---

### 5e. Grafana Cloud (Optional — Richer Dashboards)

> Only needed if UptimeRobot + Vercel Analytics is insufficient. Adds complexity.

1. Create free account at [grafana.com](https://grafana.com/auth/sign-up)
2. Use **Grafana Cloud Free** (10 k Prometheus series, 50 GB logs/month, 50 GB traces/month)
3. Options for Next.js metrics:
   - **Option A:** Use [Prometheus Next.js middleware](https://github.com/wundergraph/next-prometheus) to expose `/metrics` endpoint, scrape via Grafana Cloud agent
   - **Option B:** Push custom metrics from API routes using `@opentelemetry/sdk-node` + Grafana OTLP endpoint
4. Next.js has built-in OpenTelemetry support — add `instrumentation.ts`:
   ```ts
   // apps/food-diary/src/instrumentation.ts
   export async function register() {
     if (process.env.NEXT_RUNTIME === "nodejs") {
       const { NodeSDK } = await import("@opentelemetry/sdk-node");
       // configure exporter to Grafana Cloud OTLP endpoint
     }
   }
   ```
5. Import pre-built Next.js dashboard from Grafana dashboard library (ID: `13898`)

**Recommendation:** Start with UptimeRobot + Sentry + Vercel Analytics. Add Grafana only if you need custom business metrics dashboards.

---

## 6. Acceptance Criteria

- [ ] `GET /api/health` returns `200 { "status": "ok" }` in production
- [ ] UptimeRobot monitor is active and alerts are configured for downtime
- [ ] Sentry is capturing runtime errors from both client and server
- [ ] Vercel Analytics is enabled and showing Web Vitals data
- [ ] All monitoring credentials/DSNs are stored as environment variables, not hardcoded
- [ ] Relevant env vars are added to Vercel project settings (see Story 014)

## 7. Notes / References

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Sentry Next.js setup](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [UptimeRobot](https://uptimerobot.com)
- [Grafana Cloud free tier](https://grafana.com/pricing/)
- [Next.js OpenTelemetry](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry)
- Related: Story 014 (Vercel deploy) — health check URL only available post-deploy
- Related: Story 016 (Google Analytics) — GA4 covers user behaviour; this story covers operational health
