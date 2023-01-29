import React, { useState } from "react";
import Modal from "react-modal";
import watchListStyle from "./watchListStyle.css";

function WatchList(props) {
  const [rockets, setRockets] = useState(null);
  const [error, setError] = useState("");
  const [inFavourites, setInFavourites] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenEdit, setIsOpenEdit] = useState(false);
  const [reason, setReason] = React.useState("");

  function openModal(id) {
    props.setGameIdForDetailsId(id);
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  function openModalEdit(id) {
    props.setGameIdForDetailsId(id);
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
          let filteredRockets = ourData;
          filteredRockets = [...filteredRockets].filter(
            (rocket) => rocket.userId == props.currentUser.id
          );
          setRockets(filteredRockets);
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
    let rocket1 = rockets.find((rocket) => rocket.id === rocketId);
    console.log(rocket1);

    let id = rocketId;
    let title = rocket1.name;
    let img = rocket1.flickr_images;
    let reasons = rocket1.reason;
    reasons.push(newReason);
    console.log("Użytkownik: " + props.currentUser.id);

    let newRocket = {
      userId: props.currentUser.id,
      name: title,
      flickr_images: img,
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
        {rockets &&
          rockets.map((rocket) => {
            return (
              <div className="watchlist-div" key={rocket.id}>
                <img id="div1" src={rocket.flickr_images}></img>
                <div id="div2">
                  <h2>{rocket.name}</h2>
                  <p>Your reason for interest in this rocket:</p>
                  <ul key={rocket.reason.index}>
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
                <button onClick={() => props.changePage("LunchCard")}>
                  Read more
                </button>
                <button className="del" onClick={() => openModal(rocket.id)}>
                  Delete From WatchList
                </button>
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  contentLabel="Modal"
                  overlayClassName="modal-overlay"
                  className="modal-content"
                >
                  <p>Do you want to remove this element?</p>
                  <button
                    className="add"
                    onClick={() => deleteFromFavourites(props.gameForDetailsId)}
                  >
                    Accept
                  </button>
                  <button className="del" onClick={closeModal}>
                    Cancel
                  </button>
                </Modal>
                <button
                  className="add"
                  onClick={() => openModalEdit(rocket.id)}
                >
                  Add reason
                </button>
                <Modal
                  isOpen={modalIsOpenEdit}
                  onRequestClose={closeModalEdit}
                  contentLabel="Modal"
                  overlayClassName="modal-overlay"
                  className="modal-content"
                >
                  <p>Edit your Note:</p>
                  <input type="text" onChange={handleReasonChange}></input>
                  <button
                    className="add"
                    onClick={() => addReason(props.gameForDetailsId, reason)}
                  >
                    Accept
                  </button>
                  <button className="del" onClick={closeModalEdit}>
                    Cancel
                  </button>
                </Modal>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default WatchList;
