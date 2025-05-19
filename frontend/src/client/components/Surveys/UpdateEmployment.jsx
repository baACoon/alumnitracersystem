import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './UpdateEmployment.module.css';

export const UpdateEmployment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { surveyId, lastStatus } = location.state || {};
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [employmentInfo, setEmploymentInfo] = useState({
    job_status: '',
    occupation: '',
    company_name: '',
    year_started: '',
    job_level: '',
    position: '',
    type_of_organization: '',
    work_alignment: '',
    gradmonths:''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmploymentInfo(prev => ({ ...prev, [name]: value }));
    
    // Auto-set fields if unemployed
    if (name === "job_status" && value === "Unemployed") {
      setEmploymentInfo(prev => ({
        ...prev,
        [name]: value,
        occupation: "N/A",
        company_name: "N/A",
        year_started: "",
        job_level: "NotApplicable",
        position: "N/A",
        type_of_organization: "NotApplicable",
        work_alignment: "Unaligned",
        gradmonths: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!employmentInfo.job_status) {
      errors.job_status = "Employment Status is required";
    }

    if (employmentInfo.job_status !== "Unemployed") {
      if (!employmentInfo.occupation?.trim()) errors.occupation = "Occupation is required";
      if (!employmentInfo.company_name?.trim()) errors.company_name = "Company Name is required";
      if (!employmentInfo.year_started) {
        errors.year_started = "Year Started is required";
      } else if (parseInt(employmentInfo.year_started) > new Date().getFullYear()) {
        errors.year_started = "Invalid Year Started";
      }
      if (!employmentInfo.job_level) errors.job_level = "Job Level is required";
      if (!employmentInfo.position?.trim()) errors.position = "Position is required";
      if (!employmentInfo.type_of_organization) errors.type_of_organization = "Type of Organization is required";
      if (!employmentInfo.gradmonths) {
        errors.gradmonths = "Graduation Month is required";
      }
    }

    if (!employmentInfo.work_alignment) errors.work_alignment = "Work Alignment is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Modified handleSubmit function in UpdateEmployment.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // First, get the latest Tracer1 submission ID
      const latestSubmission = await axios.get(
        `https://alumnitracersystem.onrender.com/surveys/pending/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!latestSubmission.data?.surveys?.[0]?.id) {
        throw new Error('No survey found to update');
      }

      // Now update using the actual MongoDB ObjectId
      await axios.patch(
        `https://alumnitracersystem.onrender.com/surveys/update-employment/${latestSubmission.data.surveys[0].id}`,
        { employmentInfo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Employment status updated successfully');
      navigate('/SurveyPage');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update employment status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Update Employment Information</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="job_status">Employment Status: *</label>
            <select
              id="job_status"
              name="job_status"
              value={employmentInfo.job_status}
              onChange={handleChange}
              required
              className={styles.formSelect}
            >
              <option value="">Select Status</option>
              <option value="Permanent">Permanent</option>
              <option value="Contractual/ProjectBased">Contractual/Project Based</option>
              <option value="Temporary">Temporary</option>
              <option value="Self-employed">Self-employed</option>
              <option value="Unemployed">Unemployed</option>
            </select>
            {formErrors.job_status && <span className={styles.errorText}>{formErrors.job_status}</span>}
          </div>

          {employmentInfo.job_status !== "Unemployed" && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="occupation">Occupation: *</label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={employmentInfo.occupation}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
                {formErrors.occupation && <span className={styles.errorText}>{formErrors.occupation}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="company_name">Company Name: *</label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={employmentInfo.company_name}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
                {formErrors.company_name && <span className={styles.errorText}>{formErrors.company_name}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="year_started">Year Started: *</label>
                <input
                  type="number"
                  id="year_started"
                  name="year_started"
                  value={employmentInfo.year_started}
                  onChange={handleChange}
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                  className={styles.formInput}
                />
                {formErrors.year_started && <span className={styles.errorText}>{formErrors.year_started}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="job_level">Job Level: *</label>
                <select
                  id="job_level"
                  name="job_level"
                  value={employmentInfo.job_level}
                  onChange={handleChange}
                  required
                  className={styles.formSelect}
                >
                  <option value="">Select Job Level</option>
                  <option value="Entry-level">Entry-level</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior/Executive">Senior/Executive</option>
                  <option value="NotApplicable">Not Applicable</option>
                </select>
                {formErrors.job_level && <span className={styles.errorText}>{formErrors.job_level}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="position">Position: *</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={employmentInfo.position}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
                {formErrors.position && <span className={styles.errorText}>{formErrors.position}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="type_of_organization">Type of Organization: *</label>
                <select
                  id="type_of_organization"
                  name="type_of_organization"
                  value={employmentInfo.type_of_organization}
                  onChange={handleChange}
                  required
                  className={styles.formSelect}
                >
                  <option value="">Select Type</option>
                  <option value="Private">Private</option>
                  <option value="NGO">NGO</option>
                  <option value="Government">Government</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="NotApplicable">Not Applicable</option>
                </select>
                {formErrors.type_of_organization && <span className={styles.errorText}>{formErrors.type_of_organization}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gradmonths">Month of Graduation: *</label>
                <select
                  id="gradmonths"
                  name="gradmonths"
                  value={employmentInfo.gradmonths}
                  onChange={handleChange}
                  required
                  className={styles.formSelect}
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

          <div className={styles.formGroup}>
            <label htmlFor="work_alignment">Work Alignment with Academic Specialization: *</label>
            <select
              id="work_alignment"
              name="work_alignment"
              value={employmentInfo.work_alignment}
              onChange={handleChange}
              required
              className={styles.formSelect}
            >
              <option value="">Select Alignment</option>
              <option value="Very much aligned">Very much aligned</option>
              <option value="Aligned">Aligned</option>
              <option value="Averagely Aligned">Averagely Aligned</option>
              <option value="Somehow Aligned">Somehow Aligned</option>
              <option value="Unaligned">Unaligned</option>
            </select>
            {formErrors.work_alignment && <span className={styles.errorText}>{formErrors.work_alignment}</span>}
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => navigate('/SurveyPage')}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Status"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployment;