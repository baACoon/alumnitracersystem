import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://alumnitracer:pj3Nrrn4k32LKdEq@cluster0.cn3yf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let dbInstance;

export async function connectToDatabase() {
  try {
    if (!dbInstance) {
      await client.connect();
      dbInstance = client.db('Alumni'); // Replace with your actual database name
      console.log("Connected to MongoDB Atlas");
    }
    return dbInstance;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export function getClient() {
  return client;
}
