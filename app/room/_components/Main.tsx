import { User } from "next-auth";
import Game from "./Game";
import Chat from "./Chat";

const Main = ({ user }: { user: User | undefined }) => {
  return (
    <div
      className=" h-screen w-screen bg-cover"
      style={{
        backgroundImage: `url('https://img.freepik.com/premium-vector/poker-table-background-green-color_313905-304.jpg')`,
        height: "972px",
      }}
    >
      {/* Chat component takes 1/4 width */}
      {/* <div className="border-r">
        <Chat user={user} />
      </div> */}

      {/* Game component takes 3/4 width */}
      <div className="">
        <Game user={user} />
      </div>
    </div>
  );
};

export default Main;
