import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Get MongoDB database connection
 * Creates a new connection if one doesn't exist
 */
export async function getDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  console.log('🔌 Connecting to MongoDB...');
  client = new MongoClient(uri);
  await client.connect();
  db = client.db('goldrate');
  console.log('✅ Connected to MongoDB');
  
  return db;
}

/**
 * Close the MongoDB connection
 * Should be called at the end of the script
 */
export async function closeConnection(): Promise<void> {
  if (client) {
    console.log('🔌 Closing MongoDB connection...');
    await client.close();
    client = null;
    db = null;
    console.log('✅ MongoDB connection closed');
  }
}
