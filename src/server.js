import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/database.js';
import { swaggerSpec } from './config/swagger.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import enquiryRoutes from './routes/enquiries.js';
import testimonialRoutes from './routes/testimonials.js';
import categoryRoutes from './routes/categories.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to database
connectDB();

// Security & Performance Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
const allowedOrigins = process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/logo.png', express.static(path.join(__dirname, '../logo.png')));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/categories', categoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Landing page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Frodel Backend API</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; color: #fff; }
        .container { text-align: center; padding: 2rem; max-width: 800px; }
        h1 { font-size: 3.5rem; margin-bottom: 1rem; animation: fadeIn 0.8s; }
        .subtitle { font-size: 1.3rem; opacity: 0.9; margin-bottom: 3rem; animation: fadeIn 1s; }
        .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .card { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 1.5rem; border-radius: 15px; border: 1px solid rgba(255,255,255,0.2); transition: transform 0.3s, box-shadow 0.3s; animation: slideUp 0.6s; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .card h3 { font-size: 1.2rem; margin-bottom: 0.5rem; }
        .card p { opacity: 0.8; font-size: 0.9rem; }
        .btn { display: inline-block; background: #fff; color: #667eea; padding: 1rem 2.5rem; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 0.5rem; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
        .status { display: inline-block; background: #10b981; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; margin-bottom: 2rem; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🍕 Frodel Backend</h1>
        <p class="subtitle">Frozen Food Directory API - Fast, Secure & Scalable</p>
        <div class="status">✓ Server Running</div>
        <div class="cards">
          <div class="card">
            <h3>📦 Products</h3>
            <p>Complete CRUD operations</p>
          </div>
          <div class="card">
            <h3>📧 Enquiries</h3>
            <p>Customer management</p>
          </div>
          <div class="card">
            <h3>🔐 Auth</h3>
            <p>JWT authentication</p>
          </div>
          <div class="card">
            <h3>⚡ Fast</h3>
            <p>PM2 cluster mode</p>
          </div>
        </div>
        <div>
          <a href="/api-docs" class="btn">📚 API Documentation</a>
          <a href="/api/health" class="btn">🏥 Health Check</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Swagger documentation endpoint
app.get('/api/docs', (req, res) => {
  res.redirect('/api-docs');
});

// Root redirect
app.get('/api', (req, res) => {
  res.redirect('/');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' && statusCode === 500 
      ? 'Internal server error' 
      : err.message || 'Internal server error'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
