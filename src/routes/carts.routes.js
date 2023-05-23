const express = require("express");
const { Router } = express;
const uuid4 = require("uuid4");
const fs = require('fs');
const path = require('path');

const cartFilePath = path.join(__dirname, 'carts.json');

const router = new Router();

let carts = [];

// Lee los datos de los carritos almacenados
try {
  const cartsData = fs.readFileSync(cartFilePath, 'utf-8');
  carts = JSON.parse(cartsData);
} catch (error) {
  console.error(error);
}

// Importa la clase CartManager
const CartManager = require('../controllers/cartManager');

// Crea una instancia de CartManager
const cartManager = new CartManager(carts);

// POST
router.post("/", (req, res) => {
  const newCart = cartManager.createCart();
  try {
    fs.writeFileSync(cartFilePath, JSON.stringify(carts, null, 2));
    res.json({ data: newCart, message: "Cart created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating cart" });
  }
});

// GET /:CID
router.get("/:cid", (req, res) => {
  const { cid } = req.params;
  const cart = cartManager.getCartById(cid);
  if (cart) {
    res.json({ data: cart.products });
  } else {
    res.status(404).json({ error: "Cart not found" });
  }
});

// POST /:CID/PRODUCT/:PID
router.post("/:cid/products/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;
  try {
    const updatedCart = cartManager.addProductToCart(cid, pid, quantity);
    fs.writeFileSync(cartFilePath, JSON.stringify(carts, null, 2));
    res.json({ data: updatedCart, message: "Product added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding product to cart" });
  }
});

module.exports = router;
