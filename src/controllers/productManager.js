  
  class ProductManager {
    constructor(products) {
      this.products = products;
    }
  
    getProducts(limit) {
      let data = this.products;
      if (limit) {
        data = data.slice(0, limit);
      }
      return data;
    }
  
    getProductById(pid) {
      return this.products.find((product) => product.id === pid);
    }
  
    createProduct(productData) {
      const { title, description, code, price, stock, category, thumbnails } = productData;
      if (!title || !description || !code || !price || !stock || !category) {
        throw new Error("Missing fields");
      }
      const id = uuid4();
      const newProduct = {
        id,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || [],
      };
      this.products.push(newProduct);
      return newProduct;
    }
  
    updateProduct(pid, productData) {
      const productIndex = this.products.findIndex((product) => product.id === pid);
      if (productIndex === -1) {
        throw new Error("Product not found");
      }
      const product = this.products[productIndex];
      const { title, description, code, price, status, stock, category, thumbnails } = productData;
      if (title) product.title = title;
      if (description) product.description = description;
      if (code) product.code = code;
      if (price) product.price = price;
      if (status !== undefined) product.status = status;
      if (stock) product.stock = stock;
      if (category) product.category = category;
      if (thumbnails) product.thumbnails = thumbnails;
      return product;
    }
  
    deleteProduct(pid) {
      const productIndex = this.products.findIndex((product) => product.id === pid);
      if (productIndex === -1) {
        throw new Error("Product not found");
      }
      const deletedProduct = this.products.splice(productIndex, 1)[0];
      return deletedProduct;
    }
  }

  module.exports = ProductManager;
