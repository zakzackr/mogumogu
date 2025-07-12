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
            
        }

    } catch {

    }
    // SupabaseのServerSideクライアントを作成？

    request.
    
    // CookieからJWTを取得

    // JWTをAuthorizationヘッダにセット

    // Go APIを叩く
}