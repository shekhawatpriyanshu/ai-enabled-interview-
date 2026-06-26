const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const extractResumeText = async (
  filePath
) => {
  try {
    if (
      filePath.endsWith(".pdf")
    ) {
      const buffer =
        fs.readFileSync(filePath);

      const data =
        await pdfParse(buffer);

      return data.text;
    }

    if (
      filePath.endsWith(".docx")
    ) {
      const result =
        await mammoth.extractRawText({
          path: filePath,
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