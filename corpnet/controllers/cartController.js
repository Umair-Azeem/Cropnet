const Cart = require('../models/cartschema');

exports.addtocart = async (req, res) => {
    try {
        const { productId, quantity, price } = req.body;
        if (!productId || !quantity) {
            return res.status(400).json({ 
                success: false,
                message: 'Product ID and quantity are required' 
            });
        }
        
        // Use session ID or create a temporary cart ID
        const sessionId = req.sessionID || 'temp-session';
        
        let existingCart = await Cart.findOne({ sessionId });
        if (existingCart) {
            const productIndex = existingCart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex > -1) {
                existingCart.products[productIndex].quantity += quantity;
            } else {
                existingCart.products.push({ productId, quantity, price });
            }
            await existingCart.save();
            return res.status(200).json({ 
                success: true,
                data: existingCart,
                message: 'Cart updated successfully' 
            });
        }
        
        const newCart = await Cart.create({
            sessionId,
            products: [{ productId, quantity, price }],
            totalAmount: quantity * price
        });
        
        return res.status(201).json({ 
            success: true,
            data: newCart,
            message: 'Cart created successfully' 
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to add to cart', 
            error: error.message 
        });
    }
};
exports.getCart = async (req, res) => {
    try {
        const sessionId = req.sessionID || 'temp-session';
        const cartData = await Cart.findOne({ sessionId }).populate('products.productId', 'name price');
        
        if (!cartData) {
            return res.status(200).json({ 
                success: true,
                data: { products: [], totalAmount: 0 },
                message: 'Cart is empty' 
            });
        }
        
        res.status(200).json({ 
            success: true,
            data: cartData,
            message: 'Cart fetched successfully' 
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch cart', 
            error: error.message 
        });
    }
};
exports.updateCart = async (req, res) => {  
    try {
        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            return res.status(400).json({ 
                success: false,
                message: 'Product ID and quantity are required' 
            });
        }
        
        const sessionId = req.sessionID || 'temp-session';
        const existingCart = await Cart.findOne({ sessionId });
        
        if (!existingCart) {
            return res.status(404).json({ 
                success: false,
                message: 'Cart not found' 
            });
        }
        
        const productIndex = existingCart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            existingCart.products[productIndex].quantity = quantity;
            await existingCart.save();
            return res.status(200).json({ 
                success: true,
                data: existingCart,
                message: 'Cart updated successfully' 
            });
        }
        
        return res.status(404).json({ 
            success: false,
            message: 'Product not found in cart' 
        });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to update cart', 
            error: error.message 
        });
    }
};

exports.deleteFromCart = async (req, res) => {
    try {
        const { product_id } = req.params;
        if (!product_id) {
            return res.status(400).json({ 
                success: false,
                message: 'Product ID is required' 
            });
        }
        
        const sessionId = req.sessionID || 'temp-session';
        const existingCart = await Cart.findOne({ sessionId });
        
        if (!existingCart) {
            return res.status(404).json({ 
                success: false,
                message: 'Cart not found' 
            });
        }
        
        existingCart.products = existingCart.products.filter(p => p.productId.toString() !== product_id);
        
        if (existingCart.products.length === 0) {
            await Cart.deleteOne({ sessionId });
            return res.status(200).json({ 
                success: true,
                data: { products: [], totalAmount: 0 },
                message: 'Cart is now empty' 
            });
        }
        
        await existingCart.save();
        res.status(200).json({ 
            success: true,
            data: existingCart,
            message: 'Product removed from cart' 
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: 'Failed to remove from cart', error: error.message });
    }
}


