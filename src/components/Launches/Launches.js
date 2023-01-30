import React, { useState } from "react";

import style from "./launchesStyle.css";
import Modal from "react-modal";

function Launches(props) {
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [launches, setLaunches] = useState(null);
  const [inFavourites, setInFavourites] = useState(false);
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
      let launches2 = [];
      if (props.rocketIdForLaunches == null) {
        console.log(data);
        setLaunches(data);
      } else {
        for (let j = 0; j < data.length; j++) {
          if (props.itemForDetailsId == data[j]["rocket"]) {
            console.log("Dodawane detali: ", data[j]);

            launches2.push(data[j]);
            console.log(launches2);
          }
        }
        console.log(launches2);
        setLaunches(launches2);
        console.log(launches);
        props.setRocketIdForLaunches(null);
      }
    } catch (error) {
      console.error(error);
    }
  }
  if (launches === null) {
    console.log(launches);
    fetchLaunches();
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

  const addToWatchList = (launchesId, newReason) => {
    console.log("Adding to watchlist");
    let launch1 = launches.find((launch) => launch.id == launchesId);
    console.log(launch1);

    let reasonForAdding = [newReason];
    let id = launchesId;
    let title = launch1.name;
    let img = launch1.links.patch.small;
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
      getWatchlist();
      fetchLaunches();
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
        fetchLaunches();
        closeDeleteModal();
      });
  };

  const isWatchlist = (launchId) => {
    let launch1 = watchlist.find((launch) => launch.id === launchId);
    return launch1;
  };

  return (
    <>
      <h2>Launches</h2>
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
            onChange={(e) => sortLaunches("descending")}
          />
        </label>
        <label htmlFor="ascending">
          ascending
          <input
            type="radio"
            name="sort"
            value={sort}
            onChange={(e) => sortLaunches("ascending")}
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
        <button onClick={() => filterLaunches(filter)}>Filter</button>
        <button onClick={() => fetchLaunches()}>Show all</button>
      </div>

      <div className="rocket-section">
        {launches &&
          launches.map((launch) => {
            return (
              <div key={launch.id} className="rocket-card">
                <div className="launch-img">
                  <img src={launch.links.patch.small}></img>{" "}
                </div>
                <h2>{launch.name}</h2>
                <p>Details: {launch.details}</p>
                <p>Is it upcoming: {launch.upcoming}</p>
                <p>
                  {watchlist && (
                    <div>
                      <button
                        onClick={() => {
                          props.setItemIdForDetailsId(launch.id);
                          props.changePage("LaunchesCard");
                        }}
                      >
                        Read more
                      </button>
                      {!isWatchlist(launch.id) && (
                        <button
                          className="add"
                          onClick={() => openModalEdit(launch.id)}
                        >
                          Add to WatchList
                        </button>
                      )}
                      {isWatchlist(launch.id) && (
                        <button
                          className="del"
                          onClick={() => openDeleteModal(launch.id)}
                        >
                          Delete from WatchList
                        </button>
                      )}
                    </div>
                  )}
                </p>
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
          onClick={() => {
            addToWatchList(props.itemForDetailsId, reason);
          }}
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
          onClick={() => {
            deleteFromWatchList(props.itemForDetailsId);
          }}
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

export default Launches;
