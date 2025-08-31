const Order = require('../models/Order');
const mongoose = require('mongoose');

exports.placeOrder = async (req, res) => {
    console.log('Placing order with data:', req.body);

    try {
        const order = await Order.create(req.body);
        res.status(201).json(order);
    } catch (err) {
        console.error('❌ Order creation failed:', err);
        res.status(500).json({ message: "Order failed", error: err.message });
    }
};


exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (err) {
        console.error('❌ Order update failed:', err);  
        res.status(500).json({ message: "Failed to update order", error: err.message });
    }
}
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id, status } = req.query;

        console.log("📌 Received params:", { id, status });

        if (!id || !status) {
            return res.status(400).json({ message: "Missing id or status" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ success: true, data: order });
    } catch (err) {
        console.error("❌ Error updating order status:", err.message, err.stack);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};



exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user.id }).populate('products.product');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Could not fetch orders", err });
    }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email phone address'); 
      // ⬆ populate extra fields from User

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    console.error("❌ Fetch orders failed:", err);
    res.status(500).json({ message: "Could not fetch orders", error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('customer', 'name email').populate('products.product');
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch order", err });
    }
};
exports.getRevenue = async (req, res) => {
    try {
        // Fetch only delivered orders
        const deliveredOrders = await Order.find({ status: 'delivered' });

        // Calculate total revenue
        const totalRevenue = deliveredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        res.status(200).json({
            success: true,
            totalRevenue,
            totalOrders: deliveredOrders.length,
            message: 'Revenue calculated successfully'
        });
    } catch (error) {
        console.error('❌ Error calculating revenue:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate revenue',
            error: error.message
        });
    }
};

exports.getcountofallordersofUser = async (req, res) => {
    try {
        const userId = req.params.userId; // get user ID from URL params

        const orderCount = await Order.countDocuments({ customer: userId });

        res.status(200).json({
            success: true,
            orderCount,
            message: 'Order count fetched successfully'
        });
    } catch (error) {
        console.error('❌ Error fetching order count:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order count',
            error: error.message
        });
    }
};
