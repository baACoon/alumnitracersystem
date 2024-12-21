import React, { useState } from "react";
import styles from "./Opportunity-List.module.css";

export default function OpportunityList() {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const exampleOpportunities = [
    {
      jobId: "JOB001",
      alumniId: "ALUM123",
      adminId: "ADM001",
      college: "College of Engineering",
      jobTitle: "Software Engineer",
      location: "Manila, Philippines",
      jobStatus: "Open",
      datePublished: "2024-12-15",
      jobDescription: "Develop and maintain software applications.",
      keyResponsibilities: [
        "Design, develop, and test software.",
        "Collaborate with team members to define project requirements.",
        "Maintain and improve existing applications."
      ],
      requirements: [
        "Bachelor's degree in Computer Science or related field.",
        "2+ years of experience in software development.",
        "Proficiency in JavaScript, React, and Node.js."
      ]
    },
    {
      jobId: "JOB002",
      alumniId: "ALUM456",
      adminId: "ADM002",
      college: "College of Science",
      jobTitle: "Data Analyst",
      location: "Cebu, Philippines",
      jobStatus: "Closed",
      datePublished: "2024-11-20",
      jobDescription: "Analyze data to generate business insights.",
      keyResponsibilities: [
        "Collect, process, and analyze data.",
        "Prepare reports and dashboards for stakeholders.",
        "Identify trends and patterns in data."
      ],
      requirements: [
        "Bachelor's degree in Statistics, Mathematics, or related field.",
        "1+ year of experience in data analysis.",
        "Proficiency in Excel, SQL, and Python."
      ]
    },
    {
        jobId: "JOB001",
        alumniId: "ALUM123",
        adminId: "ADM001",
        college: "College of Engineering",
        jobTitle: "Software Engineer",
        location: "Manila, Philippines",
        jobStatus: "Open",
        datePublished: "2024-12-15",
        jobDescription: "Develop and maintain software applications.",
        keyResponsibilities: [
          "Design, develop, and test software.",
          "Collaborate with team members to define project requirements.",
          "Maintain and improve existing applications."
        ],
        requirements: [
          "Bachelor's degree in Computer Science or related field.",
          "2+ years of experience in software development.",
          "Proficiency in JavaScript, React, and Node.js."
        ]
      },
      {
        jobId: "JOB001",
        alumniId: "ALUM123",
        adminId: "ADM001",
        college: "College of Engineering",
        jobTitle: "Software Engineer",
        location: "Manila, Philippines",
        jobStatus: "Open",
        datePublished: "2024-12-15",
        jobDescription: "Develop and maintain software applications.",
        keyResponsibilities: [
          "Design, develop, and test software.",
          "Collaborate with team members to define project requirements.",
          "Maintain and improve existing applications."
        ],
        requirements: [
          "Bachelor's degree in Computer Science or related field.",
          "2+ years of experience in software development.",
          "Proficiency in JavaScript, React, and Node.js."
        ]
      }
  ];

  const handleOpportunityClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const closeModal = () => {
    setSelectedOpportunity(null);
  };

  return (
    <div>
      <h2>Published Opportunities</h2>
      <div className={styles.gridContainer}>
        {exampleOpportunities.map((opportunity, index) => (
          <div
            key={index}
            className={styles.opportunityBox}
            onClick={() => handleOpportunityClick(opportunity)}
          >
            <p><strong>College:</strong> {opportunity.college}</p>
            <p><strong>Job Title:</strong> {opportunity.jobTitle}</p>
            <p><strong>Location:</strong> {opportunity.location}</p>
            <p><strong>Job Status:</strong> {opportunity.jobStatus}</p>
            <p><strong>Date Published:</strong> {opportunity.datePublished}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedOpportunity && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
            <h2>{selectedOpportunity.jobTitle}</h2>
            <p><strong>College:</strong> {selectedOpportunity.college}</p>
            <p><strong>Job ID:</strong> {selectedOpportunity.jobId}</p>
            <p><strong>Alumni ID:</strong> {selectedOpportunity.alumniId}</p>
            <p><strong>Admin ID:</strong> {selectedOpportunity.adminId}</p>
            <p><strong>Location:</strong> {selectedOpportunity.location}</p>
            <p><strong>Job Status:</strong> {selectedOpportunity.jobStatus}</p>
            <p><strong>Date Published:</strong> {selectedOpportunity.datePublished}</p>
            <p><strong>Job Description:</strong> {selectedOpportunity.jobDescription}</p>
            <p><strong>Key Responsibilities:</strong></p>
            <ul>
              {selectedOpportunity.keyResponsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
            <p><strong>Requirements:</strong></p>
            <ul>
              {selectedOpportunity.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
