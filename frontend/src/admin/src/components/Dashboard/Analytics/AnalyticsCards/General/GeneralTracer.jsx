"use client"

import { useEffect, useState } from "react"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  BarChart,
  Bar,
  Cell,
  ComposedChart,
} from "recharts"
import styles from "./GeneralTracer.module.css"

// Color palette for charts
const COLORS = {
  primary: "#4CC3C8",
  secondary: "#C31D3C",
  veryAligned: "#2ecc71", // Green
  aligned: "#4CC3C8", // Teal
  averagelyAligned: "#f39c12", // Orange
  somehowAligned: "#f1c40f", // Yellow
  unaligned: "#e74c3c", // Red
  unspecified: "#95a5a6", // Gray
}

// Define colleges and courses data
const collegesAndCourses = {
  "College of Engineering": [
    "Bachelor of Science in Civil Engineering",
    "Bachelor of Science in Electrical Engineering",
    "Bachelor of Science in Electronics Engineering",
    "Bachelor of Science in Mechanical Engineering",
  ],
  "College of Science": [
    "Bachelor of Applied Science in Laboratory Technology",
    "Bachelor of Science in Computer Science",
    "Bachelor of Science in Environmental Science",
    "Bachelor of Science in Information System",
    "Bachelor of Science in Information Technology",
  ],
  "College of Industrial Education": [
    "Bachelor of Science Industrial Education Major in Information and Communication Technology",
    "Bachelor of Science Industrial Education Major in Home Economics",
    "Bachelor of Science Industrial Education Major in Industrial Arts",
    "Bachelor of Technical Vocational Teachers Education Major in Animation",
    "Bachelor of Technical Vocational Teachers Education Major in Automotive",
    "Bachelor of Technical Vocational Teachers Education Major in Beauty Care and Wellness",
    "Bachelor of Technical Vocational Teachers Education Major in Computer Programming",
    "Bachelor of Technical Vocational Teachers Education Major in Electrical",
    "Bachelor of Technical Vocational Teachers Education Major in Electronics",
    "Bachelor of Technical Vocational Teachers Education Major in Food Service Management",
    "Bachelor of Technical Vocational Teachers Education Major in Fashion and Garment",
    "Bachelor of Technical Vocational Teachers Education Major in Heat Ventillation & Air Conditioning",
  ],
  "College of Liberal Arts": [
    "Bachelor of Science in Business Management Major in Industrial Management",
    "Bachelor of Science in Entreprenuership",
    "Bachelor of Science Hospitality Management",
  ],
  "College of Architecture and Fine Arts": [
    "Bachelor of Science in Architecture",
    "Bachelor of Fine Arts",
    "Bachelor of Graphic Technology Major in Architecture Technology",
    "Bachelor of Graphic Technology Major in Industrial Design",
    "Bachelor of Graphic Technology Major in Mechanical Drafting Technology",
  ],
  "College of Industrial Technology": [
    "Bachelor of Science in Food Technology",
    "Bachelor of Engineering Technology Major in Civil Technology",
    "Bachelor of Engineering Technology Major in Electrical Technology",
    "Bachelor of Engineering Technology Major in Electronics Technology",
    "Bachelor of Engineering Technology Major in Computer Engineering Technology",
    "Bachelor of Engineering Technology Major in Instrumentation and Control Technology",
    "Bachelor of Engineering Technology Major in Mechanical Technology",
    "Bachelor of Engineering Technology Major in Mechatronics Technology",
    "Bachelor of Engineering Technology Major in Railway Technology",
    "Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Automative Technology",
    "Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Heating Ventilation & Airconditioning/Refrigiration Technology",
    "Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Power Plant Technology",
    "Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Welding Technology",
    "Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Dies and Moulds Technology",
    "Bachelor of Technology in Apparel and Fashion",
    "Bachelor of Technology in Culinary Technology",
    "Bachelor of Technology in Print Media Technology",
  ],
}

