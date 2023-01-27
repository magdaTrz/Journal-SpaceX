import React, {useState} from 'react';
import PropTypes from 'prop-types';

function WatchList(props) {

    const [rockets,setRockets] = useState(null);
  const [error,setError] = useState("");
  const [inFavourites,setInFavourites] = useState(false);

    const settingUpFavourites = ()=>{
        console.log("SETGAMES DEFAULT FAVOURITES");
        fetch("http://localhost:8000/rockets/",{
          method: "GET"
        })
        .then(res => res.text())
        .then((ourData)=>{
          if(ourData)
          {
            ourData=JSON.parse(ourData)
            let filteredRockets = ourData
            filteredRockets = [...filteredRockets].filter(rocket => rocket.userId == props.currentUser.id);
            setRockets(filteredRockets)
            
          }
        })
    };

    if(rockets==null)
  {
    settingUpFavourites();
  }

  const deleteFromFavourites = (rocketId) =>{
    console.log("Deleting from favourites");
    let id=rocketId;
    console.log("Użytkownik: "+props.currentUser.id);
    let newGame={"id":id,"userId":props.currentUser.id};

    fetch("http://localhost:8000/rockets/"+id,{
          method: "DELETE"
        })
        .then(res => res.text())
        .then(()=>{
          console.log("Usunięto rakietę z listy");
          setInFavourites(false);
          setError("Deleted a rocket from watchlist");
          settingUpFavourites()
        });
  }

  const changeReason = (rocketId, rocketName, flickr_images, oldReason) =>{
    console.log("Adding to watchlist");
    let reason = prompt("What's your new reason for interest in this rocket:", oldReason);
    if (reason == null || reason == "") {
      console.log("User cancelled the prompt.");
    } else {
      let id=rocketId;
    let title=rocketName;
    let img = flickr_images
    console.log("Użytkownik: "+props.currentUser.id);

    let newRocket={"userId":props.currentUser.id, "name": title, "flickr_images": img, "reason": reason};

    fetch("http://localhost:8000/rockets/" + id,{
          method: "PUT",
          headers: {"Content-type":"application/json"},
          body: JSON.stringify(newRocket)
        })
        .then(()=>{
          console.log("edytowano rakietę");
          setInFavourites(true);
          setError("Edited a rocket");
          settingUpFavourites()
        });
    }
    
  }

    return (
        <>
            <h1>Your watchlist</h1>

            <div></div>
    
            <div>
            {rockets &&  rockets.map((rocket) => {return (
                <div key={rocket.id}>
                  <img src={rocket.flickr_images}></img>
                  <h1>{rocket.name}</h1>
                  Your reason for interest in this rocket: {rocket.reason} <br/>
                  <button onClick={() => props.changePage("LunchCard")}> Read more </button>
                  <button onClick={() => deleteFromFavourites(rocket.id)}> Delete From WatchList </button>
                  <button onClick={() => changeReason(rocket.id, rocket.name, rocket.flickr_images, rocket.reason)}> Change reason </button>
                </div>
                )})
            }
            </div>
    
        </>
    )}

export default WatchList