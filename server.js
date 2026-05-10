require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./routes/auth');
const subscriberRouter = require('./routes/subscribers');
const aiRouter = require('./routes/ai');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

console.log("CI/CD verified 🚀")

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());
app.use(cors());

/* =========================
   DEBUG INFO
========================= */
console.log("🚀 NEW DEPLOYMENT RUNNING");

/* =========================
   MONGODB CONNECTION (FIXED)
========================= */
mongoose.connect(process.env.DATABASE_URL, {
  serverSelectionTimeoutMS: 5000, // fail fast
})
.then(() => {
  console.log("✅ MongoDB connected successfully");
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err.message);
});

/* =========================
   CONNECTION EVENTS
========================= */
const db = mongoose.connection;

db.on('connecting', () => console.log('⏳ Connecting to MongoDB...'));
db.on('connected', () => console.log('✅ Connected to MongoDB'));
db.on('error', (err) => console.log('❌ Mongo error:', err.message));
db.on('disconnected', () => console.log('⚠️ MongoDB disconnected'));

/* =========================
   ROUTES
========================= */
app.use('/auth', authRouter);
app.use('/subscribers', subscriberRouter);
app.use('/ai', aiRouter);

/* =========================
   HEALTH CHECK
========================= */
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

app.use(notFoundHandler);
app.use(errorHandler);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🌐 Server started on port ${PORT}`);
});