import mammoth from "mammoth";
import axios from "axios";
import FormData from "form-data";

export async function extractTextFromFile(file: Blob): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileType = file.type;

    switch (fileType) {
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/msword": {
        const { value } = await mammoth.extractRawText({ buffer });
        return value;
      }

      case "image/png":
      case "image/jpeg":
      case "image/jpg": {
        const form = new FormData();
        form.append("language", "eng");
        form.append("isOverlayRequired", "false");
        form.append("file", buffer, {
          filename: "upload.jpg", // required by ocr.space
          contentType: fileType,
        });

        const response = await axios.post(
          "https://api.ocr.space/parse/image",
          form,
          {
            headers: {
              apikey: process.env.OCR_SPACE_API_KEY!, // 🔐 Set in your .env
              ...form.getHeaders(),
            },
          }
        );

        const text = response.data?.ParsedResults?.[0]?.ParsedText;
        if (!text) throw new Error("OCR API failed to extract text.");
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
