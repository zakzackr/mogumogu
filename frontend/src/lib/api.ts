// 実行環境を判定して、BASE_URL を分ける
const isServer = typeof window === "undefined";
const baseUrl = isServer
  ? process.env.API_BASE_URL // SSR：Dockerサービス名
  : process.env.NEXT_PUBLIC_API_BASE_URL; // CSR：ホストポート

/**
 * 記事一覧を取得
 * @param token 認証用トークン（SSRで利用）
 * @returns 記事一覧の配列
 * @throws API通信エラー時に例外を投げる
 */
// export async function fetchArticles(token: string) {
//     const res = await fetch(`${baseUrl}/articles`, {
//         headers: {
//             'Cookie': `accessToken=${token}`
//         }
//     });

//     if (!res.ok) {
//         const errorJson = await res.json();
//         throw new Error(errorJson.message || '記事一覧の取得に失敗しました。');
//     }
//     return res.json();
// }

export async function fetchArticles() {
    const res = await fetch(`${baseUrl}/articles`);

    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || '記事一覧の取得に失敗しました。');
    }
    return res.json();
}

/**
 * 記事詳細を取得
 * @param articleId 記事ID
 * @param token 認証用トークン（SSRで利用）
 * @returns 記事データ
 * @throws API通信エラー時に例外を投げる
 */
// export async function fetchArticleById(articleId: string | number, token: string | undefined) {
//     const res = await fetch(`${baseUrl}/articles/${articleId}`, {
//         headers: {
//             'Cookie': `accessToken=${token}`
//         }
//     });
//     if (!res.ok) {
//         const errorJson = await res.json();
//         throw new Error(errorJson.message || '記事の取得に失敗しました。');
//     }
//     return res.json();
// }

export async function fetchArticleById(articleId: string | number) {
    const res = await fetch(`${baseUrl}/articles/${articleId}`);
    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || '記事の取得に失敗しました。');
    }
    return res.json();
}

/**
 * 記事投稿で使用する入力データ型
 * @property title - 記事のタイトル
 * @property body - 記事の本文
 */
type ArticlePostInput = {
    title: string;
    body: string;
};

/**
 * 記事を投稿する
 * @param articlePostInput - 投稿する記事データ（タイトルと本文）
 * @returns 作成された記事データ
 * @throws API通信エラー時に例外を投げる
 * @note Cookieをクロスオリジンに送信するため、credentials: 'include' を指定
 */
// export async function postArticle({ title, body }: ArticlePostInput) {
//     const res = await fetch(`${baseUrl}/articles`, {
//         method: "POST",
//         credentials: 'include',
//         body: JSON.stringify({ title, body }),
//         headers: { 'Content-Type': 'application/json' }
//     });
    
//     if (!res.ok) {
//         const errorJson = await res.json();
//         throw new Error(errorJson.message || '記事の投稿に失敗しました。');
//     }
//     return res.json();
// }

export async function postArticle({ title, body }: ArticlePostInput) {
    const res = await fetch(`${baseUrl}/articles`, {
        method: "POST",
        body: JSON.stringify({ title, body }),
        headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || '記事の投稿に失敗しました。');
    }
    return res.json();
}

/**
 * 記事にいいねを追加する
 * @param articleId - 記事のID 
 * @returns 更新後の記事データ
 * @throws API通信エラー時に例外を投げる
 * @note Cookieをクロスオリジンに送信するため、credentials: 'include' を指定
 */
export async function addLike(articleId: string | number){
    const res = await fetch(`${baseUrl}/articles/${articleId}/likes`, {
        method: "POST",
        credentials: 'include'
    });

    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || 'いいねに失敗しました。');
    }
    return res.json();
}

/**
 * 記事にMVPを追加する
 * @param articleId - 記事のID 
 * @returns 更新後の記事データ
 * @throws API通信エラー時に例外を投げる
 * @note Cookieをクロスオリジンに送信するため、credentials: 'include' を指定
 */
export async function addMvp(articleId: string | number){
    const res = await fetch(`${baseUrl}/articles/${articleId}/mvps`, {
        method: "POST",
        credentials: 'include'
    });

    if (!res.ok) {
        const errorJson = await res.json();
        if (errorJson.code === "MAX_MVP_LIMIT_EXCEEDED"){
            throw new Error(errorJson.message);
        } else {
            throw new Error(errorJson.message || 'MVPに失敗しました。');
        }
    }
    return res.json();
}

/**
 * ユーザーの新規登録を行う
 * @param email - メールアドレス 
 * @param password - パスワード
 * @param lastName - 名字
 * @param firstName - 名前
 * @param username - ユーザーネーム
 * @returns 作成されたユーザーデータ
 * @throws API通信エラー時に例外を投げる
 * @note 新規登録後にCookieを受け取るために、credentials: 'include' を指定
 */
export async function register(email: string, password: string, lastName: string, firstName: string, username: string){
    const res = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, lastName, firstName, username }),
    });

    if (!res.ok){
        const errorJson = await res.json();
        throw new Error(errorJson.message || '新規ユーザー登録に失敗しました。');
    }
    return res.json();
}

/**
 * ユーザーのログインを行う
 * @param usernameOrEmail - ユーザーネームorメールアドレス 
 * @param password - パスワード
 * @returns ログインしたユーザーのデータ
 * @throws API通信エラー時に例外を投げる
 * @note ログイン後にCookieを受け取るために、credentials: 'include' を指定
 */
export async function login(usernameOrEmail: string, password: string){
    const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
    });

    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || 'ログインに失敗しました。');
    }
    return res.json();
}

/**
 * ユーザーのログアウトを行う
 * @returns ログアウト成功のメッセージ
 * @throws API通信エラー時に例外を投げる
 * @note 有効期限切れのCookieを受け取るために、credentials: 'include' を指定
 */
export async function logout(){
    const res = await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || 'ログアウトに失敗しました。');
    }
    return res.text();
}

/**
 * トークテーマの作成で使用する入力データ型
 * @property title - トークテーマのタイトル
 * @property description - トークテーマの詳細説明
 */
type TopicInput = {
    title: string;
    description: string;
};


/**
 * トークテーマの作成を行う
 * @param topicInput - 作成されたトークテーマデータ（タイトルと説明）
 * @returns 作成されたトークテーマ
 * @throws API通信エラー時に例外を投げる
 * @note Cookieをクロスオリジンに送信するため、credentials: 'include' を指定
 */
export async function createTopic({ title, description }: TopicInput){
    const res = await fetch(`${baseUrl}/topics`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ title, description }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || 'トークテーマの作成に失敗しました。');
    }
    return res.json();
}

/**
 * トークテーマの取得を行う
 * @returns 取得したトークテーマ
 * @throws API通信エラー時に例外を投げる
 * @note Cookieをクロスオリジンに送信するため、credentials: 'include' を指定
 */
export async function fetchTopic(){
    const res = await fetch(`${baseUrl}/topics`, {
        credentials: "include",
    });

    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || 'トークテーマの取得に失敗しました。');
    }
    return res.json();
}


