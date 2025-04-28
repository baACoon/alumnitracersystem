import { useState, useEffect, useCallback } from 'react';
import {
  Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import styles from "./Tracer1Analytics.module.css";
import { ChevronDown } from 'lucide-react';
import axios from 'axios';

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

export default function Tracer1Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    respondentCount: 0,
    degreeData: [],
    collegeData: [],
    yearStartedData: [],
    employmentStatusData: [],
    organizationTypeData: [],
    workAlignmentData: []
  });
  const [batchYears, setBatchYears] = useState([]);
  const [filters, setFilters] = useState({ batchYear: "", college: "", course: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([])

  const fetchBatchYears = async () => {
    try {
      const response = await axios.get("https://alumnitracersystem.onrender.com/dashboard/tracer1-batchyears");
      setBatchYears(response.data.batchYears || []);
    } catch (error) {
      console.error('Error fetching batch years:', error);
    }
  };

  const fetchDashboardData = useCallback(async (customFilters = filters) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (customFilters.batchYear) params.append('batch', customFilters.batchYear);
      if (customFilters.college) params.append('college', customFilters.college);
      if (customFilters.course) params.append('course', customFilters.course);

      const url = `https://alumnitracersystem.onrender.com/dashboard/tracer1-analytics${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await axios.get(url);
      const data = response.data.data || {};

      setDashboardData({
        respondentCount: data.respondentCount || 0,
        degreeData: data.degreeData || [],
        collegeData: data.collegeData || [],
        yearStartedData: data.yearStartedData || [],
        employmentStatusData: data.employmentStatusData || [],
        organizationTypeData: data.organizationTypeData || [],
        workAlignmentData: data.workAlignmentData || []
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBatchYears();
    fetchDashboardData();
  }, [fetchDashboardData]);

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

  const applyFilters = () => {
    fetchDashboardData(filters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    const reset = { batchYear: "", college: "", course: "" };
    setFilters(reset);
    fetchDashboardData(reset);
    setShowFilters(false);
  };

  const chartColors = ["#4CC3C8", "#FF6B81", "#FFD166", "#FF9F43", "#7E57C2", "#26A69A"];

  const CustomTooltip = ({ active, payload, label }) => active && payload?.length ? (
    <div className={styles.customTooltip}>
      <p className={styles.label}>{`${label || payload[0].name}: ${payload[0].value}`}</p>
    </div>
  ) : null;

  if (loading) return <div className={styles.loading}>Loading dashboard data...</div>;
  if (error) return <div className={styles.error}>Error loading data: {error}</div>;

  const renderNoData = () => (
    <div className={styles.noDataMessage}>No data available for selected filters.</div>
  );

  return (
    <div className={styles.dashboardGrid}>
      <div className={styles.dashboardControls}>
        <button className={styles.filterButton} onClick={() => setShowFilters(!showFilters)}>
          Filters <ChevronDown size={14} />
        </button>
        {showFilters && (
          <div className={styles.filterPopover}>
            <h4 className={styles.filterTitle}>Filter Data</h4>
            <div className={styles.filterDivider}></div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Batch Year</label>
              <select value={filters.batchYear} onChange={(e) => handleFilterChange("batchYear", e.target.value)} className={styles.filterSelect}>
                <option value="">Select batch year</option>
                {batchYears.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>College</label>
              <select value={filters.college} onChange={(e) => handleFilterChange("college", e.target.value)} className={styles.filterSelect}>
                <option value="">Select college</option>
                {colleges.map(college => <option key={college} value={college}>{college}</option>)}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Course</label>
              <select value={filters.course} onChange={(e) => handleFilterChange("course", e.target.value)} className={styles.filterSelect} disabled={!filters.college}>
                <option value="">Select course</option>
                {filters.college && courses[filters.college]?.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterActions}>
              <button className={styles.resetButton} onClick={resetFilters}>Reset</button>
              <button className={styles.applyButton} onClick={applyFilters}>Apply</button>
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

      <div className={styles.topRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h2 className={styles.cardTitle}>TRACER SURVEY FORM RESPONDENTS</h2></div>
          <div className={styles.cardContent}>
            <span className={styles.counterValue}>{dashboardData.respondentCount}</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}><h2 className={styles.cardTitle}>DEGREE</h2></div>
          <div className={styles.cardContent}>
            {dashboardData.degreeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={dashboardData.degreeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} paddingAngle={2}>
                    {dashboardData.degreeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : renderNoData()}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}><h2 className={styles.cardTitle}>COLLEGE</h2></div>
          <div className={styles.cardContent}>
            {dashboardData.collegeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={dashboardData.collegeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} paddingAngle={2}>
                    {dashboardData.collegeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : renderNoData()}
          </div>
        </div>
      </div>

      <div className={styles.barRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h2 className={styles.cardTitle}>YEAR STARTED</h2></div>
          <div className={styles.cardContent}>
            {dashboardData.yearStartedData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardData.yearStartedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            ) : renderNoData()}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}><h2 className={styles.cardTitle}>EMPLOYMENT STATUS</h2></div>
          <div className={styles.cardContent}>
            {dashboardData.employmentStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardData.employmentStatusData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            ) : renderNoData()}
          </div>
        </div>
      </div>

      <div className={styles.barRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h2 className={styles.cardTitle}>TYPE OF ORGANIZATION</h2></div>
          <div className={styles.cardContent}>
            {dashboardData.organizationTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardData.organizationTypeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            ) : renderNoData()}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}><h2 className={styles.cardTitle}>WORK ALIGNMENT IN COURSE</h2></div>
          <div className={styles.cardContent}>
            {dashboardData.workAlignmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardData.workAlignmentData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            ) : renderNoData()}
          </div>
        </div>
      </div>
    </div>
  );
}