const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct(product) {
    try {
      //validar que los campos sean obligatorios
      const { title, description, price, thumbnail, code, stock } = product;
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error("Todos los campos son obligatorios");
      }

      //validar que no se repita el campo "code"
      const products = this.getProducts();
      if (products.some((p) => p.code === code)) {
        throw new Error("Ya existe un producto con el mismo codigo");
      }

      const newProduct = {
        id: this.autoIncrementId(products),
        ...product,
      };

      products.push(newProduct);
      fs.writeFileSync(this.path, JSON.stringify(products, null, 2));

      return newProduct;
    } catch (error) {
      console.error(`Error al agregar el producto: ${error.message}`);
      return null;
    }
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error al leer el archivo de productos: ${error.message}`);
      return [];
    }
  }

  getProductById(id) {
    try {
      const products = this.getProducts();
      const product = products.find((product) => product.id === id);
      if (!product) {
        console.error(`No se encontró ningún producto con el id: ${id}`);
        return null;
      }
      return product;
    } catch (error) {
      console.error(`Error al obtener el producto: ${error.message}`);
      return null;
    }
  }

  updateProduct(id, updatedProduct) {
    try {
      const products = this.getProducts();
      const productIndex = products.findIndex((product) => product.id === id);
      if (productIndex === -1) {
        console.error(`No se encontró ningún producto con el id: ${id}`);
        return null;
      }
      const updatedProductWithId = { id, ...updatedProduct };
      products[productIndex] = updatedProductWithId;
      fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
      return updatedProductWithId;
    } catch (error) {
      console.error(`Error al actualizar el producto: ${error.message}`);
      return null;
    }
  }

  deleteProduct(id) {
    try {
      const products = this.getProducts();
      const indexToDelete = products.findIndex((product) => product.id === id);
      if (indexToDelete === -1) {
        console.error(`No se encontró ningún producto con el id: ${id}`);
        return null;
      }
      products.splice(indexToDelete, 1);
      fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
      return true;
    } catch (error) {
      console.error(`Error al eliminar el producto: ${error.message}`);
      return false;
    }
  }

  autoIncrementId(products) {
    const lastProduct = products[products.length - 1];
    return lastProduct ? lastProduct.id + 1 : 1;
  }
}


module.exports = ProductManager;