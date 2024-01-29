"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSocket } from "./SocketContext";
import { usePathname, useRouter } from "next/navigation";
import UserList from "./UsersList";
import { User } from "next-auth";

 

export default function Chat({ user }: { user: User | undefined }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [gameLogs, setGameLogs] = useState<string[]>([]);
  const [userList, setUserList] = useState<string[]>([]);
  const [userNames, setUserNames] = useState<string[]>([]);
  const { socket } = useSocket();
  const pathname = usePathname();
  const roomId = pathname.split("/")[2];
  const userId = user?.id;
  const userName = user?.name;
  const router = useRouter();

  useEffect(() => {
    if (socket) {
      socket.emit("join_room", { roomId, userId });

      socket.on("chat_message", (message: string) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on("user_list", ({userList,userNames}: {userList : string[],userNames :string[]}) => {
        
        setUserList(userList);
        setUserNames(userNames);
      });

      socket.on("game_log", (log: string) => {
        setGameLogs((prevLogs) => [...prevLogs, log]);
      });

      socket.on("kicked_out", ({ user }) => {
        if (userId == user) {
          router.push("/");
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [roomId, router, socket, userId]);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (socket) {
      socket.emit("chat_message", {
        userName: userName,
        userId: userId,
        roomId: roomId,
        message: inputMessage,
      });
      setInputMessage("");
    }
  };

  const handleKickUser = async (userId: string,userName:string) => {
    try {
      const response = await fetch("/api/room/kickUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId, userId ,userName }),
      });

      if (response.ok) {
        const isSuccess = await response.json();
        if (isSuccess) {
          console.log(`User ${userId} kicked successfully.`);
          const updatedUserList = userList.filter((user) => user !== userId);
          setUserList(updatedUserList);
          if (socket) {
            socket.emit("kick_out", { userId, roomId });
          }
        } else {
          console.log(`Failed to kick user ${userId}.`);
        }
      } else {
        console.log(
          `Failed to kick user ${userId}. Server returned ${response.status}.`
        );
      }
    } catch (error) {
      console.log(error);
      alert("kick out failed");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* User List */}
      <div className="flex flex-col h-1/3  m-auto items-start p-4">
        <UserList
          userList={userList}
          userNames={userNames}
          onKickUser={(userId: string,userName:string) => handleKickUser(userId,userName)}
        />
      </div>
      <div className="h-1/3 no-scrollbar  overflow-y-auto m-auto">
        <div className="font-bold text-xl mb-4">Log :</div>
        <ul>
          {gameLogs
            .slice()
            .reverse()
            .map((log, index) => (
              <li key={index} className="text-inherit">
                {log}
              </li>
            ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="overflow-y-auto no-scrollbar h-1/3 p-4 flex-grow">
        <form onSubmit={sendMessage} className="flex flex-col">
          <div className="font-bold text-xl mb-4">Chat :</div>
          <div className=" flex items-center mt-2">
            <input
              type="text"
              className="text-inherit bg-inherit border"
              value={inputMessage}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInputMessage(e.target.value)
              }
            />
            <button className="p-1 bg-blue-500 text-white ml-2">Send</button>
          </div>
          <div className="flex-grow overflow-y-auto">
            <ul className="flex flex-col-reverse">
              {messages
                .map((log, index) => (
                  <li key={index} className="text-inherit">
                    {log}
                  </li>
                ))}
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}
