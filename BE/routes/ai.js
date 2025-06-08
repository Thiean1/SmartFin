const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ answer: "Thiếu prompt." });

  try {
    console.log("Sending request to Gemini with prompt:", prompt);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAARd4UGsqAaqrkCT8lxNZUzzBTxU5Z0qs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini API Response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(
        `Gemini API error: ${data.error?.message || "Unknown error"}`
      );
    }

    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!answer) {
      throw new Error("No response from Gemini");
    }

    res.json({ answer });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({
      answer: "Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn.",
      error: err.message,
    });
  }
});

module.exports = router;
