import app from './src/app.js';
import pool from './src/config/db.js';
import initDB from './src/config/init.db.js';

const PORT = 5000;

const startServer = async () => {
  try {
    console.log('Database connected');

    await initDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};

startServer();