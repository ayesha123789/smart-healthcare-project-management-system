import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import apiRoutes from './routes/apiRoutes.js';
import Project from './models/Project.js';
import { seedDatabase } from './seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(async () => {
  // If database is empty, seed automatically on first run
  const count = await Project.countDocuments();
  if (count === 0) {
    console.log('[Auto-Seed] Empty database detected. Seeding paper scenario data...');
    await seedDatabase();
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Root health check endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Smart Healthcare Project Management System API',
    status: 'Online',
    timestamp: new Date()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`[SPM Server Running]: http://localhost:${PORT}`);
});
