import React from "react";
import {Link} from 'react-router-dom'

export default function Navbar() {
  return (
    <>
      <nav>
        <div className="nav-wrapper">
          <a href="#" className="brand-logo left">
            <Link to="/">io-app</Link>
          </a>
          <ul id="nav-mobile" className="right ">
            <li>
            <Link to="/">Chat</Link>
            </li>
            <li>
              <a href="badges.html">Note</a>
            </li>
            <li>
            <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
