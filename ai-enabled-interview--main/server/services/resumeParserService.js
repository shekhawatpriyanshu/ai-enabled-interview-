const { extractResumeText: parseText } = require("./resumeParser");

const extractResumeText = async (file) => {
  try {
    if (!file) return "";

    // If file object from multer (buffer or path or location/s3)
    if (file.location) {
      return await parseText(file.location);
    }
    if (file.path) {
      return await parseText(file.path);
    }
    if (typeof file === "string") {
      return await parseText(file);
    }
    if (file.buffer) {
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(file.buffer);
      return data.text || "";
    }

    return "";
  } catch (error) {
    console.error("extractResumeText service error:", error);
    return "";
  }
};

module.exports = {
  extractResumeText,
};
