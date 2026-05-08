const express = require('express');
const OpenAI = require('openai');

const router = express.Router();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = {
  role: 'system',
  content: 'You are a helpful assistant.',
};

// POST /ai/chat
// Body: { messages: [{ role: "user"|"assistant", content: "..." }, ...] }
router.post('/chat', async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages must be a non-empty array' });
  }

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [SYSTEM_PROMPT, ...messages],
  });

  const reply = completion.choices[0].message.content;
  res.json({ reply });
});

module.exports = router;
