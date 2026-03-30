const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt) {
  const res = await axios.post(GEMINI_URL, {
    contents: [{ parts: [{ text: prompt }] }],
  });
  return res.data.candidates[0].content.parts[0].text.trim();
}

const aiCtrl = {
  enhanceCaption: async (req, res) => {
    try {
      const { caption } = req.body;
      if (!caption || !caption.trim()) {
        return res.status(400).json({ msg: 'Please provide a caption to enhance.' });
      }

      const prompt = `You are a creative social media copywriter. Enhance the following caption to make it more engaging, expressive, and impactful for social media. Keep it concise (under 150 words). Then on a new line starting with "HASHTAGS:", list exactly 5 relevant hashtags.

Caption: "${caption}"

Respond in this exact format:
ENHANCED: <your enhanced caption here>
HASHTAGS: #tag1 #tag2 #tag3 #tag4 #tag5`;

      const raw = await callGemini(prompt);

      const enhancedMatch = raw.match(/ENHANCED:\s*([\s\S]*?)(?=\nHASHTAGS:|$)/i);
      const hashtagsMatch = raw.match(/HASHTAGS:\s*(.+)/i);

      const enhancedCaption = enhancedMatch ? enhancedMatch[1].trim() : caption;
      const hashtags = hashtagsMatch
        ? hashtagsMatch[1].trim().split(/\s+/).filter(h => h.startsWith('#'))
        : [];

      res.json({ enhancedCaption, hashtags });
    } catch (err) {
      console.error('AI enhance error:', err.message);
      res.status(500).json({ msg: 'AI enhancement failed. Please try again.' });
    }
  },

  generateCaption: async (req, res) => {
    try {
      const { prompt: userPrompt } = req.body;
      if (!userPrompt || !userPrompt.trim()) {
        return res.status(400).json({ msg: 'Please provide a prompt or keywords.' });
      }

      const prompt = `You are a creative social media copywriter. Generate a catchy, engaging social media post caption based on the following keywords or prompt. Keep it under 120 words, make it expressive and authentic. Then list 5 relevant hashtags.

Keywords/Prompt: "${userPrompt}"

Respond in this exact format:
CAPTION: <your generated caption here>
HASHTAGS: #tag1 #tag2 #tag3 #tag4 #tag5`;

      const raw = await callGemini(prompt);

      const captionMatch = raw.match(/CAPTION:\s*([\s\S]*?)(?=\nHASHTAGS:|$)/i);
      const hashtagsMatch = raw.match(/HASHTAGS:\s*(.+)/i);

      const generatedCaption = captionMatch ? captionMatch[1].trim() : '';
      const hashtags = hashtagsMatch
        ? hashtagsMatch[1].trim().split(/\s+/).filter(h => h.startsWith('#'))
        : [];

      res.json({ generatedCaption, hashtags });
    } catch (err) {
      console.error('AI generate error:', err.message);
      res.status(500).json({ msg: 'AI generation failed. Please try again.' });
    }
  },
};

module.exports = aiCtrl;
