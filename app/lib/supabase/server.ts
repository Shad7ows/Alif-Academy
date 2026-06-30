import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored in Server Components
          }
        },
      },
    }
  );
}

/**
 * الطريقة الصحيحة للتحقق من المصادقة في Server Components:
 * getUser() يتصل بخوادم Supabase للتحقق الفعلي من حالة المستخدم.
 * هذا أفضل من getClaims() لأنه يكتشف المستخدمين المحذوفين أو المعلقين.
 */
export async function getUser() {
  const supabase = await createClient();
  return await supabase.auth.getUser();
}