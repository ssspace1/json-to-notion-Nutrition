export const metadata = {
  title: 'ALL_Task アップローダー',
  description: 'Notionデータベースに自動入力するアプリ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
