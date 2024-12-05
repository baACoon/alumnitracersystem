import React from "react";
import styles from './Events.module.css';


export const CreateEvent = () => {
    return(
        <div className={styles.createEvents}>
            <div className={styles.buttons}>
                <button className={styles.backButton}>&lt;&lt; BACK </button>
                <button className={styles.postButton}>&lt;&lt; POST</button>
            </div>
            <div className={styles.form}>
                <button className={styles.importImageButton}>Import Image</button>
                <input type="test" placeholder="Title" className={styles.inputField}/>
                <textarea placeholder="Write Events Description" className={styles.textArea}></textarea>
                <div className={styles.inlineFields}>
                    <input type="date" placeholder="Date" className={styles.inputField} />
                    <input type="time" placeholder="Time" className={styles.inputField} />
                    <input type="text" placeholder="Venue" className={styles.inputField} />
                </div>
                <input type="text" placeholder="Source" className={styles.inputField} />
            </div>
        </div>
    );
};

export default CreateEvent;