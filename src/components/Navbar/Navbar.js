import React, { useState } from 'react';

function Navbar() {
  const [active, setActive] = useState("home");

  function handleClick(e) {
    setActive(e.target.name);
  }

  return (
    <nav>
    <h1>Navbar</h1>
      <ul>
        {/* <li>
          <button name="home" onClick={handleClick}>Home</button>
        </li>
        <li>
          <button name="about" onClick={handleClick}>About</button>
        </li>
        <li>
          <button name="contact" onClick={handleClick}>Contact</button>
        </li> */}
      </ul>
    </nav>
  );
}

export default Navbar;
