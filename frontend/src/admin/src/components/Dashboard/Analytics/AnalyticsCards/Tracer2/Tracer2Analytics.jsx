import { useEffect, useState, useCallback } from "react";
import axios from "axios";
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
} from "recharts";
import styles from "./Tracer2Analytics.module.css";
import { ChevronDown } from 'lucide-react'

const COLORS = ["#4CC3C8", "#FF6B81", "#FFD166", "#FF9F43", "#6C5CE7", "#C31D3C"];

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

// Define all questions with their corresponding chart types
const QUESTIONS = [
  {
    id: 'respondents',
    title: 'TRACER SURVEY FORM RESPONDENTS',
    type: 'counter'
  },
  {
    id: 'degreeHolders',
    title: 'DEGREE HOLDERS (MASTERAL & DOCTORATE)',
    type: 'pie'
  },
  {
    id: 'employmentStatus',
    title: 'PRESENT EMPLOYMENT STATUS',
    type: 'pie'
  },
  {
    id: 'jobLevel',
    title: 'JOB LEVEL',
    type: 'bar'
  },
  {
    id: 'coreCompetencies',
    title: 'CORE COMPETENCIES THAT HELPED IN JOB',
    type: 'radar'
  },
  {
    id: 'lineOfBusiness',
    title: 'MAJOR LINE OF BUSINESS',
    type: 'treemap'
  },
  {
    id: 'placeOfWork',
    title: 'PLACE OF WORK',
    type: 'pie'
  },
  {
    id: 'firstJobSearch',
    title: 'HOW DID YOU FIND YOUR FIRST JOB',
    type: 'pie'
  },
  {
    id: 'firstJobDuration',
    title: 'HOW LONG DID YOU STAY IN YOUR FIRST JOB',
    type: 'area'
  },
  {
    id: 'jobLandingTime',
    title: 'HOW LONG DID IT TAKE TO LAND YOUR FIRST JOB',
    type: 'bar'
  },
  {
    id: 'reasons',
    title: 'REASONS FOR PURSUING ADVANCED STUDIES',
    type: 'bar'
  },
  {
    id: 'workAlignment',
    title: 'WAS YOUR CURRICULUM ALIGNED TO YOUR JOB?',
    type: 'pie'
  }
];

