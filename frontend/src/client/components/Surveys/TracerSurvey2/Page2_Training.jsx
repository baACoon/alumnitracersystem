import React from 'react';
import styles from "./TracerSurvey2.module.css";

const Page2_Training = ({ data, updateForm }) => {
  // Handle Training Inputs
  const handleTrainingChange = (index, field, value) => {
    const updatedTrainings = [...data.trainings];
    updatedTrainings[index][field] = value;
    updateForm("trainings", updatedTrainings);
  };

  const addTrainingRow = () => {
    updateForm("trainings", [...data.trainings, { title: "", duration: "", institution: "" }]);
  };

  const removeTrainingRow = (index) => {
    if (data.trainings.length > 1) {
      updateForm("trainings", data.trainings.filter((_, i) => i !== index));
    }
  };

  // Handle Motivation Input Change
  const handleMotivationChange = (field, value) => {
    updateForm("motivation", { ...data.motivation, [field]: value });
  };

  return (
    <div>
      <div className={styles.titleContainer}>
        <p>Please fill all required fields</p>
        <h3>Training(s)/Advanced Studies Attended after College</h3>
      </div>

      <h3 className={styles.sectionTitle}>
        Please list down all the professional training programs or advanced studies you have attended after college.
      </h3>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title of Training or Advanced Study</th>
              <th>Duration & Credits Earned</th>
              <th>Name of Training Institution/College/University</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.trainings.map((entry, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={entry.title}
                    onChange={(e) => handleTrainingChange(index, "title", e.target.value)}
                    placeholder="e.g., Project Management Certification"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={entry.duration}
                    onChange={(e) => handleTrainingChange(index, "duration", e.target.value)}
                    placeholder="e.g., 6 months, 12 credits"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={entry.institution}
                    onChange={(e) => handleTrainingChange(index, "institution", e.target.value)}
                    placeholder="e.g., Harvard University"
                  />
                </td>
                <td>
                  {data.trainings.length > 1 && (
                    <button className={styles.removeButton} onClick={() => removeTrainingRow(index)}>✖</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className={styles.addButton} onClick={addTrainingRow}>+ Add Row</button>

      {/* Motivation for Pursuing Advanced Studies */}
      <h3 className={styles.sectionTitle}>What made you pursue advanced studies?</h3>
      <div className={styles.motivationContainer}>
        <label className={styles.motivationLabel}>
          <input
            type="checkbox"
            checked={data.motivation.promotion}
            onChange={(e) => handleMotivationChange("promotion", e.target.checked)}
          />
          For Promotion
        </label>
        <label className={styles.motivationLabel}>
          <input
            type="checkbox"
            checked={data.motivation.professionalDevelopment}
            onChange={(e) => handleMotivationChange("professionalDevelopment", e.target.checked)}
          />
          For Professional Development
        </label>
        <label className={styles.motivationLabel}>
          <input
            type="checkbox"
            checked={data.motivation.others}
            onChange={(e) => handleMotivationChange("others", e.target.checked)}
          />
          Others
        </label>
      </div>
    </div>
  );
};

export default Page2_Training;
