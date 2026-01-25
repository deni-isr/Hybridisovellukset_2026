import app from './app';
import db from './database/db';

const port = process.env.PORT || 3000;

// Initialize database before starting the server
(async () => {
  try {
    await db.ensureInitialized();
    console.log('Database initialized');
    app.listen(port, () => {
      console.log(`Listening: http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
})();
