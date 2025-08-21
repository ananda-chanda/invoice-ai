const { CohereClient } = require('cohere-ai');
const co = new CohereClient({ token: process.env.COHERE_API_KEY });

async function oneSentence(prompt) {
  // Use lightweight chat/generate depending on SDK version
  const res = await co.generate({ prompt, maxTokens: 60, temperature: 0.2 });
  // handle different SDKs: res.generations?.[0]?.text
  const txt = res?.generations?.[0]?.text?.trim() || '';
  return txt.replace(/^"|"$/g,''); // strip quotes if any
}

module.exports = { oneSentence };
