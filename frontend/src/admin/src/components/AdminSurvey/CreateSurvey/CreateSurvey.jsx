import React, { useState } from 'react';
import styles from './CreateSurvey.module.css';

export const CreateSurvey = ({ onBack }) => {
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, { type: '', question: '', config: {} }]);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;

    // Reset config when question type changes
    if (field === 'type') {
      updatedQuestions[index].config = {};
    }

    setQuestions(updatedQuestions);
  };

  const updateConfig = (index, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].config[key] = value;
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.createSurvey}>
      <button className={styles.backButton} onClick={onBack}>
        Back to Surveys
      </button>
      <h1 className={styles.title}>Create New Survey</h1>
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

            {/* Dynamic Configurations Based on Question Type */}
            {question.type === 'shortAnswer' && (
              <div className={styles.exampleField}>
                <input type="text" disabled placeholder="Short answer example" />
              </div>
            )}

            {question.type === 'longAnswer' && (
              <div className={styles.exampleField}>
                <textarea disabled placeholder="Long answer example" />
              </div>
            )}

            {question.type === 'linearScale' && (
              <div className={styles.linearScale}>
                <label>
                  <h6>Least (1):</h6>
                  <input
                    type="text"
                    placeholder="Label (Optional)"
                    value={question.config.least || ''}
                    onChange={(e) => updateConfig(index, 'least', e.target.value)}
                  />
                </label>
                <label>
                  <h6>Great (5):</h6>
                  <input
                    type="text"
                    placeholder="Label (Optional)"
                    value={question.config.great || ''}
                    onChange={(e) => updateConfig(index, 'great', e.target.value)}
                  />
                </label>
              </div>
            )}

            {question.type === 'multipleChoice' && (
              <div className={styles.multipleChoice}>
                {question.config.options?.map((option, optIndex) => (
                  <div key={optIndex} className={styles.option}>
                    <input
                      type="text"
                      placeholder={`Option ${optIndex + 1}`}
                      value={option}
                      onChange={(e) =>
                        updateConfig(index, 'options', [
                          ...question.config.options.slice(0, optIndex),
                          e.target.value,
                          ...question.config.options.slice(optIndex + 1),
                        ])
                      }
                    />
                  </div>
                ))}
                <button
                  className={styles.addOptionButton}
                  onClick={() =>
                    updateConfig(index, 'options', [
                      ...(question.config.options || []),
                      '',
                    ])
                  }
                >
                  Add Option
                </button>
              </div>
            )}

            <button
              className={styles.removeButton}
              onClick={() => removeQuestion(index)}
            >
              Remove Question
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
