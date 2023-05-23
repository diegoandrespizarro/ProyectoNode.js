const express = require("express");
const { Router } = express;
const uuid4 = require("uuid4");
const { socketIO } = require('../app');
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

// Importa la clase ProductManager
const ProductManager = require('../controllers/productManager');

// Crea una instancia de ProductManager
const productManager = new ProductManager(products);

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
  const data = productManager.getProducts(limit);
  res.json({ data });
});

// Ruta GET para obtener un solo producto por id
router.get("/:pid", (req, res) => {
  const { pid } = req.params;
  const product = productManager.getProductById(pid);
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
    stock,
    category,
    thumbnails = [],
  } = req.body;
  try {
    const newProduct = productManager.createProduct({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    });
    saveData(); // Guarda los datos en el archivo
    socketIO.emit('newProduct', newProduct); // Emite un evento 'newProduct' a todos los clientes conectados
    res.json({ data: newProduct, message: "Product created" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Ruta PUT para actualizar un producto existente
router.put("/:pid", (req, res) => {
  const { pid } = req.params;
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
  try {
    const updatedProduct = productManager.updateProduct(pid, {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });
    saveData(); // Guarda los datos en el archivo
    socketIO.emit('updatedProduct', updatedProduct); // Emite un evento 'updatedProduct' a todos los clientes conectados
    res.json({ data: updatedProduct, message: "Product updated" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
});

// Ruta DELETE para eliminar un producto existente
router.delete("/:pid", (req, res) => {
  const { pid } = req.params;
  try {
    const deletedProduct = productManager.deleteProduct(pid);
    saveData(); // Guarda los datos en el archivo
    socketIO.emit('deletedProduct', deletedProduct); // Emite un evento 'deletedProduct' a todos los clientes conectados
    res.json({ data: deletedProduct, message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;