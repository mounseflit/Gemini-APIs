import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const mediaPath = __dirname + "/media";

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all requests
app.use(cors());

// Function to create an image from file
async function filesCreateImage(req, res) {
  try {
    const fileManager = new GoogleAIFileManager(process.env.API_KEY);
    const uploadResult = await fileManager.uploadFile(`${mediaPath}/jetpack.jpg`, {
      mimeType: "image/jpeg",
      displayName: "Jetpack drawing",
    });

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "Tell me about this image.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    res.json({ response: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Function to create an audio from file
async function filesCreateAudio(req, res) {
  try {
    const fileManager = new GoogleAIFileManager(process.env.API_KEY);
    const uploadResult = await fileManager.uploadFile(`${mediaPath}/samplesmall.mp3`, {
      mimeType: "audio/mp3",
      displayName: "Audio sample",
    });

    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === FileState.PROCESSING) {
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(uploadResult.file.name);
    }

    if (file.state === FileState.FAILED) {
      throw new Error("Audio processing failed.");
    }

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "Tell me about this audio clip.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    res.json({ response: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Function to create text from file
async function filesCreateText(req, res) {
  try {
    const fileManager = new GoogleAIFileManager(process.env.API_KEY);
    const uploadResult = await fileManager.uploadFile(`${mediaPath}/a11.txt`, {
      mimeType: "text/plain",
      displayName: "Apollo 11",
    });

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "Transcribe the first few sentences of this document.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    res.json({ response: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Function to create a video from file
async function filesCreateVideo(req, res) {
  try {
    const fileManager = new GoogleAIFileManager(process.env.API_KEY);
    const uploadResult = await fileManager.uploadFile(`${mediaPath}/Big_Buck_Bunny.mp4`, {
      mimeType: "video/mp4",
      displayName: "Big Buck Bunny",
    });

    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === FileState.PROCESSING) {
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(uploadResult.file.name);
    }

    if (file.state === FileState.FAILED) {
      throw new Error("Video processing failed.");
    }

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "Tell me about this video.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    res.json({ response: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Routes
app.get("/create-image", filesCreateImage);
app.get("/create-audio", filesCreateAudio);
app.get("/create-text", filesCreateText);
app.get("/create-video", filesCreateVideo);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
