const express = require('express');
const router = express.Router();
const products = require('../products.json');

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { productos: products });
});

module.exports = router;