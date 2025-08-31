const express = require('express');
const { addProduct, getAllProducts,updateProduct,deleteProduct,setproductImage } = require('../controllers/productController');
const router = express.Router();

router.post('/', addProduct);
router.get('/', getAllProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/image/:id', setproductImage);
module.exports = router;
