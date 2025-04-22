import React from 'react';
import styles from "./TracerSurvey2.module.css";

const Page3_Employment = ({ data, updateForm }) => {

  // Handle Input Changes
  const handleEmploymentStatusChange = (value) => {
    updateForm("job_status", value);
  };

  const handleUnemploymentReasonChange = (field, value) => {
    updateForm("unemploymentReasons", { ...data.unemploymentReasons, [field]: value });
  };

  const renderUnemploymentReasons = () => (
    <>
      <h3 className={styles.sectionTitle}>Please state reason(s) why you are not yet employed.</h3>
      <div className={styles.checkboxGroup}>
        {[
          { key: "furtherStudy", label: "Advance or further study" },
          { key: "noJobOpportunity", label: "No job opportunity" },
          { key: "familyConcern", label: "Family concern and decided not to find a job" },
          { key: "didNotLook", label: "Did not look for a job" },
          { key: "healthRelated", label: "Health-related reason(s)" },
          { key: "lackExperience", label: "Lack of work experience" }
        ].map(({ key, label }) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={data.unemploymentReasons[key]}
              onChange={(e) => handleUnemploymentReasonChange(key, e.target.checked)}
            />
            {label}
          </label>
        ))}
      </div>
    </>
  );

  const handleFirstJobStayingReasons = (field, value) => {
    const updatedStayingReasons = {
      ...data.jobDetails.stayingReasons,
      [field]: value,
    };

    // Use the `updateForm` prop to update the state in the parent component
    updateForm("jobDetails", {
      ...data.jobDetails,
      stayingReasons: updatedStayingReasons,
    });
  };

  const handleAcceptJobReasonChange = (field, value) => {
    const updatedAcceptingJobReasons = {
      ...data.jobDetails.acceptingJobReasons,
      [field]: value,
    };

    // Use the `updateForm` prop to update the state in the parent component
    updateForm("jobDetails", {
      ...data.jobDetails,
      acceptingJobReasons: updatedAcceptingJobReasons,
    });
  };

  const handleFirstJobChangingReasonChange = (field, value) => {
    const updatedChangingJobReasons = {
      ...data.jobDetails.changingJobReasons,
      [field]: value,
    };

    updateForm("jobDetails", {
      ...data.jobDetails,
      changingJobReasons: updatedChangingJobReasons,
    });
  };


  const handleFirstJobSearchChange = (field, value) => {
    const updatedFirstJobSearch = {
      ...data.jobDetails.firstJobSearch,
      [field]: value,
    };

    // Use the `updateForm` prop to update the state in the parent component
    updateForm("jobDetails", {
      ...data.jobDetails,
      firstJobSearch: updatedFirstJobSearch,
    });
  };

  const handleJobDetailsChange = (field, value) => {
    updateForm("jobDetails", { ...data.jobDetails, [field]: value });
  };

  const handleNestedCheckbox = (section, field, value) => {
    const updated = {
      ...data.jobDetails[section],
      [field]: value
    };
    updateForm("jobDetails", { ...data.jobDetails, [section]: updated });
  };

  const handleCompetencyChange = (field, value) => {
    const updated = {
      ...data.jobDetails.competencies,
      [field]: value
    };
    updateForm("jobDetails", { ...data.jobDetails, competencies: updated });
  };

  return (
    <div>
      <div className={styles.titleContainer}>
        <p>Please fill all required fields</p>
        <h3>EMPLOYMENT DATA</h3>
      </div>

      {/* Employment Status */}
      {/* ✅ Corrected Employment Status */}
      <h3 className={styles.sectionTitle}>Present Employment Status</h3>
      <div className={styles.businessOptions}>
        {[
          { label: "Permanent", value: "permanent" },
          { label: "Contractual/Project Base", value: "contractual" },
          { label: "Temporary", value: "temporary" },
          { label: "Self-Employed", value: "selfEmployed" },
          { label: "Unemployed", value: "unemployed" },
        ].map(({ label, value }) => (
          <label key={value}>
            <input
              type="radio"
              name="job_status"
              value={value}
              checked={data.job_status === value}
              onChange={() => handleEmploymentStatusChange(value)}
            />
            {label}
          </label>
        ))}
      </div>

      {data.job_status === "unemployed"
        ? renderUnemploymentReasons()
        : null}

      {/* If NOT unemployed, show the rest of the job-related questions */}
      {data.job_status !== "unemployed" && (
        <>
          {/* Present Occupation */}
          <h3 className={styles.sectionTitle}>Present Occupation</h3>
          <input
            type="text"
            value={data.jobDetails?.occupation || ""}  // Safely access `occupation`
            onChange={(e) => updateForm("jobDetails", { ...data.jobDetails, occupation: e.target.value })}
            placeholder="e.g., Grade School Teacher, Electrical Engineer, Self-employed"
            className={styles.textInput}
          />

          <h3 className={styles.sectionTitle}>Company Name</h3>
          <input 
            type="text" 
            value={data.jobDetails?.company_name || ""}
            onChange={(e) => updateForm("jobDetails", { ...data.jobDetails, company_name: e.target.value })}
            placeholder="e.g., ABC Corporation, XYZ Inc."
            className={styles.textInput}          
          />

          <h3 className={styles.sectionTitle}>Year Started</h3>
          <input 
            type="text" 
            value={data.jobDetails?.year_started || ""}
            onChange={(e) => updateForm("jobDetails", { ...data.jobDetails, year_started: e.target.value })}
            placeholder="e.g., 2021"
            className={styles.textInput}          
          />

          <h3 className={styles.sectionTitle}>Type of Organization</h3>
          <div className={styles.businessOptions}>
            {["Private", "NGO", "Government", "Self-Employed"].map((type, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="type_of_organization"
                  value={type}
                  checked={data.jobDetails?.type_of_organization === type}  // Use optional chaining to avoid error if data.jobDetails is undefined
                  onChange={() => updateForm("jobDetails", { ...data.jobDetails, type_of_organization: type })}
                />
                {type}
                </label>
            ))}
          </div>

          {/* Major Line of Business of the Company*/}
          <h3 className={styles.sectionTitle}>Major Line of Business of the Company</h3>
          <div className={styles.businessOptions}>
            {[
              "Agriculture & Forestry",
              "Fishing",
              "Mining & Quarrying",
              "Manufacturing",
              "Utilities (Power/Water)",
              "Construction",
              "Retail & Motor Repair",
              "Hotels & Restaurants",
              "Transport & Logistics",
              "Banking & Finance",
              "Real Estate & Business",
              "Government & Public Service",
              "Education",
              "Healthcare & Social Work",
              "Community & Social Services",
              "Domestic Services",
              "International Organizations",
              "Information Technology",
              "BPO / Call Centers",
              "Media & Communication",
              "Freelance / Self-Employed",
              "Startups & Innovation"
            ].map((business, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="lineOfBusiness"
                  value={business}
                  checked={data.jobDetails?.lineOfBusiness === business}  // Use optional chaining to avoid error if data.jobDetails is undefined
                  onChange={() => updateForm("jobDetails", { ...data.jobDetails, lineOfBusiness: business })}
                />
                {business}
              </label>
            ))}
          </div>

          {/* Place of Work */}
          <h3 className={styles.sectionTitle}>Place of Work</h3>
          <div className={styles.radioGroup}>
            {["Local", "Abroad"].map((place, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="placeOfWork"
                  value={place}
                  checked={data.jobDetails.placeOfWork === place}
                  onChange={() => updateForm("jobDetails", { ...data.jobDetails, placeOfWork: place })}
                />
                {place}
              </label>
            ))}
          </div>

          {/* First Job After College */}
          <h3 className={styles.sectionTitle}>Is this your first job after college?</h3>
          <div className={styles.radioGroup}>
            {["Yes", "No"].map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="firstJob"
                  value={option}
                  checked={data.jobDetails.firstJob === option}
                  onChange={() => updateForm("jobDetails", { ...data.jobDetails, firstJob: option })}
                />
                {option}
              </label>
            ))}
          </div>

          {data.jobDetails.firstJob === "Yes" && (
            <>
              <h3 className={styles.sectionTitle}>What are your reason(s) for staying on the job?</h3>
              <div className={styles.checkboxGroup}>
                {[
                  { key: "salariesBenefits", label: "Salary and benefits" },
                  { key: "careerChallenge", label: "Career Challenge" },
                  { key: "specialSkill", label: "Special Skill" },
                  { key: "relatedToCourse", label: "Related Course" },
                  { key: "proximity", label: "Close to home" },
                  { key: "peerInfluence", label: "Peer Influence" },
                  { key: "familyInfluence", label: "Family Influence" }
                ].map(({ key, label }) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={data.jobDetails.stayingReasons?.[key] || false}
                      onChange={(e) => handleFirstJobStayingReasons(key, e.target.checked)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </>
          )}

          <h3 className={styles.sectionTitle}>Is your first job related to the course you took up in college?</h3>
          <div className={styles.radioGroup}>
            {["Yes", "No"].map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="jobRelatedToCourse"
                  value={option}
                  checked={data.jobDetails.jobRelatedToCourse === option}
                  onChange={() => updateForm("jobDetails", { ...data.jobDetails, jobRelatedToCourse: option })}
                />
                {option}
              </label>
            ))}
          </div>

          {data.jobDetails.jobRelatedToCourse === "Yes" && (
            <>
              <h3 className={styles.sectionTitle}>What were your reasons for accepting the job?</h3>
              <div className={styles.checkboxGroup}>
                {[
                  { key: "salariesBenefits", label: "Salaries and Benefits" },
                  { key: "careerChallenge", label: "Career Challenges" },
                  { key: "specialSkill", label: "Special Skills" },
                  { key: "proximity", label: "Proximity" },
                  { key: "other", label: "Other" }
                ].map(({ key, label }) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={data.jobDetails.acceptingJobReasons?.[key] || false}
                      onChange={(e) => handleAcceptJobReasonChange(key, e.target.checked)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </>
          )}

          {data.jobDetails.jobRelatedToCourse === "No" && (
            <>
              <h3 className={styles.sectionTitle}>What were your reason(s) for changing jobs?</h3>
              <div className={styles.checkboxGroup}>
                {[
                  { key: "salariesBenefits", label: "Salary and benefits" },
                  { key: "careerChallenge", label: "Career Challenge" },
                  { key: "specialSkill", label: "Special Skill" },
                  { key: "relatedToCourse", label: "Related Course" },
                  { key: "proximity", label: "Close to home" },
                  { key: "peerInfluence", label: "Peer Influence" },
                  { key: "familyInfluence", label: "Family Influence" }
                ].map(({ key, label }) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={data.jobDetails.changingJobReasons?.[key] || false}
                      onChange={(e) => handleFirstJobChangingReasonChange(key, e.target.checked)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </>
          )}

          <h3 className={styles.sectionTitle}>How long did you stay in your first job?</h3>
          <div className={styles.businessOptions}>
            {[
              "Less than a month",
              "1 to 6 months",
              "7 to 11 months",
              "1 year to less than 2 years",
              "2 years to less than 3 years",
              "3 years to less than 4 years",
            ].map((duration, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="firstJobDuration"
                  value={duration}
                  checked={data.jobDetails.firstJobDuration === duration}
                  onChange={() => updateForm("jobDetails", {
                    ...data.jobDetails,
                    firstJobDuration: duration // Update directly in jobDetails
                  })}
                />
                {duration}
              </label>
            ))}
          </div>

          <h3 className={styles.sectionTitle}>How did you find your first job?</h3>
          <div className={styles.businessOptions}>
            {[
              { key: "advertisement", label: "Response to an advertisement" },
              { key: "walkIn", label: "As walk-in applicant" },
              { key: "recommended", label: "Recommended by someone" },
              { key: "friends", label: "Information from friends" },
              { key: "schoolPlacement", label: "Arranged by school’s job placement officer" },
              { key: "familyBusiness", label: "Family business" },
              { key: "jobFair", label: "Job Fair or Public Employment Service Office (PESO)" }
            ].map(({ key, label }) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={data.jobDetails.firstJobSearch?.[key] || false}
                  onChange={(e) => handleFirstJobSearchChange(key, e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>

          <h3 className={styles.sectionTitle}>How long did it take you to land your first job?</h3>
          <div className={styles.businessOptions}>
            {[
              "Less than a month",
              "1 to 6 months",
              "7 to 11 months",
              "1 year to less than 2 years",
              "2 years to less than 3 years",
              "3 years to less than 4 years",
            ].map((time, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="jobLandingTime"
                  value={time}
                  checked={data.jobDetails?.jobLandingTime === time}  // Use optional chaining to avoid error if data.jobDetails is undefined
                  onChange={() => updateForm("jobDetails", { ...data.jobDetails, jobLandingTime: time })}
                />
                {time}
              </label>
            ))}
          </div>

          <h3 className={styles.sectionTitle}>Job Level</h3>
          <div className={styles.businessOptions}>
            {[
              "Rank & File / Clerical", "Professional / Supervisory",
              "Managerial / Executive", "Self-Employed"
            ].map(level => (
              <label key={level}>
                <input
                  type="radio"
                  name="position"
                  value={level}
                  checked={data.jobDetails.position === level}
                  onChange={(e) => handleJobDetailsChange("position", level)}
                />
                {level}
              </label>
            ))}
          </div>

          <h3 className={styles.sectionTitle}>Monthly Salary Range</h3>
          <select
            value={data.jobDetails.salaryRange || ""}
            onChange={(e) => handleJobDetailsChange("salaryRange", e.target.value)}
            className={styles.selectInput}
          >
            <option value="">Select salary range</option>
            <option value="Below ₱10,000">Below ₱10,000</option>
            <option value="₱10,000 - ₱20,000">₱10,000 - ₱20,000</option>
            <option value="₱20,001 - ₱40,000">₱20,001 - ₱40,000</option>
            <option value="Above ₱40,000">Above ₱40,000</option>
          </select>

          <h3 className={styles.sectionTitle}>Was your curriculum aligned to your job?</h3>
          <div className={styles.businessOptions}>
            {["Very much aligned", "Aligned", "Averagely Aligned", "Somehow Aligned", "Unaligned"].map(opt => (
              <label key={opt}>
                <input
                  type="radio"
                  name="work_alignment"
                  value={opt}
                  checked={data.jobDetails.work_alignment === opt}
                  onChange={() => handleJobDetailsChange("work_alignment", opt)}
                />
                {opt}
              </label>
            ))}
          </div>

          <h3 className={styles.sectionTitle}>What core competencies helped you in your job?</h3>
          <div className={styles.businessOptions}>
            {[
              "communication", "humanRelations", "entrepreneurial", "ITSkills",
              "problemSolving", "criticalThinking", "other"
            ].map(skill => (
              <label key={skill}>
                <input
                  type="checkbox"
                  checked={data.jobDetails.competencies?.[skill] || false}
                  onChange={(e) => handleCompetencyChange(skill, e.target.checked)}
                />
                {skill.replace(/([A-Z])/g, " $1")}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Page3_Employment;
