const multer = require("multer");
const path = require("path");
const multerS3 = require("multer-s3");
const { s3Client } = require("../config/s3");

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    // Note: To make files publicly accessible automatically, you may need: acl: 'public-read'
    // Ensure your S3 bucket allows public ACLs if you use this.
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(
        null,
        `uploads/${Date.now()}_${path.basename(file.originalname)}`
      );
    },
  }),
});

module.exports = upload;