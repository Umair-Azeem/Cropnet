const Review = require('../models/Review');


const addReview = async (req, res) => {
    try {
        const review = await Review.create({ ...req.body, user: req.user.id });
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch reviews", err });
    }
}

module.exports = {
    addReview,
    getReviews
};