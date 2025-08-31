const mongoose = require('mongoose');


const inventorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 0 },   
    lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});


const Inventory = mongoose.model('Inventory', inventorySchema);