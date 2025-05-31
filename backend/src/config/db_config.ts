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

// Test database connection and initialize tables
pool.getConnection()
  .then(async connection => {
    console.log('✅ Database connected successfully');
    
    // Initialize tables based on actual database schema
    try {
      // Create ClassCalendars table (if not exists, won't recreate)
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS ClassCalendars (
          calendar_id CHAR(36) NOT NULL PRIMARY KEY,
          calendar_name VARCHAR(255) NOT NULL,
          creator_user_id CHAR(36) NOT NULL,
          join_code CHAR(6) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ ClassCalendars table verified');

      // Create CalendarMemberships table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS CalendarMemberships (
          membership_id CHAR(36) NOT NULL PRIMARY KEY,
          user_id CHAR(36) NOT NULL,
          calendar_id CHAR(36) NOT NULL,
          joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY uq_user_calendar (user_id, calendar_id)
        )
      `);
      console.log('✅ CalendarMemberships table verified');

      // Create Events table to match actual schema
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS Events (
          event_id CHAR(36) NOT NULL PRIMARY KEY,
          calendar_id CHAR(36) NOT NULL,
          creator_user_id CHAR(36) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          start_datetime DATETIME NOT NULL,
          end_datetime DATETIME NOT NULL,
          all_day BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Events table verified');

      // Create user_preferences table (simplified version without preferences)
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS user_preferences (
          user_id CHAR(36) NOT NULL PRIMARY KEY,
          avatar VARCHAR(255) DEFAULT '/api/placeholder/150/150',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )
      `);
      console.log('✅ user_preferences table verified');
    } catch (error: any) {
      console.error('❌ Failed to verify tables:', error.message);
    }
    
    connection.release();
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error.message);
  });

export default pool;
