"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RoomHandeler = ({ roomId } : {roomId : string}) => {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/room/verifyUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId }),
        });
        const { isInRoom } = await response.json();
        if (!response.ok) {
          router.push(`/`); 
        } 
      } catch (error) {
        console.log(error)
        router.push("/");
      }
    };
    fetchData();
  }, [roomId, router]);
  
  return null;
};

export default RoomHandeler;
