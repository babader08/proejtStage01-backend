const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const path = require("path"); //pour gérer les chemins de fichiers
require("dotenv").config();

const fs = require("fs");
const uploadDir = "./uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 Dossier 'uploads' créé dynamiquement");
}

// ce sont les middlewares et les contrôleurs
const verifyToken = require("./middlewares/authMiddleware");
const upload = require("./middlewares/uploadMiddleware");
const {
  addProduct,
  getAllProducts,
} = require("./Controller/productsController");
const pool = require("./config/db");

// Initialisation pour le Firebase
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Sur Render : On lit la variable d'environnement que tu as créée
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Sur ton Mac : On lit le fichier local
  serviceAccount = require("./config/serviceAccountKey.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = process.env.PORT || 8080;

const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        namehotels VARCHAR(255),
        adresse VARCHAR(255),
        price VARCHAR(50),
        image_url TEXT,
        number VARCHAR(50),
        devise VARCHAR(10),
        email VARCHAR(255)
      );
    `);
    console.log("✅ Table 'products' prête !");
  } catch (err) {
    console.error("❌ Erreur lors de la création de la table:", err);
  }
};

createTable();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://projet-stage-01.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "http://localhost:5173",
    "http://localhost:5174",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ce code permet lire et traiter les données envoyées dans le corps des requêtes HTTP au format application/x-www-form-urlencoded

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/api/products", verifyToken, upload.single("image_url"), addProduct);
app.get("/api/products", getAllProducts);

app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
});
