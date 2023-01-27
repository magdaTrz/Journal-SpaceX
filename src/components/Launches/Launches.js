import React, { useState, useEffect } from 'react';
import axios from 'axios'; //i tu bez axios 
import LaunchCard from '../LaunchesCard/LaunchCard';


//testowe raczej do zmiany
function Launches() {
  const [launches, setLaunches] = useState([]);

  useEffect(() => {
    axios
      .get('https://api.spacexdata.com/v3/launches')
      .then(response => {
        setLaunches(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div className="launches-container">
    <h1>Launches</h1>
      {launches.map(launch => (
        <LaunchCard key={launch.flight_number} launch={launch} />
      ))}
    </div>
  );
}
// test
export default Launches;
