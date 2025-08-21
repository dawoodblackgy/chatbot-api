require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Google API key not configured.' });
    }

    const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(apiURL, {
            contents: [{
                parts: [{
                    text: `You are a helpful assistant for a digital marketing company called Social Nest. Answer concisely and in the same language as the user. User's message: "${userMessage}"`
                }]
            }]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Extract the text from the Gemini response
        const reply = response.data.candidates[0].content.parts[0].text.trim();
        res.json({ reply: reply });
    } catch (error) {
        console.error('Error calling Google Gemini API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch AI response from Google.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
