import React, { useState, useEffect } from "react";
import styles from "./events.module.css"; // CSS module
import Header from "../Header/header";
import Footer from "../FooterClient/Footer";

function Events() {
  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-body">
        <EventMainPage />
      </div>
      <Footer />
    </div>
  );
}

function EventMainPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);



  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("https://alumnitracersystem.onrender.com/event/list");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedEvent(null);
      setIsClosing(false);
    }, 300); // duration should match animation duration
  };

  return (
    <div className={styles.eventsContainer}>
      {loading ? (
        <div className={styles.loadingOverlay}>
          <div className={styles.loaderContainer}>
            <svg viewBox="0 0 240 240" height="80" width="80" className="loader">
              <circle strokeLinecap="round" strokeDashoffset="-330" strokeDasharray="0 660" strokeWidth="20" stroke="#000" fill="none" r="105" cy="120" cx="120" className="pl__ring pl__ringA"></circle>
              <circle strokeLinecap="round" strokeDashoffset="-110" strokeDasharray="0 220" strokeWidth="20" stroke="#000" fill="none" r="35" cy="120" cx="120" className="pl__ring pl__ringB"></circle>
              <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="85" className="pl__ring pl__ringC"></circle>
              <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="155" className="pl__ring pl__ringD"></circle>
            </svg>
            <p>Loading...</p>
          </div>
        </div>
      ) : (
        <div className={styles.pageEnter}> {/* 🎉 Apply fade animation */}
          <h4>UPCOMING EVENTS</h4>
          {events.length > 0 ? (
            events.map((event, index) => (
              <div
                key={index}
                className={styles.eventNo1}
                onClick={() => handleEventClick(event)}
              >
                <div className={styles.eventDate}>
                  <h3>{new Date(event.date).toLocaleString("default", { month: "long" })}</h3>
                  <h3>{new Date(event.date).getDate()}</h3>
                </div>
                <div className={styles.eventDetails}>
                  <h5>{event.time} in {event.venue}</h5>
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
        </div>
      )}

      {/* Modal */}
      {selectedEvent && (
      <div className={styles.eventModal}>
        <div
          className={`${styles.eventModalContent} ${isClosing ? styles.zoomOut : styles.zoomIn}`}
        >
          <span className={styles.closeButton} onClick={closeModal}>
            &times;
          </span>
          {selectedEvent.image && (
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className={styles.eventPoster}
            />
          )}
          <h2>{selectedEvent.title}</h2>
          <p>{selectedEvent.description}</p>
          <div className={styles.dateTimeVenue}>
            <p><strong>Date & Time:</strong><br />{selectedEvent.date} at {selectedEvent.time}</p>
            <p><strong>Location:</strong><br />{selectedEvent.venue}</p>
          </div>
        </div>
      </div>
    )}

    </div>
  );
}

export default Events;
