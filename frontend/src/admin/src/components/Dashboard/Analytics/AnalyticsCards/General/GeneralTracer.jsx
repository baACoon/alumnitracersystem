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

        // Fetch all endpoints in parallel
        const [employmentRes, alignmentRes, jobSearchRes] = await Promise.all([
          fetch(`https://alumnitracersystem.onrender.com/dashboard/tracer/employment-by-batch?${queryParams}`),
          fetch(`https://alumnitracersystem.onrender.com/dashboard/tracer/work-alignment?${queryParams}`),
          fetch(`https://alumnitracersystem.onrender.com/dashboard/tracer/job-search-duration?${queryParams}`)
        ]);

        // Check all responses
        if (!employmentRes.ok || !alignmentRes.ok || !jobSearchRes.ok) {
          throw new Error(
            employmentRes.ok 
              ? alignmentRes.ok 
                ? await jobSearchRes.text() 
                : await alignmentRes.text()
              : await employmentRes.text()
          )
        }

        const [employmentJson, alignmentJson, jobSearchJson] = await Promise.all([
          employmentRes.json(), 
          alignmentRes.json(),
          jobSearchRes.json()
        ]);

        if (!isMounted) return // Prevent state updates if unmounted

        // In your fetchData processing (for jobSearchData):
const processedJobSearchData = (jobSearchJson.data || [])
  .map(item => ({
    batch: item._id.toString(),
    averageMonths: item.graduates > 0 
      ? parseFloat((item.totalMonths / item.graduates).toFixed(1)) 
      : 0
  }))
  .sort((a, b) => Number(a.batch) - Number(b.batch)); // ← Sort by year ascending

        // Validate responses
        if (!employmentJson || !alignmentJson || !jobSearchJson) {
          throw new Error("Invalid data received from server")
        }

        setData(employmentJson)
        setAlignmentData(alignmentJson.alignmentData || [])
        setJobSearchData(processedJobSearchData)

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
    if (!data?.employmentByBatch) return 'N/A';
    
    const rates = Object.values(data.employmentByBatch);
    const validRates = rates.filter(rate => !isNaN(rate));
    return (validRates.reduce((a, b) => a + b, 0) / validRates.length).toFixed(1);
  };

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
    if (!data?.employmentByBatch) return [];
    
    return Object.entries(data.employmentByBatch)
      .map(([batch, rate]) => ({
        name: batch,
        "Employment Rate": parseFloat(rate.toFixed(1)) // Ensures 1 decimal place
      }))
      .sort((a, b) => Number(a.name) - Number(b.name));
  };

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
        <p style={{ color: payload[0].color }}>
          {payload[0].name}: <strong>
            {payload[0].value === 0 
              ? "Same month" 
              : payload[0].value.toFixed(1) + " months"}
          </strong>
        </p>
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
        <h1 className={styles.dashboardTitle}>GENERAL SUMMARY</h1>
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
            Employment Rate per Batch
          </h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.chartContainer}>
            {employmentData.length === 0 ? (
              <p className={styles.noData}>No employment data available for the selected filters.</p>
            ) : (
             <ResponsiveContainer width="100%" height={400}>
              <ComposedChart 
                data={employmentData}
                margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  label={{ value: "Graduation Year", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  domain={[0, 100]}
                  label={{ 
                    value: "Employment Rate (%)", 
                    angle: -90, 
                    position: "insideLeft" 
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Employment Rate"
                  fill="url(#colorFill)"
                  strokeWidth={0}
                  opacity={0.3}
                />
                <Line
                  type="monotone"
                  dataKey="Employment Rate"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  dot={{
                    fill: COLORS.primary,
                    strokeWidth: 2,
                    r: 5
                  }}
                  activeDot={{
                    r: 7,
                    stroke: "#fff",
                    strokeWidth: 2
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
            )}
          </div>
          <div className={styles.summaryContainer}>
            <h3 className={styles.insightTitle}>Employment Trend Analysis</h3>
            {employmentData.length > 0 ? (
              <div className={styles.insightText}>
                <p>
                  <strong>Overall Performance:</strong> The average employment rate across 
                  {filters.college ? ` ${filters.college}` : ''} 
                  {filters.course ? ` (${filters.course})` : ''} graduates is 
                  <strong> {calculateAverageEmployment()}%</strong>.
                </p>
                
                {employmentData.length > 1 && (
                  <>
                    <p>
                      <strong>Trend Direction:</strong> 
                      {employmentData[employmentData.length - 1]["Employment Rate"] > employmentData[0]["Employment Rate"] ? (
                        ` ↗ Upward trend (+${(
                          employmentData[employmentData.length - 1]["Employment Rate"] - 
                          employmentData[0]["Employment Rate"]
                        ).toFixed(1)}% change)`
                      ) : (
                        ` ↘ Downward trend (${(
                          employmentData[employmentData.length - 1]["Employment Rate"] - 
                          employmentData[0]["Employment Rate"]
                        ).toFixed(1)}% change)`
                      )}
                    </p>
                    <p>
                      <strong>Peak Performance:</strong> {employmentData.reduce((max, curr) => 
                        curr["Employment Rate"] > max["Employment Rate"] ? curr : max
                      ).name} batch ({Math.max(...employmentData.map(d => d["Employment Rate"]))}%)
                    </p>
                  </>
                )}
                
                {activeFilters.length > 0 && (
                  <p className={styles.filterNote}>
                    <small>Filters applied: {activeFilters.map(f => f.label).join(', ')}</small>
                  </p>
                )}
              </div>
            ) : (
              <p className={styles.insightText}>No employment data available for selected filters</p>
            )}
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
            <h3 className={styles.insightTitle}>Curriculum Alignment Analysis</h3>
            {alignmentData.length > 0 ? (
              <div className={styles.insightText}>
                <p>
                  <strong>Overall Alignment:</strong>{" "}
                  {calculateAlignmentPercentage("Unaligned") >= 10 ? (
                    <span className={styles.warningNote}>
                      {filters.course
                        ? `Review strongly recommended for ${filters.course}`
                        : filters.college
                          ? `Review recommended for ${filters.college}`
                          : filters.yearFrom
                            ? `Review recommended for ${filters.yearFrom}-${filters.yearTo || "present"}`
                            : `Review recommended`
                      }
                    </span>
                  ) : calculateAlignmentPercentage("Unaligned") >= 5 ? (
                    <span className={styles.monitorNote}>
                      {filters.course || filters.college 
                        ? `Monitor alignment trends`
                        : `Monitor batch trends`
                      }
                    </span>
                  ) : (
                    <span className={styles.successNote}>
                      {filters.course 
                        ? `${filters.course} alignment is strong`
                        : filters.college
                          ? `${filters.college} alignment is healthy`
                          : `Alignment is within norms`
                      }
                    </span>
                  )}
                </p>

                <div className={styles.alignmentBreakdown}>
                  <p><strong>Detailed Breakdown:</strong></p>
                  <ul>
                    {alignmentData
                      .sort((a, b) => b.count - a.count)
                      .map((item) => (
                        <li key={item.alignment}>
                          <span 
                            className={styles.alignmentLabel} 
                            style={{ 
                              color: COLORS[item.alignment.replace(/\s+/g, '')] || COLORS.unspecified 
                            }}
                          >
                            {item.alignment}:
                          </span>{" "}
                          {((item.count / alignmentData.reduce((sum, i) => sum + i.count, 0)) * 100).toFixed(1)}%
                          {item.alignment === "Unaligned" && item.count > 0 && (
                            <span className={styles.warningNote}> (Review recommended)</span>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>

                {filters.course && (
                  <p className={styles.recommendation}>
                    <strong>Recommendation:</strong>{" "}
                    {calculateAlignmentPercentage("Unaligned") > 15
                      ? `Consider reviewing ${filters.course} curriculum for better industry relevance.`
                      : "Alignment rates are strong—focus on maintaining current standards."}
                  </p>
                )}
              </div>
            ) : (
              <p>No alignment data available for selected filters.</p>
            )}
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
                    label={{ value: "Average Months to Employment", angle: -90, position: "insideLeft" }}
                    domain={[0, 'dataMax + 2']}
                  />
                  <Tooltip content={<CustomJobSearchTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="averageMonths" 
                    name="Average Months to Employment"
                    fill="#4CC3C8"  // Using your primary color
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.summaryContainer}>
              <h3 className={styles.insightTitle}>Key Insights</h3>
              <p className={styles.insightText}>
                {jobSearchData.length > 0 ? (
                  <>
                    <strong>Job Search Duration Analysis:</strong>
                    <ul className={styles.insightList}>
                      <li>
                        Graduates from {jobSearchData[0].batch} to {jobSearchData[jobSearchData.length - 1].batch} found employment in 
                        <strong> {(
                          jobSearchData.reduce((sum, item) => sum + item.averageMonths, 0) / 
                          jobSearchData.length
                        ).toFixed(1)} months</strong> on average.
                      </li>
                      
                      {jobSearchData.length > 1 && (
                        <>
                          <li>
                            <strong>Trend: </strong>
                            {jobSearchData[jobSearchData.length - 1].averageMonths < jobSearchData[0].averageMonths ? (
                              "Recent batches found jobs faster (↓" + 
                              (jobSearchData[0].averageMonths - jobSearchData[jobSearchData.length - 1].averageMonths).toFixed(1) + 
                              " month improvement)"
                            ) : (
                              "Recent batches took longer (↑" + 
                              (jobSearchData[jobSearchData.length - 1].averageMonths - jobSearchData[0].averageMonths).toFixed(1) + 
                              " month increase)"
                            )}
                          </li>
                          <li>
                            <strong>Best Performance:</strong> {jobSearchData.reduce((min, curr) => 
                              curr.averageMonths < min.averageMonths ? curr : min
                            ).batch} batch ({Math.min(...jobSearchData.map(d => d.averageMonths)).toFixed(1)} months)
                          </li>
                        </>
                      )}
                      
                      <li>
                        {jobSearchData.some(d => d.averageMonths === 0) && (
                          "Some graduates secured jobs <strong>before graduation</strong> (0 month search)"
                        )}
                      </li>
                    </ul>
                    
                    {filters.college && (
                      <p className={styles.contextNote}>
                        Note: Data reflects {filters.college} {filters.course && `(${filters.course})`} graduates only.
                      </p>
                    )}
                  </>
                ) : (
                  "No job search data available for selected filters"
                )}
              </p>
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