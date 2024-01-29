import React from "react";
import ToggleMode from "./ToggleMode";
import Login from "./Login";
import Link from "next/link";

type Props = {};

export default function Header({}: Props) {
  return (
    <nav className="flex items-center justify-between p-4 max-w-4xl m-auto">
      <Link href="/" className="text-2xl font-extrabold">Poker</Link>
      <Login/>
      <ToggleMode />
    </nav>
  );
}
