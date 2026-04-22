import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import { errorHandler } from './middleware/error.middleware.js';



const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/v1', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running successfully!',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

app.use(errorHandler);

export default app;