import React, {useState} from 'react';
import ListOfEvents from './ListofEvents';
import CreateEvent from './CreateEvent';
import styles from './Events.module.css';

export const EvenTabs = () => {
    const [activeTab, setActiveTab] = useState('list');
    
    return(
        <div className={styles.eventTabsContainer}>
            <h1 className={styles.eventTitle}> EVENT MANAGEMENT</h1>
            <div className={styles.tabControls}>
                <button
                className={`${styles.tabButton} ${ activeTab === 'list' ? styles.active : ''}`}
                onClick={() => setActiveTab('list')}> List of Events 
                </button>
                <button
                className={`${styles.tabButton} ${ activeTab === 'create' ? styles.active : ''}`}
                onClick={() => setActiveTab('create')}> Create
                </button>
            </div>
            <div className={styles.tabContent}>
                {activeTab === 'list' && <ListOfEvents/>}
                {activeTab === 'create' && <CreateEvent/>}
            </div>
        </div>
    )
}

export default EvenTabs;
