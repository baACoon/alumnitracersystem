import React from "react";
import styles from './Events.module.css';


export const ListOfEvents = () => {

    return(
        <div className={styles.listOfEvents}>
            <button className={styles.deleteButton}>DELETE</button>
            <table className={styles.eventsTable}>
                <thead>
                    <tr>
                        <th>Event ID</th>
                        <th>Participants ID</th>
                        <th>Picture</th>
                        <th>Time</th>
                        <th>Date</th>
                        <th>Venue</th>
                        <th>By</th>
                        <th>Source</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>01</td>
                        <td>01</td>
                        <td>1234567...</td>
                        <td>4:00-10:00pc</td>
                        <td>12/14/24</td>
                        <td>UTC Hall</td>
                        <td>Admin Ris</td>
                        <td><a href="#">Link</a></td>
                    </tr>
                </tbody>
            </table>
            <div className={styles.eventDescription}>
                <h2>123rd Alumni Homecoming</h2>
                <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                    Quo nulla aliquam quas veniam, nam qui explicabo et blanditiis! 
                    Totam itaque cumque ut vero iusto ea veniam consectetur earum dolorem mollitia?
                </p>
            </div>
        </div>
    );
};

export default ListOfEvents;