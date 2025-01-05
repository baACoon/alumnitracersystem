import React, { useState } from 'react';
import styles from './CreateSurvey.module.css';
import { useNavigate } from 'react-router-dom';

export const CreateSurvey = ({ onBack }) => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([...questions, { type: '', question: '' }]);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.createSurvey}>
      <h1 className={styles.title}>Create New Survey</h1>
      <button className={styles.backButton} onClick={onBack}>
        Back
      </button>
      <div className={styles.form}>
        {questions.map((question, index) => (
          <div key={index} className={styles.questionBox}>
            <input
              type="text"
              placeholder="Enter your question"
              className={styles.questionInput}
              value={question.question}
              onChange={(e) => updateQuestion(index, 'question', e.target.value)}
            />
            <select
              className={styles.selectType}
              value={question.type}
              onChange={(e) => updateQuestion(index, 'type', e.target.value)}
            >
              <option value="" disabled>
                Select Question Type
              </option>
              <option value="linearScale">Linear Scale</option>
              <option value="longAnswer">Long Answer</option>
              <option value="shortAnswer">Short Answer</option>
              <option value="multipleChoice">Multiple Choice</option>
            </select>
            <button
              className={styles.removeButton}
              onClick={() => removeQuestion(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button className={styles.addButton} onClick={addQuestion}>
          + Add Question
        </button>
      </div>
      <button className={styles.submitButton}>Submit Survey</button>
    </div>
  );
};
