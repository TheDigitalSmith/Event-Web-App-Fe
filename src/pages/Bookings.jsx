import React, { Component } from "react";

import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";

export default class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
  };
  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = async () => {
    this.setState({ isLoading: true });
    let payload = {
      query: `
            query{
              bookings{
              _id
              createdAt
              event{
                _id
                title
                creator{
                  email
                }
              }
              user{
                _id
                email
              }
            }
          }
      `,
    };

    const token = this.context.token;
    try {
      const submitURL = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (submitURL.ok) {
        const responseJson = await submitURL.json();
        const bookings = responseJson.data.bookings;
        console.log(bookings);
        this.setState({ bookings: bookings, isLoading: false });
      }
    } catch (err) {
      console.log(err);
    }
  };
  render() {
    return (
      <>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <div>
            <h1>Bookings Page</h1>
            <ul>
              {this.state.bookings.map((booking) => (
                <li key={booking._id}> {booking.event.title}</li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  }
}
