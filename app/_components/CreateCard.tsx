"use client"
import { useRouter } from "next/navigation";

export default function CreateCard () {
  const router = useRouter()

  const createRoom = async (formData: FormData) => {
    const roomName =  formData.get("roomName") as string
    if (!roomName!.trim()) {
      alert("Room Name cannot be empty");
      return;
    }
    const roomPass = formData.get("roomPass") as string;
    if (!roomPass!.trim()) {
      alert("Room Name cannot be empty");
      return;
    }
    try {
      const response = await fetch("/api/room/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName ,roomPass}),
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
      console.error("Error creating room:", error);
      alert("Something went wrong!");
    }
  };
  
  return (
    <form
      className="p-4 m-4 rounded-md border border-blue-500"
      action={createRoom}
    >
      <h2 className="text-xl font-bold mb-4">Create Room</h2>
      <div className="mb-4">
        <label htmlFor="roomName" className="block text-sm font-medium">
          Room Name
        </label>
        <input
          type="text"
          id="roomName"
          name="roomName"
          className="mt-1 bg-inherit p-2 border rounded-md w-full"
        />
        <label htmlFor="roomPass" className="block text-sm font-medium">
          Room Password
        </label>
        <input
          type="text"
          id="roomPass"
          name="roomPass"
          className="mt-1 bg-inherit p-2 border rounded-md w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create
      </button>
    </form>
  );
}
