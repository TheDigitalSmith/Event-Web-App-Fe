import React from "react";
import "./EventList.css";

import EventItem from "./EventItem/EventItem";

const eventList = (props) => {
  return (
    <ul className="event__list">
      {props.events.map((event) => (
        <EventItem
          key={event._id}
          event={event}
          authUserId={props.authUserId}
          handleModalDetail={props.handleModalDetail}
        />
      ))}
    </ul>
  );
};

export default eventList;
