const express = require("express");
const { Router } = express;
const uuid4 = require("uuid4");

const fs = require('fs');
const path = require('path');

const cartFilePath = path.join(__dirname, 'carts.json');

const router = new Router();

let carts = [];

//lee los datos de los carritos almacenados
try {
    const cartsData = fs.readFileSync(cartFilePath, 'utf-8');
    carts = JSON.parse(cartsData);
  } catch (error) {
    console.error(error);
  }

  //se definen tres rutas 
  //POST
router.post("/", (req, res) => {
  const newCart = {
    id: uuid4(),
    products: []
  };
  carts.push(newCart);
  try {
    fs.writeFileSync(cartFilePath, JSON.stringify(carts, null, 2));
    res.json({ data: newCart, message: "Cart created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating cart" });
  }
});

//GET /:CID
router.get("/:cid", (req, res) => {
  const { cid } = req.params;
  const cart = carts.find((c) => c.id === cid);
  if (cart) {
    res.json({ data: cart.products });
  } else {
    res.status(404).json({ error: "Cart not found" });
  }
});

//POST /:CID/PRODUCT/:PID
router.post("/:cid/products/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;
  const cartIndex = carts.findIndex((c) => c.id === cid);
  if (cartIndex !== -1) {
    const productIndex = carts[cartIndex].products.findIndex((p) => p.id === pid);
    if (productIndex !== -1) {
      carts[cartIndex].products[productIndex].quantity += quantity;
    } else {
      carts[cartIndex].products.push({ id: pid, quantity });
    }
    try {
      fs.writeFileSync(cartFilePath, JSON.stringify(carts, null, 2));
      res.json({ data: carts[cartIndex], message: "Product added to cart" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error adding product to cart" });
    }
  } else {
    res.status(404).json({ error: "Cart not found" });
  }
});

module.exports = router;