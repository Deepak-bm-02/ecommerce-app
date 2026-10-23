
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());


// Home route
app.get("/", (req, res) => {
    res.send("E-Commerce API is running");
});

// Get all active products from MySQL

app.get("/api/products", async (req, res) => {
    try {
        const search = req.query.search;

        let sql = `
            SELECT id, category_id, name, description,
                   price, stock_quantity, image_url
            FROM products
            WHERE is_active = 1
        `;

        const params = [];

        if (search) {
            sql += " AND (name LIKE ? OR description LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }

        const [products] = await pool.query(sql, params);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});





app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


