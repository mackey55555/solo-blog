import { createClient } from 'microcms-js-sdk';

// サーバーサイドかクライアントサイドかを判定
const isServer = typeof window === 'undefined';

// 環境変数のログ出力（デバッグ用）
if (isServer) {
  console.log('Server-side environment variables:');
  console.log('MICROCMS_API_KEY exists:', !!process.env.MICROCMS_API_KEY);
  console.log('MICROCMS_SERVICE_DOMAIN:', process.env.MICROCMS_SERVICE_DOMAIN);
} else {
  console.log('Client-side environment variables:');
  console.log('NEXT_PUBLIC_MICROCMS_API_KEY exists:', !!process.env.NEXT_PUBLIC_MICROCMS_API_KEY);
  console.log('NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN:', process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN);
}

// サーバーサイド用の環境変数
const SERVER_API_KEY = process.env.MICROCMS_API_KEY;
const SERVER_SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;

// クライアントサイド用の環境変数
const CLIENT_API_KEY = process.env.NEXT_PUBLIC_MICROCMS_API_KEY;
const CLIENT_SERVICE_DOMAIN = process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN;

// 適切な環境変数を選択
const API_KEY = isServer ? SERVER_API_KEY : CLIENT_API_KEY;
const SERVICE_DOMAIN = isServer ? SERVER_SERVICE_DOMAIN : CLIENT_SERVICE_DOMAIN;

if (!API_KEY) {
  console.error('API key is missing:', { isServer, SERVER_API_KEY: !!SERVER_API_KEY, CLIENT_API_KEY: !!CLIENT_API_KEY });
  throw new Error('MICROCMS_API_KEY is required');
}

if (!SERVICE_DOMAIN) {
  console.error('Service domain is missing:', { isServer, SERVER_SERVICE_DOMAIN, CLIENT_SERVICE_DOMAIN });
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}

// サービスドメインの形式をチェック
let formattedServiceDomain = SERVICE_DOMAIN;
if (SERVICE_DOMAIN && SERVICE_DOMAIN.includes('.microcms.io')) {
  // すでに完全なドメイン名の場合は.microcms.ioを削除
  formattedServiceDomain = SERVICE_DOMAIN.replace('.microcms.io', '');
  console.log('Removed .microcms.io from service domain for SDK:', formattedServiceDomain);
}

export const client = createClient({
  serviceDomain: formattedServiceDomain,
  apiKey: API_KEY,
});

// ブログ記事の型定義
export type Blog = {
  id: string;
  title: string;
  content: string;
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
  category: {
    id: string;
    name: string;
  };
  tags?: {
    id: string;
    name: string;
  }[];
  publishedAt: string;
  revisedAt: string;
  createdAt: string;
  updatedAt: string;
};

// カテゴリーの型定義
export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

// タグの型定義
export type Tag = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

// プロキシを使用してAPIにアクセスする関数
async function fetchFromProxy(endpoint: string, contentId?: string, queries?: object) {
  try {
    let url = `/api/proxy?endpoint=${endpoint}`;
    
    if (contentId) {
      url += `&contentId=${contentId}`;
    }
    
    if (queries) {
      try {
        url += `&queries=${encodeURIComponent(JSON.stringify(queries))}`;
      } catch (jsonError) {
        console.error('Error stringifying queries:', jsonError, queries);
        throw new Error('Invalid query parameters');
      }
    }
    
    console.log('Fetching from proxy URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API responded with status ${response.status}:`, errorText);
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from proxy (${endpoint}):`, error);
    throw error;
  }
}

// ブログ一覧を取得
export const getBlogs = async (queries?: object) => {
  try {
    // サーバーサイドレンダリングの場合はSDKを使用
    if (isServer) {
      return await client.getList<Blog>({
        endpoint: 'blogs',
        queries,
      });
    }
    
    // クライアントサイドレンダリングの場合はプロキシを使用
    return await fetchFromProxy('blogs', undefined, queries);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

// ブログの詳細を取得
export const getBlogDetail = async (contentId: string, queries?: object) => {
  try {
    // サーバーサイドレンダリングの場合はSDKを使用
    if (isServer) {
      return await client.getListDetail<Blog>({
        endpoint: 'blogs',
        contentId,
        queries,
      });
    }
    
    // クライアントサイドレンダリングの場合はプロキシを使用
    return await fetchFromProxy('blogs', contentId, queries);
  } catch (error) {
    console.error('Error fetching blog detail:', error);
    throw error;
  }
};

// カテゴリー一覧を取得
export const getCategories = async (queries?: object) => {
  try {
    // サーバーサイドレンダリングの場合はSDKを使用
    if (isServer) {
      return await client.getList<Category>({
        endpoint: 'categories',
        queries,
      });
    }
    
    // クライアントサイドレンダリングの場合はプロキシを使用
    return await fetchFromProxy('categories', undefined, queries);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// タグ一覧を取得
export const getTags = async (queries?: object) => {
  try {
    // サーバーサイドレンダリングの場合はSDKを使用
    if (isServer) {
      return await client.getList<Tag>({
        endpoint: 'tags',
        queries,
      });
    }
    
    // クライアントサイドレンダリングの場合はプロキシを使用
    return await fetchFromProxy('tags', undefined, queries);
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};
