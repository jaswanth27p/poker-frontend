import { NextResponse } from "next/server";
import connect from "../../../../db";
import Room from "../../../../models/room";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();

  try {
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Login before creating a room" },
        { status: 401 }
      );
    }

    const { roomName ,roomPass } = await request.json();
    await connect();
    const roomId = uuidv4();

    const existingRoom = await Room.findOne({ roomName });
    if (existingRoom) {
      return NextResponse.json(
        { error: "Room name already exists" },
        { status: 400 }
      );
    }

    try {
      await Room.create({
        roomName,
        roomPass,
        roomId,
        owner: session.user.id,
        users: [session.user.id],
        userNames: [session.user.name],
      });
    } catch (error) {
      return NextResponse.json({ error: "Room not created" }, { status: 400 });
    }

    return NextResponse.json(
      { roomId, message: "Room created successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
