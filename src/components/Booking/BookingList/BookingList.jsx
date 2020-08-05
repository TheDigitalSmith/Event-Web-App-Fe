import React from "react";

import "./BookingList.css";

const bookingList = (props) => {
  return (
    <ul className="bookings__list">
      {props.bookings.map((booking) => {
        return (
          <>
            <li key={booking._id} className="bookings__item">
              <div className="bookings__item-data">{booking.event.title}</div>
              <div className="bookings__item-actions">
                <button
                  className="btn"
                  onClick={() => props.cancelBookingHandler(booking._id)}
                >
                  Cancel Booking
                </button>
              </div>
            </li>
          </>
        );
      })}
    </ul>
  );
};

export default bookingList;
