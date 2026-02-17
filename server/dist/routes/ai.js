"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const router = express_1.default.Router();
const groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile"; // free, fast, high quality
router.post("/chat", async (req, res) => {
    try {
        const completion = await groq.chat.completions.create({
            model: MODEL,
            messages: [{ role: "user", content: req.body.prompt }],
        });
        res.json({ text: completion.choices[0].message.content });
    }
    catch (err) {
        console.error("AI /chat error:", err);
        res.status(500).json({ error: "AI failed" });
    }
});
router.post("/suggest-tasks", async (req, res) => {
    try {
        const { name, description } = req.body;
        const completion = await groq.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: "user",
                    content: `Generate 3 specific actionable project tasks for a project named "${name}" with description "${description}".
Return ONLY a raw JSON array with no markdown, no code fences, no explanation.
Each object must have: title, description, priority (low/medium/high), type (string).
Example format: [{"title":"...","description":"...","priority":"high","type":"feature"}]`,
                },
            ],
        });
        const raw = completion.choices[0].message.content ?? "";
        // Strip markdown fences just in case
        const cleaned = raw
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/```\s*$/i, "")
            .trim();
        const parsed = JSON.parse(cleaned);
        res.json(parsed);
    }
    catch (err) {
        console.error("AI /suggest-tasks error:", err);
        res.status(500).json({ error: "AI failed" });
    }
});
exports.default = router;
