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
    <div className="style.signIn">
      <div className="typewriter">
        <h1>Journal Space-X</h1>
      </div>
      <div className="pass">
        <p htmlFor="username"> username </p>
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
      {users && (
        <button className={styles.Button} onClick={submitForm}>
          Sign In
        </button>
      )}
      <p className="hiddenError"> {error} </p>
      <button onClick={() => props.changePage("SignUp")}>
        Go to the Registration page
      </button>
    </div>
  );
}

SignIn.propTypes = {};
SignIn.defaultProps = {};

export default SignIn;
