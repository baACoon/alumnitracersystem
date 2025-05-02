import React, { useEffect, useState } from "react";
import styles from "./ListofEvents.module.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ListOfEvents = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("https://alumnitracersystem.onrender.com/event/list");
      if (response.ok) {
        const data = await response.json();
        setEventList(data);
      } else {
        toast.error("Failed to fetch events.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      setLoading(true);
      const response = await fetch(`https://alumnitracersystem.onrender.com/event/soft-delete/${eventId}`, {
        method: "POST",
      });
  
      if (response.ok) {
        setEventList(eventList.filter((event) => event._id !== eventId));
        toast.success("Event moved to trash successfully.");
      } else {
        toast.error("Failed to move event to trash.");
      }
    } catch (error) {
      console.error("Error soft deleting event:", error);
      toast.error("Something went wrong.");
    }finally{
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className={styles.listOfEvents}>
          {loading && (
          <div className={styles.bg}>
            <div className={styles.spinner}></div>
            <h3 className={styles.loadname}>Processing...</h3>
          </div>
      )}
      <h2 className={styles.title}>List of Events</h2>
      {eventList.length > 0 ? (
        <div className={styles.eventsGrid}>
          {eventList.map((event, index) => (
          <div key={event._id} className={styles.eventBox}>
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                className={styles.eventImage}
                onClick={() => handleEventClick(event)}
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
            <button
              className={styles.deleteButton}
              onClick={() => handleDeleteEvent(event._id)} // Use `_id` here
            >
              Trash
            </button>
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
            {selectedEvent.image && (
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className={styles.modalEventImage}
              />
            )}
            <h2 className={styles.modalTitle}>{selectedEvent.title}</h2>
            <div className={styles.modalDetails}>
            <div className={styles.dateTimeRow}>
                <p>
                  <strong>Date:</strong> <br />
                  {selectedEvent.date}
                </p>
                <p>
                  <strong>Time:</strong> <br />
                  {selectedEvent.time}
                </p>
              </div>
              <div className={styles.description2}>
                <p>
                  <strong>Description:</strong> <br />{selectedEvent.description}
                </p>
              </div>
              <div className={styles.venueSource}>
                <p>
                  <strong>Venue:</strong> <br />{selectedEvent.venue}
                </p>
                <p>
                  <strong>Source:</strong>{" "}
                  <a href={selectedEvent.source} target="_blank" rel="noopener noreferrer">
                    <br />Link
                  </a>
                </p>
              </div>
              <p>
                <strong>Participants ID:</strong> <br />{selectedEvent.participantsId}
              </p>
              <p>
                <strong>By:</strong> <br />{selectedEvent.by}
              </p>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfEvents;
