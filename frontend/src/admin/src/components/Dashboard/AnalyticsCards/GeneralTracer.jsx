import React, { useState } from "react";
import styles from "../Admin-Analytics.module.css";
import { TracerSurveyGraph, EmploymentAlumniGraph, CourseAlignmentGraph } from "../Analytics-Graphs";

const GeneralTracer = () => {

  const tracerData = {
    dates: ["June 19", "June 26", "July 3", "July 10", "July 17"],
    participants: [50, 60, 70, 80, 90],
    total: [60, 70, 80, 90, 100],
  };

  const employmentData = {
    colleges: ["COE", "COS", "CIE", "CLA", "CAFA"],
    employed: [500, 700, 300, 400, 250],
    total: [800, 1000, 600, 700, 500],
  };

  const courseAlignData = {
    level: ["1", "2", "3", "4", "5"],
    employed: [500, 700, 300, 400, 250],

  };

  return (
    <div>
      <div className={styles.analyticsContainer}>
              {/* Tracer Survey Graph */}
              <TracerSurveyGraph tracerData={tracerData} />
            </div>
      
            <div className={styles.analyticsContainer}>
              {/* Employment Alumni Graph */}
              <EmploymentAlumniGraph employmentData={employmentData} />
            </div>
      
            <div className={styles.analyticsContainer}>
              {/* Employment Alumni Graph */}
              <CourseAlignmentGraph courseAlignData={courseAlignData} />
            </div> 
    </div>
  )
}

export default GeneralTracer
