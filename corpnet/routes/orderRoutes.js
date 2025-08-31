const express = require('express');
const { 
  placeOrder, 
  getOrders,
  updateOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  getRevenue,
  getcountofallordersofUser 
} = require('../controllers/orderController');

const router = express.Router();
console.log('✅ orderRoutes loaded');

// Specific routes first
router.get('/revenue', getRevenue); 
router.get('/all', getAllOrders);
router.get('/count/user/:userId', getcountofallordersofUser);

// Status update route
router.put('/status', updateOrderStatus);

// Orders CRUD
router.post('/', placeOrder);
router.get('/', getOrders);
router.put('/:id', updateOrder);
router.get('/:id', getOrderById);

module.exports = router;
