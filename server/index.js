// cikiwil-shop/server/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shopRoutes = require('./routes/shopRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // Untuk parsing application/json

// --- INI ADALAH SATU-SATUNYA BARIS YANG BENAR UNTUK MENYAJIKAN FILE STATIS ---
// Ini akan membuat file di 'public' dapat diakses dari root URL
// Misalnya: 'public/uploads/file.jpg' diakses via '/uploads/file.jpg'
app.use(express.static(path.join(__dirname, 'public')));

// --- KITA HAPUS BARIS 'app.use('/public', ...)' YANG REDUNDANT ---


// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/messages', messageRoutes);

// Jika di production, serve build React
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// --- ERROR HANDLING MIDDLEWARE ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});