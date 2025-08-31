const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { HfInference } = require('@huggingface/inference');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const farmerOfferRoutes = require('./routes/farmerOfferRoutes');
const userRoutes = require('./routes/userRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
const hf = new HfInference(process.env.HF_API_KEY);


// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081'
  ],
  credentials: true
}));

// app.use(express.json());

app.use(express.json({ limit: '10mb' })); // allow up to 10MB JSON
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// Chat route
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, reply: 'Please send a message to chat.' });
    }

    // Call Hugging Face API
    const result = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message }
      ],
      max_tokens: 256
    });

    const reply = result.choices?.[0]?.message?.content || "No reply generated.";
    res.json({ success: true, reply });
  } catch (err) {
    console.error("Hugging Face chat error:", err);
    res.status(500).json({ success: false, reply: 'Something went wrong with Hugging Face API.' });
  }
});

// Root chat test
app.get('/api/chat', (req, res) => {
  res.send('🚀 Hugging Face Chatbot API is running');
});



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/farmer-offers', farmerOfferRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);

// Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', message: 'CorpNet API is running' });
// });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 