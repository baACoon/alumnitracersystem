import React, { useState } from "react";
import axios from "axios"; // To handle API requests
import styles from "./CrossCheck-Survey.module.css";
import Tuplogo from "../../components/image/Tuplogo.png";
import Alumnilogo from "../../components/image/alumniassoc_logo.png";

const colleges = {
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

function CrossCheckSurveyForm() {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    first_name: "",
    last_name: "",
    middle_name: "",
    college: "",
    course: "",
    occupation: "",
    company_name: "",
    year_started: "",
    position: "",
    job_status: "",
    type_of_organization: "",
    work_alignment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNextPage = () => setCurrentPage(2);
  const handlePreviousPage = () => setCurrentPage(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5050/api/surveys/submit", formData);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Failed to submit the survey. Please try again.");
    }
  };

  return (
    <div className={styles["survey-container"]}>
      <div className={styles["logo"]}>
        <img src={Tuplogo} alt="TUP logo" className={styles["logo-1"]} />
        <img src={Alumnilogo} alt="Alumni logo" className={styles["logo-2"]} />
      </div>
      <h1>Tracer Survey Form (2024)</h1>

      <form onSubmit={handleSubmit}>
        {currentPage === 1 && (
          <>
            <h5>Personal Information</h5>
            <div className={styles["form-group"]}>
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                readOnly
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="first_name">First Name:</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="last_name">Last Name:</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="middle_name">Middle Name:</label>
              <input
                type="text"
                id="middle_name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="college">College:</label>
              <select
                id="college"
                name="college"
                value={formData.college}
                onChange={(e) => {
                  handleChange(e);
                  setFormData({ ...formData, course: "" });
                }}
                required
              >
                <option value="">Select College</option>
                {Object.keys(colleges).map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="course">Course:</label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                disabled={!formData.college}
              >
                <option value="">Select Course</option>
                {formData.college &&
                  colleges[formData.college].map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
              </select>
            </div>
            <div className={styles["survey-form-button-container"]}>
              <button
                type="button"
                className={styles["surveyform-btn"]}
                onClick={handleNextPage}
              >
                Next
              </button>
            </div>
          </>
        )}

        {currentPage === 2 && (
          <>
            <h5>Occupational Information</h5>
            <div className={styles["form-group"]}>
              <label htmlFor="occupation">Occupation:</label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="company_name">Company Name:</label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="year_started">Year Started:</label>
              <input
                type="text"
                id="year_started"
                name="year_started"
                value={formData.year_started}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="position">Position / Designation:</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="job_status">Job Status:</label>
              <select
                id="job_status"
                name="job_status"
                value={formData.job_status}
                onChange={handleChange}
                required
              >
                <option value="">Select Job Status</option>
                <option value="Permanent">Permanent</option>
                <option value="Contractual">Contractual / Project Based</option>
                <option value="Temporary">Temporary</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="type_of_organization">
                Type of Organization:
              </label>
              <select
                id="type_of_organization"
                name="type_of_organization"
                value={formData.type_of_organization}
                onChange={handleChange}
                required
              >
                <option value="">Select Organization Type</option>
                <option value="Private">Private</option>
                <option value="Non-Government">
                  Non-Government Organization
                </option>
                <option value="Self-Employed">Self-Employed</option>
              </select>
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="work_alignment">
                Work Alignment with Academic Specialization:
              </label>
              <select
                id="work_alignment"
                name="work_alignment"
                value={formData.work_alignment}
                onChange={handleChange}
                required
              >
                <option value="">Select Alignment</option>
                <option value="Very much aligned">Very much aligned</option>
                <option value="Aligned">Aligned</option>
                <option value="Averagely Aligned">Averagely Aligned</option>
                <option value="Somehow Aligned">Somehow Aligned</option>
                <option value="Unaligned">Unaligned</option>
              </select>
            </div>
            <div className={styles["survey-form-button-container"]}>
              <button
                type="button"
                className={styles["surveyform-prevbtn"]}
                onClick={handlePreviousPage}
              >
                Previous
              </button>
              <button className={styles["surveyform-btn"]} type="submit">
                Submit
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default CrossCheckSurveyForm;
