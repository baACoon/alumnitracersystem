import React, { useState } from "react";
import ListOfEvents from "./ListofEvents";
import CreateEvent from "./CreateEvent";
import styles from "./Events.module.css";
import SideBarLayout from "../SideBar/SideBarLayout";

export const EvenTabs = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [events, setEvents] = useState([]);

  // Function to add an event
  const addEvent = (event) => {
    setEvents([...events, event]);
  };

  return (
    <SideBarLayout>
      <div className={styles.eventTabsContainer}>
        <h1 className={styles.eventTitle}> EVENT MANAGEMENT</h1>
        <div className={styles.tabControls}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "list" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("list")}
          >
            List of Events
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "create" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("create")}
          >
            Create
          </button>
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
      </div>
    </SideBarLayout>
  );
};

export default EvenTabs;
