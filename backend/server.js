const express = require("express");

const app = express();

const PORT = 5000;

const products = [
    {
        id: 1,
        name: "Laptop",
        price: 55000
    },
    {
        id: 2,
        name: "Headphones",
        price: 2500
    },
    {
        id: 3,
        name: "Smartphone",
        price: 30000
    }
];

app.get("/", (req, res) => {
    res.send("E-Commerce API is running");
});

app.get("/api/products", (req, res) => {
    res.json(products);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});