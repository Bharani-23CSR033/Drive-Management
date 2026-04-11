const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileBuffer = async ({
  buffer,
  folder = "drive-management",
  resourceType = "raw",
  mimeType = "application/octet-stream",
}) => {
  const base64 = buffer.toString("base64");
  const dataUri = `data:${mimeType};base64,${base64}`;

  const uploaded = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: resourceType,
  });

  return uploaded.secure_url;
};

module.exports = { cloudinary, uploadFileBuffer };
