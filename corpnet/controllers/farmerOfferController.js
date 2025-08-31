
const FarmerOffer = require('../models/FarmerOffer');
// Create new offer
exports.createOffer = async (req, res) => {
    try {
        const offer = await FarmerOffer.create(req.body);
        res.status(201).json(offer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all offers
exports.getAllOffers = async (req, res) => {
    try {
        const offers = await FarmerOffer.find();
        res.status(200).json(offers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single offer
exports.getOffer = async (req, res) => {
    try {
        const offer = await FarmerOffer.findById(req.params.id);
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        res.json(offer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update offer status using parameters (id and status)
exports.updateOffer = async (req, res) => {
    try {
        const { id, status } = req.params;

        const allowedStatuses = ['pending', 'approved', 'rejected'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const offer = await FarmerOffer.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!offer) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        res.json(offer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete offer
exports.deleteOffer = async (req, res) => {
    try {
        await FarmerOffer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Offer deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.searchOffers = async (req, res) => {
    try {
        const createdBy = req.query.createdBy;

        if (!createdBy) {
            return res.status(400).json({ message: 'createdBy query parameter is required.' });
        }

        const offers = await FarmerOffer.find({ createdBy: { $regex: createdBy, $options: 'i' } });

        const totalOffers = offers.length;
        const activeOffers = offers.filter(o => o.status === 'approved').length;
        const approvedAmountSum = offers
            .filter(o => o.status === 'approved')
            .reduce((sum, offer) => sum + (offer.price || 0), 0);

        res.status(200).json({
            createdBy,
            totalOffers,
            activeOffers,
            approvedAmountSum,
            offers
        });

    } catch (error) {
        res.status(500).json({ message: 'Error searching offers', error: error.message });
    }
};
