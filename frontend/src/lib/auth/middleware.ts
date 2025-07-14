import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * 認証ミドルウェア
 * 認証が必要なページへのアクセス制御とリダイレクト処理を行う
 */

/**
 * 認証が必要なパス（ページパス）
 */
const PROTECTED_PATHS = [
    "/dashboard",
    "/profile",
    "/articles/new",
    "/articles/edit",
];

/**
 * 認証済みユーザーがアクセスできないパス（ページパス）
 */
const AUTH_PAGES = ["/login", "/signup", "/register"];

/**
 * 認証ミドルウェアのメイン処理
 * @param request NextRequest
 * @returns NextResponse
 */
export async function authMiddleware(request: NextRequest) {
    // Supabaseセッション更新（トークンリフレッシュ）
    const { supabaseResponse, user } = await updateSession(request);

    const pathname = request.nextUrl.pathname;

    // 保護されたページへのアクセス制御
    if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
        if (!user) {
            // 未認証の場合、ログインページにリダイレクト
            const redirectUrl = new URL("/login", request.url);
            // ログイン後に元のページにリダイレクト
            redirectUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(redirectUrl);
        }
    }

    // 認証ページへのアクセス制御（認証済みユーザー）
    if (AUTH_PAGES.includes(pathname)) {
        if (user) {
            // 認証済みの場合、ホームページにリダイレクト
            // TODO: ダッシュボードページ作成後は '/dashboard' に変更
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // セッション更新されたレスポンスを返す
    return supabaseResponse;
}
