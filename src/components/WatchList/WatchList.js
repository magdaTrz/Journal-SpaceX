import React, { useState } from "react";
import Modal from "react-modal";
import watchListStyle from "./watchListStyle.css";

function WatchList(props) {
  const [rockets, setRockets] = useState(null);
  const [launches, setLaunches] = useState(null);
  const [watchlist, setWatchlist] = useState(null);
  const [error, setError] = useState("");
  const [inFavourites, setInFavourites] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenEdit, setIsOpenEdit] = useState(false);
  const [reason, setReason] = React.useState("");

  function openModal(id) {
    props.setItemIdForDetailsId(id);
    setIsOpen(true);
  }
  function closeModal() {
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
  

  const settingUpFavourites = () => {
    console.log("SETROCKETS DEFAULT FAVOURITES");
    fetch("http://localhost:8000/rockets/", {
      method: "GET",
    })
      .then((res) => res.text())
      .then((ourData) => {
        if (ourData) {
          ourData = JSON.parse(ourData);
          let filteredWatchlist = ourData;
          filteredWatchlist = [...filteredWatchlist].filter((item) => item.userId == props.currentUser.id);
          setWatchlist(filteredWatchlist);
          let filteredRockets = ourData;
          filteredRockets = [...filteredRockets].filter((rocket) => rocket.userId == props.currentUser.id && rocket.type == "rocket");
          setRockets(filteredRockets);
          let filteredLaunches = ourData;
          filteredLaunches = [...filteredLaunches].filter((launch) => launch.userId == props.currentUser.id && launch.type == "launch");
          setLaunches(filteredLaunches);
        }
      });
  };

  if (rockets == null) {
    settingUpFavourites();
  }

  const deleteFromFavourites = (rocketId) => {
    console.log("Deleting from favourites");
    let id = rocketId;
    console.log("Użytkownik: " + props.currentUser.id);
    Modal.setAppElement("#watchlist-root");

    fetch("http://localhost:8000/rockets/" + id, {
      method: "DELETE",
    })
      .then((res) => res.text())
      .then(() => {
        console.log("Usunięto rakietę z listy");
        setInFavourites(false);
        setError("Deleted a rocket from watchlist");
        settingUpFavourites();
        closeModal();
      });
  };

  const changeReason = (rocketId, newReason) => {
    let rocket1 = rockets.find((rocket) => rocket.id === rocketId);
    console.log(rocket1);

    let id = rocketId;
    let title = rocket1.name;
    let img = rocket1.flickr_images;
    console.log("Użytkownik: " + props.currentUser.id);

    let newRocket = {
      userId: props.currentUser.id,
      name: title,
      flickr_images: img,
      reason: newReason,
    };

    fetch("http://localhost:8000/rockets/" + id, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newRocket),
    }).then(() => {
      console.log("edytowano rakietę");
      setInFavourites(true);
      setError("Edited a rocket");
      settingUpFavourites();
      closeModalEdit();
    });
  };

  const addReason = (rocketId, newReason) => {
    let item = watchlist.find((item) => item.id === rocketId);
    console.log(item);

    let id = rocketId;
    let title = item.name;
    let img = item.flickr_images;
    let reasons = item.reason;
    let type = item.type;
    reasons.push(newReason);
    console.log("Użytkownik: " + props.currentUser.id);

    let newRocket = {
      userId: props.currentUser.id,
      name: title,
      flickr_images: img,
      type: type,
      reason: reasons,
    };

    fetch("http://localhost:8000/rockets/" + id, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newRocket),
    }).then(() => {
      console.log("edytowano rakietę");
      setInFavourites(true);
      setError("Edited a rocket");
      settingUpFavourites();
      closeModalEdit();
    });
  };

  return (
    <>
      <h2>Your watchlist</h2>

      <div id="watchlist-root">
        <h3>Rockets</h3>
        {rockets &&
          rockets.map((rocket) => {
            return (
              <div className="watchlist-div" key={rocket.id}>
                <img id="div1" src={rocket.flickr_images}></img>
                <div id="div2">
                  <h2>{rocket.name}</h2>
                  <p>Your reason for interest in this rocket:</p>
                  <ul key={rocket.reason}>
                    {Object.keys(rocket.reason).map((key, index) => {
                      if (typeof rocket.reason[key] === "object") {
                        let newData = rocket.reason[key];
                        Object.keys(newData).map((key, index) => {
                          return <li>{newData[key]}</li>;
                        });
                      } else {
                        return <li>{rocket.reason[key]}</li>;
                      }
                    })}
                  </ul>{" "}
                </div>
                <br />
                <button onClick={() => {
                  props.setItemIdForDetailsId(rocket.id);
                  props.changePage("RocketsCard");}}> Read more </button>
                <button className="del" onClick={() => openModal(rocket.id)}> Delete From WatchList </button>
                <button className="add" onClick={() => openModalEdit(rocket.id)}> Add reason </button>
              </div>
            );
          })}
      </div>
      <div id="watchlist-root">
      <h3>Launches</h3>
        {launches &&
          launches.map((launch) => {
            return (
              <div className="watchlist-div" key={launch.id}>
                <img id="div1" src={launch.flickr_images}></img>
                <div id="div2">
                  <h2>{launch.name}</h2>
                  <p>Your reason for interest in this rocket:</p>
                  <ul key={launch.reason}>
                    {Object.keys(launch.reason).map((key, index) => {
                      if (typeof launch.reason[key] === "object") {
                        let newData = launch.reason[key];
                        Object.keys(newData).map((key, index) => {
                          return <li>{newData[key]}</li>;
                        });
                      } else {
                        return <li>{launch.reason[key]}</li>;
                      }
                    })}
                  </ul>{" "}
                </div>
                <br />
                <button onClick={() => {
                  props.setItemIdForDetailsId(launch.id);
                  props.changePage("LaunchesCard");}}>
                  Read more
                </button>
                <button className="del" onClick={() => openModal(launch.id)}>
                  Delete From WatchList
                </button>

                <button
                  className="add"
                  onClick={() => openModalEdit(launch.id)}
                >
                  Add reason
                </button>
              </div>
            );
          })}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        overlayClassName="modal-overlay"
        className="modal-content"
        ariaHideApp={false}
      >
        <h3>Do you want to remove this element?</h3>
        <button
          className="add"
          onClick={() => deleteFromFavourites(props.itemForDetailsId)}
        >
          Accept
        </button>
        <button className="del" onClick={closeModal}>
          Cancel
        </button>
      </Modal>

      <Modal
        isOpen={modalIsOpenEdit}
        onRequestClose={closeModalEdit}
        contentLabel="Modal"
        overlayClassName="modal-overlay"
        className="modal-content"
        ariaHideApp={false}
      >
        <h3>Edit your Note:</h3>
        <input type="text" onChange={handleReasonChange}></input>
        <button
          className="add"
          onClick={() => addReason(props.itemForDetailsId, reason)}
        >
          Accept
        </button>
        <button className="del" onClick={closeModalEdit}>
          Cancel
        </button>
      </Modal>
    </>
  );
}

export default WatchList;
