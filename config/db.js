const { Pool } = require("pg");
require("dotenv").config(); // Très important pour lire le .env

const pool = new Pool({
  // Si DATABASE_URL existe (sur Render), on l'utilise.
  // Sinon, on utilise tes paramètres locaux du .env
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Erreur de connexion à Postgres", err.stack);
  }
  console.log("✅ Connecté à la base de données PostgreSQL !");
  release();
});

module.exports = pool;
