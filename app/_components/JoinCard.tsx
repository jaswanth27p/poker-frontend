"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinCard() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [roomPass, setRoomPass] = useState("");

  const joinRoom = async () => {
    try {
      const response = await fetch("/api/room/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName, roomPass }),
      });

      if (response.ok) {
        const { roomId } = await response.json();
        router.push(`/room/${roomId}`);
      } else if (response.status === 401) {
        const { error } = await response.json();
        alert(error);
        router.push(`/api/auth/signin`);
      } else {
        const { error } = await response.json();
        alert(error);
      }
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <form
      className="p-4 m-4 rounded-md border border-blue-500"
      onSubmit={(e) => {
        e.preventDefault();
        joinRoom();
      }}
    >
      <h2 className="text-xl font-bold mb-4">Join Room</h2>
      <div className="mb-4">
        <label htmlFor="joinRoomName" className="block text-sm font-medium">
          Room Name
        </label>
        <input
          type="text"
          id="joinRoomName"
          name="joinRoomName"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="mt-1 bg-inherit p-2 border rounded-md w-full"
        />
        <label htmlFor="joinRoomPass" className="block text-sm font-medium">
          Room Password
        </label>
        <input
          type="text"
          id="joinRoomPass"
          name="joinRoomPass"
          value={roomPass}
          onChange={(e) => setRoomPass(e.target.value)}
          className="mt-1 bg-inherit p-2 border rounded-md w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Join
      </button>
    </form>
  );
}
