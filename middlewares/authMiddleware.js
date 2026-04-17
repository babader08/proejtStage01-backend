// backend/middlewares/authMiddleware.js
const admin = require("firebase-admin");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ Pas de header Authorization ou format incorrect");
    return res.status(401).json({ message: "Non autorisé" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    console.log("✅ Token valide pour :", decodedToken.email);
    next();
  } catch (error) {
    // C'EST CETTE LIGNE QUI VA NOUS DONNER LA RÉPONSE
    console.error(
      "❌ ERREUR AUTHENTIFICATION :",
      error.code,
      "->",
      error.message,
    );

    res.status(403).json({
      message: "Accès refusé",
      reason: error.message, // On renvoie la raison pour aider au debug
    });
  }
};

module.exports = verifyToken;
