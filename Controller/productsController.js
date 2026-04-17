const pool = require("../config/db");

const addProduct = async (req, res) => {
  try {
    const { nameHotels, adresse, price, number, devise, email } = req.body;

    const image_url = req.file ? req.file.path : null;

    const query = `
      INSERT INTO products (nameHotels, adresse, price, image_url, phone_number, devise, email)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;

    const values = [
      nameHotels,
      adresse,
      price,
      image_url,
      number,
      devise,
      email,
    ];
    const result = await pool.query(query, values);

    res
      .status(201)
      .json({ message: "Hôtel ajouté via Cloudinary !", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Erreur Cloudinary/DB" });
  }
};

// RETURNING * une fonctionnalité de postgres qui permet de renvoyer
//  toutes les colonnes de la ligne qui vient d’être insérée.

const getAllProducts = async (req, res) => {
  try {
    const query = "SELECT * FROM products ORDER BY id DESC";
    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ ERREUR DÉTAILLÉE AJOUT:", error); // Cela apparaîtra dans les logs Render
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { addProduct, getAllProducts };
