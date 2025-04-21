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

<div>
      <h3 className={styles.sectionTitle}>
        Please list down all the professional training programs or advanced studies you have attended after college.
        {/* ✅ Checkbox to skip trainings */}
        <label className={styles.noneOption}>
        <input
          type="checkbox"
          checked={data.noTrainings}
          onChange={(e) => {
            const checked = e.target.checked;
            updateForm("noTrainings", checked);
            updateForm("trainings", checked ? [] : [{ title: "", duration: "", institution: "" }]);
          }}
        />

          I have not taken any professional examination.
        </label>
      </h3>

  {/* ✅ Only show training table if not skipped */}
  {!data.noTrainings && (
    <>
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
                    <button
                      className={styles.removeButton}
                      onClick={() => removeTrainingRow(index)}
                    >
                      ✖
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className={styles.addButton} onClick={addTrainingRow}>+ Add Row</button>
    </>
  )}
</div>
     {/* Motivation for Pursuing Advanced Studies */}
    <h3 className={styles.sectionTitle}>What made you pursue advanced studies?</h3>
    <div className={styles.checkboxGroup}>
      {[
        { key: "promotion", label: "For Promotion" },
        { key: "professionalDevelopment", label: "For Professional Development" },
        { key: "personalInterest", label: "Personal Interest" },
        { key: "scholarship", label: "Scholarship Opportunity" },
        { key: "careerShift", label: "Career Shift or Change in Field" },
        { key: "others", label: "Others" }
      ].map(({ key, label }) => (
        <label key={key} className={styles.check}>
          <input
            type="checkbox"
            checked={data.motivation?.[key] || false}
            onChange={(e) => handleMotivationChange(key, e.target.checked)}
          />
          {label}
        </label>
      ))}
    </div>

    </div>
  );
};

export default Page2_Training;