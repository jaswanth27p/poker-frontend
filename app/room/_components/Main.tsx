import { User } from "next-auth";
import Game from "./Game";
import Chat from "./Chat";

const Main = ({ user }: { user: User | undefined }) => {
  return (
    <div className="grid border p-2 grid-cols-4  h-screen w-screen">
      {/* Chat component takes 1/4 width */}
      <div className="col-span-1 border-r">
        <Chat user={user} />
      </div>

      {/* Game component takes 3/4 width */}
      <div className="col-span-3">
        <Game user={user} />
      </div>
    </div>
  );
};

export default Main;
