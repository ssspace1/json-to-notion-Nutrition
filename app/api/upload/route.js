import { NextResponse } from 'next/server';
import { Client } from "@notionhq/client";

export async function POST(request) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const databaseId = process.env.NOTION_DATABASE_ID;

  try {
    const body = await request.json();

    // bodyはJSON配列を想定
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

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add pages' }, { status: 500 });
  }
}
