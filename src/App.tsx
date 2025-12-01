import React, { useState, useEffect } from "react";
import "./style.css";

type RandomUser = {
  name: {
    first: string;
    last: string;
  };
  email: string;
  location: {
    country: string;
    city: string;
  };
  picture: {
    medium: string;
  };
};

export default function App() {
  const [users, setUsers] = useState<RandomUser[]>([]);
  const [counter, setCounter] = useState(0);
  const [animating, setAnimating] = useState<"next" | "prev" | null>(null);

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=50")
      .then((res) => res.json())
      .then((data) => setUsers(data.results));
  }, []);

  const changeUser = (direction: "next" | "prev") => {
    setAnimating(direction); // activa animación

    setTimeout(() => {
      setCounter((c) =>
        direction === "next"
          ? Math.min(c + 1, users.length - 1)
          : Math.max(c - 1, 0)
      );
      setAnimating(null); // quita clase después de animar
    }, 300); // debe coincidir con CSS
  };

  const user = users[counter];

  return (
    <div className="container">
      <h1>Employee Viewer</h1>

      <div
        className={`user-card ${animating === "next" ? "slide-left" : ""} ${
          animating === "prev" ? "slide-right" : ""
        }`}
      >
        {user ? (
          <>
            <img className="avatar" src={user.picture.medium} alt="User" />

            <h2>
              {user.name.first} {user.name.last}
            </h2>

            <p>
              <b>Email:</b> {user.email}
            </p>

            <p>
              <b>Location:</b> {user.location.city}, {user.location.country}
            </p>
          </>
        ) : (
          <h2>Loading...</h2>
        )}
      </div>

      <div className="btn-row">
        <button
          className={`btn ${counter === 0 ? "disabled" : ""}`}
          disabled={counter === 0}
          onClick={() => changeUser("prev")}
        >
          ◀ Previous
        </button>

        <button
          className={`btn ${counter === users.length - 1 ? "disabled" : ""}`}
          disabled={counter === users.length - 1}
          onClick={() => changeUser("next")}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
