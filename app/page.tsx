import RoomActions from "./_components/RoomActions";
import PlayButton from "./_components/PlayButton";
import { auth } from "@/auth";

export default async function Home() {
  const user = await auth()
  return (
    <main className="">
      {/* Content */}
      <div className="text-center flex min-h-screen flex-col items-center justify-center p-10 h-4/5">
        <h1 className="text-4xl font-bold mb-6">Welcome to Poker!</h1>
        <p className="text-4xl font-bold mb-6">
          {user?.user?.name}
        </p>
        {/* Buttons */}
        <PlayButton />
      </div>
      <div
        id="room-actions"
        className="flex min-h-screen flex-col items-center justify-center p-10 h-4/5"
      >
        <RoomActions />
      </div>
    </main>
  );
}
