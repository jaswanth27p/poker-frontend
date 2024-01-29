import mongoose from "mongoose";

const connect = async () => {
  try {
    const url = process.env.mongodb;
    mongoose.set("strictQuery", true);
    await mongoose.connect(url!);
  } catch (error) {
    throw new Error("Error connecting to mongodb ");
  }
};

export default connect;