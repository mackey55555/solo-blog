'use client';

import { useEffect, useRef } from 'react';

// AdSenseの型定義を追加
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

type Props = {
  slot: string;
  style?: React.CSSProperties;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
};

export default function AdSense({ slot, style, format = 'auto', responsive = true }: Props) {
  const insRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // すでに初期化されている場合は何もしない
    if (initialized.current) return;
    initialized.current = true;

    // AdSenseのスクリプトがまだ読み込まれていない場合は読み込む
    const hasAdScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
    if (!hasAdScript) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // 広告を初期化
    try {
      if (insRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', overflow: 'hidden', ...style }}>
      <div ref={insRef}>
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            ...(responsive ? { width: '100%' } : {}),
          }}
          data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
}
