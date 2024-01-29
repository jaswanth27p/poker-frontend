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

    const { roomId } = await request.json();
    await connect();

    const room = await Room.findOne({ roomId });
    const isOwner = room && room.owner==session.user.id;

    if (isOwner) {
      return NextResponse.json({ isOwner: isOwner }, { status: 200 });
    }
    return NextResponse.json({ isOwner: isOwner }, { status: 401 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
