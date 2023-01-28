import React from 'react';
import styles from "./launchesCardStyle.css"

function LaunchCard({ launch }) { //to tez trzeba zrobić tak jak ten gosciu
  return (
    <div className="launch-card">
      <h2>Lunch card</h2>
      <img src={launch.links.mission_patch} alt={launch.mission_name} />
      <div className="launch-info">
        <h3>{launch.mission_name}</h3>
        <p>Launch Date: {launch.launch_date_local}</p>
        <p>Rocket: {launch.rocket.rocket_name}</p>
        <p>Launch Site: {launch.launch_site.site_name}</p>
      </div>
    </div>
  );
}

export default LaunchCard;
