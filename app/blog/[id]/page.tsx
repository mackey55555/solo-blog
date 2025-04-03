import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogDetail, getBlogs, type Blog } from "@/lib/microcms";
import AdSense from "@/components/AdSense";

// 動的メタデータの生成
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    // paramsをawaitする
    const resolvedParams = await params;
    const blog: Blog | null = await getBlogDetail(resolvedParams.id).catch(() => null);
    
    if (!blog) {
      return {
        title: "記事が見つかりません",
      };
    }

    return {
      title: `${blog.title} | mackeyのエンジニア日記`,
      description: `${blog.title}に関する記事です。`,
      keywords: blog.category ? [blog.category.name] : [],
      openGraph: {
        title: blog.title,
        description: `${blog.title}に関する記事です。`,
        images: blog.eyecatch ? [blog.eyecatch.url] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "エラーが発生しました",
      description: "メタデータの生成中にエラーが発生しました。",
    };
  }
}

// 静的パスの生成
export async function generateStaticParams() {
  try {
    const { contents } = await getBlogs({ limit: 100 });
    
    return contents.map((blog: Blog) => ({
      id: blog.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function BlogDetail({ params }: { params: { id: string } }) {
  try {
    // paramsをawaitする
    const resolvedParams = await params;
    const blog: Blog | null = await getBlogDetail(resolvedParams.id).catch(() => null);
    
    // 記事が見つからない場合は404ページを表示
    if (!blog) {
      notFound();
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* メインコンテンツ */}
        <div className="md:col-span-2">
          <article className="border border-gray-200 rounded-lg overflow-hidden">
            {/* アイキャッチ画像 */}
            {blog.eyecatch && (
              <div className="relative h-64 md:h-80 w-full">
                <Image
                  src={blog.eyecatch.url}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 75vw"
                  priority
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            
            <div className="p-6 md:p-8">
              {/* カテゴリーとタグ */}
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.category && (
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-100">
                    {blog.category.name}
                  </span>
                )}
              </div>
              
              {/* タイトル */}
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{blog.title}</h1>
              
              {/* 公開日 */}
              <div className="flex items-center text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <time dateTime={blog.publishedAt}>
                  {new Date(blog.publishedAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                {blog.updatedAt !== blog.publishedAt && (
                  <div className="flex items-center ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <time dateTime={blog.updatedAt}>
                      {new Date(blog.updatedAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                )}
              </div>
              
              {/* 記事上部の広告 */}
              <div className="my-6">
                <AdSense slot="1234567890" />
              </div>
              
              {/* 記事本文 */}
              <div 
                className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-a:text-blue-600 prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
              
              {/* 記事下部の広告 */}
              <div className="mt-8">
                <AdSense slot="0987654321" />
              </div>
            </div>
          </article>
          
          {/* 前の記事・次の記事へのリンク */}
          <div className="flex justify-between mt-8">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              記事一覧に戻る
            </Link>
          </div>
        </div>
        
        {/* サイドバー */}
        <div className="md:col-span-1">
          <div className="sticky top-4 space-y-6">
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3 pb-2 border-b border-gray-200">このブログについて</h3>
              <p className="text-gray-600 text-sm mb-4">
                mackeyがエンジニアリングの日常で気づいたことや学んだことを記録するブログです。
                特に深く考えずに、思いついたことをゆるゆると更新していきます。
              </p>
              <div className="flex items-center mt-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">mackey</p>
                  <p className="text-xs text-gray-500">エンジニア</p>
                </div>
              </div>
            </div>
            
            {/* サイドバー広告 */}
            <div className="mb-6">
              <AdSense 
                slot="9876543210" 
                format="vertical"
              />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering blog detail:', error);
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">データの取得中にエラーが発生しました</h2>
        <p className="text-gray-600 mb-6">
          microCMSの設定を確認してください。以下のAPIが必要です：
        </p>
        <ul className="list-disc list-inside text-left max-w-md mx-auto mb-6">
          <li>blogs: ブログ記事用API</li>
          <li>categories: カテゴリー用API</li>
          <li>tags: タグ用API</li>
        </ul>
        <p className="text-gray-600">
          詳細はREADME.mdファイルを参照してください。
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }
}
