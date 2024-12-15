document.getElementById('submitBtn').addEventListener('click', async () => {
    const jsonText = document.getElementById('jsonInput').value.trim();
  
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonText
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("データを登録しました！");
      } else {
        alert("エラーが発生しました: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("ネットワークエラーが発生しました");
    }
  });
  