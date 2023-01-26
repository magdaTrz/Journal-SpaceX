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
        <div>
        <div >
        {rockets &&  rockets.map((rocket) => {return (<div>{rocket.name}</div>)})}
        </div>
        </div>
    </>
)}


Rockets.propTypes = {};
Rockets.defaultProps = {};

export default Rockets;