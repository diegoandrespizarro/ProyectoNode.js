const express = require("express");
const { Router } = express;
const uuid4 = require("uuid4");
const { socketIO } = require('../server');
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'DB', 'products.json');

const router = new Router();

let products = [];

// Carga los productos desde el archivo
try {
  const productsData = fs.readFileSync(productsFilePath, 'utf-8');
  products = JSON.parse(productsData);
} catch (error) {
  console.error(error);
}

// Función para guardar los datos en el archivo products.json después de que se hayan realizado cambios
function saveData() {
  fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
    if (err) {
      console.error(err);
    }
  });
}

// Ruta GET para obtener los productos
router.get("/", (req, res) => {
  const { limit } = req.query;
  let data = products;
  if (limit) {
    data = data.slice(0, limit);
  }
  res.json({ data });
});

// Ruta GET para obtener un solo producto por id
router.get("/:pid", (req, res) => {
  const { pid } = req.params;
  const product = products.find((p) => p.id === pid);
  if (product) {
    res.json({ data: product });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// Ruta POST para crear un nuevo producto
router.post("/", (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [],
  } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const id = uuid4();
  const product = {
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };
  products.push(product);
  saveData(); // Guarda los datos en el archivo
  socketIO.emit('newProduct', product); // Emite un evento 'newProduct' a todos los clientes conectados
  res.json({ data: product, message: "Product created" });
});

// Ruta PUT para actualizar un producto existente
router.put("/:pid", (req, res) => {
  const { pid } = req.params;
  const index = products.findIndex((p) => p.id === pid);
  if (index !== -1) {
    const product = products[index];
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;
    if (title) product.title = title;
    if (description) product.description = description;
    if (code) product.code = code;
    if (price) product.price = price;
    if (status !== undefined) product.status = status;
    if (stock) product.stock = stock;
    if (category) product.category = category;
    if (thumbnails) product.thumbnails = thumbnails;
    saveData(); // Guarda los datos en el archivo
    socketIO.emit('updatedProduct', product); // Emite un evento 'updatedProduct' a todos los clientes conectados
    res.json({ data: product, message: "Product updated" });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// Ruta DELETE para eliminar un producto existente
router.delete("/:pid", (req, res) => {
  const { pid } = req.params;
  const index = products.findIndex((p) => p.id === pid);
  if (index !== -1) {
    const product = products[index];
    products.splice(index, 1);
    saveData(); // Guarda los datos en el archivo
    socketIO.emit('deletedProduct', product); // Emite un evento 'deletedProduct' a todos los clientes conectados
    res.json({ data: product, message: "Product deleted" });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

module.exports = router;