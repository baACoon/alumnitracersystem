"use client"

import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
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
} from "recharts"
import { Search, ChevronDown } from "lucide-react"
import styles from "./GeneralTracer.module.css"

// Color palette for charts
const COLORS = {
  tracer1: "#4CC3C8",
  tracer2: "#C31D3C",
}

const colleges = [
  "College of Engineering",
  "College of Science",
  "College of Industrial Technology",
  "College of Liberal Arts",
  "College of Architecture and Fine Arts"
];

const courses = {
  "College of Engineering": [
    "Bachelor of Science in Civil Engineering",
    "Bachelor of Science in Electrical Engineering",
    "Bachelor of Science in Electronics Engineering",
    "Bachelor of Science in Mechanical Engineering"
  ],
  "College of Science": [
    "Bachelor of Applied Science in Laboratory Technology",
    "Bachelor of Science in Computer Science"
  ],
  "College of Industrial Technology": [
    "Bachelor of Engineering Technology",
    "Bachelor of Technical Teacher Education"
  ],
  "College of Liberal Arts": [
    "Bachelor of Arts in Communication",
    "Bachelor of Arts in Political Science"
  ],
  "College of Architecture and Fine Arts": [
    "Bachelor of Science in Architecture",
    "Bachelor of Fine Arts"
  ]
};

