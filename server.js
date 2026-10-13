const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Kick Chat Backend is running successfully!');
});

app.post('/api/send', async (req, res) => {
  try {
    const { chatroom_id, message, token, channel } = req.body;

    if (!chatroom_id || !message || !token) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    const kickResponse = await fetch(`https://kick.com/api/v2/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({
        chatroom_id: chatroom_id,
        content: message,
        type: 'message'
      })
    });

    const data = await kickResponse.json();

    if (kickResponse.ok) {
      res.json({ ok: true, data });
    } else {
      res.json({ ok: false, error: data.message || 'Failed to send message' });
    }

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});