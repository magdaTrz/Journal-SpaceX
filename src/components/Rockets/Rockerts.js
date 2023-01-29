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
      let reason = [person];
      let id = rocketId;
      let title = rocketName;
      let img = flickr_images;
      console.log("Użytkownik: " + props.currentUser.id);

      let newRocket = {
        id: id,
        userId: props.currentUser.id,
        name: title,
        flickr_images: img,
        reason: reason,
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
      <h2>Rockets</h2>
      <div className="info">
        <div className="blank"> </div>
        <h3>Sort by:</h3>
        <label htmlFor="descending">
          descending
          <input
            type="radio"
            name="sort"
            autoComplete="off"
            value={sort}
            onChange={(e) => sortRockets("descending")}
          />
        </label>
        <label htmlFor="ascending">
          ascending
          <input
            type="radio"
            name="sort"
            value={sort}
            onChange={(e) => sortRockets("ascending")}
          />
        </label>

        <div className="filtr">
          <input
            type="username"
            name="username"
            id="username"
            placeholder="Filter by name"
            autoComplete="off"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <button onClick={() => filterRockets(filter)}>Filter</button>
        <button onClick={() => fetchRockets()}>Pokaz wszystkie</button>
      </div>

      <div className="rocket-section">
        {rockets &&
          rockets.map((rocket) => {
            return (
              <div key={rocket.id} className="rocket-card">
                <img src={rocket.flickr_images}></img>
                <h2>{rocket.name}</h2>
                <p>Cost per launch: {rocket.cost_per_launch} </p>
                <p>First flight: {rocket.first_flight} </p>
                <p>Company: {rocket.company} </p>
                <button
                  onClick={() => {
                    props.setGameIdForDetailsId(rocket.id);
                    props.changePage("RocketsCard");
                  }}
                >
                  Read more
                </button>
                <button
                  className="add"
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
