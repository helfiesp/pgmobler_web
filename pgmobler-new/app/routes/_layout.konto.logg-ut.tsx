import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { getDb } from "~/lib/services/db.server";
import { getSessionFromRequest, clearSessionCookie } from "~/lib/services/auth.server";
import { sessions } from "~/lib/db/schema";
import { eq } from "drizzle-orm";

// Redirect GET requests to home
export async function loader(_args: LoaderFunctionArgs) {
  return redirect("/");
}

export async function action({ request, context }: ActionFunctionArgs) {
  const sessionData = await getSessionFromRequest(request, context);

  if (sessionData?.session) {
    const db = getDb(context);
    await db.delete(sessions).where(eq(sessions.id, sessionData.session.id));
  }

  const cookie = clearSessionCookie();

  return redirect("/", {
    headers: { "Set-Cookie": cookie },
  });
}
