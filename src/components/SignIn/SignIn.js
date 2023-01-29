import React, { useEffect, useState } from "react";
import styles from "./signInStyle.css";

function SignIn(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(
    props.addedNewUser ? "A new user has been created. SignIn." : ""
  );
  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        console.log(data);
      });
  }, []);

  const submitForm = () => {
    const newUser = {
      id: 0,
      username: username,
      password: password,
    };

    if (username === "") {
      setError("No username provided");
      console.log("No username provided");
      return;
    }

    if (password === "") {
      setError("No password provided");
      console.log("No password provided");
      return;
    }

    for (let i = 0; i < users.length; i++) {
      console.log(newUser.username);
      console.log(users[i].username);
      if (
        newUser.username === users[i].username &&
        newUser.password === users[i].password
      ) {
        console.log("Succes: ", users[i]);
        newUser.id = users[i].id;
        props.loginUser(newUser);
        props.changePage("Rockets");
        return;
      }
    }
    console.log("Error");
    setError("Invalid login or password.");
  };

  return (
    <div className="signIn-div">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div className="typewriter">
        <h1>Journal Space-X</h1>
      </div>
      <div className="signIn">
        <h2>Sign In</h2>
        <div className="pass">
          <p htmlFor="username"> Username </p>
          <input
            type="username"
            name="username"
            id="username"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.Button}
          />
        </div>
        <div className="pass">
          <p htmlFor="password"> Password </p>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.Button}
          />
        </div>
        {users && <button onClick={submitForm}>Sign In</button>}
        <p className="hiddenError"> {error} </p>
        <p className="acc"> You don't have account?</p>
        <button
          onClick={() => props.changePage("SignUp")}
          className="button-78"
          role="button"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

SignIn.propTypes = {};
SignIn.defaultProps = {};

export default SignIn;
