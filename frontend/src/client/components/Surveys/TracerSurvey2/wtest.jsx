import React from 'react';
import styles from "./TracerSurvey2.module.css";

const Page3_Employment = ({ data, updateForm }) => {

  const handleEmploymentStatusChange = (value) => {
    updateForm("employmentStatus", value);
  };

  const handleUnemploymentReasonChange = (field, value) => {
    updateForm("unemploymentReasons", { ...data.unemploymentReasons, [field]: value });
  };

  const handleRadioChange = (setter, value) => {
    setter(value);
  };

  const handleCheckboxChange = (setter, field, value) => {
    setter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Handle form submission logic
    console.log("Form data submitted:", data);
  };

  return (
    <div>
      <div className={styles.titleContainer}>
        <p>Please fill all required fields</p>
        <h3>EMPLOYMENT DATA</h3>
      </div>

      {/* Employment Status */}
      <h3 className={styles.sectionTitle}>Are you presently employed?</h3>
      <div className={styles.radioGroup}>
        <label>
          <input
            type="radio"
            name="employmentStatus"
            value="yes"
            checked={data.employmentStatus === "yes"}
            onChange={() => handleEmploymentStatusChange("yes")}
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="employmentStatus"
            value="no"
            checked={data.employmentStatus === "no"}
            onChange={() => handleEmploymentStatusChange("no")}
          />
          No
        </label>
        <label>
          <input
            type="radio"
            name="employmentStatus"
            value="neverEmployed"
            checked={data.employmentStatus === "neverEmployed"}
            onChange={() => handleEmploymentStatusChange("neverEmployed")}
          />
          Never Employed
        </label>
      </div>

      {/* Reasons for Not Being Employed */}
      {(data.employmentStatus === "no" || data.employmentStatus === "neverEmployed") && (
        <>
          <h3 className={styles.sectionTitle}>Please state reason(s) why you are not yet employed.</h3>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={data.unemploymentReasons.furtherStudy}
                onChange={(e) => handleUnemploymentReasonChange("furtherStudy", e.target.checked)}
              />
              Advance or further study
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.unemploymentReasons.noJobOpportunity}
                onChange={(e) => handleUnemploymentReasonChange("noJobOpportunity", e.target.checked)}
              />
              No job opportunity
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.unemploymentReasons.familyConcern}
                onChange={(e) => handleUnemploymentReasonChange("familyConcern", e.target.checked)}
              />
              Family concern and decided not to find a job
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.unemploymentReasons.didNotLook}
                onChange={(e) => handleUnemploymentReasonChange("didNotLook", e.target.checked)}
              />
              Did not look for a job
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.unemploymentReasons.healthRelated}
                onChange={(e) => handleUnemploymentReasonChange("healthRelated", e.target.checked)}
              />
              Health-related reason(s)
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.unemploymentReasons.lackExperience}
                onChange={(e) => handleUnemploymentReasonChange("lackExperience", e.target.checked)}
              />
              Lack of work experience
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.unemploymentReasons.other !== ""}
                onChange={(e) => handleUnemploymentReasonChange("other", e.target.checked ? "" : data.unemploymentReasons.other)}
              />
              Other reason(s), please specify:
            </label>
            {data.unemploymentReasons.other !== "" && (
              <input
                type="text"
                value={data.unemploymentReasons.other}
                onChange={(e) => handleUnemploymentReasonChange("other", e.target.value)}
                placeholder="Specify other reasons..."
                className={styles.otherInput}
              />
            )}
          </div>
        </>
      )}

      {/* Present Employment Status */}
      <h3 className={styles.sectionTitle}>Present Employment Status</h3>
      <div className={styles.radioGroup}>
        {["Regular", "Contractual", "Temporary", "Self-employed", "Casual"].map((status, index) => (
          <label key={index}>
            <input
              type="radio"
              name="employmentStatus"
              value={status}
              checked={data.employmentStatus === status}
              onChange={() => handleEmploymentStatusChange(status)}
            />
            {status}
          </label>
        ))}
      </div>
<h3 className={styles.sectionTitle}>What were your reasons for accepting the job?</h3>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={data.unemploymentReasons.salariesBenefits !== ""}
                onChange={(e) => handleAcceptJobReasonChange("salariesBenefirs", e.target.salariesBenefits)}
              />
              Salaries and Benefits
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.unemploymentReasons.careerChallenge !== ""}
                onChange={(e) => handleAcceptJobReasonChange("careerChallenge", e.target.careerChallenge)}
              />
              Career Challenges
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.unemploymentReasons.specialSkill !== ""}
                onChange={(e) => handleAcceptJobReasonChange("specialSkill", e.target.specialSkill)}
              />
              Special Skills
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.unemploymentReasons.proximity !== ""}
                onChange={(e) => handleAcceptJobReasonChange("proximity", e.target.proximity)}
              />
              Proximity
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.unemploymentReasons.other !== ""}
                onChange={(e) => handleAcceptJobReasonChange("other", e.target.other)}
              />
              Other
            </label>
          </div>
      {/* Present Occupation */}
      <h3 className={styles.sectionTitle}>Present Occupation</h3>
      <input
        type="text"
        value={data.jobDetails.occupation}
        onChange={(e) => updateForm("jobDetails", { ...data.jobDetails, occupation: e.target.value })}
        placeholder="e.g., Grade School Teacher, Electrical Engineer, Self-employed"
        className={styles.textInput}
      />

      {/* Major Line of Business */}
      <h3 className={styles.sectionTitle}>Major Line of Business of the Company</h3>
      <div className={styles.businessOptions}>
        {[
          "Agriculture, Hunting, and Forestry",
          "Fishing",
          "Mining and Quarrying",
          "Manufacturing",
          "Electricity, Gas, and Water Supply",
          "Construction",
          "Wholesale and Retail Trade, repair of motor vehicles, motorcycles, and personal and household goods",
          "Hotels and Restaurants",
          "Transport Storage and Communication",
          "Financial Intermediation",
          "Real Estate, Renting, and Business Activities",
          "Public Administration and Defense; Compulsory Social Security",
          "Education",
          "Health and Social Work",
          "Other Community, Social, and Personal Service Activities",
          "Private Households with Employed Persons",
          "Extra-territorial Organizations and Bodies",
        ].map((business, index) => (
          <label key={index}>
            <input
              type="radio"
              name="lineOfBusiness"
              value={business}
              checked={data.jobDetails.lineOfBusiness === business}
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

      {/* Other Details for First Job */}
      {data.jobDetails.firstJob === "Yes" && (
        <>
          {/* Reasons for Staying */}
          <h3 className={styles.sectionTitle}>What are your reason(s) for staying on the job?</h3>
          <div className={styles.checkboxGroup}>
            {Object.keys(data.jobDetails.stayingReasons).map((reason, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={data.jobDetails.stayingReasons[reason]}
                  onChange={(e) => handleCheckboxChange(updateForm, "stayingReasons", reason, e.target.checked)}
                />
                {reason.replace(/([A-Z])/g, " $1").trim()}
              </label>
            ))}
          </div>
        </>
      )}

      <div className={styles.buttonRow}>
        <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Page3_Employment;
