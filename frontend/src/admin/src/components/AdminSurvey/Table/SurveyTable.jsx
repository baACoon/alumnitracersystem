import React from 'react';
import styles from './SurveyTable.module.css';

{/**  ganito dapat pero gagawing dynamic 
 
const surveys = [
  {
    id: 1,
    title: 'Tracer Survey Form (2020)',
    datePublished: 'July 29, 2020',
    responses: 150
  },
  {
    id: 2,
    title: 'Masteral: Subject Alignment',
    datePublished: 'July 29, 2020',
    responses: 89
  },
  {
    id: 3,
    title: 'Masteral: University Experience',
    datePublished: 'July 29, 2018',
    responses: 245
  },
  {
    id: 4,
    title: 'Masters or comfortability?',
    datePublished: 'July 29, 2016',
    responses: 178
  },
  {
    id: 5,
    title: 'Subject Alignment',
    datePublished: 'July 29, 2016',
    responses: 312
  },
  {
    id: 6,
    title: 'University Experience',
    datePublished: 'July 29, 2016',
    responses: 267
  }
];
  
*/}


const surveys = [
  <div>
    <p style={{ color: 'gray', textAlign: 'center' }}>Pending content will go here.</p>
  </div>
];

export const SurveyTable = () => {
  return (
    <div 
      className={styles.tableWrapper}
      role="region" 
      aria-label="Survey list"
      tabIndex="0"
    >
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" className={styles.header}>No.</th>
            <th scope="col" className={styles.header}>TITLE</th>
            <th scope="col" className={styles.header}>DATE PUBLISHED</th>
            <th scope="col" className={styles.header}>RESPONSES</th>
            <th scope="col" className={styles.header}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map((survey, index) => (
            <tr key={survey.id} className={styles.row}>
              <td className={styles.cell}>{index + 1}</td>
              <td className={styles.cell}>{survey.title}</td>
              <td className={styles.cell}>{survey.datePublished}</td>
              <td className={styles.cell}>{survey.responses}</td>
              <td className={styles.actionCell}>
                {/*<button    ----dapat lalabas tong view and Download kapag 
                                  may may laman na. 
                  className={`${styles.actionButton} ${styles.viewButton}`}
                  aria-label={`View ${survey.title}`}
                >
                  VIEW
                </button>
                <button 
                  className={`${styles.actionButton} ${styles.downloadButton}`}
                  aria-label={`Download ${survey.title}`}
                >
                  DOWNLOAD
                </button>*/}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};