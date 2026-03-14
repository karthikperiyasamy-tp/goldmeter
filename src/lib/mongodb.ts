import { MongoClient, Db, MongoClientOptions } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}
const uri: string = mongoUri;

const DB_NAME = "goldrate";
const MAX_CONNECT_ATTEMPTS = 2;
const RETRY_DELAY_MS = 750;

// Use conservative timeouts/pool limits for serverless runtimes.
const options: MongoClientOptions = {
  appName: "goldmeter-web",
  maxPoolSize: 8,
  minPoolSize: 0,
  maxIdleTimeMS: 60_000,
  serverSelectionTimeoutMS: 8_000,
  connectTimeoutMS: 8_000,
  socketTimeoutMS: 20_000,
  retryWrites: true,
};

type GlobalMongo = typeof globalThis & {
  _mongoClient?: MongoClient;
  _mongoClientPromise?: Promise<MongoClient>;
};

const globalMongo = global as GlobalMongo;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetryMongoError(error: unknown): boolean {
  const msg = String(error ?? "");
  return (
    msg.includes("MongoServerSelectionError") ||
    msg.includes("MongoNetworkTimeoutError") ||
    msg.includes("timed out") ||
    msg.includes("ECONNRESET") ||
    msg.includes("ETIMEDOUT")
  );
}

async function connectWithRetry(): Promise<MongoClient> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_CONNECT_ATTEMPTS; attempt++) {
    try {
      const client = new MongoClient(uri, options);
      await client.connect();
      return client;
    } catch (error) {
      lastError = error;
      console.error(
        `[MongoDB] connect attempt ${attempt}/${MAX_CONNECT_ATTEMPTS} failed:`,
        error
      );

      if (attempt < MAX_CONNECT_ATTEMPTS && shouldRetryMongoError(error)) {
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }
      break;
    }
  }

  throw lastError;
}

function getClientPromise(): Promise<MongoClient> {
  if (!globalMongo._mongoClientPromise) {
    globalMongo._mongoClientPromise = connectWithRetry()
      .then((client) => {
        globalMongo._mongoClient = client;
        return client;
      })
      .catch((error) => {
        // Reset cached promise so future requests can retry.
        globalMongo._mongoClientPromise = undefined;
        throw error;
      });
  }
  return globalMongo._mongoClientPromise;
}

// Export a module-scoped MongoClient promise
const clientPromise = getClientPromise();
export default clientPromise;

// Helper to get the database
export async function getDatabase(): Promise<Db> {
  try {
    const client = await getClientPromise();
    return client.db(DB_NAME);
  } catch (error) {
    // Force reconnect attempt on next call after failure.
    globalMongo._mongoClientPromise = undefined;
    throw error;
  }
}

