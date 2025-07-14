import { NextRequest } from "next/server";
import { authMiddleware } from "@/lib/auth/middleware";

/**
 * Next.js ミドルウェアのエントリーポイント
 * 全てのページアクセスに対して認証チェックを実行
 */
export async function middleware(request: NextRequest) {
    return authMiddleware(request);
}

/**
 * ミドルウェアを適用するパスの設定
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
