class CartManager {
    constructor(carts) {
      this.carts = carts;
    }
  
    createCart() {
      const newCart = {
        id: uuid4(),
        products: [],
      };
      this.carts.push(newCart);
      return newCart;
    }
  
    getCartById(cid) {
      return this.carts.find((cart) => cart.id === cid);
    }
  
    addProductToCart(cid, pid, quantity = 1) {
      const cartIndex = this.carts.findIndex((cart) => cart.id === cid);
      if (cartIndex === -1) {
        throw new Error("Cart not found");
      }
      const cart = this.carts[cartIndex];
      const productIndex = cart.products.findIndex((product) => product.id === pid);
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ id: pid, quantity });
      }
      return cart;
    }
  }

  