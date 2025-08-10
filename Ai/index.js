import express from "express";
import bodyParser from "body-parser";
import { generateRiddle, generatePoem, mixPoeLines } from "./karrot-brain.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Handle POST requests to /api/v1/karrot
app.post("/api/v1/karrot", async (req, res) => {
  const { message } = req.body;
  let reply = "";

  if (/riddle/i.test(message)) {
    reply = generateRiddle();
  } else if (/poem/i.test(message)) {
    reply = generatePoem();
  } else {
    reply = mixPoeLines();
  }

  res.json({ reply });
});

app.listen(PORT, () => {
  console.log(`🧠 Karrot AI backend is running on http://localhost:${PORT}`);
});
