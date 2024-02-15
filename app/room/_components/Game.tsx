"use client";
import React, { useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { User } from "next-auth";
import { usePathname } from "next/navigation";
import { CardUI, WinnerCardUI } from "../_components/Cards";
import UsersList from "./UsersList";

interface Card {
  suit: string;
  rank: string;
}

interface WinnerCard {
  value: string;
  suit: string;
  rank: number;
  wildValue: string;
}
interface WinnerInfo {
  name: string;
  cards: WinnerCard[];
  descr: string;
  userName: string;
}

interface Player {
  id: string;
  name: string;
  hand: Card[];
  chips: number;
  bet: number;
  inGame: boolean;
  lastAction: string | null;
  lastBet: number;
}

interface GameState {
  players: Player[];
  communityCards: Card[];
  currentPlayerIndex: number;
  pot: number;
  smallBlindIndex: number;
}

const Game = ({ user }: { user: User | undefined }) => {
  const pathname = usePathname();
  const roomId = pathname.split("/")[2];
  const { socket } = useSocket();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [callBet, setCallBet] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(30);
  const [userList, setUserList] = useState<string[]>([]);
  const [userNames, setUserNames] = useState<string[]>([]);
  const [winnerInfo, setWinnerInfo] = useState<WinnerInfo | null>(null);
  const [winnerName, setWinnerName] = useState(null);
  const [timer, setTimer] = useState<number | null>(null);
  const userId = user?.id;
  const userName = user?.name;

  useEffect(() => {
    if (socket) {
      socket.emit("join_room", { roomId, userId });
      socket.emit("get_game_state", { roomId, userId });
      socket.on("game_state", (data: GameState) => {
        if (data.players) {
          const maxBet = Math.max(...data.players.map((player) => player.bet));
          const currentPlayerBet = data.players[data.currentPlayerIndex].bet;
          setCallBet(maxBet - currentPlayerBet);
          setGameState(data);
        }
      });

      socket.on("winner", ({ winner }: { winner: any }) => {
        setWinnerInfo(winner.handInfo);
        setWinnerName(winner.name);
        const log = winner.name + " is the winner !";
        socket.emit("game_log", { roomId, log });
        setTimeout(() => {
          setWinnerInfo(null);
          setWinnerName(null);
          if (winner.id == userId) {
            socket.emit("reset_game", { roomId });
          }
        }, 15000);
      });

      socket.on(
        "user_list",
        ({
          userList,
          userNames,
        }: {
          userList: string[];
          userNames: string[];
        }) => {
          setUserList(userList);
          setUserNames(userNames);
        }
      );

      return () => {
        socket.disconnect();
      };
    }
  }, [roomId, socket, userId]);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    let autoFoldExecuted = false;

    if (
      gameState?.players &&
      gameState.players[gameState.currentPlayerIndex]?.id === userId &&
      gameState.players.length > 1
    ) {
      setCountdown(30);
      autoFoldExecuted = false;
      countdownInterval = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount === 1 && !autoFoldExecuted) {
            if (socket) {
              autoFoldExecuted = true;
              const action = "fold";
              socket.emit("player_action", { roomId, userId, action, callBet });
              const log = userName + " " + action + "ed";
              socket.emit("game_log", { roomId, log });
            }
          }
          if (socket) {
            socket.emit("timer", { roomId, prevCount });
          }
          return prevCount - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [gameState, userId, roomId, callBet, socket, userName]);

  const handleAction = (action: String) => {
    if (socket) {
      socket.emit("player_action", { roomId, userId, action, callBet });
      const log = userName + " " + action + "ed";
      socket.emit("game_log", { roomId, log });
    }
  };
  const handleKickUser = async (userId: string, userName: string) => {
    try {
      const response = await fetch("/api/room/kickUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId, userId, userName }),
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

  if (!gameState || gameState.players.length < 2) {
    return (
      <>
        {" "}
        <div>No game in progress</div>
        <UsersList
          userList={userList}
          userNames={userNames}
          onKickUser={(userId: string, userName: string) =>
            handleKickUser(userId, userName)
          }
          startBtn={true}
        />
      </>
    );
  }

  return (
    <div>
      <UsersList
        userList={userList}
        userNames={userNames}
        onKickUser={(userId: string, userName: string) =>
          handleKickUser(userId, userName)
        }
        startBtn={false}
      />

      {gameState && (
        <div className="grid grid-rows-2 gap-4">
          <div className="border p-2 m-2">
            <ul className="flex flex-wrap justify-center">
              {gameState.players.map((player, index) => (
                <div key={index} className="w-1/6">
                  {userId !== player.id && (
                    <li key={index} className="border m-1 p-1 ">
                      <strong>{`${index + 1}: ${player.name}`}</strong>
                      <p>
                        Chips: {player.chips} - Bet: {player.bet}
                      </p>
                      {winnerInfo && userId !== player.id && (
                        <div>
                          <div className="flex space-x-2">
                            <CardUI card={player.hand[0]} />
                            <CardUI card={player.hand[1]} />
                          </div>
                        </div>
                      )}
                    </li>
                  )}
                </div>
              ))}
            </ul>
          </div>
          <div className="p-2 m-2 border grid grid-cols-3 gap-4 ">
            <div>
              <h2>Community Cards:</h2>
              <ul className="flex flex-shrink-0 space-x-2">
                {gameState.communityCards.map((card, index) => (
                  <li key={index} className="w-1/6">
                    <CardUI card={card} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              {gameState?.players[gameState.currentPlayerIndex]?.id ===
                userId &&
                !winnerName && (
                  <div>
                    <button
                      className="border p-2 m-2 inline-block"
                      onClick={() => handleAction("fold")}
                    >
                      Fold
                    </button>
                    <button
                      className="border p-2 m-2 inline-block"
                      onClick={() => handleAction("call")}
                    >
                      Call {callBet > 0 && `(${callBet})`}
                    </button>
                    <button
                      className="border p-2 m-2 inline-block"
                      onClick={() => handleAction("raise")}
                    >
                      Raise {callBet > 0 && `(${callBet + 10})`}
                    </button>
                  </div>
                )}
              {gameState.players.map((player, index) => (
                <div key={index} className="w-full text-center">
                  {userId === player.id && (
                    <div key={index} className="border m-1 p-1 ">
                      <strong>{`${index + 1}: ${player.name}`}</strong>
                      <p>
                        Chips: {player.chips} - Bet: {player.bet}
                      </p>
                      <div>
                        <div className="flex justify-center space-x-2">
                          <CardUI card={player.hand[0]} />
                          <CardUI card={player.hand[1]} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <h2>Current Player Index: {gameState.currentPlayerIndex}</h2>
              <h2>Pot: {gameState.pot}</h2>
            </div>
            <div>
              {winnerInfo && (
                <div>
                  <h2>Winning Cards:</h2>
                  <p>{winnerName}</p>
                  <p>
                    Cards:
                    <ul className="flex space-x-2">
                      {winnerInfo.cards.map((card, index) => (
                        <li key={index} className="w-1/6">
                          <WinnerCardUI card={card} />
                        </li>
                      ))}
                    </ul>
                  </p>
                  <p>Description: {winnerInfo.descr}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Buttons for actions */}
    </div>
  );
};

export default Game;
