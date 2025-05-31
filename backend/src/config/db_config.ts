import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT || 3306),
  ...(process.env.DB_SSLMODE !== 'disable' && {
    ssl: {
      rejectUnauthorized: true
    }
  }),
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error.message);
  });

export default pool;
