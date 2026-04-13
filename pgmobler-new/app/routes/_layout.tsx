import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Header } from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { AdminBar } from "~/components/admin/AdminBar";
import { getDb } from "~/lib/services/db.server";
import { getCategoriesWithChildren } from "~/lib/services/category.server";
import { getAllCmsContent } from "~/lib/services/cms.server";
import { getCartItemCount } from "~/lib/services/cart.server";
import { getSessionFromRequest } from "~/lib/services/auth.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const db = getDb(context);

  const [categories, cms, cartCount, sessionData] = await Promise.all([
    getCategoriesWithChildren(db),
    getAllCmsContent(db),
    getCartItemCount(db, request),
    getSessionFromRequest(request, context),
  ]);

  const isLoggedIn = !!sessionData?.customer;
  // For now treat any logged-in user as admin
  const isAdmin = isLoggedIn;

  return json({ categories, cms, isAdmin, isLoggedIn, cartCount });
}

export default function Layout() {
  const { categories, cms, isAdmin, isLoggedIn, cartCount } =
    useLoaderData<typeof loader>();
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <Header categories={categories} cms={cms} cartCount={cartCount} isLoggedIn={isLoggedIn} />
      <main className="flex-1">
        <Outlet context={{ cms, editMode }} />
      </main>
      <Footer categories={categories} cms={cms} />
      {isAdmin && (
        <AdminBar
          editMode={editMode}
          onToggleEditMode={() => setEditMode(!editMode)}
        />
      )}
    </>
  );
}
