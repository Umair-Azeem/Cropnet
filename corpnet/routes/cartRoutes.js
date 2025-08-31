const express = require('express');
const {addtocart, getCart, updateCart, deleteFromCart} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/',  addtocart);
router.get('/', getCart);
router.put('/',  updateCart);
router.delete('/:product_id',  deleteFromCart);
module.exports = router;