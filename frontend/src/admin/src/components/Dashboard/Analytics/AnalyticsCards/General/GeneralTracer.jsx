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

// Define available batch years, colleges, and courses (similar to AlumniFilters)
const batchYears = Array.from({ length: 10 }, (_, i) => 2016 + i);

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

export default function GeneralTracer() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    batchYear: "",
    college: "",
    course: ""
  })
  const [activeFilters, setActiveFilters] = useState([])
  const [filterApplied, setFilterApplied] = useState(false)

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [type]: value };
      if (type === "college") {
        // Reset course when college changes
        newFilters.course = "";
      }
      
      // Update active filters immediately
      const updatedActiveFilters = [];
      Object.entries(newFilters).forEach(([key, val]) => {
        if (val) {
          updatedActiveFilters.push({ type: key, value: val });
        }
      });
      setActiveFilters(updatedActiveFilters);
      setFilterApplied(true);
      
      return newFilters;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      batchYear: "",
      college: "",
      course: ""
    });
    setActiveFilters([]);
    setFilterApplied(false);
    setShowFilters(false);
  };

  // Remove specific filter
  const removeFilter = (type) => {
    setFilters(prev => {
      const newFilters = { ...prev, [type]: "" };
      // If college is removed, also remove course
      if (type === "college") {
        newFilters.course = "";
      }
      
      // Update active filters immediately
      const updatedActiveFilters = [];
      Object.entries(newFilters).forEach(([key, val]) => {
        if (val) {
          updatedActiveFilters.push({ type: key, value: val });
        }
      });
      setActiveFilters(updatedActiveFilters);
      
      return newFilters;
    });
  };

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setLoading(true);
        
        // Construct query parameters
        const queryParams = new URLSearchParams();
        if (filters.batchYear) queryParams.append('batch', filters.batchYear);
        if (filters.college) queryParams.append('college', filters.college);
        if (filters.course) queryParams.append('course', filters.course);

        // Add query parameters to URL
        const url = `http://localhost:5050/dashboard/tracer/comparison${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const res = await fetch(url);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch comparison data:", err);
        setError("Failed to load comparison data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchComparisonData();
  }, [filters]); // Re-fetch when filters change

  // Format data for comparison charts
  const formatComparisonData = (dataObj, category) => {
    if (!dataObj) return []

    return Object.keys(dataObj.tracer1).map((key) => ({
      name: key,
      "Tracer 1": dataObj.tracer1[key],
      "Tracer 2": dataObj.tracer2[key],
    }))
  }

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
    if (!data) return {}
  
    const employedT1 = data.employmentRate.tracer1.Employed
    const employedT2 = data.employmentRate.tracer2.Employed
    const employmentChange = calculateChange(employedT1, employedT2)
  
    const safeSum = (obj, keys) => keys.reduce((sum, key) => sum + (obj[key] || 0), 0)
  
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
        <div className={styles.filterButtonWrapper}>
          <button
            className={styles.filterButton}
            onClick={() => setShowFilters(!showFilters)}
          >
            <span>Filters</span>
            <span className={styles.filterIcon}>
              <ChevronDown size={16} />
            </span>
          </button>
          
          {showFilters && (
            <div className={styles.filterPopover}>
              <h4 className={styles.filterTitle}>Filter Tracer Data</h4>
              <div className={styles.filterDivider}></div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Batch Year</label>
                <select
                  className={styles.filterSelect}
                  value={filters.batchYear}
                  onChange={(e) => handleFilterChange("batchYear", e.target.value)}
                >
                  <option value="">Select batch year</option>
                  {batchYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>College</label>
                <select
                  className={styles.filterSelect}
                  value={filters.college}
                  onChange={(e) => handleFilterChange("college", e.target.value)}
                >
                  <option value="">Select college</option>
                  {colleges.map((college) => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Course</label>
                <select
                  className={styles.filterSelect}
                  value={filters.course}
                  onChange={(e) => handleFilterChange("course", e.target.value)}
                  disabled={!filters.college}
                >
                  <option value="">Select course</option>
                  {filters.college && courses[filters.college] &&
                    courses[filters.college].map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                </select>
              </div>

              <div className={styles.filterActions}>
                <button className={styles.resetButton} onClick={resetFilters}>
                  Reset Filters
                </button>
                <button className={styles.applyButton} onClick={() => setShowFilters(false)}>
                  Close Filters
                </button>
              </div>
            </div>
          )}
        </div>
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
        <p className={styles.summaryText}>{summaries.overall.text}</p>
      </div>

      {/* Employment Rate Comparison */}
      <div className={styles.comparisonSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Employment Rate Comparison</h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.chartContainer}>
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
          </div>
          <div className={styles.summaryContainer}>
            <h3 className={styles.insightTitle}>Key Insights</h3>
            <p className={styles.insightText}>{summaries.employment.text}</p>
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
          </div>
          <div className={styles.summaryContainer}>
            <h3 className={styles.insightTitle}>Key Insights</h3>
            <p className={styles.insightText}>{summaries.alignment.text}</p>
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
          </div>
          <div className={styles.summaryContainer}>
            <h3 className={styles.insightTitle}>Key Insights</h3>
            <p className={styles.insightText}>{summaries.job_level.text}</p>
          </div>
        </div>
      </div>

      <div className={styles.conclusionSection}>
        <h2 className={styles.conclusionTitle}>Conclusion</h2>
        <p className={styles.conclusionText}>
          The 2-year comparison reveals valuable insights about the long-term impact of the curriculum and career
          progression of graduates. The data suggests that graduates are generally{" "}
          {data.employmentRate.tracer2.Employed > data.employmentRate.tracer1.Employed
            ? "improving their employment prospects"
            : "facing challenges in employment"}{" "}
          and
          {data.job_level.tracer2["Mid-level"] + data.job_level.tracer2["Senior/Executive"] >
          data.job_level.tracer1["Mid-level"] + data.job_level.tracer1["Senior/Executive"]
            ? " advancing in their careers"
            : " maintaining similar job levels"}
          . The curriculum alignment trends indicate that the knowledge and skills acquired during their education
          {data.curriculumAlignment.tracer2["Very much aligned"] + data.curriculumAlignment.tracer2["Aligned"] >
          data.curriculumAlignment.tracer1["Very much aligned"] + data.curriculumAlignment.tracer1["Aligned"]
            ? " remain relevant and valuable as they progress in their careers."
            : " may need updates to better support long-term career growth."}
        </p>
        <p className={styles.recommendationText}>
          <strong>Recommendations:</strong>{" "}
          {data.employmentRate.tracer2.Employed > data.employmentRate.tracer1.Employed &&
          data.curriculumAlignment.tracer2["Very much aligned"] + data.curriculumAlignment.tracer2["Aligned"] >
            data.curriculumAlignment.tracer1["Very much aligned"] + data.curriculumAlignment.tracer1["Aligned"]
            ? "Continue with the current curriculum structure while incorporating emerging industry trends to maintain relevance."
            : "Consider curriculum revisions to better align with industry needs and enhance graduate employability and career advancement opportunities."}
          {activeFilters.length > 0 && ` These insights are specific to the filtered group of alumni.`}
        </p>
      </div>
    </div>
  )
}