// Define available batch years, colleges, and courses (similar to AlumniFilters)
const batchYears = Array.from({ length: 10 }, (_, i) => 2016 + i);
export default function GeneralTracer() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [availableFilters, setAvailableFilters] = useState({ batchYears: [], colleges: [], courses: [] });
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    batchYear: "",
    college: "",
    course: ""
  })
  const [activeFilters, setActiveFilters] = useState([])

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      const updated = { ...prev, [type]: value }

      if (type === "batchYear") {
        updated.college = ""
        updated.course = ""
      } else if (type === "college") {
        updated.course = ""
      }

      setActiveFilters(Object.entries(updated).filter(([_, val]) => val).map(([t, v]) => ({ type: t, value: v })))
      return updated
    })
  }
  const resetFilters = () => {
    setFilters({ batchYear: "", college: "", course: "" })
    setActiveFilters([])
    setShowFilters(false)
  }

  const removeFilter = (type) => {
    handleFilterChange(type, "")
  }

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams()
        if (filters.batchYear) queryParams.append('batch', filters.batchYear)
        if (filters.college) queryParams.append('college', filters.college)
        if (filters.course) queryParams.append('course', filters.course)
  
        const url = `http://localhost:5050/dashboard/tracer/comparison${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        const res = await fetch(url)
        const json = await res.json()
        setData(json)
        
        // Update available filters from the response
        if (json.filters) {
          setAvailableFilters({
            batchYears: Object.keys(json.filters.batchYearToColleges || {}).map(Number).sort((a, b) => b - a),
            collegeToCourses: json.filters.collegeToCourses || {},
            batchYearToColleges: json.filters.batchYearToColleges || {}
          })
        }
      } catch (err) {
        console.error("Failed to fetch comparison data:", err)
        setError("Failed to load comparison data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
  
    fetchComparisonData()
  }, [filters])

  const formatComparisonData = (dataObj) => {
    if (!dataObj) return []
    return Object.keys(dataObj.tracer1 || {}).map((key) => ({
      name: key,
      "Tracer 1": dataObj.tracer1[key] || 0,
      "Tracer 2": dataObj.tracer2[key] || 0,
    }))
  }

  if (loading) return <div className={styles.loadingContainer}><div className={styles.loadingSpinner}></div><p>Loading comparison data...</p></div>
  if (error) return <div className={styles.errorContainer}><p>{error}</p><button onClick={() => window.location.reload()}>Retry</button></div>
  if (!data) return null

  const availableBatchYears = availableFilters.batchYears.sort((a, b) => b - a);
  const availableColleges = availableFilters.colleges;
  const availableCourses = availableFilters.courses;
  

  // Calculate change percentages for summary
  const calculateChange = (tracer1Value, tracer2Value) => {
    const change = tracer2Value - tracer1Value
    const percentChange = tracer1Value !== 0 ? (change / tracer1Value) * 100 : 0
    return {
      change,
      percentChange: Number.parseFloat(percentChange.toFixed(1)),
      increased: change > 0,
    }
  }

  const generateSummaries = (data) => {
    if (!data || !data.employmentRate || !data.curriculumAlignment || !data.job_level) {
      return {
        employment: { text: "" },
        alignment: { text: "" },
        job_level: { text: "" },
        overall: { text: "" }
      }
    }  
    const employedT1 = data.employmentRate?.tracer1?.Employed || 0
    const employedT2 = data.employmentRate?.tracer2?.Employed || 0
    const employmentChange = calculateChange(employedT1, employedT2)
  
    const safeSum = (obj, keys) => keys.reduce((sum, key) => sum + (obj?.[key] || 0), 0)
  
    const highAlignmentT1 = safeSum(data.curriculumAlignment.tracer1, [
      "Very much aligned",
      "Aligned",
      "Averagely Aligned"
    ])
    const highAlignmentT2 = safeSum(data.curriculumAlignment.tracer2, [
      "Very much aligned",
      "Aligned",
      "Averagely Aligned"
    ])
    const alignmentChange = calculateChange(highAlignmentT1, highAlignmentT2)
  
    const midUpT1 =
      (data.job_level?.tracer1?.["Mid-level"] || 0) +
      (data.job_level?.tracer1?.["Senior/Executive"] || 0)
    const midUpT2 =
      (data.job_level?.tracer2?.["Mid-level"] || 0) +
      (data.job_level?.tracer2?.["Senior/Executive"] || 0)
    const levelChange = calculateChange(midUpT1, midUpT2)
  
    return {
      employment: {
        text:
          employmentChange.change > 0
            ? `The employment rate has increased by ${employmentChange.percentChange}% over the 2-year period, from ${employedT1}% to ${employedT2}%. This positive trend suggests graduates are finding better job opportunities as they gain more experience.`
            : employmentChange.change < 0
            ? `The employment rate has decreased by ${Math.abs(employmentChange.percentChange)}%, from ${employedT1}% to ${employedT2}%. This trend suggests some graduates may be facing challenges in maintaining employment.`
            : `The employment rate has remained consistent at ${employedT1}%. This suggests stable opportunities for graduates over time.`,
      },
      alignment: {
        text:
          alignmentChange.change > 0
            ? `The percentage of graduates reporting high curriculum alignment has increased from ${highAlignmentT1}% to ${highAlignmentT2}%. This implies that the curriculum is becoming more aligned with industry needs.`
            : alignmentChange.change < 0
            ? `The percentage of graduates reporting high curriculum alignment has decreased from ${highAlignmentT1}% to ${highAlignmentT2}%. This may indicate a need to update or re-align the curriculum.`
            : `The percentage of graduates reporting high curriculum alignment remained the same at ${highAlignmentT1}%. This suggests consistent curriculum relevance.`,
      },
      job_level: {
        text:
          levelChange.change > 0
            ? `The percentage of graduates in mid or executive level positions has increased from ${midUpT1}% to ${midUpT2}%, indicating strong career progression.`
            : levelChange.change < 0
            ? `The percentage of graduates in mid or executive level positions has decreased from ${midUpT1}% to ${midUpT2}%. This might suggest slower career growth.`
            : `The percentage of graduates in mid or executive level positions remained steady at ${midUpT1}%. This indicates stable career levels over time.`,
      },
      overall: {
        text: `Overall, the data ${
          employmentChange.change === 0 && levelChange.change === 0 && alignmentChange.change === 0
            ? "remained stable across all key metrics"
            : employmentChange.increased && levelChange.increased && alignmentChange.increased
            ? "shows strong positive trends across all areas"
            : "shows mixed results depending on the category"
        }. ${
          employmentChange.increased && levelChange.increased
            ? "Graduates are both finding employment and advancing in their careers."
            : ""
        } ${
          alignmentChange.increased
            ? "Curriculum relevance also appears to be improving."
            : alignmentChange.change === 0
            ? "Curriculum relevance remains steady."
            : ""
        }`,
      },
    }
  }

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.label}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}%`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading comparison data...</p>
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

  const summaries = generateSummaries(data)

  return (
    <div className={styles.comparisonDashboard}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Tracer Survey Comparison</h1>
        <p className={styles.dashboardDescription}>
          2-Year Gap Analysis
        </p>
      </div>

       {/* Filter Section */}
       <div className={styles.filterSection}>
        <button className={styles.filterButton} onClick={() => setShowFilters(!showFilters)}>
          Filters <ChevronDown size={16} />
        </button>

        {showFilters && (
          <div className={styles.filterPopover}>
            <div className={styles.filterGroup}>
              <label>Batch Year</label>
              <select value={filters.batchYear} onChange={(e) => handleFilterChange("batchYear", e.target.value) }className={styles.filterSelect}>
                <option value="">Select batch</option>
                {availableFilters.batchYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label>College</label>
              <select 
                value={filters.college} 
                onChange={(e) => handleFilterChange("college", e.target.value)} 
                disabled={!filters.batchYear} className={styles.filterSelect}
              >
                <option value="">Select college</option>
                {filters.batchYear && availableFilters.batchYearToColleges[filters.batchYear]?.map(college => (
                  <option key={college} value={college}>{college}</option>
                ))} 
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label>Course</label>
              <select 
                value={filters.course} 
                onChange={(e) => handleFilterChange("course", e.target.value)} 
                disabled={!filters.college}
              >
                <option value="">Select course</option>
                {filters.college && availableFilters.collegeToCourses[filters.college]?.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            <div className={styles.filterActions}>
              <button className={styles.resetButton} onClick={resetFilters}>Reset</button>
              <button className={styles.resetButton} onClick={() => setShowFilters(false)}>Close</button>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className={styles.activeFiltersBar}>
          <div className={styles.activeFiltersList}>
            {activeFilters.map((filter) => (
              <div 
                key={filter.type} 
                className={styles.filterBadgeOutline}
                title={
                  filter.type === "batchYear" ? `Year: ${filter.value}` :
                  filter.type === "college" ? `College: ${filter.value}` :
                  `Course: ${filter.value}`
                }
              >
                {filter.type === "batchYear" && `Year: ${filter.value}`}
                {filter.type === "college" && `College: ${filter.value}`}
                {filter.type === "course" && `Course: ${filter.value}`}
                <button className={styles.removeFilterButton} onClick={() => removeFilter(filter.type)}>
                  ×
                </button>
              </div>
            ))}
            {activeFilters.length > 0 && (
              <button
                className={styles.clearAllButton}
                onClick={resetFilters}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}

      <div className={styles.overallSummary}>
        <h2 className={styles.summaryTitle}>Overall Analysis</h2>
        <p className={styles.summaryText}>
          {summaries?.overall?.text || "No overall summary available for the selected filters."}
        </p>
      </div>

      {/* Employment Rate Comparison */}
        <div className={styles.comparisonSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Employment Rate Comparison</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.chartContainer}>
              {formatComparisonData(data.employmentRate).length === 0 ? (
                <p className={styles.noData}>No data available for Employment Rate Comparison.</p>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={formatComparisonData(data.employmentRate)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="Tracer 1" fill={COLORS.tracer1} name="Initial Survey" />
                    <Bar dataKey="Tracer 2" fill={COLORS.tracer2} name="After 2 Years" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className={styles.summaryContainer}>
              <h3 className={styles.insightTitle}>Key Insights</h3>
              <p className={styles.insightText}>
                {summaries?.employment?.text || "No employment data insights available for the selected filters."}
              </p>
            </div>
          </div>
        </div>

        {/* Curriculum Alignment Comparison */}
        <div className={styles.comparisonSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Curriculum Alignment Comparison</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.chartContainer}>
              {formatComparisonData(data.curriculumAlignment).length === 0 ? (
                <p className={styles.noData}>No data available for Curriculum Alignment Comparison.</p>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart outerRadius={150} data={formatComparisonData(data.curriculumAlignment)}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Initial Survey"
                      dataKey="Tracer 1"
                      stroke={COLORS.tracer1}
                      fill={COLORS.tracer1}
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="After 2 Years"
                      dataKey="Tracer 2"
                      stroke={COLORS.tracer2}
                      fill={COLORS.tracer2}
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className={styles.summaryContainer}>
              <h3 className={styles.insightTitle}>Key Insights</h3>
              <p className={styles.insightText}>
                {summaries?.alignment?.text || "No curriculum alignment insights available for the selected filters."}
              </p>
            </div>
          </div>
        </div>

        {/* Job Level Comparison */}
        <div className={styles.comparisonSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Job Level Progression</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.chartContainer}>
              {formatComparisonData(data.job_level).length === 0 ? (
                <p className={styles.noData}>No data available for Job Level Comparison.</p>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={formatComparisonData(data.job_level)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="Tracer 1" fill={COLORS.tracer1} name="Initial Survey" />
                    <Bar dataKey="Tracer 2" fill={COLORS.tracer2} name="After 2 Years" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className={styles.summaryContainer}>
              <h3 className={styles.insightTitle}>Key Insights</h3>
              <p className={styles.insightText}>
                {summaries?.job_level?.text || "No job level progression insights available for the selected filters."}
              </p>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className={styles.conclusionSection}>
          <h2 className={styles.conclusionTitle}>Conclusion</h2>
          <p className={styles.conclusionText}>
            {data.employmentRate?.tracer2?.Employed > data.employmentRate?.tracer1?.Employed
              ? "Graduates are improving their employment prospects"
              : "Graduates may be facing employment challenges"}{" "}
            and{" "}
            {((data.job_level?.tracer2?.["Mid-level"] || 0) + (data.job_level?.tracer2?.["Senior/Executive"] || 0)) >
            ((data.job_level?.tracer1?.["Mid-level"] || 0) + (data.job_level?.tracer1?.["Senior/Executive"] || 0))
              ? "advancing in their careers."
              : "maintaining similar job levels."}
            Curriculum trends suggest that the knowledge acquired during education{" "}
            {((data.curriculumAlignment?.tracer2?.["Very much aligned"] || 0) + (data.curriculumAlignment?.tracer2?.["Aligned"] || 0)) >
            ((data.curriculumAlignment?.tracer1?.["Very much aligned"] || 0) + (data.curriculumAlignment?.tracer1?.["Aligned"] || 0))
              ? "remains highly relevant."
              : "may require curriculum updates for better career growth."}
          </p>

          <p className={styles.recommendationText}>
            <strong>Recommendations:</strong>{" "}
            {((data.employmentRate?.tracer2?.Employed || 0) > (data.employmentRate?.tracer1?.Employed || 0)) &&
            (((data.curriculumAlignment?.tracer2?.["Very much aligned"] || 0) + (data.curriculumAlignment?.tracer2?.["Aligned"] || 0)) >
            ((data.curriculumAlignment?.tracer1?.["Very much aligned"] || 0) + (data.curriculumAlignment?.tracer1?.["Aligned"] || 0)))
              ? "Continue the current curriculum structure while adapting to emerging trends."
              : "Consider curriculum improvements to better align with evolving industry needs."}
            {activeFilters.length > 0 && ` These insights are specific to the filtered group of alumni.`}
          </p>
        </div>
    </div>
  )
}