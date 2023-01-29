import React, { useEffect, useState } from "react";
import rocketsCardStyle from "./rocketsCardStyle.css";

function RocketsCard(props) {
  const [rocketDetails, setRocketDetails] = useState(null);
  const [error, setError] = useState("");
  const [inFavourites, setInFavourites] = useState(false);

  async function fetchRockets() {
    try {
      const response = await fetch("https://api.spacexdata.com/v4/rockets");
      const data = await response.json();
      console.log(props.gameForDetailsId);
      for (let j = 0; j < data.length; j++) {
        if (props.gameForDetailsId == data[j]["id"]) {
          console.log("Dodawane detali: ", data[j]);

          setRocketDetails(data[j]);
          console.log(rocketDetails);

          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (rocketDetails === null) {
    fetchRockets();
  }

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
      <h2>Details</h2>

      <div className="details-card">
        {rocketDetails && (
          <div>
            <h2>{rocketDetails.name}</h2>
            <div className="img-div">
              <img src={rocketDetails.flickr_images}></img>
            </div>
            <p>{rocketDetails.description} </p>
            <p>First flight: {rocketDetails.first_flight} </p>
            <p>Company: {rocketDetails.company} </p>
            <p>Country: {rocketDetails.country} </p>
            <p>Size: {rocketDetails.diameter.meters}m - diameter x </p>
            <p>{rocketDetails.height.meters}m - height </p>
            <p>Weight: {rocketDetails.mass.kg}kg</p>
            <p>Success Rate: {rocketDetails.success_rate_pct}%</p>
            <p>
              Learn More{" "}
              <a href={rocketDetails.wikipedia}>Go to Wikipedia Page</a>
            </p>
            <p>
              <button
                onClick={() => {
                  props.setGameIdForDetailsId(rocketDetails.id);
                  props.changePage("Launches");
                }}
              >
                See launches
              </button>
              <button
                className="add"
                onClick={() =>
                  addToWatchList(
                    rocketDetails.id,
                    rocketDetails.name,
                    rocketDetails.flickr_images
                  )
                }
              >
                Add to WatchList
              </button>
            </p>
          </div>
        )}
      </div>
    </>
  );
}

RocketsCard.propTypes = {};

RocketsCard.defaultProps = {};

export default RocketsCard;
