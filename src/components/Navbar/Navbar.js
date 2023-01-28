import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from"./navbarStyle.css";

function Navbar(props) {
  const [active, setActive] = useState("SignIn");

  function handleClick(e) {
    setActive(e.target.name);
    console.log("Navigate to: " + e.target.name);
  }

  return (
    <nav>
      <h1>Space X</h1>


      <button name="Launches" onClick={() => props.changePage("Launches")}>
        Launches
      </button>

      <button name="Rockets" onClick={() => props.changePage("Rockets")}>
        Rockets
      </button>

      <button name="Watch List" onClick={() => props.changePage("WatchList")}>
        Watch List
      </button>
    </nav>
  );
}

export default Navbar;
