const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
};

const farmerOnly = (req, res, next) => {
    if (req.user && req.user.role === 'farmer') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Farmer privileges required.'
        });
    }
};

const customerOnly = (req, res, next) => {
    if (req.user && req.user.role === 'customer') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Customer privileges required.'
        });
    }
};

module.exports = {
    adminOnly,
    farmerOnly,
    customerOnly
}; 