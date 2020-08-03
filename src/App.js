import React from "react";
import "./App.css";
import { Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth.jsx";
import BookingsPage from "./pages/Bookings.jsx";
import EventsPage from "./pages/Events.jsx";

import MainNavigation from "./components/Navigation/MainNavigation";

function App() {
  return (
    <>
      <MainNavigation />
      <main className="main-content">
        <Switch>
          <Redirect from="/" to="/auth" exact></Redirect>
          <Route path="/auth" component={AuthPage}></Route>
          <Route path="/bookings" component={BookingsPage}></Route>
          <Route path="/events" component={EventsPage}></Route>
        </Switch>
      </main>
    </>
  );
}

export default App;
