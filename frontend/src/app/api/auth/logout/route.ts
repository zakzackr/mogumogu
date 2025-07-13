import { createErrorResponse, ERROR_CODES } from "@/lib/apiResponse";
import { createServerSideClient } from "@/lib/supabase";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

/**
 * ログアウト用のRoute Handler
 * @param request - HTTPリクエスト
 * @returns ログイン結果
 */

export async function POST() {
    try {
        // supabaseクライアントを作成
        const supabase = await createServerSideClient();

        // ログアウト
        const { error } = await supabase.auth.signOut();

        if (error) {
            // サーバーサイドでのログアウトに失敗した場合でも、
            // クライアントをログアウトさせるために処理を続行します。
            // エラーはログに記録しておきます。
            console.error("Supabase logout error:", error);
        }

        // ログアウト成功時のレスポンス
        // signOut()が成功しても失敗しても、このレスポンスが返され、
        // SupabaseのミドルウェアがCookieをクリアするヘッダーを添付します。
        return NextResponse.json(
            {
                message: "ログアウトに成功しました",
            },
            { status: StatusCodes.OK }
        );
    } catch (error) {
        console.error("Logout API error:", error);
        return createErrorResponse(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            "予期せぬエラーが発生しました",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}
