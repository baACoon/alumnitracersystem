import React from 'react';
import styles from "./TracerSurvey2.module.css";

const Page1_Education = ({ data, updateForm }) => {
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...data.education];
    updatedEducation[index][field] = value;
    updateForm("education", updatedEducation);
  };

  const addEducationRow = () => {
    updateForm("education", [...data.education, { degree: "", college: "", yearGraduated: "", honors: "" }]);
  };

  const removeEducationRow = (index) => {
    if (data.education.length > 1) {
      updateForm("education", data.education.filter((_, i) => i !== index));
    }
  };

  const handleExamChange = (index, field, value) => {
    const updatedExams = [...data.examinations];
    updatedExams[index][field] = value;
    updateForm("examinations", updatedExams);
  };

  const addExamRow = () => {
    updateForm("examinations", [...data.examinations, { examName: "", dateTaken: "", rating: "" }]);
  };

  const removeExamRow = (index) => {
    if (data.examinations.length > 1) {
      updateForm("examinations", data.examinations.filter((_, i) => i !== index));
    }
  };

  const handleCheckboxChange = (reason, level) => {
    const updatedReasons = { ...data.reasons };
    updatedReasons[reason][level] = !updatedReasons[reason][level];
    updateForm("reasons", updatedReasons);
  };

  return (
    <div>
      <div className={styles.titleContainer}>
        <p>Please fill all required fields</p>
        <h3>Educational Background</h3>
      </div>

      <div className="educationAttainment">
        <label htmlFor="" className={styles.sectionTitle}>Educational Attainment</label>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Degree & Specialization</th>
                <th>College/University</th>
                <th>Year Graduated</th>
                <th>Honors/Awards</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.education.map((entry, index) => (
                <tr key={index}>
                  <td>
                    <select value={entry.type} onChange={(e) => handleEducationChange(index, "type", e.target.value)}>
                      <option value="">Select Type</option>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Masters">Masters</option>
                      <option value="Doctorate">Doctorate</option>
                    </select>
                  </td>
                  <td><input type="text" value={entry.degree} onChange={(e) => handleEducationChange(index, "degree", e.target.value)} placeholder="e.g., BS Computer Science" /></td>
                  <td><input type="text" value={entry.college} onChange={(e) => handleEducationChange(index, "college", e.target.value)} placeholder="e.g., TUP Manila" /></td>
                  <td><input type="number" value={entry.yearGraduated} onChange={(e) => handleEducationChange(index, "yearGraduated", e.target.value)} placeholder="e.g., 2022" /></td>
                  <td><input type="text" value={entry.honors} onChange={(e) => handleEducationChange(index, "honors", e.target.value)} placeholder="e.g., Cum Laude" /></td>
                  <td>{data.education.length > 1 && <button className={styles.removeButton} onClick={() => removeEducationRow(index)}>✖</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button className={styles.addButton} onClick={addEducationRow}>+ Add Row</button>

      {/* Professional Examinations Passed Table */}
      <div>
        <label htmlFor="" className={styles.sectionTitle}>Examination(s) Passed</label>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name of Examination</th>
                <th>Date Taken</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.examinations.map((entry, index) => (
                <tr key={index}>
                  <td><input type="text" value={entry.examName} onChange={(e) => handleExamChange(index, "examName", e.target.value)} placeholder="e.g., Civil Engineering Licensure" /></td>
                  <td><input type="date" value={entry.dateTaken} onChange={(e) => handleExamChange(index, "dateTaken", e.target.value)} /></td>
                  <td><input type="text" value={entry.rating} onChange={(e) => handleExamChange(index, "rating", e.target.value)} placeholder="e.g., 85.5%" /></td>
                  <td>{data.examinations.length > 1 && <button className={styles.removeButton} onClick={() => removeExamRow(index)}>✖</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button className={styles.addButton} onClick={addExamRow}>+ Add Row</button>

      {/* Reasons for Taking Course Table */}
      <div>
        <label htmlFor="" className={styles.sectionTitle}>Reason(s) for Taking the Course(s) or Pursuing Degree(s)</label>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reasons</th>
                <th>Undergraduate (AB/BS)</th>
                <th>Graduate (MS/MA/PhD)</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data.reasons).map((reasonKey, index) => (
                <tr key={index}>
                  <td>{reasonKey.replace(/([A-Z])/g, " $1").trim()}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={data.reasons[reasonKey].undergraduate}
                      onChange={() => handleCheckboxChange(reasonKey, "undergraduate")}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={data.reasons[reasonKey].graduate}
                      onChange={() => handleCheckboxChange(reasonKey, "graduate")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page1_Education;