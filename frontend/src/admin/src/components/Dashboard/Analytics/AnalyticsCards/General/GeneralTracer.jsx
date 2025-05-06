"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area
} from 'recharts';
import { ChevronDown } from "lucide-react"
import styles from "./GeneralTracer.module.css"

// Color palette for charts
const COLORS = {
  primary: "#4CC3C8", // Teal for the main line
  secondary: "#C31D3C", // Red for any future additional lines
  grid: "#f0f0f0" // Light gray for grid lines
};

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
};

export default function GeneralTracer() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [availableFilters, setAvailableFilters] = useState({ 
    batchYears: [], 
    colleges: Object.keys(collegesAndCourses),
    collegeToCourses: collegesAndCourses
  });

  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])
  const [filters, setFilters] = useState({
    yearFrom: "",
    yearTo: "",
    college: "",
    course: ""
  });

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      const updated = { ...prev, [type]: value };
      
      // Reset dependent filters when parent changes
      if (type === "yearFrom" || type === "yearTo") {
        updated.college = "";
        updated.course = "";
      } else if (type === "college") {
        updated.course = "";
      }

      setActiveFilters(
        Object.entries(updated)
          .filter(([_, val]) => val)
          .map(([t, v]) => ({ 
            type: t, 
            value: v,
            label: t === "yearFrom" ? `From ${v}` :
                   t === "yearTo" ? `To ${v}` :
                   t === "college" ? `College: ${v}` :
                   `Course: ${v}`
          }))
      );
      return updated;
    });
  };

  const resetFilters = () => {
    setFilters({ 
      yearFrom: "", 
      yearTo: "", 
      college: "", 
      course: "" 
    });
    setActiveFilters([]);
    setShowFilters(false);
  };

  const removeFilter = (type) => {
    handleFilterChange(type, "");
  };

  useEffect(() => {
    const fetchEmploymentData = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (filters.yearFrom) queryParams.append('yearFrom', filters.yearFrom);
        if (filters.yearTo) queryParams.append('yearTo', filters.yearTo);
        if (filters.college) queryParams.append('college', filters.college);
        if (filters.course) queryParams.append('course', filters.course);

        const url = `http://localhost:5050/dashboard/tracer/employment-by-batch${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const res = await fetch(url);
        const json = await res.json();
        
        if (!res.ok) throw new Error(json.error || "Failed to fetch data");
        
        setData(json);
        
        // Update available batch years from the response
        if (json.filters?.batchYears) {
          setAvailableFilters(prev => ({
            ...prev,
            batchYears: json.filters.batchYears
          }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmploymentData();
  }, [filters]);

  const formatBatchComparisonData = (data) => {
    if (!data || !data.employmentByBatch) return [];
    
    // Sort batches chronologically
    return Object.entries(data.employmentByBatch)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([batch, rate]) => ({
        name: batch,
        "Employment Rate": rate
      }));
  };

  const generateSummaries = (data) => {
    if (!data || !data.employmentByBatch) {
      return {
        employment: { text: "" },
        overall: { text: "" }
      };
    }

    const batches = Object.keys(data.employmentByBatch)
      .map(Number)
      .sort((a, b) => a - b)
      .map(String);

    if (batches.length === 0) {
      return {
        employment: { text: "No employment data available for the selected filters." },
        overall: { text: "No data available for analysis." }
      };
    }

    const rates = batches.map(batch => data.employmentByBatch[batch]);
    const highestBatch = batches[rates.indexOf(Math.max(...rates))];
    const lowestBatch = batches[rates.indexOf(Math.min(...rates))];
    const averageRate = (rates.reduce((sum, rate) => sum + rate, 0) / rates.length).toFixed(1);
    
    let trendText = "";
    if (batches.length > 1) {
      const firstRate = data.employmentByBatch[batches[0]];
      const lastRate = data.employmentByBatch[batches[batches.length - 1]];
      const trend = lastRate - firstRate;
      
      if (trend > 0) {
        trendText = `There's an overall increasing trend of ${Math.abs(trend).toFixed(1)} percentage points from ${batches[0]} to ${batches[batches.length - 1]}.`;
      } else if (trend < 0) {
        trendText = `There's an overall decreasing trend of ${Math.abs(trend).toFixed(1)} percentage points from ${batches[0]} to ${batches[batches.length - 1]}.`;
      } else {
        trendText = "Employment rates have remained stable across the selected years.";
      }
    }

    return {
      employment: {
        text: `The employment rate across selected batches ranges from ${Math.min(...rates)}% to ${Math.max(...rates)}%, with an average of ${averageRate}%. 
        The highest employment rate was in ${highestBatch} (${data.employmentByBatch[highestBatch]}%), while the lowest was in ${lowestBatch} (${data.employmentByBatch[lowestBatch]}%). ${trendText}`
      },
      overall: {
        text: `Analysis of ${batches.length} batch${batches.length !== 1 ? 'es' : ''} ${filters.college ? `from ${filters.college}` : ''} ${filters.course ? `(${filters.course})` : ''} shows ${averageRate}% average employment rate. 
        ${trendText} ${batches.length > 1 ? 'This could indicate changing job market conditions or improvements in the university\'s career preparation programs.' : ''}`
      }
    };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <div className={styles.tooltipHeader}>
            Graduation: <strong>{label}</strong>
          </div>
          <div className={styles.tooltipItem}>
            <span className={styles.tooltipBullet} style={{backgroundColor: COLORS.primary}}></span>
            Employment: <strong>{payload[0].value}%</strong>
          </div>
          {filters.college && (
            <div className={styles.tooltipItem}>
              <span className={styles.tooltipBullet} style={{backgroundColor: COLORS.secondary}}></span>
              College: <strong>{filters.college}</strong>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading employment data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          className={styles.retryButton} 
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null

  const summaries = generateSummaries(data);
  const employmentData = formatBatchComparisonData(data);

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
        <button 
          className={styles.filterButton} 
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters <ChevronDown size={16} />
        </button>

        {showFilters && (
          <div className={styles.filterPopover}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Year From</label>
              <select 
                value={filters.yearFrom} 
                onChange={(e) => handleFilterChange("yearFrom", e.target.value)}
              >
                <option value="">Select year</option>
                {availableFilters.batchYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Year To</label>
              <select 
                value={filters.yearTo} 
                onChange={(e) => handleFilterChange("yearTo", e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Select year</option>
                {availableFilters.batchYears
                  .filter(year => !filters.yearFrom || year >= filters.yearFrom)
                  .map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>College</label>
              <select 
                value={filters.college} 
                onChange={(e) => handleFilterChange("college", e.target.value)} 
                className={styles.filterSelect}
              >
                <option value="">Select college</option>
                {availableFilters.colleges.map(college => (
                  <option key={college} value={college}>{college}</option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Course</label>
              <select 
                value={filters.course} 
                onChange={(e) => handleFilterChange("course", e.target.value)} 
                disabled={!filters.college}
                className={styles.filterSelect}
              >
                <option value="">Select course</option>
                {filters.college && 
                  availableFilters.collegeToCourses[filters.college]?.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))
                }
              </select>
            </div>
            <div className={styles.filterActions}>
              <button 
                className={styles.resetButton} 
                onClick={resetFilters}
              >
                Reset
              </button>
              <button 
                className={styles.applyButton} 
                onClick={() => setShowFilters(false)}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className={styles.activeFiltersBar}>
          <div className={styles.activeFiltersList}>
            {activeFilters.map((filter, index) => (
              <div 
                key={index} 
                className={styles.filterBadgeOutline}
              >
                {filter.label}
                <button 
                  className={styles.removeFilterButton} 
                  onClick={() => removeFilter(filter.type)}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              className={styles.clearAllButton}
              onClick={resetFilters}
            >
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
            {filters.college ? `${filters.college} ` : ''}
            {filters.course ? `(${filters.course}) ` : ''}
            Employment Trends
          </h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.chartContainer}>
            {employmentData.length === 0 ? (
              <p className={styles.noData}>No employment data available for the selected filters.</p>
            ) : (
         
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={employmentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name"
                    tick={{ fill: '#666' }}
                    axisLine={{ stroke: '#ccc' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fill: '#666' }}
                    axisLine={{ stroke: '#ccc' }}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    wrapperStyle={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      padding: '10px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Employment Rate"
                    fill="url(#colorFill)"
                    strokeWidth={0}
                  />
                  <Line
                    type="monotone"
                    dataKey="Employment Rate"
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    dot={{
                      fill: COLORS.primary,
                      strokeWidth: 2,
                      r: 4,
                      stroke: '#fff'
                    }}
                    activeDot={{
                      r: 6,
                      stroke: '#fff',
                      strokeWidth: 2,
                      fill: COLORS.primary
                    }}
                  />
                </LineChart>
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

      {/* Conclusion */}
      <div className={styles.conclusionSection}>
        <h2 className={styles.conclusionTitle}>Conclusion</h2>
        <p className={styles.conclusionText}>
          {summaries?.overall?.text || "No conclusion available for the selected filters."}
        </p>
        <p className={styles.recommendationText}>
          <strong>Recommendations:</strong>{" "}
          {employmentData.length > 1 && 
            (employmentData[employmentData.length - 1]["Employment Rate"] > employmentData[0]["Employment Rate"]
              ? "The improving employment trends suggest that current career preparation programs are effective."
              : "Consider reviewing career preparation programs to better support graduates in finding employment.")}
          {activeFilters.length > 0 && " These insights are specific to the filtered group of alumni."}
        </p>
      </div>
    </div>
  )
}