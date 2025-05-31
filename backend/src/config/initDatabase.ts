import pool from './db_config';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function initializeDatabase() {
  try {
    // Read and execute the events schema
    const eventsSchema = readFileSync(join(__dirname, 'events_schema.sql'), 'utf8');
    await pool.execute(eventsSchema);
    
    console.log('✅ Events table initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize events table:', error);
    throw error;
  }
}

// Auto-initialize if this file is run directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}
