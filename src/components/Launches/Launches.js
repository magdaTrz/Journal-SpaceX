import React, { useState } from "react";

import launchesStyle from "./launchesStyle.css";

function Launches(props) {
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [launches, setLaunches] = useState(null);
  const [inFavourites, setInFavourites] = useState(false);



  async function fetchLaunches() {
    try {
      const response = await fetch("https://api.spacexdata.com/v5/launches");
      const data = await response.json();
      let launches2 = []
      if(props.gameForDetailsId == null) {
        console.log(data);
        setLaunches(data);
      } else {
        for(let j=0;j<data.length;j++)
          {
            if(props.gameForDetailsId==data[j]["rocket"])
            {
              console.log("Dodawane detali: ",data[j]);
              
              launches2.push(data[j])
              console.log(launches2);
            }
          }
          console.log(launches2);
          setLaunches(launches2);
          console.log(launches)
          props.setGameIdForDetailsId(null)
      }
    } catch (error) {
      console.error(error);
    }
  }
  if (launches === null) {
    console.log(launches)
    fetchLaunches();
  }

  const sortLaunches = (sortingType) => {
    console.log("Sorting Rockets by: ", sortingType);
    //fetchRockets()
    let sortedLaunches = launches;
    if (sortingType === "ascending") {
      sortedLaunches = [...sortedLaunches].sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
    } else {
      sortedLaunches = [...sortedLaunches].sort((a, b) =>
        a.name < b.name ? 1 : -1
      );
    }
    setLaunches(sortedLaunches);
  };

  const filterLaunches = (filteredName) => {
    console.log("Filtering rockets by name: ", filteredName);
    console.log(launches);
    let filteredLaunches = launches;

    filteredLaunches = [...filteredLaunches].filter((rocket) =>
      rocket.name.toLowerCase().includes(filteredName.toLowerCase())
    );
    console.log(filteredLaunches);
    console.log(launches);
    setLaunches(filteredLaunches);
  };

  const addToWatchList = (launchesId, launchesName, flickr_images) => {
    console.log("Adding to watchlist");
    let person = prompt("Why are you interested in this launch:", "");
    if (person == null || person === "") {
      console.log("User cancelled the prompt.");
    } else {
      let id = launchesId;
      let title = launchesName;
      let img = flickr_images;
      console.log("Użytkownik: " + props.currentUser.id);

      let newLaunches = {
        id: id,
        userId: props.currentUser.id,
        name: title,
        flickr_images: img,
        reason: person,
      };

      fetch("http://localhost:8000/rockets", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newLaunches),
      }).then(() => {
        console.log("Dodano rakietę do obserwowanych");
        setInFavourites(true);
        setError("Added a rocket to watchlist");
      });
    }
  };

  return (
    <>
      <h1>Launches</h1>
      <div>
        <p>Sort by:</p>
        <p htmlFor="descending">
          descending
          <input
            type="radio"
            name="sort"
            autoComplete="off"
            value={sort}
            onChange={(e) => sortLaunches("descending")}
          />
        </p>
        <p htmlFor="ascending">
          ascending
          <input
            type="radio"
            name="sort"
            value={sort}
            onChange={(e) => sortLaunches("ascending")}
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
      <button onClick={() => filterLaunches(filter)}>Filter</button>
      <button onClick={() => fetchLaunches()}>Pokaz wszystkie</button>
      <div></div>

      <div className="rocket-section">
        {launches &&
          launches.map((launch) => {
            return (
              <div key={launch.id} className="launch-card">
                <img src={launch.links.patch.small}></img>
                <h1>{launch.name}</h1>
                Details: {launch.details} <br />
                Is it upcoming: {launch.upcoming} <br />
                <button onClick={() => props.changePage("LunchCard")}>
                  Read more
                </button>
                <button
                  onClick={() =>
                    addToWatchList(
                      launch.id,
                      launch.name,
                      launch.links.patch.small
                    )
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

export default Launches;
