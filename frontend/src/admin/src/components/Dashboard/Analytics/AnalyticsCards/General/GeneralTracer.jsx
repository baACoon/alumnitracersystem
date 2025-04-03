"use client"
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import styles from "../Tracer1/Tracer1Analytics.module.css"

export default function GeneralTracer() {
  // Sample data for the charts
  const degreeData = [
    { name: "Bachelor", value: 45, color: "#4CC3C8" }, // Teal
    { name: "Masters", value: 30, color: "#FF6B81" }, // Pink
    { name: "Associate", value: 20, color: "#FFD166" }, // Yellow
    { name: "Doctorate", value: 5, color: "#FF9F43" }, // Orange
  ]

  const collegeData = [
    { name: "Engineering", value: 40, color: "#4CC3C8" }, // Teal
    { name: "Business", value: 35, color: "#FF6B81" }, // Pink
    { name: "Arts", value: 20, color: "#FFD166" }, // Yellow
    { name: "Science", value: 5, color: "#FF9F43" }, // Orange
  ]

  const barChartData = [
    { category: "Red", value: 12 },
    { category: "Blue", value: 19 },
    { category: "Yellow", value: 3 },
    { category: "Green", value: 5 },
    { category: "Purple", value: 2 },
    { category: "Orange", value: 3 },
  ]

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.label}>{`${label || payload[0].name}: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={styles.dashboardGrid}>
      {/* First Row: Respondents, Degree, College */}
      <div className={styles.topRow}>
        {/* Respondents Counter */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>NUMBER OF ALUMNI</h2>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.counterValue}>487</span>
          </div>
        </div>

        {/* Degree Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>REGISTERED ALUMNI</h2>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.counterValue}>254</span>
          </div>
        </div>

        {/* College Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>TRACER 2 REPONDENTS</h2>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.counterValue}>157</span>
          </div>
        </div>
      </div>

      {/* Second Row: Year Started, Employment Status */}
      <div className={styles.barRow}>
        {/* Year Started Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>EDUCATIONATION ATTAINTMENT</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="# of Votes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Employment Status Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>EMPLOYMENT STATUS</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="# of Votes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row: Type of Organization, Work Alignment */}
      <div className={styles.barRow}>
        {/* Type of Organization Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>TYPE OF ORGANIZATION</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="# of Votes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Work Alignment Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>WORK ALIGNMENT IN COURSE</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="# of Votes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

