import React, {useState} from "react";
import ServerApi from "./ServerApi";
import {useNavigate} from "react-router-dom";

export function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const [message, setMessage] = useState();

  async function login() {
    await ServerApi.login(username, password).then((response) => {
      if (response.ok) {
        setMessage("");
        navigate(`/playlists`);
      } else {
        setMessage("Username or password is not OK");
      }
    });
  }

  return (
    <div>
      <h3>Login</h3>
      Username
      <input
        type="text"
        onChange={(event) => setUsername(event.target.value)}
      />
      <br></br>
      Password
      <input
        type="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <br></br>
      <button
        onClick={() => {
          login();
        }}
      >
        Login
      </button>
      <h3>{message}</h3>
    </div>
  );
}
