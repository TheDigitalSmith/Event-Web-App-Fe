import React, { Component } from "react";

import "./Events.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";

export default class EventsPage extends Component {
  state = {
    modal: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
  };

  // isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.newEventTitleEl = React.createRef();
    this.newEventPriceEl = React.createRef();
    this.newEventDateEl = React.createRef();
    this.newEventDescriptionEl = React.createRef();
  }
  enableCreatingEventModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  closeDetailHandler = () => {
    this.setState({ selectedEvent: null });
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
        // this.fetchEvents();
        this.setState((prevstate) => {
          const updatedEvents = [...this.state.events];
          updatedEvents.push({
            _id: responseJson.data.createEvent._id,
            title: responseJson.data.createEvent.title,
            description: responseJson.data.createEvent.description,
            date: responseJson.data.createEvent.date,
            price: responseJson.data.createEvent.price,
            creator: {
              _id: this.context.userId,
            },
          });
          return { events: updatedEvents };
        });
        console.log(submitURL);
        console.log(responseJson);
      }
    } catch (err) {
      console.log(err);
    }
  };

  fetchEvents = async () => {
    this.setState({ isLoading: true });
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
        // if (this.isActive) {
        //   this.setState({ events: events, isLoading: false });
        // }
        this.setState({ events: events, isLoading: false });
      }
    } catch (err) {
      console.log(err);
      // if (this.isActive) {
      //   this.setState({ isLoading: false });
      // }
      this.setState({ isLoading: false });
    }
  };

  bookEventHandler = async () => {
    let payload = {
      query: `
            mutation{
              bookEvent(eventId:"${this.state.selectedEvent._id}"){
              _id
              createdAt
              updatedAt
              event{
                title
                description
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
        console.log("Booking Response", responseJson);
        this.setState({ isLoading: false, selectedEvent: null });
        // const booking = responseJson.data.events;
      }
    } catch (err) {
      console.log(err);
      this.setState({ isLoading: false, selectedEvent: null });
    }
  };

  handleModalDetail = (eventId) => {
    this.setState((prevState) => {
      const selectedEvent = prevState.events.find((e) => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  componentDidMount() {
    this.fetchEvents();
  }

  // componentWillMount() {
  //   this.isActive = false;
  // }

  render() {
    return (
      <>
        {(this.state.modal || this.state.selectedEvent) && <Backdrop />}
        {this.state.modal && (
          <>
            <Modal
              title="Add Event"
              canCancel
              canConfirm
              onConfirm={this.createEventHandler}
              onCancel={this.enableCreatingEventModal}
              confirmText="Create"
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
        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm={this.context.token ? true : false}
            onConfirm={this.bookEventHandler}
            onCancel={this.closeDetailHandler}
            confirmText="Book Event"
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>
              ${this.state.selectedEvent.price} -{" "}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events</p>
            <button className="btn" onClick={this.enableCreatingEventModal}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner></Spinner>
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            handleModalDetail={this.handleModalDetail}
          ></EventList>
        )}
      </>
    );
  }
}
