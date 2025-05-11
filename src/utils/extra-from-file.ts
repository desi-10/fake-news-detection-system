import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { createWorker } from "tesseract.js";

export async function extractTextFromFile(file: Blob): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileType = file.type;

    switch (fileType) {
      case "application/pdf": {
        const pdfData = await pdfParse(buffer);
        return pdfData.text;
      }

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/msword": {
        const { value } = await mammoth.extractRawText({ buffer });
        return value;
      }

      case "image/png":
      case "image/jpeg":
      case "image/jpg": {
        const worker = await createWorker("eng");
        const {
          data: { text },
        } = await worker.recognize(buffer);
        await worker.terminate();
        return text;
      }

      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error("Error extracting text from file:", error);
    throw error;
  }
}
