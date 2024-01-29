"use client";
import React, { useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { User } from "next-auth";
import { usePathname } from "next/navigation";
import {CardUI,WinnerCardUI} from "../_components/Cards"

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
  id:string;
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
  const [winnerInfo, setWinnerInfo] = useState<WinnerInfo | null>(null);
  const userId = user?.id;
  const userName = user?.name;

  useEffect(() => {
    if (socket) {
      socket.on("game_state", (data: GameState) => {
        const maxBet = Math.max(...data.players.map((player) => player.bet));
        const currentPlayerBet = data.players[data.currentPlayerIndex].bet;
        setCallBet(maxBet - currentPlayerBet);
        setGameState(data);
      });

      socket.on("winner", ({ winner  }: { winner: any  }) => {
        setWinnerInfo(winner.handInfo);
        const log = winner.name + " is the winner !";
        socket.emit("game_log", { roomId, log });
        setTimeout(() => {
          setWinnerInfo(null);
        }, 15000);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [roomId, socket]);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (
      gameState?.players &&
      gameState.players[gameState.currentPlayerIndex]?.id === userId &&
      gameState.players.length > 1
    ) {
      setCountdown(30);
      countdownInterval = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [gameState, userId]);

  useEffect(() => {
    if (countdown === 0) {
      if (socket) {
        const action = "fold";
        socket.emit("player_action", { roomId, userId, action, callBet });
        const log = userName + " " + action + "ed";
        socket.emit("game_log", { roomId, log });
      }
    }
  }, [callBet, countdown, roomId, socket, userId, userName]);

  const handleAction = (action: String) => {
    if (socket) {
      socket.emit("player_action", { roomId, userId, action, callBet });
      const log = userName + " " + action + "ed";
      socket.emit("game_log", { roomId, log });
    }
  };

  if (!gameState || gameState.players.length < 2) {
    return <div>No game in progress</div>;
  }

  return (
    <div>
      {/* Buttons for actions */}
      {gameState?.players[gameState.currentPlayerIndex]?.id === userId && (
        <div>
          <hr></hr>
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
      <h1>Game State:</h1>
      {gameState && (
        <div>
          <h2>Players:</h2>
          <ul>
            {gameState.players.map((player, index) => (
              <li key={index}>
                <hr></hr>
                <strong>{`Player ${index + 1}: ${player.name}`}</strong>
                <p>
                  Chips: {player.chips} - Bet: {player.bet}
                </p>
                {player.id ===
                  gameState.players[gameState.currentPlayerIndex].id && (
                  <p>Time left: {countdown}s</p>
                )}
                {player.hand.length > 0 && userId === player.id && (
                  <div className="flex space-x-2">
                    <CardUI card={player.hand[0]} />
                    <CardUI card={player.hand[1]} />
                  </div>
                )}
                <hr></hr>
              </li>
            ))}
          </ul>
          <hr></hr>
          <h2>Community Cards:</h2>
          <ul className="flex space-x-2">
            {gameState.communityCards.map((card, index) => (
              <li key={index}>
                <CardUI card={card} />
              </li>
            ))}
          </ul>
          <hr></hr>
          <h2>Current Player Index: {gameState.currentPlayerIndex}</h2>
          <h2>Pot: {gameState.pot}</h2>
          <h2>Small Blind Index: {gameState.smallBlindIndex}</h2>
          {winnerInfo && (
            <div>
              <h2>Winning Cards:</h2>
              <p>
                Cards:
                <ul className="flex space-x-2">
                  {winnerInfo.cards.map((card, index) => (
                    <li key={index}>
                      <WinnerCardUI card={card} />
                    </li>
                  ))}
                </ul>
              </p>
              <p>Description: {winnerInfo.descr}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;

