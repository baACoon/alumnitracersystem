import React, { useState } from 'react';
import styles from "./TracerSurvey2.module.css";

const collegeCourses = {
  "College of Engineering": [
    "Bachelor of Science in Civil Engineering",
    "Bachelor of Science in Electrical Engineering",
    "Bachelor of Science in Electronics Engineering",
    "Bachelor of Science in Mechanical Engineering",
  ],
  "College of Science": [
    "Bachelor of Applied Science in Laboratory Technology",
    "Bachelor of Science in Computer Science",
    "Bachelor of Science in Environmental Science",
    "Bachelor of Science in Information System",
    "Bachelor of Science in Information Technology",
  ],
  "College of Industrial Education": [
    "Bachelor of Science Industrial Education Major in Information and Communication Technology",
    "Bachelor of Science Industrial Education Major in Home Economics",
    "Bachelor of Science Industrial Education Major in Industrial Arts",
    "Bachelor of Technical Vocational Teachers Education Major in Animation",
    "Bachelor of Technical Vocational Teachers Education Major in Automotive",
    "Bachelor of Technical Vocational Teachers Education Major in Beauty Care and Wellness",
    "Bachelor of Technical Vocational Teachers Education Major in Computer Programming",
    "Bachelor of Technical Vocational Teachers Education Major in Electrical",
    "Bachelor of Technical Vocational Teachers Education Major in Electronics",
    "Bachelor of Technical Vocational Teachers Education Major in Food Service Management",
    "Bachelor of Technical Vocational Teachers Education Major in Fashion and Garment",
    "Bachelor of Technical Vocational Teachers Education Major in Heat Ventillation & Air Conditioning",
  ],
  "College of Liberal Arts": [
    "Bachelor of Science in Business Management Major in Industrial Management",
    "Bachelor of Science in Entreprenuership",
    "Bachelor of Science Hospitality Management",
  ],
  "College of Architecture and Fine Arts": [
    "Bachelor of Science in Architecture",
    "Bachelor of Fine Arts",
    "Bachelor of Graphic Technology Major in Architecture Technology",
    "Bachelor of Graphic Technology Major in Industrial Design",
    "Bachelor of Graphic Technology Major in Mechanical Drafting Technology",
  ],
  "College of Industrial Technology": [
    "Bachelor of Science in Food Technology",
    "Bachelor of Engineering Technology Major in Civil Technology",
    "Bachelor of Engineering Technology Major in Electrical Technology",
    "Bachelor of Engineering Technology Major in Electronics Technology",
    "Bachelor of Engineering Technology Major in Computer Engineering Technology",
    "Bachelor of Engineering Technology Major in Instrumentation and Control Technology",
    "Bachelor of Engineering Technology Major in Mechanical Technology",
    "Bachelor of Engineering Technology Major in Mechatronics Technology",
    "Bachelor of Engineering Technology Major in Railway Technology",
    "Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Automative Technology",
    "Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Heating Ventilation & Airconditioning/Refrigiration Technology",
    "Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Power Plant Technology",
    "Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Welding Technology",
    "Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Dies and Moulds Technology",
    "Bachelor of Technology in Apparel and Fashion",
    "Bachelor of Technology in Culinary Technology",
    "Bachelor of Technology in Print Media Technology",
  ],
};

const Page1_Education = ({ data, updateForm }) => {
  const [availableCourses, setAvailableCourses] = useState([]);

   // In your handleEducationChange function:
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...data.education];
    
    if (field === "college") {
      updatedEducation[index].course = [""]; // Reset to empty array
      setAvailableCourses(collegeCourses[value[0]] || []); // Access first array element
    }
    
    updatedEducation[index][field] = Array.isArray(value) ? value : [value];
    updateForm("education", updatedEducation);
  };

  const addEducationRow = () => {
    updateForm("education", [
      ...data.education, 
      { degreeType: "", course: "", college: "", yearGraduated: "", institution: "" }
    ]);
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
                <th>College</th>
                <th>Course</th>
                <th>Year Graduated</th>
                <th>Institution</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.education.map((entry, index) => (
                <tr key={index}>
                  <td>
                    <select 
                      value={entry.degreeType[0] || ""}
                      onChange={(e) => handleEducationChange(index, "degreeType", [e.target.value])}
                      className={styles.selectInput}
                    >
                      <option value="">Select Type</option>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Masters">Masters</option>
                      <option value="Doctorate">Doctorate</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={entry.college[0] || ""}
                      onChange={(e) => {
                        const college = e.target.value;
                        handleEducationChange(index, "college", [college]);
                        setAvailableCourses(collegeCourses[college] || []);
                      }}
                      className={styles.selectInput}
                    >
                      <option value="">Select College</option>
                      {Object.keys(collegeCourses).map((college) => (
                        <option key={college} value={college}>
                          {college}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={entry.course[0] || ""}
                      onChange={(e) => handleEducationChange(index, "course", [e.target.value])}
                      className={styles.selectInput}
                      disabled={!entry.college || entry.college.length === 0}
                    >
                      <option value="">Select Course</option>
                      {collegeCourses[entry.college[0]]?.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input 
                      type="number" 
                      value={entry.yearGraduated} 
                      onChange={(e) => handleEducationChange(index, "yearGraduated", e.target.value)} 
                      placeholder="e.g., 2022" 
                      className={styles.inputField}
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      value={entry.institution} 
                      onChange={(e) => handleEducationChange(index, "institution", e.target.value)} 
                      placeholder="e.g., TUP Manila" 
                      className={styles.inputField}
                    />
                  </td>
                  <td>
                    {data.education.length > 1 && (
                      <button className={styles.removeButton} onClick={() => removeEducationRow(index)}>
                        ✖
                      </button>
                    )}
                  </td>
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
