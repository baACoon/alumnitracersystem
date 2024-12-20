import React, { useState, useEffect } from "react";
import "../Events/events.css";
import Header from "../Header/header";
import Footer from "../../../admin/components/Footer/Footer";

function Events() {
  return (
    <div>
      <Header />
      <Footer />
      <EventMainPage />
    </div>
  );
}

function EventMainPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch events from backend API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5050/event/list"); // Adjust URL if needed
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="EventsContainer">
      <h4>DECEMBER 2024</h4>
      {events.length > 0 ? (
        events.map((event, index) => (
          <div
            key={index}
            className="eventNo1"
            onClick={() => handleEventClick(event)}
          >
            <div className="event-date">
              <h3>{new Date(event.date).toLocaleString("default", { month: "short" })}</h3>
              <h3>{new Date(event.date).getDate()}</h3>
            </div>
            <div className="event-details">
              <h5>
                {event.time} in {event.venue}
              </h5>
              <h3>{event.title}</h3>
              <h5>
                {event.description.length > 100
                  ? `${event.description.substring(0, 100)}...`
                  : event.description}
              </h5>
            </div>
          </div>
        ))
      ) : (
        <p>No events available at the moment.</p>
      )}

      {/* Modal */}
      {selectedEvent && (
        <div className="eventmodal">
          <div className="eventmodal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            {selectedEvent.image && (
              <img
                src={`http://localhost:5050/uploads/${selectedEvent.image}`}
                alt={selectedEvent.title}
                className="event-poster"
              />
            )}
            <h2>{selectedEvent.title}</h2>
            <p>
              <strong>Date:</strong> {selectedEvent.date} at {selectedEvent.time}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.venue}
            </p>
            <p>{selectedEvent.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
