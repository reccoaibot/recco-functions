const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

exports.getChatGPTResponse = functions.https.onCall(async (data, context) => {
  const userMessage = data.message;

  if (!userMessage) {
    throw new functions.https.HttpsError("invalid-argument", "Missing message input.");
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
    return { reply };
  } catch (error) {
    console.error("OpenAI error:", error.response?.data || error.message);
    throw new functions.https.HttpsError("internal", "OpenAI call failed");
  }
});
// Triggering redeploy
