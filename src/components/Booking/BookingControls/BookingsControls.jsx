import React from "react";

import "./BookingControls.css";

const bookingsControl = (props) => {
  return (
    <div className="bookings-control">
      <button
        className={props.activeOutputType === "list" ? "active" : ""}
        onClick={() => props.outputTypeHandler("list")}
      >
        List
      </button>
      <button
        className={props.activeOutputType === "chart" ? "active" : ""}
        onClick={() => props.outputTypeHandler("chart")}
      >
        Chart
      </button>
    </div>
  );
};

export default bookingsControl;
