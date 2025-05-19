"use client"

import { useState, useEffect, useCallback } from "react"
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import styles from "./Tracer1Analytics.module.css"
import { ChevronDown } from "lucide-react"
import axios from "axios"

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

export default function Tracer1Analytics() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboardData, setDashboardData] = useState({
    respondentCount: 0,
    degreeData: [],
    collegeData: [],
    yearStartedData: [],
    employmentStatusData: [],
    organizationTypeData: [],
    workAlignmentData: [],
  })
  const [batchYears, setBatchYears] = useState([])
    const [availableFilters, setAvailableFilters] = useState({
      batchYears: [],
      colleges: Object.keys(collegesAndCourses),
      collegeToCourses: collegesAndCourses,
    })
    const [showFilters, setShowFilters] = useState(true)
    const [activeFilters, setActiveFilters] = useState([])
    const [filters, setFilters] = useState({
      batchYears: [],
      college: "",
      course: "",
    })
    const [pendingFilters, setPendingFilters] = useState({
      batchYears: [],
      college: "",
      course: "",
    })

  const fetchBatchYears = async () => {
    try {
      const response = await axios.get("https://alumnitracersystem.onrender.com/dashboard/tracer1-batchyears")
      setBatchYears(response.data.batchYears || [])
    } catch (error) {
      console.error("Error fetching batch years:", error)
    }
  }

  const fetchDashboardData = useCallback(
    async (customFilters = filters) => {
      try {
        setLoading(true)

        const params = new URLSearchParams()
        if (customFilters.batchYear) params.append("batch", customFilters.batchYear)
        if (customFilters.college) params.append("college", customFilters.college)
        if (customFilters.course) params.append("course", customFilters.course)

        const url = `https://alumnitracersystem.onrender.com/dashboard/tracer1-analytics${params.toString() ? `?${params.toString()}` : ""}`
        const response = await axios.get(url)
        const data = response.data.data || {}

        setDashboardData({
          respondentCount: data.respondentCount || 0,
          degreeData: data.degreeData || [],
          collegeData: data.collegeData || [],
          yearStartedData: data.yearStartedData || [],
          employmentStatusData: data.employmentStatusData || [],
          organizationTypeData: data.organizationTypeData || [],
          workAlignmentData: data.workAlignmentData || [],
        })

        setLoading(false)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError(err.message)
        setLoading(false)
      }
    },
    [filters],
  )

  useEffect(() => {
    fetchBatchYears()
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleFilterChange = (type, value) => {
    setPendingFilters((prev) => {
      const updated = { ...prev, [type]: value }

      if (type === "batchYear") {
        updated.college = ""
        updated.course = ""
      } else if (type === "college") {
        updated.course = ""
      }

      return updated
    })
  }

  

const applyFilters = () => {
  setFilters(pendingFilters);

  // Update active filters display
  setActiveFilters(
    Object.entries(pendingFilters)
      .filter(([_, val]) => val)
      .map(([type, value]) => ({
        type,
        value,
        label:
          type === "batchYear"
            ? `Batch Year: ${value}`
            : type === "college"
            ? `College: ${value}`
            : type === "course"
            ? `Course: ${value}`
            : "",
      }))
  );
};

  const resetFilters = () => {
    setPendingFilters({
      batchYear: "",
      college: "",
      course: "",
    })
    setFilters({
      batchYear: "",
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
      Object.entries(pendingFilters)
        .filter(([_, val]) => val)
        .map(([type, value]) => ({
          type,
          value,
          label:
            type === "batchYear"
              ? `Batch Year: ${value}`
              : type === "college"
              ? `College: ${value}`
              : type === "course"
              ? `Course: ${value}`
              : "",
        }))
    );
  }


  const chartColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#8AC926", "#FF595E"]

  const CustomTooltip = ({ active, payload, label }) =>
    active && payload?.length ? (
      <div className={styles.customTooltip}>
        <p className={styles.label}>{`${label || payload[0].name}: ${payload[0].value}`}</p>
      </div>
    ) : null

  if (loading) return <div className={styles.loading}>Loading dashboard data...</div>
  if (error) return <div className={styles.error}>Error loading data: {error}</div>

  const renderNoData = () => <div className={styles.noDataMessage}>No data available for selected filters.</div>

  return (
    <div className={styles.dashboardGrid}>
      <div className={styles.filterSection}>
              <div className={styles.filterContainer}>
                <div className={styles.filterHeader}>
                  <h3 className={styles.filterTitle}>Filter Data</h3>
                </div>
                <div className={styles.filterContent}>
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Batch Year</label>
                    <select
                      value={filters.batchYears}
                      onChange={(e) => handleFilterChange("batchYear", e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="">Select batch year</option>
                      {batchYears.map((year) => (
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

      <div className={styles.topRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>TRACER SURVEY FORM RESPONDENTS</h2>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.counterValue}>{dashboardData.respondentCount}</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>DEGREE</h2>
          </div>
          <div className={styles.cardContent}>
            {dashboardData.degreeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dashboardData.degreeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dashboardData.degreeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              renderNoData()
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>COLLEGE</h2>
          </div>
          <div className={styles.cardContent}>
            {dashboardData.collegeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dashboardData.collegeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dashboardData.collegeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              renderNoData()
            )}
          </div>
        </div>
      </div>

      <div className={styles.barRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>YEAR STARTED</h2>
          </div>
          <div className={styles.cardContent}>
            {dashboardData.yearStartedData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardData.yearStartedData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                  <XAxis dataKey="name" label={{ value: "Year", position: "insideBottom", offset: -10 }} />
                  <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#36A2EB" name="Count" label={{ position: "top" }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              renderNoData()
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>EMPLOYMENT STATUS</h2>
          </div>
          <div className={styles.cardContent}>
            {dashboardData.employmentStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={dashboardData.employmentStatusData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                >
                  <XAxis dataKey="name" label={{ value: "Status", position: "insideBottom", offset: -10 }} />
                  <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#FF6384" name="Count" label={{ position: "top" }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              renderNoData()
            )}
          </div>
        </div>
      </div>

      <div className={styles.barRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>TYPE OF ORGANIZATION</h2>
          </div>
          <div className={styles.cardContent}>
            {dashboardData.organizationTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={dashboardData.organizationTypeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                >
                  <XAxis dataKey="name" label={{ value: "Organization Type", position: "insideBottom", offset: -10 }} />
                  <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#FFCE56" name="Count" label={{ position: "top" }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              renderNoData()
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>WORK ALIGNMENT IN COURSE</h2>
          </div>
          <div className={styles.cardContent}>
            {dashboardData.workAlignmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardData.workAlignmentData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                  <XAxis dataKey="name" label={{ value: "Alignment", position: "insideBottom", offset: -10 }} />
                  <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#4BC0C0" name="Count" label={{ position: "top" }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              renderNoData()
            )}
          </div>
        </div>
      </div>
    </div>
  )
}