import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: {
    folder:          "crave",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation:  [{ width: 800, height: 600, crop: "limit", quality: "auto" }],
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export async function deleteImage(imageUrl) {
  if (!imageUrl) return;
  try {
    const parts = imageUrl.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return;
    const afterUpload = parts.slice(uploadIndex + 1);
    const startIndex = afterUpload[0]?.match(/^v\d+$/) ? 1 : 0;
    const publicIdWithExt = afterUpload.slice(startIndex).join("/");
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
    await cloudinaryV2.uploader.destroy(publicId);
  } catch (err) {
    console.error("[cloudinary] deleteImage failed:", err.message);
  }
}

export default cloudinaryV2;