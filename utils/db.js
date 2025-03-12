import mongoose from "mongoose";

export default async function connectDB() {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error on connect to db", err);
    });
}
