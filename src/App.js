import React, { Component } from "react";
import "./App.css";
import { Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth.jsx";
import BookingsPage from "./pages/Bookings.jsx";
import EventsPage from "./pages/Events.jsx";

import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context.jsx";

class App extends Component {
  state = {
    userId: "",
    token: "",
  };

  login = (token, userId, tokenExpiration) => {
    console.log("logging in");
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    console.log("Logging out");
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {!this.state.token && (
                <Redirect from="/" to="/auth" exact></Redirect>
              )}
              {this.state.token && (
                <Redirect from="/" to="/events" exact></Redirect>
              )}
              {this.state.token && (
                <Redirect from="/auth" to="/events" exact></Redirect>
              )}
              {!this.state.token && (
                <Route path="/auth" component={AuthPage}></Route>
              )}
              {this.state.token && (
                <Route path="/bookings" component={BookingsPage}></Route>
              )}
              <Route path="/events" component={EventsPage}></Route>
            </Switch>
          </main>
        </AuthContext.Provider>
      </>
    );
  }
}

export default App;
