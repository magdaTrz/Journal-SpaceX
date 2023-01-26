import React, { useState } from "react";

import rocketsStyle from "./rocketsStyle.css"

function Rockets(props) {
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("");
    const [rockets, setRockets] = useState(null);
    const [gameName, setGameName] = useState("");

    async function fetchRockets() {
        try {
            const response = await fetch('https://api.spacexdata.com/v4/rockets');
            const data = await response.json();
            console.log(data);
            setRockets(data);
            return data;
        } catch (error) {
          console.error(error);
        }
    }
    if(rockets === null) {
        fetchRockets();
    }

    const sortRockets = (sortingType) => {
        console.log("Sorting Rockets by: ", sortingType);
        let sortedRockets = rockets;
        if (sortingType === "ascending") {
          sortedRockets = [...sortedRockets].sort((a, b) =>
            a.title > b.title ? 1 : -1,
          );
        } else {
          sortedRockets = [...sortedRockets].sort((a, b) =>
            a.title < b.title ? 1 : -1,
          );
        }
        setRockets(sortedRockets);
    }

    return (
    <>
        <h1>Rockets</h1>
        <div>
        <p>Sort by:</p>
          <p htmlFor="descending">descending
          <input
            type="radio"
            name="sort"
            autoComplete="off"
            value={sort}
            onChange={(e) => sortRockets("descending")}
          /></p>
          <p htmlFor="ascending">ascending
          <input
            type="radio"
            name="sort"
            value={sort}
            onChange={(e) => sortRockets("ascending")}
          /></p>
        </div>

        <div className="rocket-section">
        {rockets &&  rockets.map((rocket) => {return (
            <div className="rocket-card">
              <img src={rocket.flickr_images}></img>
              <h1>{rocket.name}</h1>
              Cost per launch: {rocket.cost_per_launch} <br/>
              First flight: {rocket.first_flight} <br/>
              Company: {rocket.company} <br/>
              <button> Read more </button>
            </div>
            )})
        }
        </div>

    </>
)}


Rockets.propTypes = {};
Rockets.defaultProps = {};

export default Rockets;