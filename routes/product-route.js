const express = require('express');
const {createProduct,getProducts,getProductBySku,updateProduct,deleteProduct} = require('../controllers/productController');
const router = express.Router();

router.post('/createproduct', createProduct);
router.get('/', getProducts);
router.get('/:sku', getProductBySku);
router.patch('/:sku', updateProduct);
router.delete('/:sku', deleteProduct);
module.exports = router;
