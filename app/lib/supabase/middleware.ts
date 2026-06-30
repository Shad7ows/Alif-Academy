import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ✅ استخدام getSession() بدلاً من getUser() في Middleware
  // getSession() سريع لأنه يعمل محلياً على الـ Token
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isPublicAuthRoute =
    request.nextUrl.pathname.startsWith("/auth/sign-in") ||
    request.nextUrl.pathname.startsWith("/auth/sign-up") ||
    request.nextUrl.pathname.startsWith("/auth/reset-password") ||
    request.nextUrl.pathname.startsWith("/auth/callback") ||
    request.nextUrl.pathname.startsWith("/import-data");

  // توجيه: إذا لا يوجد session وليس صفحة عامة → تسجيل دخول
  // ✅ الصفحة الرئيسية أيضاً تتطلب تسجيل دخول الآن
  if (!session && !isPublicAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    return NextResponse.redirect(url);
  }

  // إذا كان المستخدم مسجل ودخل على صفحة تسجيل الدخول → وجهه للرئيسية
  if (session && isPublicAuthRoute && request.nextUrl.pathname !== "/import-data") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}