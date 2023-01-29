import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";

import rocketsStyle from "./rocketsStyle.css";
import { waitFor } from "@testing-library/react";

function Rockets(props) {
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [rockets, setRockets] = useState(null);
  const [inFavourites, setInFavourites] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenEdit, setIsOpenEdit] = useState(false);
  const [reason, setReason] = React.useState("");
  const [watchlist, setWatchlist] = useState(null);
  let isWatchlistFull = false;

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
        method: "GET"
      });
      const data = await response.json();
      if (data) {
        let filteredRockets = data;
        filteredRockets = [...filteredRockets].filter((rocket) => rocket.userId == props.currentUser.id);
        setWatchlist(filteredRockets);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if(watchlist === null) {
    getWatchlist()
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

  const addToWatchList = (rocketId, reasonFor) => {
    console.log("Adding to watchlist");
    let rocket1 = rockets.find((rocket) => rocket.id == rocketId);
    console.log(rocket1)
  
      let reasonForAdding = [reasonFor];
      let id = rocketId;
      let title = rocket1.name
      let img = rocket1.flickr_images;
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
        getWatchlist();
        fetchRockets();
        closeModalEdit();
      });
  };

  const deleteFromWatchList = (rocketId) => {
    console.log("Deleting from favourites");
    let id = rocketId;
    let rocket1 = rockets.find((rocket) => rocket.id == rocketId);
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
        <button onClick={() => fetchRockets()}>Show all</button>
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
                {!isWatchlist(rocket.id) && <button onClick={ () => openModalEdit(rocket.id)}>Add to WatchList</button>}
                {isWatchlist(rocket.id) && <button onClick={ () => openDeleteModal(rocket.id)}>Delete from WatchList</button>}
                
              </div>
            );
          })}
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

Rockets.propTypes = {};
Rockets.defaultProps = {};

export default Rockets;
