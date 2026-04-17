const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const path = require("path"); //pour gérer les chemins de fichiers
require("dotenv").config();

// ce sont les middlewares et les contrôleurs
const verifyToken = require("./middlewares/authMiddleware");
const upload = require("./middlewares/uploadMiddleware");
const {
  addProduct,
  getAllProducts,
} = require("./Controller/productsController");

// Initialisation pour le Firebase
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require("./config/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
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

app.post("/api/products", upload.single("image_url"), addProduct);
app.get("/api/products", getAllProducts);

app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
});
