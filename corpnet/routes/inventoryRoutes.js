const express = require('express');
const {
  addInventory,
  getInventory,
  getDashboardStats
} = require('../controllers/inventoryController');

console.log('✅ inventory offer routes loaded');

const router = express.Router();
console.log('✅ inventoryRoutes loaded');

// Specific routes should come before dynamic ones
router.get('/getdashboard', getDashboardStats);
router.post('/:productId', addInventory);
router.get('/:productId', getInventory);

module.exports = router;
