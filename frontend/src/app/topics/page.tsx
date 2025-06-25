'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTopic } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";


/**
 * トークテーマ設定画面
 * 
 * @returns 記事一覧表示画面
 */
export default function TopicPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();


    // 登録するボタン押下時のハンドラ
    const handleTopicSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // validationを行う
        if (!title || title.trim() === ""){
                setError("タイトルは必須です")
                return
        }
        setError("")
        
        // トークテーマ作成APIの呼び出し
        try {
            await createTopic({title, description});
            // トークテーマ作成後は、記事一覧表示画面に遷移
            router.push("/");
        } catch(error: unknown){
            if (error instanceof Error){
                setError(error.message);
            } else {
                setError("トークテーマの作成に失敗しました。");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pb-12">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center font-bold text-xl">トークテーマ</CardHeader>
                <CardDescription className="text-center">
                    トークテーマを入力してください。入力したトークテーマはすぐに反映されます。
                </CardDescription>
                {error && <div className="text-red-500 text-center text-sm">{error}</div>}
                <form onSubmit={handleTopicSubmit}>
                    <CardContent className="flex flex-col items-center justify-center gap-4 mb-6">
                        <div className="w-full flex flex-col gap-2">
                            <Label className="text-sm font-bold" htmlFor="title">タイトル</Label>
                            <Input id="title" type="text" placeholder="タイトルを入力" className="w-full" onChange={(e) => setTitle(e.target.value)} required/>
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <Label className="text-sm font-bold" htmlFor="description">概要</Label>
                            <Textarea id="description" placeholder="概要を入力" className="w-full" onChange={(e) => setDescription(e.target.value)}/>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">登録する</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}