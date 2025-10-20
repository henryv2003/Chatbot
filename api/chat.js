// server.js

// 1. Load environment variables from .env file
require('dotenv').config();
const API_KEY = process.env.GEMINI_API_KEY;

// --- FIX: Import the class for the SDK ---
const { GoogleGenAI } = require('@google/genai');

// 3. Initialize the AI client and Model
if (!API_KEY) {
    return (req, res) => res.status(500).send("error: GEMINI_API_KEY is missing ");
}

// Initialize the client
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Api chat endpoint
module.exports = async (req, res) => {
  // --- Manual Middleware Logic ---
  if (req.method !== "POST") {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // CORS headers for response 
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-type', 'Application/json');

  // Extract the body
  const { contents } = req.body;
  const MODEL_NAME = "gemini-2.5-flash";

  try {
      // validation
      if(!contents) {
        return res.status(400).json({error: "Request body is missing 'contents'."})
      }

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: contents
      });

    // Extract and send the text 
      const responseText = response.text;
      res.json({ rext: response.text });
  
    } catch (error) {
      console.error("Gemini API error:", error.message);
      res.status(500).json({
        error: "Failed to communicate with the gemini API",
        details: error.message
      });
    }

};
