import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSocket } from "./SocketContext";

export default function UsersList({
  userList,
  userNames,
  onKickUser,
}: {
  userList: string[];
  userNames: string[];
  onKickUser: (userId: string,userName:string) => Promise<void>;
}) {
  const pathname = usePathname();
  const roomId = pathname.split("/")[2];
  const router = useRouter();
  const [editOptions, setEditOptions] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/room/isOwner", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId }),
        });
        const { isOwner } = await response.json();
        setEditOptions(isOwner);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [roomId, router]);
  const handleStartGame = () => {
    if (socket) {
      socket.emit("start_game", { roomId });
    }
  };

  return (
    <div>
      <h2>User List:</h2>
      <ul className="overflox-y-auto no-scrollbar border p-4">
        {userList.map((userId, index) => (
          <li key={index}>
            <p className="inline-block">{userNames[index]} </p>
            {editOptions && (
              <p
                className="ml-1 p-1 rounded-lg bg-red-500 inline-block text-white"
                onClick={() => onKickUser(userId, userNames[index])}
              >
                kick
              </p>
            )}
          </li>
        ))}
      </ul>
      {editOptions && (
        <button
          className="px-4  py-2 rounded-lg bg-green-500 text-white"
          onClick={handleStartGame}
        >
          start game
        </button>
      )}
    </div>
  );
}
