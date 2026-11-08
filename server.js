
import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();

app.use(express.json());

console.log(
    'Gemini API Key geladen:',
    !!process.env.GEMINI_API_KEY
);

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        console.log('Nachrichten erhalten:', messages);

        const contents = messages.map(message => ({
            role: message.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: message.content }]
        }));

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash-lite',
            contents
        });

        res.json({
            reply: response.text
        });

    } catch (error) {
        console.error('GEMINI FEHLER:', error);

        res.status(500).json({
            error: error.message || 'Unbekannter Gemini-Fehler'
        });
    }
});

app.listen(3001, () => {
    console.log('Server läuft auf http://localhost:3001');
});
