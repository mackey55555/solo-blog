'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogs, getCategories } from '@/lib/microcms';
import AdSense from './AdSense';
import type { Blog, Category } from '@/lib/microcms';

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching blogs and categories...');
        
        // ブログとカテゴリーを並行して取得
        const [blogsResponse, categoriesResponse] = await Promise.all([
          getBlogs({ limit: 10 }),
          getCategories({ limit: 100 })
        ]);
        
        console.log('Blogs fetched successfully:', blogsResponse.contents.length);
        console.log('Categories fetched successfully:', categoriesResponse.contents.length);
        
        setBlogs(blogsResponse.contents);
        setCategories(categoriesResponse.contents);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        // エラーメッセージをより詳細に
        const errorMessage = err instanceof Error 
          ? `${err.name}: ${err.message}` 
          : 'Unknown error occurred';
        console.error('Detailed error:', errorMessage);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">データを読み込み中...</p>
      </div>
    );
  }

  if (error) {
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
        <p className="text-gray-600 mb-4">
          詳細はREADME.mdファイルを参照してください。
        </p>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md mx-auto text-left">
          <p className="text-red-700 text-sm font-medium mb-2">エラー詳細:</p>
          <p className="text-red-600 text-xs break-words">{error.message}</p>
          {/* エラーの追加情報があれば表示 */}
          <div className="mt-2">
            <p className="text-red-700 text-sm font-medium mb-1">追加情報:</p>
            <pre className="text-red-600 text-xs overflow-auto max-h-32 bg-red-50 p-2 rounded border border-red-200">
              {error.message}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* メインコンテンツ */}
      <div className="md:col-span-2">
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <h2 className="text-xl font-medium text-gray-800 mb-2">ようこそ！</h2>
          <p className="text-gray-600">
            このブログでは、日々のエンジニアリング活動で学んだことや発見したことを気ままに綴っています。
            特に深く考えずに、思いついたことをゆるゆると更新していきます。
          </p>
        </div>
        
        <h2 className="text-2xl font-bold mb-2 border-b pb-2">最近の記事</h2>
        
        {/* 広告を表示 */}
        <div className="mb-2">
          <AdSense slot="1234567890" />
        </div>
        
        {/* ブログ記事がない場合 */}
        {blogs.length === 0 && (
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-center">まだ記事がありません。もうしばらくお待ちください。</p>
          </div>
        )}
        
        {/* ブログ記事一覧 */}
        <div className="space-y-2 mt-1">
          {blogs.map((blog, index) => (
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
                  {blog.category && (
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full mb-2 border border-blue-100">
                      {blog.category.name}
                    </span>
                  )}
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
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-3 pb-2 border-b border-gray-200">カテゴリー</h3>
            {categories.length === 0 ? (
              <p className="text-gray-500 text-sm">カテゴリーはまだ設定されていません。</p>
            ) : (
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link 
                      href={`/category/${category.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
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
}
