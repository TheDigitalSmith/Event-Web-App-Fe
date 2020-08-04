import React, { Component } from "react";

import "./Events.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";

export default class EventsPage extends Component {
  state = {
    modal: false,
    events: [],
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.newEventTitleEl = React.createRef();
    this.newEventPriceEl = React.createRef();
    this.newEventDateEl = React.createRef();
    this.newEventDescriptionEl = React.createRef();
  }
  enableCreatingEventModal = async () => {
    this.setState({ modal: !this.state.modal });
  };

  createEventHandler = async () => {
    const title = this.newEventTitleEl.current.value;
    const price = this.newEventPriceEl.current.value;
    const date = this.newEventDateEl.current.value;
    const description = this.newEventDescriptionEl.current.value;

    if (
      title.trim().length === 0 ||
      price.trim().length === 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = {
      title,
      price: +price,
      date,
      description,
    };
    console.log("event", event);

    let payload = {
      query: `
            mutation{
              createEvent(eventInput:{title:"${title}", price:${price}, date:"${date}", description:"${description}"}){
              _id
              title
              description
              price
              date
              creator{
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
        this.setState({ modal: false });
        this.fetchEvents();
        console.log(submitURL);
        console.log(responseJson);
      }
    } catch (err) {
      console.log(err);
    }
  };

  fetchEvents = async () => {
    let payload = {
      query: `
            query{
              events{
              _id
              title
              description
              price
              date
              creator{
                _id
                email
              }
            }
          }
      `,
    };

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
        const events = responseJson.data.events;
        this.setState({ events: events });
        console.log(submitURL);
        console.log(responseJson);
      }
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    this.fetchEvents();
  }

  render() {
    const eventList = this.state.events.map((event) => {
      return (
        <li key={event._id} className="events__list-item">
          {event.title}
        </li>
      );
    });
    return (
      <>
        {this.state.modal && (
          <>
            <Backdrop />
            <Modal
              title="Add Event"
              canCancel
              canConfirm
              onConfirm={this.createEventHandler}
              onCancel={this.enableCreatingEventModal}
            >
              <form>
                <div className="form-control">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" ref={this.newEventTitleEl} />
                </div>
                <div className="form-control">
                  <label htmlFor="price">Price</label>
                  <input type="Number" id="price" ref={this.newEventPriceEl} />
                </div>
                <div className="form-control">
                  <label htmlFor="price">Date</label>
                  <input
                    type="datetime-local"
                    id="date"
                    ref={this.newEventDateEl}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="price">Description</label>
                  <textarea
                    id="description"
                    rows="4"
                    ref={this.newEventDescriptionEl}
                  />
                </div>
              </form>
            </Modal>
          </>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events</p>
            <button className="btn" onClick={this.enableCreatingEventModal}>
              Create Event
            </button>
          </div>
        )}
        <ul className="event__list">{eventList}</ul>
      </>
    );
  }
}
