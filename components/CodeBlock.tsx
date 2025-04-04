'use client';

import { useEffect, useRef } from 'react';

interface CodeBlockProps {
  content: string;
}

export default function CodeBlock({ content }: CodeBlockProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // コードブロックを見つける
    const codeBlocks = contentRef.current.querySelectorAll('pre');
    
    codeBlocks.forEach((pre) => {
      // すでにコピーボタンが追加されている場合はスキップ
      if (pre.querySelector('.copy-button')) return;
      
      // コピーボタンを作成
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
        </svg>
      `;
      
      // スタイルを設定
      copyButton.style.position = 'absolute';
      copyButton.style.top = '8px';
      copyButton.style.right = '8px';
      copyButton.style.padding = '4px';
      copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
      copyButton.style.border = 'none';
      copyButton.style.borderRadius = '4px';
      copyButton.style.color = '#fff';
      copyButton.style.cursor = 'pointer';
      copyButton.style.display = 'flex';
      copyButton.style.alignItems = 'center';
      copyButton.style.justifyContent = 'center';
      copyButton.style.opacity = '0.7';
      copyButton.style.transition = 'opacity 0.2s';
      
      // ホバー時のスタイル
      copyButton.addEventListener('mouseenter', () => {
        copyButton.style.opacity = '1';
      });
      
      copyButton.addEventListener('mouseleave', () => {
        copyButton.style.opacity = '0.7';
      });
      
      // クリックイベントを追加
      copyButton.addEventListener('click', () => {
        // コードブロック内のテキストを取得
        const code = pre.querySelector('code');
        if (!code) return;
        
        // テキストをクリップボードにコピー
        navigator.clipboard.writeText(code.textContent || '')
          .then(() => {
            // コピー成功時の表示
            copyButton.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            `;
            
            // 2秒後に元のアイコンに戻す
            setTimeout(() => {
              copyButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                </svg>
              `;
            }, 2000);
          })
          .catch((err) => {
            console.error('クリップボードへのコピーに失敗しました:', err);
          });
      });
      
      // preタグにポジション相対を設定
      pre.style.position = 'relative';
      
      // コピーボタンをpreタグに追加
      pre.appendChild(copyButton);
    });
  }, []);

  return (
    <div 
      ref={contentRef} 
      className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-a:text-blue-600 prose-img:rounded-lg"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
