import React, { useState } from 'react';
import '../Events/events.css';
import Header from '../Header/header';
import Footer from '../../../admin/components/Footer/Footer';
import tupevent from '../../components/image/tup.jpg'


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
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      date: "SEPT 14",
      title: "123rd Alumni Homecoming",
      description: "Alumni from the Technological University of the Philippines...",
      location: "TUP IRTC",
      time: "December 20 @ 4:00pm",
      fullDetails: `Mark events in your calendars!
      Alumni from the Technological University of the Philippines are cordially invited to get in touch and bring back connections with one another.
      Come celebrate life's milestones, reunite, and share memories with us on this unforgettable evening. It's time to make new memories and renew old friendships. Greetings from home, dearest alumni.
      We are happy that you decided to come back, recall, and get to experience the TUP connection again.
      We'll see you there!`,
      image: (tupevent),
    },
  ];

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="EventsContainer">
      <h4>DECEMBER 2024</h4>
      {events.map((event, index) => (
        <div
          key={index}
          className="eventNo1"
          onClick={() => handleEventClick(event)}
        >
          <div className="event-date">
            <h3>{event.date.split(" ")[0]}</h3>
            <h3>{event.date.split(" ")[1]}</h3>
          </div>
          <div className="event-details">
            <h5>
              {event.time} in {event.location}
            </h5>
            <h3>{event.title}</h3>
            <h5>{event.description}</h5>
          </div>
        </div>
      ))}

      {selectedEvent && (
        <div className="eventmodal">
          <div className="eventmodal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="event-poster"
            />
            <h2>{selectedEvent.title}</h2>
            <p>
              <strong>Date:</strong> {selectedEvent.time}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <p>{selectedEvent.fullDetails}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
