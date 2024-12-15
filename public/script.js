document.getElementById('toggleBtn').addEventListener('click', () => {
    const instructions = document.getElementById('instructions');
    const toggleBtn = document.getElementById('toggleBtn');
    if (instructions.style.display === 'none' || instructions.style.display === '') {
      instructions.style.display = 'block';
      toggleBtn.textContent = '▲ 詳細を閉じる';
    } else {
      instructions.style.display = 'none';
      toggleBtn.textContent = '▼ 詳細を表示';
    }
  });
  
  document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('jsonInput').value = '';
  });
  
  document.getElementById('submitBtn').addEventListener('click', async () => {
    const jsonText = document.getElementById('jsonInput').value.trim();
  
    if (!jsonText) {
      alert("JSONが空です。");
      return;
    }
  
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonText
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("データを登録しました！");
        document.getElementById('jsonInput').value = '';
      } else {
        alert("エラーが発生しました: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("ネットワークエラーが発生しました");
    }
  });
  