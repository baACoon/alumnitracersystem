import React, { useState } from "react";
import ReportsContent from "./Reports-Content"
import styles from "./Admin-Reports.module.css";

export default function Reports() {
  return (

      <section className={styles.filterSection} aria-label="Dashboard filters">

       <div className={styles.analyticsContainer}>
          <ReportsContent />
        </div>
      </section>

  );
}

