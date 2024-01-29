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

const CardUI = ({ card }: { card: Card }) => {
  let suit = card.suit.charAt(0).toLowerCase();
  const getCardColor = () => {
    return suit === "h" || suit === "d" ? "bg-red-500" : "bg-blue-500";
  };
  const getSuitSymbol = () => {
    switch (suit) {
      case "h":
        return "♥";
      case "d":
        return "♦";
      case "c":
        return "♣";
      case "s":
        return "♠";
      default:
        return "";
    }
  };

  return (
    <div
      className={`border border-gray-800 rounded p-4   ${getCardColor()}`}
      style={{
        width: "80px",
        height: "120px",
        margin: "5px",
        position: "relative",
      }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
        <div className="text-lg mb-2">{card.rank}</div>
        <div className=" text-5xl">{getSuitSymbol()}</div>
      </div>
    </div>
  );
};

const WinnerCardUI = ({ card }: { card: WinnerCard }) => {
  let suit = card.suit;
  const getCardColor = () => {
    return suit === "h" || suit === "d" ? "bg-red-500" : "bg-blue-500";
  };
  const getSuitSymbol = () => {
    switch (suit) {
      case "h":
        return "♥";
      case "d":
        return "♦";
      case "c":
        return "♣";
      case "s":
        return "♠";
      default:
        return "";
    }
  };

  return (
    <div
      className={`border border-gray-800 rounded p-4   ${getCardColor()}`}
      style={{
        width: "80px",
        height: "120px",
        margin: "5px",
        position: "relative",
      }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
        <div className="text-lg mb-2">{card.value}</div>
        <div className=" text-5xl">{getSuitSymbol()}</div>
      </div>
    </div>
  );
};

export { CardUI, WinnerCardUI };
