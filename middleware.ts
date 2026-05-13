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

  // Protected routes
  if (
    (pathname.startsWith("/profile") ||
      pathname.startsWith("/admin")) &&
    !user
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Force setup-profile if username missing
  if (
    user &&
    pathname !== "/setup-profile" &&
    !pathname.startsWith("/u/")
  ) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (!profile?.username) {
      return NextResponse.redirect(
        new URL("/setup-profile", req.url)
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/admin/:path*",
    "/setup-profile",
  ],
};