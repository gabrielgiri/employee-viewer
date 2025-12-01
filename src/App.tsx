import React, { useState, useEffect } from "react";
import "./style.css";

type RandomUser = {
  name: { first: string; last: string };
  email: string;
  location: {
    country: string;
    city: string;
    street: { number: number; name: string };
  };
  picture: { medium: string };
  gender: string;
};

export default function App() {
  const [users, setUsers] = useState<RandomUser[]>([]);
  const [counter, setCounter] = useState(0);
  const [animating, setAnimating] = useState<"next" | "prev" | null>(null);
  const [showDetails, setShowDetails] = useState(false); // empieza colapsado
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=50")
      .then((res) => res.json())
      .then((data) => setUsers(data.results))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const changeUser = (direction: "next" | "prev") => {
    setAnimating(direction);
    setClicks((c) => c + 1);
    setShowDetails(false); // colapsa al cambiar de usuario

    setTimeout(() => {
      setCounter((c) =>
        direction === "next"
          ? Math.min(c + 1, users.length - 1)
          : Math.max(c - 1, 0)
      );
      setAnimating(null);
    }, 300);
  };

  const user = users[counter];

  useEffect(() => {
    if (user) {
      console.log(`Mostrando usuario: ${user.name.first} ${user.name.last}`);
    }
  }, [user]);

  return (
    <div className="container">
      <h1>Employee Viewer</h1>

      {user ? (
        <div
          className={`user-card ${animating === "next" ? "slide-left" : ""} ${
            animating === "prev" ? "slide-right" : ""
          }`}
        >
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

          <button
            className="btn small-btn"
            onClick={() => setShowDetails((prev) => !prev)}
          >
            {showDetails ? "Collapse" : "Expand"}
          </button>

          <div className={`details-container ${showDetails ? "expanded" : ""}`}>
            <div className="details">
              <p>
                <b>Gender:</b> {user.gender || "Not specified"}
              </p>
              <p>
                <b>Street:</b> {user.location.street.number}{" "}
                {user.location.street.name}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}

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

      <p>Total clicks: {clicks}</p>
    </div>
  );
}
