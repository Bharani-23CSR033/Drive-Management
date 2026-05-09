const { v2: cloudinary } = require("cloudinary");

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

const uploadFileBuffer = async ({
  buffer,
  folder = "drive-management",
  resourceType = "raw",
  mimeType = "application/octet-stream",
}) => {
  const base64 = buffer.toString("base64");
  const dataUri = `data:${mimeType};base64,${base64}`;

  if (!isConfigured) {
    throw new Error("Cloudinary is not configured");
  }

  const uploaded = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: resourceType,
  });

  return uploaded.secure_url;
};

module.exports = { cloudinary, uploadFileBuffer, isConfigured };
