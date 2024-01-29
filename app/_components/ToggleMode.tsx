
"use client";

import { useEffect, useState } from "react";
import { MdDarkMode } from "react-icons/md";
import { MdSunny } from "react-icons/md";

type Theme = "dark" | "light" | null; 

type Props = {}

export default function ToggleMode({}: Props) {
    const [theme, setTheme] = useState<Theme>(null);
    const [iconsLoaded, setIconsLoaded] = useState(true);

    useEffect(() => {
      if (localStorage.getItem("theme") === "dark") {
        setTheme("dark");
      } else if (localStorage.getItem("theme") === "light") {
        setTheme("light");
      } 
      const toggleButtonsDiv = document.getElementById("toggle-buttons");
      if (toggleButtonsDiv && toggleButtonsDiv.innerHTML.trim() === "") {
        setIconsLoaded(false);
      } else {
        setIconsLoaded(true);
      }
    }, []);

    function toggleDarkMode() {
      if (theme === "light") {
        setTheme("dark");
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.add("dark");
      } else if (theme === "dark") {
        setTheme("light");
        localStorage.setItem("theme", "light");
        document.documentElement.classList.remove("dark");
      } 
    }

  return (
    <div className="float-right">
      {iconsLoaded ? (
        <button id="toogle-buttons" onClick={toggleDarkMode}>
          {theme === "dark" ? <MdDarkMode size={30} /> : null}
          {theme === "light" ? <MdSunny size={30} /> : null}
        </button>
      ) : (
        <button onClick={toggleDarkMode}>
          Mode
        </button>
      )}
    </div>
  );
}