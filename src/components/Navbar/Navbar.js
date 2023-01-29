import React, { useState } from "react";
import styles from "./navbarStyle.css";

function Navbar(props) {
  const [active, setActive] = useState("SignIn");

  return (
    <nav>
      <div className="typewriter">
        <h1>Journal Space-X</h1>
      </div>
      <div className="navbar-items">
        <button name="Launches" onClick={() => props.changePage("Launches")}>
          Launches
        </button>

        <button name="Rockets" onClick={() => props.changePage("Rockets")}>
          Rockets
        </button>

        <button name="Watch List" onClick={() => props.changePage("WatchList")}>
          Watch List
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
