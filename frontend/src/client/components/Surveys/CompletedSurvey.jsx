import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CompletedSurvey.module.css';

export const CompletedSurvey = () => {
    const navigate = useNavigate();
  
    const goToForm = () => {
      navigate ('/SurveyForm')
    }
  
    return (
        <div className='survey-body'>
                  {/* Main Content */}
          <div className="survey-table-container">
            <h2>Completed Surveys</h2>
            <table className="survey-table">
              <thead>
                <tr>
                  <th>No. </th>
                  <th>TITLE</th>
                  <th>DATE SURVEY RECEIVED</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>testing</td>
                  <td>
                    <a onClick={goToForm}>Tracer Survey Form (2024)</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    )
  }

    export default CompletedSurvey;