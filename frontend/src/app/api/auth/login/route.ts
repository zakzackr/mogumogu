import { createErrorResponse, ERROR_CODES } from '@/lib/apiResponse';
import { createServerSideClient } from '@/lib/supabase';
import { StatusCodes } from 'http-status-codes'
import { NextResponse } from 'next/server'

/**
 * ログイン用のRoute Handler
 * @param request - HTTPリクエスト
 * @returns ログイン結果
 */

export async function POST(request: Request){
    try {
        const {email, password} = await request.json();

        // 入力validation
        if (!email || !password){
            return createErrorResponse(
                ERROR_CODES.VALIDATION_ERROR,
                "メールアドレスとパスワードが必要です",
                StatusCodes.BAD_REQUEST
            )
        }

        // supabaseクライアントを作成
        const supabase = await createServerSideClient();

        // ログイン
        const { data, error } = await supabase.auth.signInWithPassword({
            email, password
        })

        if (error) {
            return createErrorResponse(
                ERROR_CODES.AUTHENTICATION_ERROR,
                "ログインに失敗しました",
                StatusCodes.UNAUTHORIZED
            )
        }

        // TODO: username, avatar_urlなどの返却を検討
        return NextResponse.json(
            { message: "ログインに成功しました"},
            { status: StatusCodes.OK }
        )
    } catch (error) {
        return createErrorResponse(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            "予期せぬエラーが発生しました",
            StatusCodes.INTERNAL_SERVER_ERROR
        )
    }
    // SupabaseのServerSideクライアントを作成？

    request.
    
    // CookieからJWTを取得

    // JWTをAuthorizationヘッダにセット

    // Go APIを叩く
}