import mongoose from "mongoose";

export async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.log("MONGO_URI not configured. Running API with mock data mode.");
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.error("Mongo connection failed. Falling back to mock data mode.", error.message);
    return false;
  }
}

export function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}
