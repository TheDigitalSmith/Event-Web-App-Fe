import React, { Component } from "react";

import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";

import BookingList from "../components/Booking/BookingList/BookingList";

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
      this.setState({ isLoading: false });
    }
  };

  cancelBookingHandler = async (bookingId) => {
    this.setState({ isLoading: true });
    let payload = {
      query: `
            mutation deleteBooking($booking: ID!){
              cancelBooking(bookingId:$booking){
              title
              description
            }
          }
      `,
      variables: {
        booking: bookingId,
      },
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
        console.log("Booking Response", responseJson);
        this.setState((prevState) => {
          const updatedBookings = prevState.bookings.filter((booking) => {
            return booking._id !== bookingId;
          });
          return { bookings: updatedBookings, isLoading: false };
        });
        // const booking = responseJson.data.events;
      }
    } catch (err) {
      console.log(err);
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <>
        <h1>Bookings Page</h1>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <div>
            <BookingList
              bookings={this.state.bookings}
              cancelBookingHandler={this.cancelBookingHandler}
            ></BookingList>
          </div>
        )}
      </>
    );
  }
}
