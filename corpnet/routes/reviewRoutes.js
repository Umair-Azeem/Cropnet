const express = require('express');
const { addReview, getReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', protect, addReview);
router.get('/', getReviews);

module.exports = router;