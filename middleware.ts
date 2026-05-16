import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const response = await updateSession(req);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  // Public routes
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/u/") ||
    pathname.startsWith("/discover");

  // Protected routes
  const isProtectedRoute =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/admin");

  // Not logged in -> redirect protected pages
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  // Logged in -> check onboarding
  if (
    user &&
    !pathname.startsWith("/setup-profile") &&
    !pathname.startsWith("/u/")
  ) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();

    // Missing username -> onboarding
    if (!profile?.username) {
      return NextResponse.redirect(
        new URL("/setup-profile", req.url)
      );
    }
  }

  // Already onboarded -> prevent access to setup page
  if (user && pathname === "/setup-profile") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.username) {
      return NextResponse.redirect(
        new URL("/profile", req.url)
      );
    }
  }

  // Logged in users visiting login/signup
  if (
    user &&
    (pathname === "/login" ||
      pathname === "/signup")
  ) {
    return NextResponse.redirect(
      new URL("/profile", req.url)
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};