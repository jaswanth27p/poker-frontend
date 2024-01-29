// Import necessary dependencies and modules
import { NextResponse } from "next/server";
import connect from "../../../../db";
import Room from "../../../../models/room";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();

  try {
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Login before kicking a user" },
        { status: 401 }
      );
    }

    const { roomId, userId ,userName } = await request.json();
    await connect();

    // Check if the user making the request is the owner of the room
    const room = await Room.findOne({ roomId, owner: session.user.id });
    if (!room) {
      return NextResponse.json(
        { error: "User does not have permission to kick from this room" },
        { status: 403 }
      );
    }

    // Check if the user to be kicked is in the room
    const isUserInRoom = room.users.includes(userId);
    if (!isUserInRoom) {
      return NextResponse.json(
        { error: "User to be kicked is not in the room" },
        { status: 400 }
      );
    }

    // Remove the user from the room's users array
    room.users = room.users.filter((id: any) => id !== userId);
    room.users = room.userNames.filter((name: any) => name !== userName);
    await room.save();

    return NextResponse.json({ isUserKicked: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
