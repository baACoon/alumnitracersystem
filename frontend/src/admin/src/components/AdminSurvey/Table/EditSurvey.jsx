import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../CreateSurvey/CreateSurvey.module.css"; // Reusing styles from CreateSurvey

export const EditSurvey = ({ surveyId, onBack }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  // Fetch the survey data for editing
  useEffect(() => {
    fetchSurveyData();
  }, [surveyId]);

  const fetchSurveyData = async () => {
    try {
      const response = await axios.get(`https://alumnitracersystem.onrender.com/api/surveys/${surveyId}`);
      const { survey, questions } = response.data;
      setTitle(survey.title);
      setDescription(survey.description);
      setQuestions(questions);
    } catch (error) {
      console.error("Error fetching survey data:", error);
    }
  };

  // Update the question text
  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // Update the options of a multiple-choice question
  const updateOptions = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Add a new option for a multiple-choice question
  const addOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push("");
    setQuestions(updatedQuestions);
  };

  // Remove a question from the survey
  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // Submit the edited survey
  const handleSubmit = async () => {
    if (!title || questions.length === 0) {
      alert("Title and at least one question are required.");
      return;
    }
  
    try {
      const response = await axios.put(`https://alumnitracersystem.onrender.com/api/newSurveys/${surveyId}`, {
        title,
        description,
        questions,
      });
  
      alert("Survey updated successfully!");
      onBack(); // Navigate back to the previous page
    } catch (error) {
      console.error("Error updating survey:", error);
      alert("Failed to update survey.");
    }
  };
  

  return (
    <div>
      <div className={styles.createSurvey}>
        {/* Buttons Row */}
        <div className={styles.buttonRow}>
          <button className={styles.backButton} onClick={onBack}>
            Back
          </button>
        </div>

        <h1 className={styles.title}>Edit Survey</h1>
        <input
          type="text"
          placeholder="Survey Title"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Survey Description"
          className={styles.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className={styles.form}>
          {questions.map((question, index) => (
            <div key={index} className={styles.questionBox}>
              <input
                type="text"
                placeholder="Enter your question"
                className={styles.questionInput}
                value={question.questionText}
                onChange={(e) => updateQuestion(index, "questionText", e.target.value)}
              />
              <select
                className={styles.selectType}
                value={question.questionType}
                onChange={(e) => updateQuestion(index, "questionType", e.target.value)}
              >
                <option value="" disabled>Select Question Type</option>
                <option value="text">Short Answer</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="checkbox">Checkbox</option>
              </select>

              {/* Handle multiple-choice questions */}
              {question.questionType === "multiple-choice" && (
                <div className={styles.multipleChoice}>
                  {question.options.map((option, optIndex) => (
                    <input
                      key={optIndex}
                      type="text"
                      placeholder={`Option ${optIndex + 1}`}
                      value={option}
                      onChange={(e) => updateOptions(index, optIndex, e.target.value)}
                    />
                  ))}
                  <button className={styles.addOptionButton} onClick={() => addOption(index)}>
                    Add Option
                  </button>
                </div>
              )}

              <button className={styles.removeButton} onClick={() => removeQuestion(index)}>
                Remove Question
              </button>
            </div>
          ))}
          <button className={styles.addButton} onClick={() => setQuestions([...questions, { questionText: "", questionType: "", options: [] }])}>
            + Add Question
          </button>
        </div>
        <button className={styles.submitButton} onClick={handleSubmit}>
          Update Survey
        </button>
      </div>
    </div>
  );
};
