import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser'; // Middleware to parse cookies
import cors from 'cors'; // Middleware to enable CORS (Cross-Origin Resource Sharing)
import compression from 'compression'; // Middleware to compress HTTP responses
import 'dotenv/config'; // Import and configure environment variables

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// Middleware setup
app.use(cors()); // Enable CORS for cross-origin requests
app.use(compression()); // Enable response compression
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

const __dirname = path.resolve(); // Set __dirname to current working directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from uploads folder

// Define API routes
app.use('/api/v1/products', productRoutes); // Routes for product-related operations
app.use('/api/v1/users', userRoutes); // Routes for user authentication and management
app.use('/api/v1/orders', orderRoutes); // Routes for order management
app.use('/api/v1/upload', uploadRoutes); // Routes for file uploads
app.use('/api/v1/payment', paymentRoutes); // Routes for payment processing

// Serve frontend in production environment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build'))); // Serve static files from frontend build folder

  // Redirect all unknown routes to index.html (for React single-page application)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
} else {
  // Basic route for development mode
  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
}

// Error handling middleware
app.use(notFound); // Handle 404 errors (Route Not Found)
app.use(errorHandler); // Handle general errors

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`); // Log server URL
});
