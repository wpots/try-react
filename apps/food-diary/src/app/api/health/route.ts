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
  const validEnvs = ["production", "development", "test"];
  const env = validEnvs.includes(process.env.NODE_ENV ?? "") ? "ok" : "missing";
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
