const express = require('express');
const ProductManager = require('./ProductManager');
const app = express();

const path = require('path');
const productManager = new ProductManager(path.resolve(__dirname, './products.json'));

app.get("/products", async (req, res) => {
    try {
      const products = await productManager.getProducts();
      const limit = parseInt(req.query.limit);
      if (limit) {
        res.json(products.slice(0, limit));
      } else {
        res.json(products);
      }
    } catch (error) {
      console.error(`Error al obtener los productos: ${error.message}`);
      res.status(500).send("Error al obtener los productos");
    }
  });

  app.get("/products/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    try {
      const product = await productManager.getProductById(id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).send(`Producto con ID ${id} no encontrado`);
      }
    } catch (error) {
      console.error(`Error al obtener el producto con ID ${id}: ${error.message}`);
      res.status(500).send(`Error al obtener el producto con ID ${id}`);
    }
  });

app.listen(8080,()=>{
    console.log("servidor run on port 8080")
})
