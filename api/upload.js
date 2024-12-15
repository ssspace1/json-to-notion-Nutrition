const { Client } = require('@notionhq/client');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  let bodyData = [];
  req.on('data', chunk => {
    bodyData.push(chunk);
  });

  req.on('end', async () => {
    bodyData = Buffer.concat(bodyData).toString();

    let data;
    try {
      data = JSON.parse(bodyData);
    } catch (error) {
      return res.status(400).json({ error: "Invalid JSON" });
    }

    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    const databaseId = process.env.NOTION_DATABASE_ID;

    try {
      for (const item of data) {
        const { ALL_Task, 状態, Priority, 日付, memo, リソース } = item;
        await notion.pages.create({
          parent: { database_id: databaseId },
          properties: {
            "ALL_Task": { title: [{ type: "text", text: { content: ALL_Task } }] },
            "状態": { select: { name: 状態 } },
            "Priority": { select: { name: Priority } },
            "日付": { date: { start: 日付 } },
            "memo": { rich_text: [{ type: "text", text: { content: memo } }] },
            "リソース": { number: リソース }
          }
        });
      }

      res.status(200).json({ status: "success" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add pages" });
    }
  });
}
