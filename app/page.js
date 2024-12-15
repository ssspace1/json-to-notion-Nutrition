"use client";
import { useState } from "react";

export default function HomePage() {
  const [jsonText, setJsonText] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonText
      });

      const result = await response.json();
      if (response.ok) {
        alert("データを登録しました！");
      } else {
        alert("エラーが発生しました: " + result.error);
      }
    } catch (err) {
      alert("ネットワークエラーが発生しました");
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f0f0", fontFamily: "sans-serif" }}>
      <h1>ALL_Task アップローダー</h1>
      <p>下のテキストボックスにJSONを貼り付けて、「送信」ボタンを押してください。</p>
      <textarea
        style={{ width: "100%", height: "200px" }}
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
      ></textarea>
      <br /><br />
      <button onClick={handleSubmit}>送信</button>
      <p>※Notionデータベースに自動で反映されます。</p>
    </div>
  );
}
