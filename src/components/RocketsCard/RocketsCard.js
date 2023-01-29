import React, { useEffect, useState } from "react";
import rocketsCardStyle from "./rocketsCardStyle.css";
import Modal from "react-modal";

function RocketsCard(props) {
  const [rocketDetails, setRocketDetails] = useState(null);
  const [error, setError] = useState("");
  const [inFavourites, setInFavourites] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [watchlist, setWatchlist] = useState(null);
  const [reason, setReason] = React.useState("");
  const [modalIsOpenEdit, setIsOpenEdit] = useState(false);
  


  function openDeleteModal(id) {
    props.setGameIdForDetailsId(id);
    setIsOpen(true);
  }
  function closeDeleteModal() {
    setIsOpen(false);
  }

  function openModalEdit(id) {
    props.setGameIdForDetailsId(id);
    setIsOpenEdit(true);
  }

  const handleReasonChange = ev => setReason(ev.target.value);

  function closeModalEdit() {
    setIsOpenEdit(false);
  }


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

  async function getWatchlist() {
    console.log("SETROCKETS DEFAULT FAVOURITES");
    try {
      const response = await fetch("http://localhost:8000/rockets/", {
        method: "GET"
      });
      const data = await response.json();
        let filteredRockets = data;
        filteredRockets = [...filteredRockets].filter((rocket) => rocket.userId == props.currentUser.id);
        setWatchlist(filteredRockets);
        return filteredRockets
    } catch (error) {
      console.error(error);
    }
  };

  if(watchlist === null) {
    getWatchlist()
  }
  const addToWatchList = (rocketId, newReason) => {
    console.log("Adding to watchlist");
  
      let reasonForAdding = [newReason];
      let id = rocketId;
      let title = rocketDetails.name
      let img = rocketDetails.flickr_images;
      console.log("Użytkownik: " + props.currentUser.id);

      let newRocket = {
        id: id,
        userId: props.currentUser.id,
        name: title,
        flickr_images: img,
        reason: reasonForAdding,
      };

      fetch("http://localhost:8000/rockets", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newRocket),
      }).then(() => {
        console.log("Dodano rakietę do obserwowanych");
        setInFavourites(true);
        setError("Added a rocket to watchlist");
        closeModalEdit();
      });
  };

  const deleteFromWatchList = (rocketId) => {
    console.log("Deleting from favourites");
    let id = rocketId;
    console.log("Użytkownik: " + props.currentUser.id);

    fetch("http://localhost:8000/rockets/" + id, {
      method: "DELETE",
    })
      .then((res) => res.text())
      .then(() => {
        console.log("Usunięto rakietę z listy");
        setInFavourites(false);
        setError("Deleted a rocket from watchlist");
        getWatchlist();
        fetchRockets();
        closeDeleteModal();
      });
  };

  const isWatchlist = (rocketId) => {
    let rocket1 = watchlist.find((rocket) => rocket.id === rocketId);
    console.log(rocket1)
    return rocket1;
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
              {watchlist && (
                  <div>
                    <button onClick={() => {
                    props.setRocketIdForLaunches(rocketDetails.id);
                    props.changePage("Launches");
                  }}
                > See launches </button>
                  {!isWatchlist(rocketDetails.id) && <button onClick={ () => openModalEdit(rocketDetails.id)}>Add to WatchList</button>}
                  {isWatchlist(rocketDetails.id) && <button onClick={ () => openDeleteModal(rocketDetails.id)}>Delete from WatchList</button>}
                  </div>
                )}
            </p>
          </div>
        )}
      </div>
      <Modal
        isOpen={modalIsOpenEdit}
        onRequestClose={closeModalEdit}
        contentLabel="Modal"
        overlayClassName="modal-overlay"
        className="modal-content"
        ariaHideApp={false}>
        <h3>Add your reason for adding it to watchlist:</h3>
        <input type="text" onChange={handleReasonChange} placeholder="Your Reason"></input>
        <button onClick={() => addToWatchList(props.gameForDetailsId, reason)}> Accept </button>
        <button onClick={closeModalEdit}>Cancel</button>
      </Modal>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Modal"
        overlayClassName="modal-overlay"
        className="modal-content"
        ariaHideApp={false} >
        <h3>Do you want to remove this element?</h3>
        <button onClick={() => deleteFromWatchList(props.gameForDetailsId)}> Accept </button>
        <button onClick={closeDeleteModal}>Cancel</button>
      </Modal>
    </>
  );
}

RocketsCard.propTypes = {};

RocketsCard.defaultProps = {};

export default RocketsCard;
