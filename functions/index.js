const functions = require("firebase-functions");
const axios = require("axios");

    exports.getChatGPTResponse = functions
    .v2
    .https
    .onRequest({
      secrets: ["OPENAI_API_KEY"]
    }, async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Missing message input." });
    }

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are a friendly, emotionally intelligent TV and movie recommender. Suggest shows or movies based on the user's mood and preferences.",
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          temperature: 0.8,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      return res.status(200).json({ reply });
    } catch (err) {
      console.error("OpenAI Error:", err.response?.data || err.message || err);
      return res.status(500).json({ error: "Something went wrong." });
    }
  });
