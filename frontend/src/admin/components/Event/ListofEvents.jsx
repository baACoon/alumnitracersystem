import React, { useEffect, useState } from "react";
import styles from "./ListofEvents.module.css";

export const ListOfEvents = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventList, setEventList] = useState([]);
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5050/event/list");
      if (response.ok) {
        const data = await response.json();
        setEventList(data);
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
    <div className={styles.listOfEvents}>
      <h2 className={styles.title}>List of Events</h2>
      {eventList.length > 0 ? (
        <div className={styles.eventsGrid}>
        {eventList.map((event, index) => (
          <div
            key={index}
            className={styles.eventBox}
            onClick={() => handleEventClick(event)}
          >
            {event.image && (
              <img
                src={`http://localhost:5050/uploads/${event.image}`}
                alt={event.title}
                className={styles.eventImage}
              />
            )}
            <p>
              <strong>Date and Time:</strong> {event.date} at {event.time}
            </p>
            <h2>{event.title}</h2>
            <p>
              {event.description.length > 100
                ? event.description.substring(0, 100) + "..."
                : event.description}
            </p>
          </div>
        ))}
      </div>
      
      ) : (
        <p className={styles.noEvents}>No events available. Please create one.</p>
      )}

      {/* Modal */}
      {selectedEvent && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // Prevent modal close on content click
          >
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
            <h2 className={styles.modalTitle}>{selectedEvent.title}</h2>
            <div className={styles.modalDetails}>
              <p>
                <strong>Date:</strong> {selectedEvent.date}
              </p>
              <p>
                <strong>Time:</strong> {selectedEvent.time}
              </p>
              <p>
                <strong>Venue:</strong> {selectedEvent.venue}
              </p>
              <p>
                <strong>Description:</strong> {selectedEvent.description}
              </p>
              <p>
                <strong>Event ID:</strong> {selectedEvent.eventId}
              </p>
              <p>
                <strong>Participants ID:</strong> {selectedEvent.participantsId}
              </p>
              <p>
                <strong>By:</strong> {selectedEvent.by}
              </p>
              <p>
                <strong>Source:</strong>{" "}
                <a href={selectedEvent.source} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfEvents;
