
const CustomerOrder = require('../models/CustomerOrder');

exports.placeOrder = async (req, res) => {
    try {
        const { products, totalAmount } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No products in the order' });
        }

        const order = await CustomerOrder.create({
            customerId: req.user.id,
            products,
            totalAmount
        });

        res.status(201).json({
            success: true,
            data: order,
            message: 'Order placed successfully'
        });
    } catch (error) {
        console.error('Place order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to place order',
            error: error.message
        });
    }
}
exports.getOrders = async (req, res) => {
    try {
        const orders = await CustomerOrder.find({ customerId: req.user.id })
            .populate('products.productId', 'name price')
            .populate('customerId', 'name email');

        res.status(200).json({
            success: true,
            data: orders,
            message: 'Orders fetched successfully'
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
}
exports.getAllorders = async (req, res) => {
    try {
        const offers = await FarmerOffer.find()
            .populate('farmer', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: offers,
            message: 'Offers fetched successfully'
        });
    } catch (error) {
        console.error('Get all offers error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch offers',
            error: error.message
        });
    }
}

