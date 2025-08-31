const Inventory = require('../models/Inventory');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.addInventory = async (req, res) => {
    try {
        const inventory = await Inventory.create({ ...req.body, product: req.params.productId });
        res.status(201).json(inventory);
    } catch (err) {
        res.status(500).json({ message: "Failed to add inventory", err });
    }
}
exports.getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find({ product: req.params.productId });
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch inventory", err });
    }
}
exports.updateInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: "Failed to update inventory", err });
    } 
}
exports.deleteInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findByIdAndDelete(req.params.id);
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.json({ message: "Inventory deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete inventory", err });
    }
}

exports.getDashboardStats = async (req, res) => {
  console.log('📊 /getdashboard route hit');
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      totalOrders,
      totalProducts,
      totalUsers
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", err });
  }
};


