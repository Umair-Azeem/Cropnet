const Product = require('../models/Product');

// Add product without authentication
exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, category, quantity, unit,image } = req.body;
        
        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            quantity: quantity || 0,
            unit: unit || 'kg',
            farmer: null // No farmer association since auth is removed
        });
        
        res.status(201).json({
            success: true,
            data: product,
            message: 'Product added successfully'
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: "Failed to add product", 
            error: err.message 
        });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({
            success: true,
            data: products,
            message: 'Products fetched successfully'
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch products", 
            error: err.message 
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);
        
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Failed to delete product", 
            error: err.message 
        });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, category, quantity, unit } = req.body;

        const product = await Product.findByIdAndUpdate(productId, {
            name,
            description,
            price,
            category,
            quantity,
            unit
        }, { new: true });

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: product,
            message: 'Product updated successfully'
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Failed to update product", 
            error: err.message 
        });
    }
}
exports.setproductImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { image } = req.body;

        console.log('[setproductImage] Setting product image for ID:', id, 'with image:', image);

        if (!image) {
            return res.status(400).json({ 
                success: false, 
                message: 'Image is required in request body' 
            });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { $push: { images: image } }, // ✅ use correct field name
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: product,
            message: 'Product image updated successfully'
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Failed to update product image", 
            error: err.message 
        });
    }
};
