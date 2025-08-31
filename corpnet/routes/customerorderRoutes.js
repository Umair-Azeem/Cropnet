const express = require('express');
const { placeOrder, getOrders,getallOrders } = require('../controllers/orderController');

const router = express.Router();

router.post('/', placeOrder);
router.get('/', getOrders);
router.get('/all', getallOrders);

module.exports = router;


