import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint to process the immigration assessment
app.post("/api/assessment", async (req, res) => {
  const form = req.body;
  const { fullName, email, ...safeForm } = form;

  const prompt = `
  You are an immigration AI assistant.
  The following anonymized user profile has been submitted for a free assessment:
  ${JSON.stringify(safeForm)}

  Provide a short, educational summary of possible Canadian immigration pathways
  the user might explore based on this information.
  Do NOT give legal advice or eligibility guarantees.
  Begin the response with this disclaimer:
  "⚠️ This AI-generated report is for general informational purposes only and should not be taken as legal or immigration advice."
  `;

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const report = aiResponse.choices[0].message.content;

    // Instead of sending an email, just return the report
    res.json({ success: true, report });
  } catch (err) {
    console.error("❌ Error generating report:", err);
    res.json({ success: false, error: err.message });
  }
});

app.listen(3001, () => console.log("✅ Server running on port 3001"));
