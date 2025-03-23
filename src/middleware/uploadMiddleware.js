const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Storage settings
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Dopaminder",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: (req, file) =>
      `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`,
  },
});

//Multer upload setup
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

module.exports = upload;
