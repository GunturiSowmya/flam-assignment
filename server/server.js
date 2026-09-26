import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
dotenv.config();
const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.FRONTEND_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Origin is not allowed by CORS"));
    },
}));

app.get("/api/health", (req, res) => {
    res.json({ success: true });
});

const systemPrompt = `You are an AI Study Assistant. Create study material from the user's topic or notes.
Return only valid JSON matching this schema, with no markdown or surrounding explanation:
{
  "title": "string",
  "cards": [{ "id": 1, "question": "string", "answer": "string" }],
  "quiz": [{ "id": 1, "question": "string", "options": ["string", "string", "string", "string"], "correctAnswer": 0 }]
}
Generate exactly 5 flashcards and 5 quiz questions. Each quiz must have exactly 4 non-empty options. correctAnswer must be a zero-based integer from 0 to 3. Use unique numeric IDs and non-empty strings for all text fields.`;

app.post("/api/response", async (req, res) => {
    const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
    if (!prompt) {
        return res.status(400).json({ success: false, error: "Please enter a topic or notes to get started." });
    }

    try {
        if (!process.env.OPENROUTER_API_KEY) throw new Error("OpenRouter API key is not configured");
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            signal: AbortSignal.timeout(45_000),
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openrouter/free",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) throw new Error(`OpenRouter returned ${response.status}`);
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (typeof content !== "string" || !content.trim()) throw new Error("OpenRouter response did not contain message content");
        return res.json({ success: true, data: content });
    } catch (error) {
        console.error("Study material generation failed:", error.message);
        if (error.name === "TimeoutError" || error.name === "AbortError") {
            return res.status(504).json({ success: false, error: "The AI request took too long. Please try again." });
        }
        return res.status(500).json({ success: false, error: "Failed to generate study material" });
    }
});

app.use((error, req, res, next) => {
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ success: false, error: "Request body must be valid JSON." });
    }
    if (error.type === "entity.too.large") {
        return res.status(413).json({ success: false, error: "Request body is too large." });
    }
    console.error("Request failed:", error.message);
    return res.status(500).json({ success: false, error: "The server could not process the request." });
});

app.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`);
})
