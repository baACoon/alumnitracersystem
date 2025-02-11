import React from 'react'
import styles from './styles.module.css';
import { PendingSurvey } from './PendingSurvey';
import { CompletedSurvey } from './CompletedSurvey';
import Header from "../Header/header";
import Footer from "../FooterClient/Footer";

function SurveyPage(){
    return (
        <div className={styles.surveyContainer}>
            <Header />
            <SurveyMainPage />
            <Footer />
        </div>
    )
}

function SurveyMainPage () {
    const [activeTab, setActiveTab] = useState('pending');

    return ( 
        <section>
            <div className={styles.surveyMainPage}>
                <div className={styles.buttonContainer}>
                    <button 
                        role='tab'
                        aria-selected={activeTab === 'pending'}
                        className={`${styles.pendingButton} ${activeTab === 'pending' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Survey
                    </button>
                    <button 
                        role='tab'
                        aria-selected={activeTab === 'existing'}
                        className={`${styles.pendingButton} ${activeTab === 'pending' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('existing')}
                    >
                        Completed Survey
                    </button>
                </div>
                <div>
                    {activeTab === 'pending' && <PendingSurvey />}
                    {activeTab === 'completed' && <CompletedSurvey />} 
                </div>
            </div>
        </section>  
    )
}

export default SurveyPage;