export default function Tracer2Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [batchYears, setBatchYears] = useState([]);
  const [filters, setFilters] = useState({ 
    batchYear: "",
    college: "",
    course: "",
    question: "" // New filter for specific question
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  const fetchBatchYears = async () => {
    try {
      const response = await axios.get("http://localhost:5050/dashboard/tracer2-batchyears");
      setBatchYears(response.data.batchYears || []);
    } catch (error) {
      console.error("Error fetching batch years for Tracer 2:", error);
    }
  };

  const fetchAnalytics = useCallback(async (customFilters = filters) => {
    try {
      setLoading(true);
     
      const params = new URLSearchParams();
      if (customFilters.batchYear) params.append('batch', customFilters.batchYear);
      if (customFilters.college) params.append('college', customFilters.college);
      if (customFilters.course) params.append('course', customFilters.course);

      const url = `http://localhost:5050/dashboard/tracer2/analytics${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await axios.get(url);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError("Failed to load analytics data. Please try again later.");
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBatchYears();
    fetchAnalytics();
  }, [fetchAnalytics]);

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
    fetchAnalytics(filters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    const reset = { batchYear: "", college: "", course: "", question: "" };
    setFilters(reset);
    fetchAnalytics(reset);
    setShowFilters(false);
    setActiveFilters([]);
  };

  const removeFilter = (type) => {
    const updatedFilters = { ...filters, [type]: "" };
    setFilters(updatedFilters);
    fetchAnalytics(updatedFilters);
    
    setActiveFilters(
      Object.entries(updatedFilters)
        .filter(([_, val]) => val)
        .map(([t, v]) => ({ type: t, value: v }))
    );
  };

  const formatBarData = (obj) => (obj ? Object.entries(obj).map(([name, value]) => ({ name, value })) : []);

  const formatReasonsData = (obj) => (obj ? Object.entries(obj).map(([name, value]) => ({ name, undergraduate: value.undergraduate || 0, graduate: value.graduate || 0 })) : []);

  const formatRadarData = (obj) => (obj ? Object.entries(obj).map(([key, val]) => ({ skill: key, value: val })) : []);

  const addColors = (data) => data.map((item, index) => ({ ...item, color: COLORS[index % COLORS.length] }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.label}>{`${label || payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Generate insights for each question
  const generateInsights = (questionId) => {
    if (!data) return "No data available";
    
    switch(questionId) {
      case 'respondents':
        return `Total of ${data.totalRespondents || 0} alumni responded to the survey.`;
        
      case 'degreeHolders':
        const masters = data.advancedDegreeHolders?.masters || 0;
        const doctorate = data.advancedDegreeHolders?.doctorate || 0;
        const totalDegrees = masters + doctorate;
        const totalRespondents = data.totalRespondents || 1;
        const percentage = ((totalDegrees / totalRespondents) * 100).toFixed(1);
        return `${totalDegrees} alumni (${percentage}%) have pursued advanced degrees (${masters} Masters, ${doctorate} Doctorate).`;
        
      case 'employmentStatus':
        const employedCount = data.totalEmployed || 0;
        const unemployedCount = data.job_status?.Unemployed || 0;
        const total = employedCount + unemployedCount;
        const employedPercentage = total > 0 ? ((employedCount / total) * 100).toFixed(1) : 0;
        return `${employedPercentage}% of respondents are currently employed (${employedCount} out of ${total}).`;
        
      case 'jobLevel':
        const positions = formatBarData(data.jobData?.position || {});
        const topPosition = positions.reduce((max, pos) => pos.value > max.value ? pos : max, {value: 0});
        return `The most common job level is "${topPosition.name}" with ${topPosition.value} respondents.`;
        
      case 'coreCompetencies':
        const competencies = formatRadarData(data.jobData?.coreCompetencies || {});
        const topCompetency = competencies.reduce((max, comp) => comp.value > max.value ? comp : max, {value: 0});
        return `"${topCompetency.skill}" is the most frequently cited competency that helped in jobs (${topCompetency.value} mentions).`;
        
      case 'lineOfBusiness':
        const businesses = formatBarData(data.jobData?.lineOfBusiness || {});
        const topBusiness = businesses.reduce((max, bus) => bus.value > max.value ? bus : max, {value: 0});
        return `The most common industry is "${topBusiness.name}" with ${topBusiness.value} alumni working in this field.`;
        
      case 'placeOfWork':
        const places = formatBarData(data.jobData?.placeOfWork || {});
        const topPlace = places.reduce((max, place) => place.value > max.value ? place : max, {value: 0});
        return `Most alumni work in "${topPlace.name}" (${topPlace.value} respondents).`;
        
      case 'firstJobSearch':
        const methods = formatBarData(data.jobData?.firstJobSearch || {});
        const topMethod = methods.reduce((max, method) => method.value > max.value ? method : max, {value: 0});
        return `"${topMethod.name}" was the most common way alumni found their first job (${topMethod.value} respondents).`;
        
      case 'firstJobDuration':
        const durations = formatBarData(data.jobData?.firstJobDuration || {});
        const topDuration = durations.reduce((max, dur) => dur.value > max.value ? dur : max, {value: 0});
        return `Most alumni stayed in their first job for "${topDuration.name}" (${topDuration.value} respondents).`;
        
      case 'jobLandingTime':
        const times = formatBarData(data.jobData?.jobLandingTime || {});
        const topTime = times.reduce((max, time) => time.value > max.value ? time : max, {value: 0});
        return `Most alumni landed their first job within "${topTime.name}" (${topTime.value} respondents).`;
        
      case 'reasons':
        const reasons = formatReasonsData(data.reasons || {});
        const topReason = reasons.reduce((max, reason) => 
          (reason.undergraduate + reason.graduate) > (max.undergraduate + max.graduate) ? reason : max, 
          {undergraduate: 0, graduate: 0}
        );
        return `"${topReason.name}" is the most common reason for pursuing advanced studies (${topReason.undergraduate + topReason.graduate} mentions).`;
        
      case 'workAlignment':
        const alignments = formatBarData(data.jobData?.work_alignment || {});
        const topAlignment = alignments.reduce((max, align) => align.value > max.value ? align : max, {value: 0});
        return `Most alumni report their curriculum was "${topAlignment.name}" with their job (${topAlignment.value} respondents).`;
        
      default:
        return "No insights available for this question.";
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}><div className={styles.loadingSpinner}></div><p>Loading analytics data...</p></div>;
  }

  if (error && !data) {
    return <div className={styles.errorContainer}><p className={styles.errorMessage}>{error}</p><button className={styles.retryButton} onClick={() => window.location.reload()}>Retry</button></div>;
  }

  if (!data) return null;

  const employedCount = data.totalEmployed || 0;
  const unemployedCount = data.job_status?.Unemployed || 0;

  const degreeHolderData = [
    { name: "Doctorate", value: data.advancedDegreeHolders?.doctorate || 0, color: COLORS[0] },
    { name: "Masters", value: data.advancedDegreeHolders?.masters || 0, color: COLORS[1] },
  ];

  const coreCompetenciesData = formatRadarData(data.jobData?.coreCompetencies || {});

  // Filter questions if a specific question is selected
  const visibleQuestions = filters.question 
    ? QUESTIONS.filter(q => q.id === filters.question)
    : QUESTIONS;

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

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Question</label>
              <select value={filters.question} onChange={(e) => handleFilterChange("question", e.target.value)} className={styles.filterSelect}>
                <option value="">All Questions</option>
                {QUESTIONS.map(question => (
                  <option key={question.id} value={question.id}>{question.title}</option>
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
                  filter.type === "course" ? `Course: ${filter.value}` :
                  `Question: ${QUESTIONS.find(q => q.id === filter.value)?.title || filter.value}`
                }
              >
                {filter.type === "batchYear" && `Year: ${filter.value}`}
                {filter.type === "college" && `College: ${filter.value}`}
                {filter.type === "course" && `Course: ${filter.value}`}
                {filter.type === "question" && `Question: ${QUESTIONS.find(q => q.id === filter.value)?.title.substring(0, 20)}...`}
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

      {/* Dashboard Content */}
      {visibleQuestions.map(question => {
        switch(question.id) {
          case 'respondents':
            return (
              <div key={question.id} className={styles.row0}>
                <div className={`${styles.card} ${styles.respondentsCard}`}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>{question.title}</h2>
                  </div>
                  <div className={styles.cardContent}>
                    <span className={styles.counterValue}>{data.totalRespondents || 0}</span>
                    <div className={`${styles.insightBox} ${activeFilters.length > 0 ? styles.visible : ''}`}>
                      <h3 className={styles.insightTitle}>Key Insight</h3>
                      <p className={styles.insightText}>{generateInsights(question.id)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          
          case 'degreeHolders':
            return (
              <div key={question.id} className={styles.row1}>
                <div className={`${styles.card} ${styles.educationalAttainmentCard}`}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>{question.title}</h2>
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
                    <div className={`${styles.insightBox} ${activeFilters.length > 0 ? styles.visible : ''}`}>
                      <h3 className={styles.insightTitle}>Key Insight</h3>
                      <p className={styles.insightText}>{generateInsights(question.id)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
            
          case 'employmentStatus':
            return (
              <div key={question.id} className={styles.row2}>
                <div className={`${styles.card} ${styles.employmentStatusCard}`}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>{question.title}</h2>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.chartContainer}>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={addColors(formatBarData(data.job_status || {}))}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            paddingAngle={2}
                            label
                          >
                            {formatBarData(data.job_status || {}).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className={`${styles.insightBox} ${activeFilters.length > 0 ? styles.visible : ''}`}>
                      <h3 className={styles.insightTitle}>Key Insight</h3>
                      <p className={styles.insightText}>{generateInsights(question.id)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
            
          // Add cases for all other questions following the same pattern
          // Each question should return its card with chart and insights
          // I'll show a few more examples:
          
          case 'jobLevel':
            return (
              <div key={question.id} className={styles.row2}>
                <div className={`${styles.card} ${styles.jobLevelCard}`}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>{question.title}</h2>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.chartContainer}>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={addColors(formatBarData(data.jobData?.position || {}))}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                        >
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="value">
                            {formatBarData(data.jobData?.position || {}).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className={`${styles.insightBox} ${activeFilters.length > 0 ? styles.visible : ''}`}>
                      <h3 className={styles.insightTitle}>Key Insight</h3>
                      <p className={styles.insightText}>{generateInsights(question.id)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          
          
          case 'coreCompetencies':
            return (
              <div key={question.id} className={styles.row2}>
                <div className={`${styles.card} ${styles.coreCompetenciesCard}`}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>{question.title}</h2>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.chartContainer}>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={formatRadarData(data.jobData.coreCompetencies)}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="skill" />
                          <PolarRadiusAxis />
                          <Radar name="Skills" dataKey="value" stroke="#d32f2f" fill="#d32f2f" fillOpacity={0.6} />
                          <Tooltip />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className={`${styles.insightBox} ${activeFilters.length > 0 ? styles.visible : ''}`}>
                      <h3 className={styles.insightTitle}>Key Insight</h3>
                      <p className={styles.insightText}>{generateInsights(question.id)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
            
          case 'lineOfBusiness':
            return (
              <div key={question.id} className={styles.row3}>
                <div className={`${styles.card} ${styles.lineOfBusinessCard}`}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>{question.title}</h2>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.chartContainer}>
                      <ResponsiveContainer width="100%" height={300}>
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
                    <div className={`${styles.insightBox} ${activeFilters.length > 0 ? styles.visible : ''}`}>
                      <h3 className={styles.insightTitle}>Key Insight</h3>
                      <p className={styles.insightText}>{generateInsights(question.id)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );

          case 'placeOfWork':
            return(
              <div key={question.id}>
                  <div className={`${styles.card} ${styles.placeOfWorkCard}`}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>{question.title}</h2>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.chartContainer}>
                       <ResponsiveContainer width="100%" height={300}>
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
                      <div className={`${styles.insightBox} ${activeFilters.length > 0 ? styles.visible : ''}`}>
                        <h3 className={styles.insightTitle}>Key Insight</h3>
                        <p className={styles.insightText}>{generateInsights(question.id)}</p>
                      </div>
                    </div>

                  </div>
              </div>
            );
          
          case 'firstJobSearch':
            return(
              <div key={question.id} className={styles.row4}>
                  <div className={`${styles.card} ${styles.firstJobSearchCard}`}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>{question.title}</h2>
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
                      <div className={`${styles.insightBox} ${activeFilters.length > 0 ? styles.visible : ''}`}>
                        <h3 className={styles.insightTitle}>Key Insight</h3>
                        <p className={styles.insightText}>{generateInsights(question.id)}</p>
                      </div>
                    </div>

                  </div>

              </div>
            );

          case 'firstJobDuration': 
            return(
              <div key={question.id} className={styles.row3}>
                <div className={`${styles.card} ${styles.firstJobDurationCard}`}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>{question.title}</h2>
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
                    <div className={`${styles.insightBox} ${activeFilters.length > 0 ? styles.visible : ''}`}>
                      <h3 className={styles.insightTitle}>Key Insight</h3>
                      <p className={styles.insightText}>{generateInsights(question.id)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );

          case 'jobLandingTime':
            return(
              <div key={question.id}>
                <div className={`${styles.card} ${styles.jobLandingTimeCard}`}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>{question.title}</h2>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.chartContainer}>
                      <ResponsiveContainer width="100%" height={400}>
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
                    <div className={`${styles.insightBox} ${activeFilters.length > 0 ? styles.visible : ''}`}>
                      <h3 className={styles.insightTitle}>Key Insight</h3>
                      <p className={styles.insightText}>{generateInsights(question.id)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          case 'reasons':
            return(
              <div key={question.id} className={styles.row3}>
                <div className={`${styles.card} ${styles.reasonsCard}`}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>{question.title}</h2>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.chartContainer}>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={formatReasonsData(data.reasons || {})}
                          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="undergraduate" name="Undergraduate" fill="#4CC3C8" />
                          <Bar dataKey="graduate" name="Graduate" fill="#FF6B81" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className={`${styles.insightBox} ${activeFilters.length > 0 ? styles.visible : ''}`}>
                      <h3 className={styles.insightTitle}>Key Insight</h3>
                      <p className={styles.insightText}>{generateInsights(question.id)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
            
          case 'workAlignment':
            return (
              <div key={question.id} className={styles.row5}>
                <div className={`${styles.card} ${styles.curriculumJobAlignmentCard}`}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>{question.title}</h2>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.chartContainer}>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={addColors(formatBarData(data.jobData?.work_alignment || {}))}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={2}
                            label
                          >
                            {formatBarData(data.jobData?.work_alignment || {}).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className={`${styles.insightBox} ${activeFilters.length > 0 ? styles.visible : ''}`}>
                      <h3 className={styles.insightTitle}>Key Insight</h3>
                      <p className={styles.insightText}>{generateInsights(question.id)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );

          
        }
      })}
    </div>
  );
}