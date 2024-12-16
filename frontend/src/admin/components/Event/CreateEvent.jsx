import React, { useState } from "react";
import styles from "./CreateEvent.module.css";

export const CreateEvent = ({ onPost, onBack }) => {
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [source, setSource] = useState("");

  const handlePost = () => {
    if (title && description && date && time && venue) {
      const newEvent = { title, description, date, time, venue, source };
      onPost(newEvent);
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setVenue("");
      setSource("");
    } else {
      alert("Please fill out all required fields.");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // Display the file name
    }
  };

  return (
    <div className={styles.createEvents}>
      <div className={styles.buttons}>
        <button className={styles.backButton} onClick={onBack}>
          &lt;&lt; BACK
        </button>
        <button className={styles.postButton} onClick={handlePost}>
          POST
        </button>
      </div>
      <div className={styles.form}>
      <div className={styles.fileInputContainer}>
          <label htmlFor="fileInput" className={styles.importImageButton}>
            Import Image
          </label>
          <input
            type="file"
            id="fileInput"
            className={styles.fileInput}
            onChange={handleFileUpload}
          />
          {fileName && <p className={styles.fileName}>{fileName}</p>}
        </div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.inputField}
        />
        <textarea
          placeholder="Write Events Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textArea}
        ></textarea>
        <div className={styles.inlineFields}>
          <input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.inputField}
          />
          <input
            type="time"
            placeholder="Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={styles.inputField}
          />
          <input
            type="text"
            placeholder="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className={styles.inputField}
          />
        </div>
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className={styles.inputField}
        />
      </div>
    </div>
  );
};

export default CreateEvent;
