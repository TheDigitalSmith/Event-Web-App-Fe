import React from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../../context/auth-context";

import "./MainNavigation.css";

const mainNavigation = (props) => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>Events</h1>
          </div>
          <div className="main-navigation__items">
            <ul>
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token && (
                <>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </>
              )}
              <li>{!context.token && <NavLink to="/auth">Sign In</NavLink>}</li>
            </ul>
          </div>
        </header>
      );
    }}
  </AuthContext.Consumer>
);
export default mainNavigation;
