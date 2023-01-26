import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LaunchCard from './LaunchCard';

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
      {launches.map(launch => (
        <LaunchCard key={launch.flight_number} launch={launch} />
      ))}
    </div>
  );
}

export default Launches;
