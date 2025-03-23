import React from 'react';
import styles from "./TracerSurvey2.module.css";

const Page3_Employment = ({ data, updateForm }) => {

  // Handle Input Changes
  const handleEmploymentStatusChange = (value) => {
    updateForm("employmentStatus", value);
  };

  const handleUnemploymentReasonChange = (field, value) => {
    updateForm("unemploymentReasons", { ...data.unemploymentReasons, [field]: value });
  };

  const handleFirstJobStayingReasonChange = (field, value) => {
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

  return (
    <div>
      <div className={styles.titleContainer}>
        <p>Please fill all required fields</p>
        <h3>EMPLOYMENT DATA</h3>
      </div>

      {/* Employment Status */}
      <h3 className={styles.sectionTitle}>Present Employment Status</h3>
      <div className={styles.businessOptions}>
        {["Regular", "Contractual", "Temporary", "Self-employed", "Casual", "Unemployed", "Never Employed"].map((status, index) => (
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

      {/* Reasons for Not Being Employed */}
      {(data.employmentStatus === "Unemployed" || data.employmentStatus === "Never Employed") && (
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
          </div>
        </>
      )}


      {/* Present Occupation */}
      <h3 className={styles.sectionTitle}>Present Occupation</h3>
      <input
        type="text"
        value={data.jobDetails?.occupation || ""}  // Safely access `occupation`
        onChange={(e) => updateForm("jobDetails", { ...data.jobDetails, occupation: e.target.value })}
        placeholder="e.g., Grade School Teacher, Electrical Engineer, Self-employed"
        className={styles.textInput}
      />


      {/* Major Line of Business of the Company*/}
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
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.stayingReasons.salariesBenefits}
                onChange={(e) => handleFirstJobStayingReasonChange("salariesBenefits", e.target.checked)}
              />
              Salary and benefits
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.stayingReasons.careerChallenge}
                onChange={(e) => handleFirstJobStayingReasonChange("careerChallenge", e.target.checked)}
              />
              Career Challenge
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.stayingReasons.specialSkill}
                onChange={(e) => handleFirstJobStayingReasonChange("specialSkill", e.target.checked)}
              />
              Special Skill
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.stayingReasons.relatedToCourse}
                onChange={(e) => handleFirstJobStayingReasonChange("relatedToCourse", e.target.checked)}
              />
              Related Course
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.stayingReasons.proximity}
                onChange={(e) => handleFirstJobStayingReasonChange("proximity", e.target.checked)}
              />
              Close to home
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.stayingReasons.peerInfluence}
                onChange={(e) => handleFirstJobStayingReasonChange("peerInfluence", e.target.checked)}
              />
              Peer Influence
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.stayingReasons.familyInfluence}
                onChange={(e) => handleFirstJobStayingReasonChange("familyInfluence", e.target.checked)}
              />
              Family Influence
            </label>
          </div>
        </>
      )}




      <h3 className={styles.sectionTitle}>Is your first job related to the course you took up in college?</h3>
      <div className={styles.radioGroup}>
        {["Yes", "No"].map((option, index) => (
          <label key={index}>
            <input
              type="radio"
              name="firstJob"
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
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.acceptingJobReasons.salariesBenefits}
                onChange={(e) => handleAcceptJobReasonChange("salariesBenefits", e.target.checked)}
              />
              Salaries and Benefits
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.acceptingJobReasons.careerChallenge}
                onChange={(e) => handleAcceptJobReasonChange("careerChallenge", e.target.checked)}
              />
              Career Challenges
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.acceptingJobReasons.specialSkill}
                onChange={(e) => handleAcceptJobReasonChange("specialSkill", e.target.checked)}
              />
              Special Skills
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.acceptingJobReasons.proximity}
                onChange={(e) => handleAcceptJobReasonChange("proximity", e.target.checked)}
              />
              Proximity
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.acceptingJobReasons.other}
                onChange={(e) => handleAcceptJobReasonChange("other", e.target.checked)}
              />
              Other
            </label>
          </div>
        </>
      )}


      {data.jobDetails.jobRelatedToCourse === "No" && (
        <>
          <h3 className={styles.sectionTitle}>What were your reason(s) for changing jobs?</h3>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.changingJobReasons.salariesBenefits}
                onChange={(e) => handleFirstJobChangingReasonChange("salariesBenefits", e.target.checked)}
              />
              Salary and benefits
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.changingJobReasons.careerChallenge}
                onChange={(e) => handleFirstJobChangingReasonChange("careerChallenge", e.target.checked)}
              />
              Career Challenge
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.changingJobReasons.specialSkill}
                onChange={(e) => handleFirstJobChangingReasonChange("specialSkill", e.target.checked)}
              />
              Special Skill
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.changingJobReasons.relatedToCourse}
                onChange={(e) => handleFirstJobChangingReasonChange("relatedToCourse", e.target.checked)}
              />
              Related Course
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.changingJobReasons.proximity}
                onChange={(e) => handleFirstJobChangingReasonChange("proximity", e.target.checked)}
              />
              Close to home
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.changingJobReasons.peerInfluence}
                onChange={(e) => handleFirstJobChangingReasonChange("peerInfluence", e.target.checked)}
              />
              Peer Influence
            </label>
            <label>
              <input
                type="checkbox"
                checked={data.jobDetails.changingJobReasons.familyInfluence}
                onChange={(e) => handleFirstJobChangingReasonChange("familyInfluence", e.target.checked)}
              />
              Family Influence
            </label>
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


      <h3 className={styles.sectionTitle}>What were your reason(s) for changing jobs?</h3>
      <div className={styles.checkboxGroup}>
        <label>
          <input
            type="checkbox"
            checked={data.jobDetails.firstJobSearch.advertisement}
            onChange={(e) => handleFirstJobSearchChange("advertisement", e.target.checked)}
          />
          Response to an advertisement
        </label>
        <label>
          <input
            type="checkbox"
            checked={data.jobDetails.firstJobSearch.walkIn}
            onChange={(e) => handleFirstJobSearchChange("walkIn", e.target.checked)}
          />
          As walk-in applicant
        </label>
        <label>
          <input
            type="checkbox"
            checked={data.jobDetails.firstJobSearch.recommended}
            onChange={(e) => handleFirstJobSearchChange("recommended", e.target.checked)}
          />
          Recommended by someone
        </label>
        <label>
          <input
            type="checkbox"
            checked={data.jobDetails.firstJobSearch.friends}
            onChange={(e) => handleFirstJobSearchChange("friends", e.target.checked)}
          />
          Information from friends
        </label>
        <label>
          <input
            type="checkbox"
            checked={data.jobDetails.firstJobSearch.schoolPlacement}
            onChange={(e) => handleFirstJobSearchChange("schoolPlacement", e.target.checked)}
          />
          Arranged by school’s job placement officer
        </label>
        <label>
          <input
            type="checkbox"
            checked={data.jobDetails.firstJobSearch.familyBusiness}
            onChange={(e) => handleFirstJobSearchChange("familyBusiness", e.target.checked)}
          />
          Family business
        </label>
        <label>
          <input
            type="checkbox"
            checked={data.jobDetails.firstJobSearch.jobFair}
            onChange={(e) => handleFirstJobSearchChange("jobFair", e.target.checked)}
          />
          Job Fair or Public Employment Service Office (PESO)
        </label>
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
    </div>
  );
};

export default Page3_Employment;
