import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint');
  const contentId = searchParams.get('contentId');
  const queries = searchParams.get('queries');

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
  }

  const apiKey = process.env.MICROCMS_API_KEY;
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;

  if (!apiKey || !serviceDomain) {
    return NextResponse.json({ error: 'API key or service domain is not configured' }, { status: 500 });
  }

  // サービスドメインを直接使用
  let url = `https://${serviceDomain}.microcms.io/api/v1/${endpoint}`;
  
  if (contentId) {
    url += `/${contentId}`;
  }

  try {
    const headers = {
      'X-MICROCMS-API-KEY': apiKey,
    };

    let queryString = '';
    
    try {
      if (queries) {
        const queryParams = JSON.parse(queries);
        queryString = Object.entries(queryParams)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join('&');
      }
      
      if (queryString) {
        url += `?${queryString}`;
      }
    } catch (error) {
      console.error('Error parsing queries:', error, queries);
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }

    console.log('Fetching from URL:', url);
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from microCMS:', error);
    return NextResponse.json({ error: 'Failed to fetch data from microCMS' }, { status: 500 });
  }
}
