const mongoose = require('mongoose');

const farmerOfferSchema = new mongoose.Schema({
   name:String,
    description: String,
    quantity: Number,
    contact: String,
    price: Number,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    
    createdBy: String,
}, { timestamps: true });

module.exports = mongoose.model('FarmerOffer', farmerOfferSchema);
