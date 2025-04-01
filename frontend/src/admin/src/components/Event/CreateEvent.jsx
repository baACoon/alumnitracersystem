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

  // Handles event creation
  const handlePost = async () => {
    if (title && description && date && time && venue) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date);
      formData.append("time", time);
      formData.append("venue", venue);
      formData.append("source", source);
      if (fileName) {
        const fileInput = document.getElementById("fileInput");
        formData.append("image", fileInput.files[0]); // Attach file
      }

      try {
        const response = await fetch("https://alumnitracersystem.onrender.com/event/create", {
          method: "POST",
          body: formData, // Send as FormData
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.message);
          onPost(result.event); // Trigger callback for posting event
          resetForm(); // Clear form after success
        } else {
          const errorData = await response.json();
          alert(`Failed to create the event: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error creating event:", error);
        alert("An error occurred while creating the event.");
      }
    } else {
      alert("Please fill out all required fields.");
    }
  };

  // Clear form after successful post
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setVenue("");
    setSource("");
    setFileName("");
  };

  // Handles file input change
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
          placeholder="Write Event Description"
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
          placeholder="URL Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className={styles.inputField}
        />
      </div>
    </div>
  );
};

export default CreateEvent;
