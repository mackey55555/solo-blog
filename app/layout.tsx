import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mackeyのエンジニア日記",
  description: "エンジニアリングに関する日々の学びや発見を気ままに綴るブログです",
  keywords: ["エンジニア", "プログラミング", "Web開発", "技術ブログ", "日記"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <Link href="/" className="no-underline">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 hover:text-gray-700 transition-colors">
                    mackeyのエンジニア日記
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">ゆるゆる上げていく技術ブログ</p>
                </Link>
              </div>
              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                      ホーム
                    </Link>
                  </li>
                  <li>
                    <Link href="https://github.com/mackey55555" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                      GitHub
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 mt-12 py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center">
              <p className="text-center text-gray-500 text-sm">
                日々の発見や学びを気ままに記録していきます
              </p>
              <p className="text-center text-gray-500 text-sm mt-4">
                © 2025 mackeyのエンジニア日記 All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
