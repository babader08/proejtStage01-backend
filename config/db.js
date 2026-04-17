const { Pool } = require("pg");

const pool = new Pool({
  user: "projetStage01",
  host: "127.0.0.1",
  database: "postgres",
  password: "babader",
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Erreur de connexion à Postgres", err.stack);
  }
  console.log("Connecté à la base de données PostgreSQL !");
  release();
});

module.exports = pool;
