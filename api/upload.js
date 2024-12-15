import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  // POST以外は拒否
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const databaseId = process.env.NOTION_DATABASE_ID;

  try {
    const body = req.body; // fetch時にapplication/jsonを指定していれば自動でパースされます

    for (const item of body) {
      const { ALL_Task, 状態, Priority, 日付, memo, リソース } = item;

      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          "ALL_Task": {
            title: [{ type: "text", text: { content: ALL_Task } }]
          },
          "状態": {
            select: { name: 状態 }
          },
          "Priority": {
            select: { name: Priority }
          },
          "日付": {
            date: { start: 日付 }
          },
          "memo": {
            rich_text: [{ type: "text", text: { content: memo } }]
          },
          "リソース": {
            number: リソース
          }
        }
      });
    }

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add pages" });
  }
}
