const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // リクエストボディを読み込み
  let bodyData = [];
  for await (const chunk of req) {
    bodyData.push(chunk);
  }
  bodyData = Buffer.concat(bodyData).toString();

  let data;
  try {
    data = JSON.parse(bodyData);
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  // properties.jsonを読み込む
  const propertiesConfigPath = path.join(__dirname, '..', 'config', 'properties.json');
  const propertiesConfig = JSON.parse(fs.readFileSync(propertiesConfigPath, 'utf8'));

  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const databaseId = process.env.NOTION_DATABASE_ID;

  try {
    for (const item of data) {
      const propertiesToUpdate = {};

      // properties.jsonで定義されたプロパティに基づいてNotionプロパティを構築
      for (const [propKey, propDef] of Object.entries(propertiesConfig.properties)) {
        const userValue = item[propKey]; // ユーザがJSONで渡してくるキーと合わせる

        if (userValue === undefined) {
          // データがない場合はスキップするか、デフォルト処理
          continue;
        }

        // プロパティタイプに応じてNotion用のプロパティオブジェクトを作成
        switch (propDef.type) {
          case 'title':
            propertiesToUpdate[propDef.notionPropertyName] = {
              title: [{ type: "text", text: { content: userValue } }]
            };
            break;
          case 'select':
            // selectオプションが有効な値かチェック (任意)
            // if (!propDef.options.includes(userValue)) {
            //   // 必要なら無効な値への対応
            // }
            propertiesToUpdate[propDef.notionPropertyName] = {
              select: { name: userValue }
            };
            break;
          case 'date':
            propertiesToUpdate[propDef.notionPropertyName] = {
              date: { start: userValue }
            };
            break;
          case 'rich_text':
            propertiesToUpdate[propDef.notionPropertyName] = {
              rich_text: [{ type: "text", text: { content: userValue } }]
            };
            break;
          case 'number':
            propertiesToUpdate[propDef.notionPropertyName] = {
              number: userValue
            };
            break;
          default:
            // 未対応タイプはとりあえずスキップ
            break;
        }
      }

      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: propertiesToUpdate
      });
    }

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add pages" });
  }
};
