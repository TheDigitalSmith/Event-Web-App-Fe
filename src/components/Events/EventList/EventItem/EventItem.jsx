import React from "react";

import "./EventItem.css";

const eventItem = (props) => {
  const { event, authUserId } = props;
  return (
    <li key={event._id} className="events__list-item">
      <div>
        <h1>{event.title}</h1>
        <h2>
          ${event.price} - {new Date(event.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        <button
          className="btn"
          onClick={() => props.handleModalDetail(event._id)}
        >
          View Details
        </button>
        {authUserId === event.creator._id && (
          <p>You're the owner of the event</p>
        )}
      </div>
    </li>
  );
};

export default eventItem;
