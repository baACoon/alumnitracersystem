import React, { useState, useCallback, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Correct way to import useNavigate
import styles from "./CrossCheck-Survey.module.css";
import Tuplogo from "../../components/image/Tuplogo.png";
import Alumnilogo from "../../components/image/alumniassoc_logo.png";
import nationalities from "./nationalities"; 
import { PH_LOCATIONS } from "./philippine-locations";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  
  const [selectedProvince, setSelectedProvince] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email_address: "",
    contact_no: "",
    birthdate: "",
    birthplace: {
      province: "",
      city: ""
    },
    
    
    sex: "",
    nationality: "",
    address: "",
    degree: "",
    college: "",
    course: "",
    occupation: "",
    company_name: "",
    year_started: "",
    job_status: "",
    job_level: "",
    position: "",
    type_of_organization: "",
    work_alignment: "",
    gradmonths: "", // Changed from graduate_months to gradmonths
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "email_address") {
      const atComIndex = value.indexOf(".com");
      if (atComIndex !== -1 && value.length > atComIndex + 4) return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));

    // Auto-set fields if unemployed
    if (name === "job_status" && value === "Unemployed") {
      setFormData((prev) => ({
        ...prev,
        occupation: "N/A",
        company_name: "N/A",
        year_started: "",
        job_level: "NotApplicable",
        position: "N/A",
        type_of_organization: "NotApplicable",
        work_alignment: "NotApplicable", // Add this line
        gradmonths: "", // Add this line
      }));
    }
    if (name === "birthplace.province") {
      setSelectedProvince(value);
      setFormData((prev) => ({
        ...prev,
        birthplace: { province: value, city: "" }
      }));
      return;
    }
    
    if (name === "birthplace.city") {
      setFormData((prev) => ({
        ...prev,
        birthplace: { ...prev.birthplace, city: value }
      }));
      return;
    }
    
  }, []);

  const handleCollegeChange = (e) => {
    const selectedCollege = e.target.value;
    setFormData((prev) => ({ ...prev, college: selectedCollege, course: "" }));
    setFormErrors((prev) => ({ ...prev, college: "", course: "" }));
  };

  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value;
    setFormData((prev) => ({ ...prev, course: selectedCourse }));
    setFormErrors((prev) => ({ ...prev, course: "" }));
  };

  const validateForm = useCallback(() => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(09\d{9}|(\+639)\d{9})$/;
    const birthdateLimit = new Date();
    birthdateLimit.setFullYear(birthdateLimit.getFullYear() - 18);

    if (currentPage === 1) {
      if (!formData.first_name.trim()) errors.first_name = "First Name is required.";
        else if (formData.first_name.length > 50) errors.first_name = "Max 50 characters allowed.";
      if (!formData.last_name.trim()) errors.last_name = "Last Name is required.";
        else if (formData.last_name.length > 50) errors.last_name = "Max 50 characters allowed.";
        
      if (!emailRegex.test(formData.email_address)) errors.email_address = "Invalid email address.";
      if (!phoneRegex.test(formData.contact_no)) {
        errors.contact_no = "Use format 09xxxxxxxxx or +639xxxxxxxxx.";
      }
      if (!formData.birthdate) errors.birthdate = "Birthdate is required.";
        else if (new Date(formData.birthdate) > birthdateLimit) 
          errors.birthdate = "You must be at least 18 years old.";
        else if (new Date(formData.birthdate) > new Date()) {
          errors.birthdate = "Birthdate cannot be in the future.";
        } else if (new Date(formData.birthdate) > birthdateLimit) {
          errors.birthdate = "You must be at least 18 years old.";
        }
        
        if (!formData.birthplace?.province || !formData.birthplace?.city) {
          errors.birthplace = "Please select both province and city.";
        }
        
      if (!formData.sex) errors.sex = "Sex is required.";
      if (!formData.nationality.trim()) errors.nationality = "Nationality is required.";
      if (!formData.address.trim()) errors.address = "Address is required.";
      if (!formData.degree) errors.degree = "Degree is required.";
      if (!formData.college.trim()) errors.college = "College is required.";
      if (!formData.course.trim()) errors.course = "Course is required.";
    }

    if (currentPage === 2) {
      if (!formData.job_status) errors.job_status = "Employment Status is required.";
      if (formData.job_status !== "Unemployed") {
        if (!formData.occupation?.trim()) errors.occupation = "Occupation is required.";
        if (!formData.company_name?.trim()) errors.company_name = "Company Name is required.";
        if (!formData.year_started) errors.year_started = "Year Started is required.";
        else if (parseInt(formData.year_started) > new Date().getFullYear()) errors.year_started = "Invalid Year Started.";
        if (!formData.job_level) errors.job_level = "Job Level is required.";
        if (!formData.position?.trim()) errors.position = "Position is required.";
        if (!formData.type_of_organization) errors.type_of_organization = "Type of Organization is required.";
        if (!formData.work_alignment) errors.work_alignment = "Work Alignment is required.";
        if (!formData.gradmonths) errors.gradmonths = "Month of Graduation is required.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [currentPage, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus({ type: "error", message: "Please fix the errors." });
      return;
    }

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setSubmitStatus({ type: "error", message: "Authentication error. Please login." });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5050/surveys/submit/Tracer1', {
        userId,
        personalInfo: {
          first_name: formData.first_name,
          middle_name: formData.middle_name,
          last_name: formData.last_name,
          email_address: formData.email_address,
          contact_no: formData.contact_no,
          birthdate: formData.birthdate,
          birthplace: formData.birthplace,
          sex: formData.sex,
          nationality: formData.nationality,
          address: formData.address,
          degree: formData.degree,
          college: formData.college,
          course: formData.course,
        },
        employmentInfo: {
          occupation: formData.occupation,
          company_name: formData.company_name,
          year_started: formData.year_started,
          job_status: formData.job_status,
          job_level: formData.job_level,
          position: formData.position,
          type_of_organization: formData.type_of_organization,
          work_alignment: formData.work_alignment,
          gradmonths: formData.gradmonths.toLowerCase(), // Add this line
        }
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (response.data.success) {
        setSubmitStatus({ type: "success", message: "Survey submitted successfully!" });
        setTimeout(() => navigate("/Home"), 2000);
        setFormData({});
        setCurrentPage(1);
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: error.response?.data?.message || "Submission failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles["survey-container"]}>
      <div className={styles["logo-container"]}>
        <img src={Tuplogo} alt="TUP logo" className={styles["logo-1"]} />
        <img src={Alumnilogo} alt="Alumni logo" className={styles["logo-2"]} />
      </div>

      <h1 className={styles.surveyTitle}>Tracer Survey Form</h1>
      {submitStatus.message && (
        <p className={submitStatus.type === "error" ? styles.errorMessage : styles.successMessage}>
          {submitStatus.message}
        </p>
      )}

      <form onSubmit={handleSubmit} className={styles["survey-form"]}>
        {currentPage === 1 ? (
          <>
            <h3 className={styles["section-title"]}>Personal Information</h3>
            <div className={styles["form-grid"]}>
              {/* Personal Information Fields */}
                          <div className={styles["form-group"]}>
                              <label htmlFor="first_name">First Name: *</label>
                              <input
                                  type="text"
                                  id="first_name"
                                  name="first_name"
                                  value={formData.first_name}
                                  onChange={handleChange}
                                  required
                                  className={styles["form-input"]}
                              />
                              {formErrors.first_name && <span className={styles.errorText}>{formErrors.first_name}</span>}
                          </div>
  
                           <div className={styles["form-group"]}>
                                  <label htmlFor="middle_name">Middle Name:</label>
                                  <input
                                      type="text"
                                      id="middle_name"
                                      name="middle_name"
                                      value={formData.middle_name}
                                      onChange={handleChange}
                                      className={styles["form-input"]}
                                  />
                              </div>
  
                              <div className={styles["form-group"]}>
                                  <label htmlFor="last_name">Last Name: *</label>
                                  <input
                                      type="text"
                                      id="last_name"
                                      name="last_name"
                                      value={formData.last_name}
                                      onChange={handleChange}
                                      required
                                      className={styles["form-input"]}
                                  />
                                  {formErrors.last_name && <span className={styles.errorText}>{formErrors.last_name}</span>}
                              </div>
  
                              <div className={styles["form-group"]}>
                                  <label htmlFor="email_address">Email Address: *</label>
                                  <input
                                      type="email"
                                      id="email_address"
                                      name="email_address"
                                      value={formData.email_address}
                                      onChange={handleChange}
                                      required
                                      className={styles["form-input"]}
                                  />
                                  {formErrors.email_address && <span className={styles.errorText}>{formErrors.email_address}</span>}
                              </div>
  
                              <div className={styles["form-group"]}>
                                  <label htmlFor="contact_no">Contact Number: *</label>
                                  <input
                                      type="tel"
                                      id="contact_no"
                                      name="contact_no"
                                      value={formData.contact_no}
                                      onChange={handleChange}
                                      required
                                      className={styles["form-input"]}
                                  />
                                  {formErrors.contact_no && <span className={styles.errorText}>{formErrors.contact_no}</span>}
                              </div>
  
                              <div className={styles["form-group"]}>
                                  <label htmlFor="birthdate">Birth Date: *</label>
                                  <input
                                      type="date"
                                      id="birthdate"
                                      name="birthdate"
                                      value={formData.birthdate}
                                      onChange={handleChange}
                                      required
                                      className={styles["form-input"]}
                                  />
                                  {formErrors.birthdate && <span className={styles.errorText}>{formErrors.birthdate}</span>}
                              </div>
  
                              <div className={styles["form-group"]}>
                                <label>Birthplace: Province *</label>
                                <select
                                  name="birthplace.province"
                                  value={formData.birthplace?.province || ""}
                                  onChange={handleChange}
                                  required
                                  className={styles["form-select"]}
                                >
                                  <option value="">Select Province</option>
                                  {Object.keys(PH_LOCATIONS).map((province) => (
                                    <option key={province} value={province}>{province}</option>
                                  ))}
                                </select>
                              </div>

                              <div className={styles["form-group"]}>
                                <label>City/Municipality *</label>
                                <select
                                  name="birthplace.city"
                                  value={formData.birthplace?.city || ""}
                                  onChange={handleChange}
                                  required
                                  disabled={!formData.birthplace?.province}
                                  className={styles["form-select"]}
                                >
                                  <option value="">Select City</option>
                                  {(PH_LOCATIONS[formData.birthplace?.province] || []).map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                  ))}
                                </select>
                                {formErrors.birthplace && <span className={styles.errorText}>{formErrors.birthplace}</span>}
                              </div>

  
                              <div className={styles["form-group"]}>
                                <label>Sex: *</label>
                                <div className={styles["radio-group"]}>
                                  <label className={styles["radio-pill"]}>
                                    <input
                                      type="radio"
                                      name="sex"
                                      value="Male"
                                      checked={formData.sex === "Male"}
                                      onChange={handleChange}
                                      required
                                    />
                                    <span>Male</span>
                                  </label>
                                  <label className={styles["radio-pill"]}>
                                    <input
                                      type="radio"
                                      name="sex"
                                      value="Female"
                                      checked={formData.sex === "Female"}
                                      onChange={handleChange}
                                    />
                                    <span>Female</span>
                                  </label>
                                </div>
                                {formErrors.sex && <span className={styles.errorText}>{formErrors.sex}</span>}
                              </div>

                              <div className={styles["form-group"]}>
                              <label>Nationality: *</label>
                                <select
                                  id="nationality"
                                  name="nationality"
                                  value={formData.nationality}
                                  onChange={handleChange}
                                  required
                                  className={styles["form-input"]}
                                >
                                  <option value="" disabled>Select your nationality</option>
                                  {nationalities.map((nation, index) => (
                                    <option key={index} value={nation}>
                                      {nation}
                                    </option>
                                  ))}
                                </select>
                                {formErrors.nationality && <span className={styles.errorText}>{formErrors.nationality}</span>}
                              </div>

                              <div className={styles["form-group"]}>
                                  <label htmlFor="address">Complete Address: *</label>
                                  <input
                                      type="text"
                                      id="address"
                                      name="address"
                                      value={formData.address}
                                      onChange={handleChange}
                                      required
                                      className={styles["form-input"]}
                                  />
                                  {formErrors.address && <span className={styles.errorText}>{formErrors.address}</span>}
                              </div>
  
                              <div className={styles["form-group"]}>
                                  <label htmlFor="degree">Degree: *</label>
                                  <select
                                      id="degree"
                                      name="degree"
                                      value={formData.degree}
                                      onChange={handleChange}
                                      required
                                      className={styles["form-select"]}
                                  >
                                      <option value="">Select Degree</option>
                                      <option value="bachelors">Bachelor's Degree</option>
                                      <option value="masters">Master's Degree</option>
                                      <option value="doctorate">Doctorate Degree</option>
                                  </select>
                                  {formErrors.degree && <span className={styles.errorText}>{formErrors.degree}</span>}
                              </div>
  
                              <div className={styles["form-group"]}>
                              <label htmlFor="college">College: *</label>
                              <select
                                id="college"
                                name="college"
                                value={formData.college}
                                onChange={handleCollegeChange}
                                required
                                className={styles["form-select"]}
                              >
                                <option value="">Select College</option>
                                {Object.keys(colleges).map((college) => (
                                  <option key={college} value={college}>
                                    {college}
                                  </option>
                                ))}
                              </select>
                              {formErrors.college && <span className={styles.errorText}>{formErrors.college}</span>}
                            </div>

                            <div className={styles["form-group"]}>
                              <label htmlFor="course">Course: *</label>
                              <select
                                id="course"
                                name="course"
                                value={formData.course}
                                onChange={handleCourseChange}
                                required
                                className={styles["form-select"]}
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
                              {formErrors.course && <span className={styles.errorText}>{formErrors.course}</span>}
                            </div>
                                    </div>

                          <div className={styles["survey-form-button-container"]}>
                            <button
                              type="button"
                              className={styles["surveyform-btn"]}
                              onClick={() => {
                                if (validateForm()) {
                                  setCurrentPage(2);
                                } else {
                                  setSubmitStatus({
                                    type: "error",
                                    message: "Please fill in all required fields",
                                  });
                                }
                              }}
                            >
                              Next
                            </button>
                          </div>
                </>
              ) : (
                <>
                  <h2 className={styles["section-title"]}>Occupational Information</h2>
                    <div className={styles["form-grid"]}>
                      {/* Occupational Information Fields */}
                      
                      <div className={styles["form-group"]}>
                                  <label htmlFor="job_status">Employment Status: *</label>
                                  <select
                                      id="job_status"
                                      name="job_status"
                                      value={formData.job_status}
                                      onChange={handleChange}
                                      required
                                      className={styles["form-select"]}
                                  >
                                      <option value="">Select Status</option>
                                      <option value="Permanent">Permanent</option>
                                      <option value="Contractual/ProjectBased">Contractual/Project Based</option>
                                      <option value="Temporary">Temporary</option>
                                      <option value="Self-employed">Self-employed</option>
                                      <option value="Unemployed">Unemployed</option>
                                  </select>
                              </div>

                      {formData.job_status !== "Unemployed" && (
                        <>
                          <div className={styles["form-group"]}>
                              <label htmlFor="occupation">Occupation: *</label>
                              <input
                                  type="text"
                                  id="occupation"
                                  name="occupation"
                                  value={formData.occupation}
                                  onChange={handleChange}
                                  required
                                  className={styles["form-input"]}
                              />
                              {formErrors.occupation && <span className={styles.errorText}>{formErrors.occupation}</span>}

                          </div>
  
                          <div className={styles["form-group"]}>
                                  <label htmlFor="company_name">Company Name: *</label>
                                  <input
                                      type="text"
                                      id="company_name"
                                      name="company_name"
                                      value={formData.company_name}
                                      onChange={handleChange}
                                      required
                                      className={styles["form-input"]}
                                  />
                                  {formErrors.company_name && <span className={styles.errorText}>{formErrors.company_name}</span>}
                              </div>
  
                              <div className={styles["form-group"]}>
                                  <label htmlFor="year_started">Year Started: *</label>
                                  <input
                                      type="number"
                                      id="year_started"
                                      name="year_started"
                                      value={formData.year_started}
                                      onChange={handleChange}
                                      required
                                      min="1900"
                                      max={new Date().getFullYear()}
                                      className={styles["form-input"]}
                                  />
                                  {formErrors.year_started && <span className={styles.errorText}>{formErrors.year_started}</span>}
                              </div>

                              <div className={styles["form-group"]}>
                                <label htmlFor="job_level">Job Level: *</label>
                                <select
                                  id="job_level"
                                  name="job_level"
                                  value={formData.job_level}
                                  onChange={handleChange}
                                  required
                                  className={styles["form-select"]}
                                >
                                  <option value="">Select Job Level</option>
                                  <option value="Entry-level">Entry-level</option>
                                  <option value="Mid-level">Mid-level</option>
                                  <option value="Senior/Executive">Senior/Executive</option>
                                  <option value="NotApplicable">Not Applicable</option>
                                </select>
                              </div>
  
                              <div className={styles["form-group"]}>
                                  <label htmlFor="position">Position: *</label>
                                  <input
                                      type="text"
                                      id="position"
                                      name="position"
                                      value={formData.position}
                                      onChange={handleChange}
                                      required
                                      className={styles["form-input"]}
                                  />
                                  {formErrors.positio  && <span className={styles.errorText}>{formErrors.position}</span>}
                              </div>
  
                              
  
                              <div className={styles["form-group"]}>
                                  <label htmlFor="type_of_organization">Type of Organization: *</label>
                                  <select
                                      id="type_of_organization"
                                      name="type_of_organization"
                                      value={formData.type_of_organization}
                                      onChange={handleChange}
                                      required
                                      className={styles["form-select"]}
                                  >
                                      <option value="">Select Type</option>
                                      <option value="Private">Private</option>
                                      <option value="NGO">NGO</option>
                                      <option value="Government">Government</option>
                                      <option value="Self-employed">Self-employed</option>
                                      <option value="NotApplicable">Not Applicable</option>

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
                              <div className={styles["form-group"]}>
                                <label htmlFor="gradmonths">
                                  Month of Graduation: *
                                </label>
                                <select
                                  id="gradmonths"
                                  name="gradmonths"
                                  value={formData.gradmonths}
                                  onChange={handleChange}
                                  required
                                  className={styles["form-select"]}
                                >
                                  <option value="">Select Month</option>
                                  <option value="january">January</option>
                                  <option value="february">February</option>
                                  <option value="march">March</option>
                                  <option value="april">April</option>
                                  <option value="may">May</option>
                                  <option value="june">June</option>
                                  <option value="july">July</option>
                                  <option value="august">August</option>
                                  <option value="september">September</option>
                                  <option value="october">October</option>
                                  <option value="november">November</option>
                                  <option value="december">December</option>
                                </select>
                                {formErrors.gradmonths && (
                                  <span className={styles.errorText}>{formErrors.gradmonths}</span>
                                )}
                              </div>
                        </>
                      )}
                    </div>

              <div className={styles["survey-form-button-container"]}>
                <button
                  type="button"
                  className={styles["surveyform-prevbtn"]}
                  onClick={() => setCurrentPage(1)}
                  disabled={isSubmitting}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className={styles["surveyform-btn"]}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </>
          )}
      </form>
    </div>
  );
}

export default CrossCheckSurveyForm;
