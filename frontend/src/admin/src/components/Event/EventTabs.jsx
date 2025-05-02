import React, { useState, useEffect } from "react";
import ListOfEvents from "./ListofEvents";
import CreateEvent from "./CreateEvent";
import styles from "./Events.module.css";
import SideBarLayout from "../SideBar/SideBarLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const EvenTabs = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [events, setEvents] = useState([]);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [trashedEvents, setTrashedEvents] = useState([]);

  // Function to add an event
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
          toast.error("Failed to fetch events.");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const fetchTrashedEvents = async () => {
      try {
        const response = await fetch("https://alumnitracersystem.onrender.com/event/trash");
        if (response.ok) {
          const data = await response.json();
          setTrashedEvents(data);
        } else {
          toast.error("Failed to fetch trashed events.");
        }
      } catch (error) {
        console.error("Error fetching trashed events:", error);
      }
    };


    const handleRestoreEvent = async (id) => {
      try {
        const response = await fetch(`https://alumnitracersystem.onrender.com/event/restore/${id}`, {
          method: "POST"
        });
        if (response.ok) {
          setTrashedEvents((prev) => prev.filter((e) => e._id !== id));
          fetchEvents();
        } else {
          toast.error("Failed to restore event.");
        }
      } catch (error) {
        console.error("Error restoring event:", error);
      }
    };

    const calculateDaysLeft = (deletedAt) => {
      const deletedDate = new Date(deletedAt);
      const expireDate = new Date(deletedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const diffMs = expireDate - Date.now();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? `${diffDays} day(s) left` : "Expired";
    };
  
    const addEvent = (event) => {
      setEvents([...events, event]);
    };

  return (
    <SideBarLayout>
        <div className={styles.eventTabsContainer}>
        <div className={styles.tabControls}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className={`${styles.tabButton} ${activeTab === "list" ? styles.active : ""}`}
                onClick={() => setActiveTab("list")}
              >
                List of Events
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "create" ? styles.active : ""}`}
                onClick={() => setActiveTab("create")}
              >
                + Create Event
              </button>
            </div>
            <FontAwesomeIcon
              icon={faTrash}
              title="View Deleted Events"
              onClick={() => {
                setShowTrashModal(true);
                fetchTrashedEvents();
              }}
              style={{ cursor: "pointer", fontSize: "20px", color: "#7a1e1e" }}
            />
          </div>
        </div>


        <div className={styles.tabContent}>
          {activeTab === "list" && <ListOfEvents events={events} />}
          {activeTab === "create" && (
            <CreateEvent
              onPost={(event) => {
                addEvent(event);
                setActiveTab("list");
              }}
              onBack={() => setActiveTab("list")}
            />
          )}
        </div>

        {showTrashModal && (
          <div className={styles.modalOverlay} onClick={() => setShowTrashModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <span className={styles.closeButton} onClick={() => setShowTrashModal(false)}>&times;</span>
              <h3>Deleted Events (Recoverable)</h3>
              {trashedEvents.length === 0 ? (
                <p>No deleted events found.</p>
              ) : (
                <div className={styles.trashList}>
                  {trashedEvents.map((event) => (
                    <div key={event._id} className={styles.trashedItem}>
                      <p><strong>{event.title}</strong></p>
                      <p>{event.description}</p>
                      <p><em>Date:</em> {event.date} <em>Time:</em> {event.time}</p>
                      <p style={{ fontStyle: "italic", color: "#a33" }}>{calculateDaysLeft(event.deletedAt)}</p>
                      <button onClick={() => handleRestoreEvent(event._id)}>Restore</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SideBarLayout>
  );
};

export default EvenTabs;
