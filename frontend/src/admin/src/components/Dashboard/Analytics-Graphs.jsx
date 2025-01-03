import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./Analytics-Graphs.module.css"
import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Tracer Survey Graph Component
export function TracerSurveyGraph({ tracerData }) {
  const tracerChartData = {
    labels: tracerData.dates, // Tracer survey dates
    datasets: [
      {
        label: "Participants",
        data: tracerData.participants,
        backgroundColor: "rgba(235, 81, 54, 0.8)", // Highlighted participants
      },
      {
        label: "Total Alumni",
        data: tracerData.total,
        backgroundColor: "rgba(235, 96, 54, 0.3)", // Low-opacity bar for totals
      },
    ],
  };

  const tracerOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tracer Survey Participation",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Participants",
        },
      },
      x: {
        title: {
          display: true,
          text: "Survey Dates",
        },
      },
    },
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>BATCH 2024</h1>
        <h2>Tracer Survey Form Respondents</h2>
      </div>
      <div className={styles.details}>
      </div>
      <div className={styles.chart}>
         <Bar data={tracerChartData} options={tracerOptions}  />
      </div>
    </div>
  );

}

// Employment Alumni Graph Component
export function EmploymentAlumniGraph({ employmentData }) {
  const employmentChartData = {
    labels: employmentData.colleges, // College names
    datasets: [
      {
        label: "Employed Alumni",
        data: employmentData.employed, // Number of employed
        backgroundColor: "rgba(75, 192, 182, 0.8)", // Highlighted bar color
      },
      {
        label: "Total Alumni",
        data: employmentData.total, // Total alumni
        backgroundColor: "rgba(75, 192, 192, 0.3)", // Low-opacity bar color
      },
    ],
  };

  const employmentOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Employed Alumni by College",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Alumni",
        },
      },
      x: {
        title: {
          display: true,
          text: "Colleges",
        },
      },
    },
  };
 
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>BATCH 2024</h1>
        <h2>Employed Alumni in each Colleges</h2>
      </div>
      <div className={styles.details}>
      </div>
      <div className={styles.chart}>
         <Bar data={employmentChartData} options={employmentOptions} />
      </div>
    </div>
  );
}

// Employment Alumni Graph Component
export function CourseAlignmentGraph({ courseAlignData }) {
  const coursealignChartData = {
    labels: courseAlignData.level, // College names
    datasets: [
      {
        label: "Employed Alumni",
        data: courseAlignData.employed, // Number of employed
        backgroundColor: "rgba(75, 192, 182, 0.8)", // Highlighted bar color
      },
      {
        label: "Total Alumni",
        data: courseAlignData.total, // Total alumni
        backgroundColor: "rgba(75, 192, 192, 0.3)", // Low-opacity bar color
      },
    ],
  };

  const courseAlignOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Employed Alumni by College",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Alumni",
        },
      },
      x: {
        title: {
          display: true,
          text: "Colleges",
        },
      },
    },
  };
 
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>BATCH 2024</h1>
        <h2>Course Alignment</h2>
      </div>
      <div className={styles.details}>
      </div>
      <div className={styles.chart}>
         <Bar data={coursealignChartData} options={courseAlignOptions} />
      </div>
    </div>
  );
}
