const Groq = require('groq-sdk');
const Advisory = require('../models/Advisory');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const askAdvisory = async (req, res) => {
  try {
    const { question, cropName, soilType, location } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question'
      });
    }

    const prompt = `You are an expert agricultural advisor for Indian farmers.

Farmer Details:
- Location: ${location || 'Punjab, India'}
- Crop: ${cropName || 'Not specified'}
- Soil Type: ${soilType || 'Not specified'}

Farmer's Question: ${question}

Please provide practical, specific advice in simple language.
Keep response under 150 words.
Focus on actionable steps the farmer can take immediately.
If relevant, mention specific fertilizers, pesticides or techniques used in India.`;

    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 500
    });

    const aiResponse = response.choices[0].message.content;

    const advisory = await Advisory.create({
      userId: req.user.id,
      cropName: cropName || 'General',
      question,
      aiResponse
    });

    res.json({
      success: true,
      advisory: {
        id: advisory._id,
        question,
        answer: aiResponse,
        cropName: advisory.cropName,
        createdAt: advisory.createdAt
      }
    });

  } catch (error) {
    console.log('Advisory Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAdvisoryHistory = async (req, res) => {
  try {
    const advisories = await Advisory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, advisories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { askAdvisory, getAdvisoryHistory };