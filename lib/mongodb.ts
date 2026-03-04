// lib/mongodb.ts
// Responsible for managing a MongoDB connection using Mongoose in a
// Next.js/TypeScript environment. The connection is cached to avoid
// growing the number of connections during hot-reloading in development.

import mongoose, { ConnectOptions, Mongoose } from 'mongoose';

// Global is augmented to store mongoose connection across module reloads.
// This prevents multiple connections during Next.js hot reloads (dev mode).
// We extend the NodeJS.Global interface to include our connection cache.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      _mongoose?: {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      };
    }
  }
}

// Default export: a function that returns an established mongoose
// connection. It will re-use an existing connection if available.

let cached = global.mongoose; // read cache if any

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// MONGODB_URI should be defined in your environment (e.g., .env.local).
// If you use TypeScript strict mode, ensure you provide a fallback or
// handle the undefined case appropriately when calling connectMongo().

export async function connectMongo(): Promise<Mongoose> {
  if (cached?.conn) {
    // If we already have a connection, use it
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts: ConnectOptions = {
      // your connection options here
      // useNewUrlParser and useUnifiedTopology are defaults in mongoose 6+
    };

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    // Create a new promise to connect and cache it. This ensures that
    // simultaneous calls to connectMongo before the first connection
    // resolves will share the same promise and not open multiple
    // connections.
    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn!;
}

// Optionally export mongoose for models definitions or other operations
export { mongoose };
