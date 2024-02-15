import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSocket } from "./SocketContext";

export default function UsersList({
  userList,
  userNames,
  onKickUser,
  startBtn,
}: {
  userList: string[];
  userNames: string[];
  onKickUser: (userId: string, userName: string) => Promise<void>;
  startBtn: boolean;
}) {
  const pathname = usePathname();
  const roomId = pathname.split("/")[2];
  const router = useRouter();
  const [editOptions, setEditOptions] = useState(false);
  const { socket } = useSocket();
  const [isUserListVisible, setIsUserListVisible] = useState(false);

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

  const toggleUserList = () => {
    setIsUserListVisible(!isUserListVisible);
  };

  return (
    <div>
      <button
        className="px-4 m-2 py-2 rounded-lg bg-blue-500 text-white"
        onClick={toggleUserList}
      >
        Show Users
      </button>

      {isUserListVisible && (
        <div className="fixed z-20 top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className=" p-8 rounded-lg relative max-h-[80vh] overflow-y-auto">
            <button
              className="close-btn  absolute top-4 right-4 text-red-500"
              onClick={() => setIsUserListVisible(false)}
            >
              &#10006;
            </button>
            <ul className="overflow-y-auto no-scrollbar border p-2">
              {userList.map((userId, index) => (
                <li key={index}>
                  <p className="inline-block">{userNames[index]} </p>
                  {editOptions && (
                    <button
                      className="ml-1 p-1 rounded-lg bg-red-500 inline-block text-white"
                      onClick={() => onKickUser(userId, userNames[index])}
                    >
                      kick
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {editOptions && (
        <button
          className="px-4 m-2 py-2 rounded-lg bg-green-500 text-white"
          onClick={handleStartGame}
        >
          Start Game
        </button>
      )}
    </div>
  );
}
