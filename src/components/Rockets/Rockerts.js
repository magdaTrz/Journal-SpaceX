import React, { useState } from "react";
import PropTypes from "prop-types";

import rocketsStyle from "./rocketsStyle.css";


function Rockets(props) {
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [rockets, setRockets] = useState(null);
  const [inFavourites, setInFavourites] = useState(false);

  async function fetchRockets() {
    try {
      const response = await fetch("https://api.spacexdata.com/v4/rockets");
      const data = await response.json();
      console.log(data);
      setRockets(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  if (rockets === null) {
    fetchRockets();
  }

  const sortRockets = (sortingType) => {
    console.log("Sorting Rockets by: ", sortingType);
    //fetchRockets()
    let sortedRockets = rockets;
    if (sortingType === "ascending") {
      sortedRockets = [...sortedRockets].sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
    } else {
      sortedRockets = [...sortedRockets].sort((a, b) =>
        a.name < b.name ? 1 : -1
      );
    }
    setRockets(sortedRockets);
  };

  const filterRockets = (filteredName) => {
    console.log("Filtering rockets by name: ", filteredName);
    console.log(rockets);
    let filteredRockets = rockets;

    filteredRockets = [...filteredRockets].filter((rocket) =>
      rocket.name.toLowerCase().includes(filteredName.toLowerCase())
    );
    console.log(filteredRockets);
    console.log(rockets);
    setRockets(filteredRockets);
  };

  const addToWatchList = (rocketId, rocketName, flickr_images) => {
    console.log("Adding to watchlist");
    let person = prompt("Why are you interested in this rocket:", "");
    if (person == null || person == "") {
      console.log("User cancelled the prompt.");
    } else {
      let id = rocketId;
      let title = rocketName;
      let img = flickr_images;
      console.log("Użytkownik: " + props.currentUser.id);

      let newRocket = {
        id: id,
        userId: props.currentUser.id,
        name: title,
        flickr_images: img,
        reason: person,
      };

      fetch("http://localhost:8000/rockets", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newRocket),
      }).then(() => {
        console.log("Dodano rakietę do obserwowanych");
        setInFavourites(true);
        setError("Added a rocket to watchlist");
      });
    }
  };

  

  return (
    <>
      <h1>Rockets</h1>
      <div>
        <p>Sort by:</p>
        <p htmlFor="descending">
          descending
          <input
            type="radio"
            name="sort"
            autoComplete="off"
            value={sort}
            onChange={(e) => sortRockets("descending")}
          />
        </p>
        <p htmlFor="ascending">
          ascending
          <input
            type="radio"
            name="sort"
            value={sort}
            onChange={(e) => sortRockets("ascending")}
          />
        </p>
      </div>

      <div>
        <p htmlFor="username">Filter by name</p>
        <input
          type="username"
          name="username"
          id="username"
          autoComplete="off"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <button onClick={() => filterRockets(filter)}>Filter</button>
      <button onClick={() => fetchRockets()}>Pokaz wszystkie</button>
      <div></div>

      <div className="rocket-section">
        {rockets &&
          rockets.map((rocket) => {
            return (
              <div key={rocket.id} className="rocket-card">
                <img src={rocket.flickr_images}></img>
                <h1>{rocket.name}</h1>
                Cost per launch: {rocket.cost_per_launch} <br />
                First flight: {rocket.first_flight} <br />
                Company: {rocket.company} <br />
                <button onClick={() => {
                  props.setGameIdForDetailsId(rocket.id);
                  props.changePage("RocketsCard") }}>
                  Read more
                </button>
                <button
                  onClick={() =>
                    addToWatchList(rocket.id, rocket.name, rocket.flickr_images)
                  }
                >
                  Add to WatchList
                </button>
              </div>
            );
          })}
      </div>
    </>
  );
}

Rockets.propTypes = {};
Rockets.defaultProps = {};

export default Rockets;
