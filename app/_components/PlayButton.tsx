"use client";
import React from "react";

type Props = {};

export default function PlayButton({}: Props) {
  const handleCreateRoomClick = () => {
    // Find the target div by its ID
    const targetDiv = document.getElementById("room-actions");

    // Check if the target div exists
    if (targetDiv) {
      // Scroll to the target div
      targetDiv.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <div className="flex justify-center">
        <button
          onClick={handleCreateRoomClick}
          className="bg-red-400 bg- text-white px-4 py-2 rounded-md hover:bg-red-500"
        >
          Lets Play
        </button>
         
      </div>
    </>
  );
}
