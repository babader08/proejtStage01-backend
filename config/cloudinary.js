const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "red_product_hotels", // Nom du dossier sur Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

module.exports = { cloudinary, storage }; // module.exports c'est une façon d’exporter des variables ou fonctions dans un fichier Node.js

// Ce code sert à configurer l’envoi et le stockage de fichiers (images)
//  sur Cloudinary depuis ton application Node.js.
