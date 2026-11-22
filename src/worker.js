import { GoogleGenAI } from "@google/genai";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/chat" && request.method === "POST") {
            try {
                const { messages } = await request.json();

                if (!Array.isArray(messages) || messages.length === 0) {
                    return Response.json(
                        { error: "Messages array is required" },
                        { status: 400 }
                    );
                }

                const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

                const contents = messages.map((message) => ({
                    role: message.role === "assistant" ? "model" : "user",
                    parts: [{ text: message.content }],
                }));

                const response = await ai.models.generateContent({
                    model: "gemini-3.5-flash-lite",
                    contents,
                });

                return Response.json({
                    reply: response.text,
                });
            } catch (error) {
                console.error("Worker /api/chat Fehler:", error);
                return Response.json(
                    { error: error?.message || "Gemini-Fehler im Worker" },
                    { status: 500 }
                );
            }
        }

        if (env.ASSETS) {
            return env.ASSETS.fetch(request);
        }

        return new Response("Not Found", { status: 404 });
    },
};