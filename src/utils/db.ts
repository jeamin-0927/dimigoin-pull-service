import { MongoClient } from "mongodb";

import * as env from "@/utils/env";

const uri = env.MONGODB_URI; 
const options = {};

let cachedClient = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = await MongoClient.connect(uri, options);
  cachedClient = client;

  return client;
}