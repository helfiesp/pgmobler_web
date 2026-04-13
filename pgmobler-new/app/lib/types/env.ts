export interface Env {
  DB: D1Database;
  R2: R2Bucket;
  KV: KVNamespace;
  ENVIRONMENT: string;
  SITE_URL: string;
  SESSION_SECRET: string;
  VIPPS_CLIENT_ID?: string;
  VIPPS_CLIENT_SECRET?: string;
  VIPPS_MSN?: string;
  VIPPS_SUBSCRIPTION_KEY?: string;
  KLARNA_API_KEY?: string;
  KLARNA_API_SECRET?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
}

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}
