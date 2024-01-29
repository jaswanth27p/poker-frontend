// api/room/join.ts
import { NextResponse } from "next/server";
import connect from "../../../../db";
import Room from "../../../../models/room";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();

  try {
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Login before joining a room" },
        { status: 401 }
      );
    }

    const { roomName, roomPass } = await request.json();
    await connect();

    const existingRoom = await Room.findOne({
      roomName,
      roomPass,
    });

    if (!existingRoom) {
      return NextResponse.json(
        { error: "Invalid room name or password" },
        { status: 400 }
      );
    }
    
    if (existingRoom.users.length >= 6) {
      return NextResponse.json(
        { error: "Room is full, cannot join" },
        { status: 403 }
      );
    }

    if (!existingRoom.users.includes(session.user.id)) {
      existingRoom.users.push(session.user.id);
      existingRoom.userNames.push(session.user.name);
      await existingRoom.save();
    }
    
    return NextResponse.json(
      { roomId: existingRoom.roomId, message: "Joined room successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
