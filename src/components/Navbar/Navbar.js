import React, { useState } from "react";
import PropTypes from "prop-types";

function Navbar(props) {
  const [active, setActive] = useState("SignIn");

  function handleClick(e) {
    setActive(e.target.name);
    console.log("Navigate to: " + e.target.name);
  }

  return (
    <nav>
      <h1>Navbar</h1>
      <ul>
        <li>
          <button name="Launches" onClick={() => props.changePage("Launches")}>
            Launches
          </button>
        </li>
        <li>
          <button name="Rockets" onClick={() => props.changePage("Rockets")}>
            Rockets
          </button>
        </li>
        <li>
          <button
            name="Watch List"
            onClick={() => props.changePage("WatchList")}
          >
            Watch List
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
