import React, { Component } from "react";
import "./Auth.css";

import AuthContext from "../context/auth-context";

export default class AuthPage extends Component {
  state = {
    isLogin: true,
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchHandler = (e) => {
    e.preventDefault();
    this.setState({ isLogin: !this.state.isLogin });
  };

  submitHandler = async (e) => {
    e.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let payload = {
      query: `
      query{
        login(email:"${email}", password:"${password}"){
          userId
          token
          tokenExpiration
        }
      }
      `,
    };

    if (!this.state.isLogin) {
      payload = {
        query: `
        mutation{
          createUser(userInput:{email:"${email}", password:"${password}"}){
            _id
            email
            password
            createdEvents{
              title
            }
          }
        }
        `,
      };
    }

    console.log(email, password);
    try {
      const submitURL = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (submitURL.ok) {
        const responseJson = await submitURL.json();
        console.log(responseJson);
        if (responseJson.data.login.token) {
          this.context.login(
            responseJson.data.login.token,
            responseJson.data.login.userId
          );
        }
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  render() {
    return (
      <>
        <h1>Auth Page</h1>
        <form className="auth-form">
          <div className="form-control">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" ref={this.emailEl} />
          </div>
          <div className="form-control">
            <label htmlFor="password">password</label>
            <input type="password" id="password" ref={this.passwordEl} />
          </div>
          <div className="form-actions">
            <button onClick={this.submitHandler}>
              {this.state.isLogin ? "Sign In" : "Create Account"}
            </button>
            <button onClick={this.switchHandler}>
              Switch to {this.state.isLogin ? "Signup" : "Login"}
            </button>
          </div>
        </form>
      </>
    );
  }
}
