import mongoose, { Schema, Document } from "mongoose";


interface IRoom extends Document {
  roomName: string;
  roomId: string;
  owner: string;
  userRequests: string[];
  acceptedUsers: string[];
}

const roomSchema: Schema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    unique: true,
  },
  roomPass: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: String,
    required: true,
  },
  users: {
    type: [String],
    default: [],
  },
  userNames: {
    type: [String],
    default: [],
  },
});




export default mongoose.models.Room ||
  mongoose.model<IRoom>("Room", roomSchema);
