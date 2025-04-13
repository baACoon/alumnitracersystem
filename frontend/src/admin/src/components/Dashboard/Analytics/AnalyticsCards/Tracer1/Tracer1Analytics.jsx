import { useState, useEffect } from 'react';
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import styles from "./Tracer1Analytics.module.css"
import axios from 'axios';

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5050/dashboard/tracer1-analytics');
        
        // Ensure all expected data fields exist, even if empty
        const data = response.data.data || {
          respondentCount: 0,
          degreeData: [],
          collegeData: [],
          yearStartedData: [],
          employmentStatusData: [],
          organizationTypeData: [],
          workAlignmentData: []
        };

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
    };

    fetchDashboardData();
  }, []);

  // Colors for charts
  const chartColors = ["#4CC3C8", "#FF6B81", "#FFD166", "#FF9F43", "#7E57C2", "#26A69A"];

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
    return <div className={styles.loading}>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error loading data: {error}</div>;
  }

  return (
    <div className={styles.dashboardGrid}>
      {/* First Row: Respondents, Degree, College */}
      <div className={styles.topRow}>
        {/* Respondents Counter */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>TRACER SURVEY FORM RESPONDENTS</h2>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.counterValue}>{dashboardData.respondentCount}</span>
          </div>
        </div>

        {/* Degree Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>DEGREE</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dashboardData.degreeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {dashboardData.degreeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* College Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>COLLEGE</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dashboardData.collegeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {dashboardData.collegeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Year Started, Employment Status */}
      <div className={styles.barRow}>
        {/* Year Started Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>YEAR STARTED</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardData.yearStartedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="Count" />
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
                <BarChart data={dashboardData.employmentStatusData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="Count" />
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
                <BarChart data={dashboardData.organizationTypeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="Count" />
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
                <BarChart data={dashboardData.workAlignmentData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}