const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const axios = require("axios");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/s3");

const extractResumeText = async (
  fileUrl
) => {
  try {
    const isUrl = fileUrl.startsWith("http://") || fileUrl.startsWith("https://");
    let buffer;
    
    if (isUrl && fileUrl.includes("amazonaws.com")) {
      const key = decodeURIComponent(
        new URL(fileUrl).pathname.substring(1)
      );
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key
      });
      const response = await s3Client.send(command);
      
      // Use AWS SDK v3 built-in method
      const byteArray = await response.Body.transformToByteArray();
      buffer = Buffer.from(byteArray);
      
    } else if (isUrl) {
      const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
      buffer = Buffer.from(response.data);
    } else {
      buffer = fs.readFileSync(fileUrl);
    }

    if (
      fileUrl.toLowerCase().endsWith(".pdf")
    ) {
      const data =
        await pdfParse(buffer);

      return data.text;
    }

    if (
      fileUrl.toLowerCase().endsWith(".docx")
    ) {
      const result =
        await mammoth.extractRawText({
          buffer: buffer,
        });

      return result.value;
    }

    return "";
  } catch (error) {
    console.error(
      "Resume Parse Error:",
      error
    );
    throw error;
  }
};

module.exports = {
  extractResumeText,
};