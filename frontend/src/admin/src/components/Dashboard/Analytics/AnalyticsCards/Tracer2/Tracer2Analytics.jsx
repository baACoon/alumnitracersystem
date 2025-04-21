"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  AreaChart,
  Area,
} from "recharts"
import styles from "./Tracer2Analytics.module.css"

// Color palette for charts
const COLORS = ["#4CC3C8", "#FF6B81", "#FFD166", "#FF9F43", "#6C5CE7", "#C31D3C"]

export default function Tracer2Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const res = await axios.get("http://localhost:5050/dashboard/tracer2/analytics")
        setData(res.data)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch analytics:", err)
        setError("Failed to load analytics data. Please try again later.")
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  // Helper function to format data for charts
  const formatBarData = (obj) => {
    if (!obj) return []
    return Object.entries(obj).map(([name, value]) => ({ name, value }))
  }

  // Helper function to add colors to data
  const addColors = (data) => {
    return data.map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length],
    }))
  }

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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading analytics data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button className={styles.retryButton} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null

  // Format data for advanced degree holders
  const degreeHolderData = [
    { name: "Doctorate", value: data.advancedDegreeHolders?.doctorate || 0, color: COLORS[0] },
    { name: "Masters", value: data.advancedDegreeHolders?.masters || 0, color: COLORS[1] },
  ]

  // Format data for core competencies radar chart
  const coreCompetenciesData = formatBarData(data.jobData?.coreCompetencies || {}).map((item) => ({
    subject: item.name,
    A: item.value,
    fullMark: 100,
  }))

  return (
    <div className={styles.dashboardGrid}>
      {/* ROW 1 */}
      <div className={styles.row1}>
        {/* Respondents Counter */}
        <div className={`${styles.card} ${styles.respondentsCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>TRACER SURVEY FORM RESPONDENTS</h2>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.counterValue}>{data.totalRespondents || 0}</span>
          </div>
        </div>

        {/* Degree Holders Chart */}
        <div className={`${styles.card} ${styles.educationalAttainmentCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>DEGREE HOLDERS (MASTERAL & DOCTORATE)</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={degreeHolderData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {degreeHolderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Job Level Chart */}
        <div className={`${styles.card} ${styles.jobLevelCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>JOB LEVEL</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={addColors(formatBarData(data.jobData?.jobLevel || {}))}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value">
                    {formatBarData(data.jobData?.jobLevel || {}).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2 */}
      <div className={styles.row2}>
        {/* Reasons of Taking the Course */}
        <div className={`${styles.card} ${styles.reasonsCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>REASONS FOR TAKING THE COURSE/PURSUING DEGREES</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={addColors(formatBarData(data.reasons || {}))}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value">
                    {formatBarData(data.reasons || {}).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Curriculum Alignment */}
        <div className={`${styles.card} ${styles.curriculumAlignmentCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>CURRICULUM ALIGNMENT TO JOB</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={addColors(formatBarData(data.jobData?.curriculumAlignment || {}))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {formatBarData(data.jobData?.curriculumAlignment || {}).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3 */}
      <div className={styles.row3}>
        {/* Present Employment Status */}
        <div className={`${styles.card} ${styles.employmentStatusCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>PRESENT EMPLOYMENT STATUS</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={addColors(formatBarData(data.employmentStatus || {}))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    paddingAngle={2}
                    label
                  >
                    {formatBarData(data.employmentStatus || {}).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 4 */}
      <div className={styles.row4}>
        {/* Line of Business */}
        <div className={`${styles.card} ${styles.lineOfBusinessCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>MAJOR LINE OF BUSINESS</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <Treemap
                  data={addColors(formatBarData(data.jobData?.lineOfBusiness || {}))}
                  dataKey="value"
                  nameKey="name"
                  ratio={4 / 3}
                  stroke="#fff"
                  content={({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {
                    const formattedData = addColors(formatBarData(data.jobData?.lineOfBusiness || {}))
                    return (
                      <g>
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          style={{
                            fill: formattedData[index % formattedData.length]?.color || COLORS[0],
                            stroke: "#fff",
                            strokeWidth: 2 / (depth + 1e-10),
                            strokeOpacity: 1 / (depth + 1e-10),
                          }}
                        />
                        {width > 30 && height > 30 && (
                          <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14}>
                            {name}
                          </text>
                        )}
                        {width > 30 && height > 30 && (
                          <text
                            x={x + width / 2}
                            y={y + height / 2 - 7}
                            textAnchor="middle"
                            fill="#fff"
                            fontSize={14}
                            fontWeight="bold"
                          >
                            {formattedData[index % formattedData.length]?.value || 0}
                          </text>
                        )}
                      </g>
                    )
                  }}
                />
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Place of Work */}
        <div className={`${styles.card} ${styles.placeOfWorkCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>PLACE OF WORK</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={addColors(formatBarData(data.jobData?.placeOfWork || {}))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {formatBarData(data.jobData?.placeOfWork || {}).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* How did you find your first job */}
        <div className={`${styles.card} ${styles.findFirstJobCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>HOW DID YOU FIND YOUR FIRST JOB</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={addColors(formatBarData(data.jobData?.firstJobSearch || {}))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {formatBarData(data.jobData?.firstJobSearch || {}).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 5 */}
      <div className={styles.row5}>
        {/* Core Competencies */}
        <div className={`${styles.card} ${styles.coreCompetenciesCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>CORE COMPETENCIES THAT HELPED IN JOB</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart outerRadius={90} data={coreCompetenciesData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Skills" dataKey="A" stroke="#C31D3C" fill="#C31D3C" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* First Job Duration */}
        <div className={`${styles.card} ${styles.firstJobDurationCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>HOW LONG DID YOU STAY IN YOUR FIRST JOB</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={addColors(formatBarData(data.jobData?.firstJobDuration || {}))}
                  margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C31D3C" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#C31D3C" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#C31D3C" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 6 */}
      <div className={styles.row6}>
        {/* Time to Land First Job */}
        <div className={`${styles.card} ${styles.firstJobLandingTimeCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>HOW LONG DID IT TAKE TO LAND YOUR FIRST JOB</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={addColors(formatBarData(data.jobData?.jobLandingTime || {}))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value">
                    {formatBarData(data.jobData?.jobLandingTime || {}).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Curriculum Alignment to Job */}
        <div className={`${styles.card} ${styles.curriculumJobAlignmentCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>WAS YOUR CURRICULUM ALIGNED TO YOUR JOB?</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={addColors(formatBarData(data.jobData?.curriculumAlignment || {}))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    label
                  >
                    {formatBarData(data.jobData?.curriculumAlignment || {}).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
