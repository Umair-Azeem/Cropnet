const express = require('express');
const { recordTransaction, getAllTransactions } = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', protect, recordTransaction);
router.get('/', protect, getAllTransactions);

module.exports = router;
