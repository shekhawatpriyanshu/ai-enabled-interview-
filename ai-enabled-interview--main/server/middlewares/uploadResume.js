const multer = require("multer");
const path = require("path");
const multerS3 = require("multer-s3");
const { s3Client } = require("../config/s3");

module.exports = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(
        null,
        `uploads/resumes/${Date.now()}_${path.basename(file.originalname)}`
      );
    },
  }),
});