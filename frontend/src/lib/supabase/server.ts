import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabaseクライアント（サーバーコンポーネント、Route Handler）
 */

// ServerSideからSupabase APIにアクセスするための設定
export const createClient = async () => {
    const cookieStore = await cookies();

    // ServerSideでSupabaseクライアントを生成
    return createServerClient(
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
                        // Server Componentから呼び出された場合は無視
                    }
                },
            },
        }
    );
};
