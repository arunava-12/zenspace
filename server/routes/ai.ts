import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.VITE_GOOGLE_API_KEY!); // ✅ fixed env var name

router.post("/chat", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(req.body.prompt);
    res.json({ text: result.response.text() });
  } catch (err) {
    console.error("AI /chat error:", err);
    res.status(500).json({ error: "AI failed" });
  }
});

router.post("/suggest-tasks", async (req, res) => {
  try {
    const { name, description } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // ✅ free tier

    const result = await model.generateContent(
      `Generate 3 specific actionable project tasks for a project named "${name}" with description "${description}". 
      Return ONLY a raw JSON array (no markdown, no code fences) with objects containing: title, description, priority, type.`
    );

    const raw = result.response.text();

    // ✅ Strip markdown code fences if Gemini wraps the response
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    res.json(parsed);
  } catch (err) {
    console.error("AI /suggest-tasks error:", err); // ✅ log real error
    res.status(500).json({ error: "AI failed" });
  }
});

export default router;