import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogs, getCategories, type Blog, type Category } from "@/lib/microcms";
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
    const { contents } = await getCategories({
      filters: `id[equals]${resolvedParams.id}`,
    });
    
    const category: Category | undefined = contents[0];
    
    if (!category) {
      return {
        title: "カテゴリーが見つかりません",
      };
    }

    return {
      title: `${category.name}の記事一覧`,
      description: `${category.name}に関する記事の一覧です。`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "カテゴリー",
      description: "カテゴリー別の記事一覧です。",
    };
  }
}

// 静的パスの生成
export async function generateStaticParams() {
  try {
    const { contents } = await getCategories({ limit: 100 });
    
    return contents.map((category: Category) => ({
      id: category.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: { params: { id: string } }) {
  try {
    // paramsをawaitする
    const resolvedParams = await params;
    
    // カテゴリー情報を取得
    const { contents: categoryContents } = await getCategories({
      filters: `id[equals]${resolvedParams.id}`,
    });
    
    const category: Category | undefined = categoryContents[0];
    
    // カテゴリーが見つからない場合は404ページを表示
    if (!category) {
      notFound();
    }
    
    // カテゴリーに属する記事を取得
    const { contents: blogs } = await getBlogs({
      filters: `category[equals]${resolvedParams.id}`,
      limit: 50,
    });
    
    // すべてのカテゴリーを取得
    const { contents: allCategories } = await getCategories();

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* メインコンテンツ */}
        <div className="md:col-span-2">
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{category.name}の記事一覧</h1>
            <p className="text-gray-600">
              {category.name}に関連する記事をまとめています。
            </p>
          </div>
          
          {/* 広告を表示 */}
          <div className="mb-8">
            <AdSense slot="1234567890" />
          </div>
          
          {/* 記事がない場合 */}
          {blogs.length === 0 && (
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500 text-center">このカテゴリーの記事はまだありません。もうしばらくお待ちください。</p>
            </div>
          )}
          
          {/* ブログ記事一覧 */}
          <div className="space-y-8">
            {blogs.map((blog: Blog, index: number) => (
              <article key={blog.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="md:flex">
                  {blog.eyecatch && (
                    <div className="md:w-1/3 relative h-48 md:h-auto">
                      <Image
                        src={blog.eyecatch.url}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        priority={index === 0} // 最初の画像にはpriorityを設定
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  )}
                  <div className="p-5 md:w-2/3">
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full mb-2 border border-blue-100">
                      {blog.category.name}
                    </span>
                    <h3 className="text-xl font-semibold mb-2">
                      <Link href={`/blog/${blog.id}`} className="hover:text-blue-600 transition-colors">
                        {blog.title}
                      </Link>
                    </h3>
                    <time dateTime={blog.publishedAt} className="text-sm text-gray-500 block mb-3">
                      {new Date(blog.publishedAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <div className="mt-2">
                      <Link 
                        href={`/blog/${blog.id}`} 
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        続きを読む →
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {/* ホームに戻るリンク */}
          <div className="mt-8">
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

        {/* サイドバー */}
        <div className="md:col-span-1">
          <div className="sticky top-4 space-y-6">
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3 pb-2 border-b border-gray-200">カテゴリー</h3>
              <ul className="space-y-2">
                {allCategories.map((cat: Category) => (
                  <li key={cat.id}>
                    <Link 
                      href={`/category/${cat.id}`}
                      className={`${
                        cat.id === resolvedParams.id 
                          ? 'text-blue-600 font-medium' 
                          : 'text-gray-700 hover:text-blue-600'
                      } transition-colors`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
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
    console.error('Error rendering category page:', error);
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
