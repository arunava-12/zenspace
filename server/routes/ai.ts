import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

router.post("/chat", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(req.body.prompt);
    res.json({ text: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: "AI failed" });
  }
});

router.post("/suggest-tasks", async (req, res) => {
  try {
    const { name, description } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `Generate 3 specific actionable project tasks for a project named "${name}" with description "${description}". Return JSON array with title, description, priority, type.`
    );

    const text = result.response.text();

    res.json(JSON.parse(text));
  } catch (err) {
    res.status(500).json({ error: "AI failed" });
  }
});

export default router;
