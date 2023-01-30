import React, { useEffect, useState } from "react";
import launchesCardStyle from "./launchesCardStyle.css";
import Modal from "react-modal";

function LaunchCard(props) {
  const [launchDetails, setLaunchDetails] = useState(null);
  const [error, setError] = useState("");
  const [inFavourites, setInFavourites] = useState(false);
  const [rockets, setRockets] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [watchlist, setWatchlist] = useState(null);
  const [reason, setReason] = React.useState("");
  const [modalIsOpenEdit, setIsOpenEdit] = useState(false);

  function openDeleteModal(id) {
    props.setItemIdForDetailsId(id);
    setIsOpen(true);
  }
  function closeDeleteModal() {
    setIsOpen(false);
  }

  function openModalEdit(id) {
    props.setItemIdForDetailsId(id);
    setIsOpenEdit(true);
  }

  const handleReasonChange = (ev) => setReason(ev.target.value);

  function closeModalEdit() {
    setIsOpenEdit(false);
  }

  async function fetchLaunches() {
    try {
      const response = await fetch("https://api.spacexdata.com/v5/launches");
      const data = await response.json();
      console.log(props.itemForDetailsId);
      for (let j = 0; j < data.length; j++) {
        if (props.itemForDetailsId == data[j]["id"]) {
          console.log("Dodawane detali: ", data[j]);

          setLaunchDetails(data[j]);
          console.log(launchDetails);

          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (launchDetails === null) {
    fetchLaunches();
  }

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

  async function getWatchlist() {
    console.log("SETROCKETS DEFAULT FAVOURITES");
    try {
      const response = await fetch("http://localhost:8000/rockets/", {
        method: "GET",
      });
      const data = await response.json();
      let filteredRockets = data;
      filteredRockets = [...filteredRockets].filter(
        (rocket) => rocket.userId == props.currentUser.id
      );
      setWatchlist(filteredRockets);
      return filteredRockets;
    } catch (error) {
      console.error(error);
    }
  }

  if (watchlist === null) {
    getWatchlist();
  }

  const addToWatchList = (launchesId, newReason) => {
    console.log("Adding to watchlist");

    console.log("Adding to watchlist");

    let reasonForAdding = [newReason];
    let id = launchesId;
    let title = launchDetails.name;
    let img = launchDetails.links.patch.small;
    console.log("Użytkownik: " + props.currentUser.id);

    let newLaunches = {
      id: id,
      userId: props.currentUser.id,
      name: title,
      flickr_images: img,
      type: "launch",
      reason: reasonForAdding,
    };

    fetch("http://localhost:8000/rockets", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newLaunches),
    }).then(() => {
      console.log("Dodano rakietę do obserwowanych");
      setInFavourites(true);
      setError("Added a rocket to watchlist");
      closeModalEdit();
    });
  };

  const deleteFromWatchList = (launchId) => {
    console.log("Deleting from favourites");
    let id = launchId;
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

  const isWatchlist = (launchId) => {
    let launch1 = watchlist.find((launch) => launch.id === launchId);
    console.log(launch1);
    return launch1;
  };

  const getRocketName = (launchRocket) => {
    let launch1 = rockets.find((rocket) => rocket.id === launchRocket);
    console.log(launch1);
    return launch1.name;
  };

  const getSuccess = (success) => {
    if (success) {
      return "Yes";
    } else {
      return "No";
    }
  };

  return (
    <>
      <h2>Details</h2>

      <div className="details-card">
        {launchDetails && (
          <div>
            <h2>{launchDetails.name}</h2>
            <div className="img-div">
              <img src={launchDetails.links.patch.small}></img>
            </div>
            <p>{launchDetails.details} </p>
            <p>Date: {launchDetails.date_utc} </p>
            <p>Rocket: {getRocketName(launchDetails.rocket)} </p>
            <p>Was it successful: {getSuccess(launchDetails.success)} </p>
            <p>Flight number: {launchDetails.flight_number}</p>
            <p>
              {watchlist && (
                <div>
                  <button
                    onClick={() => {
                      props.setItemIdForDetailsId(launchDetails.rocket);
                      props.changePage("RocketsCard");
                    }}
                  >
                    See Rocket
                  </button>
                  {!isWatchlist(launchDetails.id) && (
                    <button
                      className="add"
                      onClick={() => openModalEdit(launchDetails.id)}
                    >
                      Add to WatchList
                    </button>
                  )}
                  {isWatchlist(launchDetails.id) && (
                    <button
                      className="del"
                      onClick={() => openDeleteModal(launchDetails.id)}
                    >
                      Delete from WatchList
                    </button>
                  )}
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
        ariaHideApp={false}
      >
        <h3>Add your reason for adding it to watchlist:</h3>
        <input
          type="text"
          onChange={handleReasonChange}
          placeholder="Your Reason"
        ></input>
        <button
          className="add"
          onClick={() => addToWatchList(props.itemForDetailsId, reason)}
        >
          Accept
        </button>
        <button className="del" onClick={closeModalEdit}>
          Cancel
        </button>
      </Modal>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Modal"
        overlayClassName="modal-overlay"
        className="modal-content"
        ariaHideApp={false}
      >
        <h3>Do you want to remove this element?</h3>
        <button
          className="add"
          onClick={() => deleteFromWatchList(props.itemForDetailsId)}
        >
          Accept
        </button>
        <button className="del" onClick={closeDeleteModal}>
          Cancel
        </button>
      </Modal>
    </>
  );
}

LaunchCard.propTypes = {};

LaunchCard.defaultProps = {};

export default LaunchCard;