export default function GeneralTracer() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [alignmentData, setAlignmentData] = useState([])
  const [jobSearchData, setJobSearchData] = useState([]);

  const [availableFilters, setAvailableFilters] = useState({
    batchYears: [],
    colleges: Object.keys(collegesAndCourses),
    collegeToCourses: collegesAndCourses,
  })
  const [showFilters, setShowFilters] = useState(true)
  const [activeFilters, setActiveFilters] = useState([])
  const [filters, setFilters] = useState({
    yearFrom: "",
    yearTo: "",
    college: "",
    course: "",
  })
  const [pendingFilters, setPendingFilters] = useState({
    yearFrom: "",
    yearTo: "",
    college: "",
    course: "",
  })

  const handleFilterChange = (type, value) => {
    setPendingFilters((prev) => {
      const updated = { ...prev, [type]: value }

      // Reset dependent filters when parent changes
      if (type === "yearFrom" || type === "yearTo") {
        updated.college = ""
        updated.course = ""
      } else if (type === "college") {
        updated.course = ""
      }

      return updated
    })
  }

  const generateDummyJobSearchData = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 5}, (_, i) => currentYear - i - 1).reverse();
    
    return years.map(year => ({
      batch: year.toString(),
      averageMonths: Math.floor(Math.random() * 12) + 1, // Random 1-12 months
      graduates: Math.floor(Math.random() * 50) + 20 // Random 20-70 graduates
    }));
  };

  const applyFilters = () => {
    setFilters(pendingFilters)

    // Update active filters display
    setActiveFilters(
      Object.entries(pendingFilters)
        .filter(([_, val]) => val)
        .map(([t, v]) => ({
          type: t,
          value: v,
          label:
            t === "yearFrom"
              ? `From ${v}`
              : t === "yearTo"
                ? `To ${v}`
                : t === "college"
                  ? `College: ${v}`
                  : `Course: ${v}`,
        })),
    )
  }

  const resetFilters = () => {
    setPendingFilters({
      yearFrom: "",
      yearTo: "",
      college: "",
      course: "",
    })
    setFilters({
      yearFrom: "",
      yearTo: "",
      college: "",
      course: "",
    })
    setActiveFilters([])
  }

  const removeFilter = (type) => {
    const updatedFilters = { ...filters, [type]: "" }
    setFilters(updatedFilters)
    setPendingFilters(updatedFilters)

    setActiveFilters(
      Object.entries(updatedFilters)
        .filter(([_, val]) => val)
        .map(([t, v]) => ({
          type: t,
          value: v,
          label:
            t === "yearFrom"
              ? `From ${v}`
              : t === "yearTo"
                ? `To ${v}`
                : t === "college"
                  ? `College: ${v}`
                  : `Course: ${v}`,
        })),
    )
  }

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null) // Reset error state

        const queryParams = new URLSearchParams()
        if (filters.yearFrom) queryParams.append("yearFrom", filters.yearFrom)
        if (filters.yearTo) queryParams.append("yearTo", filters.yearTo)
        if (filters.college) queryParams.append("college", filters.college)
        if (filters.course) queryParams.append("course", filters.course)

        // Fetch both endpoints in parallel
        const [employmentRes, alignmentRes] = await Promise.all([
          fetch(`http://localhost:5050/dashboard/tracer/employment-by-batch?${queryParams}`),
          fetch(`http://localhost:5050/dashboard/tracer/work-alignment?${queryParams}`),
        ])

        // Check both responses
        if (!employmentRes.ok || !alignmentRes.ok) {
          throw new Error(employmentRes.ok ? await alignmentRes.text() : await employmentRes.text())
        }

        const [employmentJson, alignmentJson] = await Promise.all([employmentRes.json(), alignmentRes.json()])

        if (!isMounted) return // Prevent state updates if unmounted

        // Validate responses
        if (!employmentJson || !alignmentJson) {
          throw new Error("Invalid data received from server")
        }

        setData(employmentJson)
        setAlignmentData(alignmentJson.alignmentData || [])

        // Update available filters
        if (employmentJson.filters?.batchYears) {
          setAvailableFilters((prev) => ({
            ...prev,
            batchYears: employmentJson.filters.batchYears,
          }))
        }
      } catch (err) {
        if (!isMounted) return
        console.error("Fetch error:", err)
        setError(err.message || "Failed to load data")
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false // Cleanup function
    }
  }, [filters])

  // Helper functions for calculations
  const calculateAverageEmployment = () => {
    if (!data?.employmentByBatch) return 0
    const rates = Object.values(data.employmentByBatch)
    return (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(1)
  }

  const calculateAlignmentPercentage = (patterns) => {
    if (alignmentData.length === 0) return 0
    const regex = new RegExp(patterns.split("|").join("|"))
    const total = alignmentData.reduce((sum, item) => sum + item.count, 0)
    const matched = alignmentData
      .filter((item) => regex.test(item.alignment))
      .reduce((sum, item) => sum + item.count, 0)
    return ((matched / total) * 100).toFixed(1)
  }

  const formatBatchComparisonData = (data) => {
    if (!data || !data.employmentByBatch) return []

    // Sort batches chronologically
    const employmentData = Object.entries(data.employmentByBatch)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([batch, rate]) => ({
        name: batch,
        "Employment Rate": rate,
      }))

    // If we have alignment data, add it to the employment data
    if (alignmentData.length > 0) {
      // Calculate aligned and unaligned counts per batch
      const alignmentByBatch = {}

      // Initialize with zeros
      employmentData.forEach((item) => {
        alignmentByBatch[item.name] = {
          alignedCount: 0,
          unalignedCount: 0,
        }
      })

      // This is a simplified approach - in a real app, you would fetch actual alignment data by batch
      // For this example, we'll distribute the alignment data across batches
      const batchCount = employmentData.length
      if (batchCount > 0) {
        const alignedTotal = alignmentData
          .filter((item) =>
            ["Very much aligned", "Aligned", "Averagely Aligned", "Somehow Aligned"].includes(item.alignment),
          )
          .reduce((sum, item) => sum + item.count, 0)

        const unalignedTotal = alignmentData
          .filter((item) => item.alignment === "Unaligned")
          .reduce((sum, item) => sum + item.count, 0)

        // Distribute proportionally across batches
        employmentData.forEach((item, index) => {
          // Create a distribution pattern (more recent years have more data)
          const factor = (index + 1) / batchCount
          item.alignedCount = Math.round((alignedTotal * factor) / batchCount)
          item.unalignedCount = Math.round((unalignedTotal * factor) / batchCount)
        })
      }
    }

    return employmentData
  }

  const generateSummaries = (data) => {
    if (!data || !data.employmentByBatch) {
      return {
        employment: { text: "" },
        overall: { text: "" },
      }
    }

    const batches = Object.keys(data.employmentByBatch)
      .map(Number)
      .sort((a, b) => a - b)
      .map(String)

    if (batches.length === 0) {
      return {
        employment: { text: "No employment data available for the selected filters." },
        overall: { text: "No data available for analysis." },
      }
    }

    const rates = batches.map((batch) => data.employmentByBatch[batch])
    const highestBatch = batches[rates.indexOf(Math.max(...rates))]
    const lowestBatch = batches[rates.indexOf(Math.min(...rates))]
    const averageRate = (rates.reduce((sum, rate) => sum + rate, 0) / rates.length).toFixed(1)

    let trendText = ""
    if (batches.length > 1) {
      const firstRate = data.employmentByBatch[batches[0]]
      const lastRate = data.employmentByBatch[batches[batches.length - 1]]
      const trend = lastRate - firstRate

      if (trend > 0) {
        trendText = `There's an overall increasing trend of ${Math.abs(trend).toFixed(1)} percentage points from ${batches[0]} to ${batches[batches.length - 1]}.`
      } else if (trend < 0) {
        trendText = `There's an overall decreasing trend of ${Math.abs(trend).toFixed(1)} percentage points from ${batches[0]} to ${batches[batches.length - 1]}.`
      } else {
        trendText = "Employment rates have remained stable across the selected years."
      }
    }

    return {
      employment: {
        text: `The employment rate across selected batches ranges from ${Math.min(...rates)}% to ${Math.max(...rates)}%, with an average of ${averageRate}%. 
        The highest employment rate was in ${highestBatch} (${data.employmentByBatch[highestBatch]}%), while the lowest was in ${lowestBatch} (${data.employmentByBatch[lowestBatch]}%). ${trendText}`,
      },
      overall: {
        text: `Analysis of ${batches.length} batch${batches.length !== 1 ? "es" : ""} ${filters.college ? `from ${filters.college}` : ""} ${filters.course ? `(${filters.course})` : ""} shows ${averageRate}% average employment rate. 
        ${trendText} ${batches.length > 1 ? "This could indicate changing job market conditions or improvements in the university's career preparation programs." : ""}`,
      },
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <div className={styles.tooltipHeader}>
            Graduation: <strong>{label}</strong>
          </div>
          {payload.map((entry, index) => (
            <div key={index} className={styles.tooltipItem}>
              <span className={styles.tooltipBullet} style={{ backgroundColor: entry.color }}></span>
              {entry.name}:{" "}
              <strong>
                {entry.value}
                {entry.name === "Employment Rate" ? "%" : ""}
              </strong>
            </div>
          ))}
          {filters.college && (
            <div className={styles.tooltipItem}>
              <span className={styles.tooltipBullet} style={{ backgroundColor: COLORS.secondary }}></span>
              College: <strong>{filters.college}</strong>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  const CustomJobSearchTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipHeader}>Batch: {label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color }}>
              {item.name}: <strong>{item.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading data...</p>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>Error: {error}</p>
        <button
          className={styles.retryButton}
          onClick={() => {
            setError(null)
            setLoading(true)
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null

  const summaries = generateSummaries(data)
  const employmentData = formatBatchComparisonData(data)

  return (
    <div className={styles.comparisonDashboard}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Employment Rate by Batch</h1>
        <p className={styles.dashboardDescription}>
          Compare employment rates across different graduation years, colleges, and courses
        </p>
      </div>

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.filterContainer}>
          <div className={styles.filterHeader}>
            <h3 className={styles.filterTitle}>Filter Data</h3>
          </div>
          <div className={styles.filterContent}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Year From</label>
              <select
                className={styles.filterSelect}
                value={pendingFilters.yearFrom}
                onChange={(e) => handleFilterChange("yearFrom", e.target.value)}
              >
                <option value="">Select year</option>
                {availableFilters.batchYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Year To</label>
              <select
                className={styles.filterSelect}
                value={pendingFilters.yearTo}
                onChange={(e) => handleFilterChange("yearTo", e.target.value)}
                disabled={!pendingFilters.yearFrom}
              >
                <option value="">Select year</option>
                {availableFilters.batchYears
                  .filter((year) => !pendingFilters.yearFrom || year >= pendingFilters.yearFrom)
                  .map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>College</label>
              <select
                className={styles.filterSelect}
                value={pendingFilters.college}
                onChange={(e) => handleFilterChange("college", e.target.value)}
              >
                <option value="">Select college</option>
                {availableFilters.colleges.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Course</label>
              <select
                className={styles.filterSelect}
                value={pendingFilters.course}
                onChange={(e) => handleFilterChange("course", e.target.value)}
                disabled={!pendingFilters.college}
              >
                <option value="">Select course</option>
                {pendingFilters.college &&
                  availableFilters.collegeToCourses[pendingFilters.college]?.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
              </select>
            </div>
            <div className={styles.filterActions}>
              <button className={styles.resetButton} onClick={resetFilters}>
                Reset Filters
              </button>
              <button className={styles.applyButton} onClick={applyFilters}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className={styles.activeFiltersBar}>
          <div className={styles.activeFiltersList}>
            <span style={{ marginRight: "8px", fontWeight: "500", color: "#666" }}>Active filters:</span>
            {activeFilters.map((filter, index) => (
              <div key={index} className={styles.filterBadgeOutline}>
                {filter.label}
                <button className={styles.removeFilterButton} onClick={() => removeFilter(filter.type)}>
                  ×
                </button>
              </div>
            ))}
            <button className={styles.clearAllButton} onClick={resetFilters}>
              Clear All
            </button>
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
          <h2 className={styles.sectionTitle}>
            {filters.college ? `${filters.college} ` : ""}
            {filters.course ? `(${filters.course}) ` : ""}
            Employment Trends
          </h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.chartContainer}>
            {employmentData.length === 0 ? (
              <p className={styles.noData}>No employment data available for the selected filters.</p>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={employmentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#666" }} axisLine={{ stroke: "#ccc" }} />
                  <YAxis
                    yAxisId="left"
                    domain={[0, 100]}
                    tick={{ fill: "#666" }}
                    axisLine={{ stroke: "#ccc" }}
                    label={{
                      value: "Employment Rate (%)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, "dataMax + 10"]}
                    tick={{ fill: "#666" }}
                    axisLine={{ stroke: "#ccc" }}
                    label={{
                      value: "Graduate Count",
                      angle: 90,
                      position: "insideRight",
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    wrapperStyle={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "10px",
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="Employment Rate"
                    fill="url(#colorFill)"
                    strokeWidth={0}
                    name="Employment Rate Area"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Employment Rate"
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    name="Employment Rate"
                    dot={{
                      fill: COLORS.primary,
                      strokeWidth: 2,
                      r: 4,
                      stroke: "#fff",
                    }}
                    activeDot={{
                      r: 6,
                      stroke: "#fff",
                      strokeWidth: 2,
                      fill: COLORS.primary,
                    }}
                  />
                  {alignmentData.length > 0 && (
                    <Bar
                      yAxisId="right"
                      dataKey="alignedCount"
                      name="Aligned Graduates"
                      fill={COLORS.veryAligned}
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                  {alignmentData.length > 0 && (
                    <Bar
                      yAxisId="right"
                      dataKey="unalignedCount"
                      name="Unaligned Graduates"
                      fill={COLORS.unaligned}
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                </ComposedChart>
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

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {filters.college ? `${filters.college} ` : ""}
            {filters.course ? `(${filters.course}) ` : ""}
            Curriculum Alignment
          </h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.chartContainer}>
            {alignmentData.length === 0 ? (
              <div className={styles.noData}>
                {error ? (
                  <>
                    <p>Error loading alignment data:</p>
                    <p className={styles.errorText}>{error}</p>
                  </>
                ) : (
                  <p>No alignment data available for selected filters</p>
                )}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={alignmentData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="alignment" type="category" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [`${value} graduates`, "Count"]}
                    labelFormatter={(label) => `Alignment: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="count" name="Number of Graduates" radius={[0, 4, 4, 0]}>
                    {alignmentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.alignment === "Very much aligned"
                            ? "#2ecc71"
                            : // Green
                              entry.alignment === "Aligned"
                              ? "#4CC3C8"
                              : // Teal
                                entry.alignment === "Averagely Aligned"
                                ? "#f39c12"
                                : // Orange
                                  entry.alignment === "Somehow Aligned"
                                  ? "#f1c40f"
                                  : // Yellow (new)
                                    entry.alignment === "Unaligned"
                                    ? "#e74c3c"
                                    : // Red
                                      "#95a5a6" // Gray (not specified)
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className={styles.summaryContainer}>
            <h3 className={styles.insightTitle}>Key Insights</h3>
            <p className={styles.insightText}>
              {alignmentData.length > 0 ? (
                <>
                  {Math.round(
                    ((alignmentData.find((a) => a.alignment === "Very much aligned")?.count ||
                      0 + alignmentData.find((a) => a.alignment === "Aligned")?.count ||
                      0 + alignmentData.find((a) => a.alignment === "Averagely Aligned")?.count ||
                      0 + alignmentData.find((a) => a.alignment === "Somehow Aligned")?.count ||
                      0) /
                      alignmentData.reduce((sum, item) => sum + item.count, 0)) *
                      100,
                  )}
                  % of graduates report some level of alignment with their studies.
                  {alignmentData.find((a) => a.alignment === "Unaligned")?.count > 0 &&
                    ` ${alignmentData.find((a) => a.alignment === "Unaligned").count} graduates report unaligned work.`}
                </>
              ) : (
                "No alignment data available for selected filters."
              )}
            </p>
          </div>
        </div>

        {/* Add this after your existing charts */}
        <div className={styles.comparisonSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Job Search Length Post-Graduation</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={jobSearchData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="batch" 
                    label={{ value: "Graduation Year", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    label={{ value: "Average Months", angle: -90, position: "insideLeft" }}
                    domain={[0, 12]}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "Number of Graduates", angle: 90, position: "insideRight" }}
                  />
                  <Tooltip 
                    content={<CustomJobSearchTooltip />}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="averageMonths" 
                    name="Average Months to Employment"
                    fill="#9b59b6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="graduates" 
                    name="Number of Graduates"
                    fill="#3498db"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.summaryContainer}>
              <h3 className={styles.insightTitle}>Key Insights</h3>
              <p className={styles.insightText}>
                {jobSearchData.length > 0 ? (
                  `On average, graduates find employment within 
                  ${(jobSearchData.reduce((sum, item) => sum + item.averageMonths, 0) / jobSearchData.length).toFixed(1)} 
                  months after graduation. Recent batches show ${jobSearchData[jobSearchData.length-1].averageMonths < 
                  jobSearchData[0].averageMonths ? 'improving' : 'consistent'} job search timelines.`
                ) : "No job search data available"}
              </p>
              <div className={styles.dummyDataNotice}>
                <span className={styles.noticeIcon}>⚠️</span>
                Currently displaying sample data
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div className={styles.conclusionSection}>
        <h2 className={styles.conclusionTitle}>Conclusion</h2>
        <p className={styles.conclusionText}>
          {data?.employmentByBatch ? (
            <>
              Graduates from {Object.keys(data.employmentByBatch).join(", ")} show an average employment rate of{" "}
              {calculateAverageEmployment()}%.
              {alignmentData.length > 0 && (
                <>
                  {" "}
                  Regarding curriculum alignment, {calculateAlignmentPercentage("Very much aligned|Aligned")}% report
                  strong alignment with their field of study.
                </>
              )}
            </>
          ) : (
            "No conclusive data available for the selected filters."
          )}
        </p>

        <p className={styles.recommendationText}>
          <strong>Recommendations:</strong>
          {alignmentData.length > 0 && (
            <>
              {calculateAlignmentPercentage("Unaligned") > 15
                ? ` Consider reviewing the ${filters.course || "program"} curriculum to better align with current industry needs, 
                as ${calculateAlignmentPercentage("Unaligned")}% of graduates report unaligned work.`
                : ` The strong alignment (${calculateAlignmentPercentage("Very much aligned|Aligned")}%) suggests the curriculum 
                is effectively preparing students for their careers.`}
            </>
          )}
          {activeFilters.length > 0 && ` These insights are specific to the filtered group.`}
        </p>
      </div>
    </div>
  )
}
