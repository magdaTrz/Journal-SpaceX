import singUpStyle from "./signUpStyle.css";
import React, { useEffect, useState } from "react";

function SignUp(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
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
    const newUser = { username: username, password: password };
    if (username === "") {
      setError("No username provided");
      error.log("No username provided");
      return;
    }
    if (password === "") {
      setError("No password provided");
      error.log("No password provided");
      return;
    }
    for (let i = 0; i < users.length; i++) {
      console.log(newUser.username);
      console.log(users[i].username);
      if (newUser.username === users[i].username) {
        setError("A user with such a username already exists.");
        console.log("Such login already exists:", users[i]);
        return;
      }
    }
    while (newUser == null) {
      console.log();
    }

    if (newUser != null) {
      console.log("Added user: ", newUser);
      let users = null;
      fetch("http://localhost:8000/users")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          users = data;
          let id = -1;
          for (let i = 0; i < users.length; i++) {
            if (id < users[i].id) {
              id = users[i].id;
            }
          }
          let newUserWithId = {
            id: id + 1,
            username: newUser.username,
            password: newUser.password,
          };
          users.push(newUserWithId);
          fetch("http://localhost:8000/users", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(newUserWithId),
          }).then(() => {
            props.changePage("SignIn");
            props.addedNewUser();
          });
        });
    }
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
        <h2>Sign Up</h2>
        <div className="pass">
          <p htmlFor="username">Username</p>
          <input
            type="username"
            name="username"
            id="username"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          />
        </div>
        {users && <button onClick={submitForm}>Sign Up</button>}
        <p className="hiddenError">{error}</p>
        <p className="acc"> You have account?</p>
        <button onClick={() => props.changePage("SignIn")}>Sign In</button>
      </div>
    </div>
  );
}

SignUp.propTypes = {};

SignUp.defaultProps = {};

export default SignUp;
