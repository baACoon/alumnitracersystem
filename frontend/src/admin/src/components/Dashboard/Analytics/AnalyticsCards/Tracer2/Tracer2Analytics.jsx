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
import { ChevronDown, Filter, X } from 'lucide-react';

const COLORS = ["#4CC3C8", "#FF6B81", "#FFD166", "#FF9F43", "#6C5CE7", "#C31D3C"];

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
    batchYears: "",
    college: "",
    course: "",
    question: "" // New filter for specific question
  });
  const [availableFilters, setAvailableFilters] = useState({
    batchYears: [],
    colleges: Object.keys(collegesAndCourses),
    collegeToCourses: collegesAndCourses,
    question: []
  })
  const [pendingFilters, setPendingFilters] = useState({
    batchYear: "",
    college: "",
    course: "",
    question: ""
  });

  const [appliedFilters, setAppliedFilters] = useState({
    batchYear: "",
    college: "",
    course: "",
    question: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  const fetchBatchYears = async () => {
    try {
      const response = await axios.get("https://alumnitracersystem.onrender.com/dashboard/tracer2-batchyears");
      setBatchYears(response.data.batchYears || []);
    } catch (error) {
      console.error("Error fetching batch years for Tracer 2:", error);
    }
  };

  const fetchAnalytics = useCallback(async (filtersToApply = appliedFilters) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filtersToApply.batchYear) params.append('batch', filtersToApply.batchYear);
      if (filtersToApply.college) params.append('college', filtersToApply.college);
      if (filtersToApply.course) params.append('course', filtersToApply.course);
      if (filtersToApply.question) params.append('question', filtersToApply.question);

      const url = `https://alumnitracersystem.onrender.com/dashboard/tracer2/analytics${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await axios.get(url);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError("Failed to load analytics data. Please try again later.");
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    fetchBatchYears();
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Update handleFilterChange to only modify pendingFilters
  const handleFilterChange = (type, value) => {
    setPendingFilters(prev => {
      const updated = { ...prev, [type]: value };

      // Reset dependent filters
      if (type === "batchYear") {
        updated.college = "";
        updated.course = "";
      } else if (type === "college") {
        updated.course = "";
      }

      return updated;
    });
  };

  // Update applyFilters to set the applied filters and fetch data
  const applyFilters = () => {
    setAppliedFilters(pendingFilters);
    fetchAnalytics(pendingFilters);

    setActiveFilters(
      Object.entries(pendingFilters)
        .filter(([_, val]) => val)
        .map(([t, v]) => ({ type: t, value: v }))
    );

    // Scroll to the results after applying filters
    setTimeout(() => {
      const resultsSection = document.querySelector(`.${styles.dashboardGrid}`);
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Update resetFilters to reset both pending and applied filters
  const resetFilters = () => {
    const reset = { batchYear: "", college: "", course: "", question: "" };
    setPendingFilters(reset);
    setAppliedFilters(reset);
    fetchAnalytics(reset);
    setActiveFilters([]);
  };

  // Update removeFilter to modify both pending and applied filters
  const removeFilter = (type) => {
    const updatedPending = { ...pendingFilters, [type]: "" };
    const updatedApplied = { ...appliedFilters, [type]: "" };

    setPendingFilters(updatedPending);
    setAppliedFilters(updatedApplied);
    fetchAnalytics(updatedApplied);

    setActiveFilters(
      Object.entries(updatedApplied)
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

    switch (questionId) {
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
        const topPosition = positions.reduce((max, pos) => pos.value > max.value ? pos : max, { value: 0 });
        return `The most common job level is "${topPosition.name}" with ${topPosition.value} respondents.`;

      case 'coreCompetencies':
        const competencies = formatRadarData(data.jobData?.coreCompetencies || {});
        const topCompetency = competencies.reduce((max, comp) => comp.value > max.value ? comp : max, { value: 0 });
        return `"${topCompetency.skill}" is the most frequently cited competency that helped in jobs (${topCompetency.value} mentions).`;

      case 'lineOfBusiness':
        const businesses = formatBarData(data.jobData?.lineOfBusiness || {});
        const topBusiness = businesses.reduce((max, bus) => bus.value > max.value ? bus : max, { value: 0 });
        return `The most common industry is "${topBusiness.name}" with ${topBusiness.value} alumni working in this field.`;

      case 'placeOfWork':
        const places = formatBarData(data.jobData?.placeOfWork || {});
        const topPlace = places.reduce((max, place) => place.value > max.value ? place : max, { value: 0 });
        return `Most alumni work in "${topPlace.name}" (${topPlace.value} respondents).`;

      case 'firstJobSearch':
        const methods = formatBarData(data.jobData?.firstJobSearch || {});
        const topMethod = methods.reduce((max, method) => method.value > max.value ? method : max, { value: 0 });
        return `"${topMethod.name}" was the most common way alumni found their first job (${topMethod.value} respondents).`;

      case 'firstJobDuration':
        const durations = formatBarData(data.jobData?.firstJobDuration || {});
        const topDuration = durations.reduce((max, dur) => dur.value > max.value ? dur : max, { value: 0 });
        return `Most alumni stayed in their first job for "${topDuration.name}" (${topDuration.value} respondents).`;

      case 'jobLandingTime':
        const times = formatBarData(data.jobData?.jobLandingTime || {});
        const topTime = times.reduce((max, time) => time.value > max.value ? time : max, { value: 0 });
        return `Most alumni landed their first job within "${topTime.name}" (${topTime.value} respondents).`;

      case 'reasons':
        const reasons = formatReasonsData(data.reasons || {});
        const topReason = reasons.reduce((max, reason) =>
          (reason.undergraduate + reason.graduate) > (max.undergraduate + max.graduate) ? reason : max,
          { undergraduate: 0, graduate: 0 }
        );
        return `"${topReason.name}" is the most common reason for pursuing advanced studies (${topReason.undergraduate + topReason.graduate} mentions).`;

      case 'workAlignment':
        const alignments = formatBarData(data.jobData?.work_alignment || {});
        const topAlignment = alignments.reduce((max, align) => align.value > max.value ? align : max, { value: 0 });
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
  const renderQuestionChart = (question) => {
    if (question.id === 'respondents') {
      return (
        <div className={styles.respondentCounter}>
          <span className={styles.counterValue}>{data?.totalRespondents || 0}</span>
          <p className={styles.counterLabel}>Total Respondents</p>
        </div>
      );
    }

    switch (question.type) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={getChartData(question.id)}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {getChartData(question.id).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      case 'bar':
        // Special handling for reasons question
        if (question.id === 'reasons') {
          const reasonsData = getChartData(question.id);
          return (
            <BarChart
              data={reasonsData}
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
          );
        }
        // Regular bar chart for other questions
        return (
          <BarChart data={getChartData(question.id)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {getChartData(question.id).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
      case 'radar':
        return (
          <RadarChart outerRadius={150} data={getChartData(question.id)}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis />
            <Radar
              name="Competency"
              dataKey="value"
              stroke="#C31D3C"
              fill="#C31D3C"
              fillOpacity={0.6}
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        );
      case 'treemap':
        return (
          <Treemap
            width={500}
            height={400}
            data={getChartData(question.id)}
            dataKey="value"
            ratio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
          >
            <Tooltip />
          </Treemap>
        );
      case 'area':
        return (
          <AreaChart
            data={getChartData(question.id)}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C31D3C" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#C31D3C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#C31D3C"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        );
      default:
        return <div>Chart type not supported</div>;
    }
  };

  const renderAdditionalInsights = (question) => {
    const insights = generateInsights(question.id);

    switch (question.id) {
      case 'respondents':
        return (
          <>
            <p><strong>Survey Participation:</strong> {data?.totalRespondents || 0} alumni responded</p>
          </>
        );
      case 'employmentStatus':
        const employed = data?.job_status?.Employed || 0;
        const unemployed = data?.job_status?.Unemployed || 0;
        const total = employed + unemployed;
        const rate = total > 0 ? ((employed / total) * 100).toFixed(1) : 0;

        return (
          <>
            <p><strong>Employment Rate:</strong> {rate}%</p>
            <p><strong>Total Employed:</strong> {employed} alumni</p>
            <p><strong>Total Unemployed:</strong> {unemployed} alumni</p>
            {insights}
          </>
        );
      case 'degreeHolders':
        const masters = data?.advancedDegreeHolders?.masters || 0;
        const doctorate = data?.advancedDegreeHolders?.doctorate || 0;
        return (
          <>
            <p><strong>Master's Degree Holders:</strong> {masters}</p>
            <p><strong>Doctorate Holders:</strong> {doctorate}</p>
            <p><strong>Advanced Degree Rate:</strong> {((masters + doctorate) / data?.totalRespondents * 100).toFixed(1)}% of respondents</p>
          </>
        );
      case 'jobLevel':
        const positions = formatBarData(data?.jobData?.position || {});
        const topPosition = positions.reduce((max, pos) => pos.value > max.value ? pos : max, { value: 0 });
        return (
          <>
            <p><strong>Most Common Position:</strong> {topPosition.name} ({topPosition.value} alumni)</p>
            <p><strong>Total Positions Reported:</strong> {positions.length}</p>
            {insights}
          </>
        );
      case 'coreCompetencies':
        const competencies = formatRadarData(data?.jobData?.coreCompetencies || {});
        const topCompetency = competencies.reduce((max, comp) => comp.value > max.value ? comp : max, { value: 0 });
        return (
          <>
            <p><strong>Top Competency:</strong> {topCompetency.skill} ({topCompetency.value} mentions)</p>
            <p><strong>Total Competencies Rated:</strong> {competencies.length}</p>
            {insights}
          </>
        );
      case 'placeOfWork':
        const places = formatBarData(data?.jobData?.placeOfWork || {});
        const topPlace = places.reduce((max, place) => place.value > max.value ? place : max, { value: 0 });
        return (
          <>
            <p><strong>Most Common Workplace:</strong> {topPlace.name} ({topPlace.value} alumni)</p>
            <p><strong>Total Workplace Types:</strong> {places.length}</p>
            {insights}
          </>
        );
      case 'workAlignment':
        const alignments = formatBarData(data?.jobData?.work_alignment || {});
        const topAlignment = alignments.reduce((max, align) => align.value > max.value ? align : max, { value: 0 });
        return (
          <>
            <p><strong>Primary Alignment:</strong> {topAlignment.name} ({topAlignment.value} alumni)</p>
            <p><strong>Alignment Distribution:</strong></p>
            <ul>
              {alignments.map((align, i) => (
                <li key={i}>{align.name}: {align.value} ({((align.value / data.totalRespondents) * 100).toFixed(1)}%)</li>
              ))}
            </ul>
          </>
        );

      case 'reasons':
        const reasonsData = getChartData('reasons');
        const totalUndergrad = reasonsData.reduce((sum, item) => sum + (item.undergraduate || 0), 0);
        const totalGrad = reasonsData.reduce((sum, item) => sum + (item.graduate || 0), 0);
        const topReason = reasonsData.reduce((max, reason) =>
          (reason.undergraduate + reason.graduate) > (max.undergraduate + max.graduate) ? reason : max,
          { undergraduate: 0, graduate: 0, name: '' }
        );

        return (
          <>
            <p><strong>Top Reason:</strong> {topReason.name}</p>
            <p><strong>Total Undergraduate Mentions:</strong> {totalUndergrad}</p>
            <p><strong>Total Graduate Mentions:</strong> {totalGrad}</p>
            <p><strong>Most Common Combination:</strong> {topReason.undergraduate + topReason.graduate} total mentions</p>
          </>
        );

      // Remove the generateInsights() call from other cases too
      case 'lineOfBusiness':
        const businesses = formatBarData(data?.jobData?.lineOfBusiness || {});
        const topBusiness = businesses.reduce((max, bus) => bus.value > max.value ? bus : max, { value: 0 });
        return (
          <>
            <p><strong>Top Industry:</strong> {topBusiness.name}</p>
            <p><strong>Total Industries Reported:</strong> {businesses.length}</p>
            <p><strong>Alumni in Top Industry:</strong> {topBusiness.value} ({((topBusiness.value / data.totalRespondents) * 100).toFixed(1)}%)</p>
          </>
        );

      case 'firstJobSearch':
        const methods = formatBarData(data?.jobData?.firstJobSearch || {});
        const topMethod = methods.reduce((max, method) => method.value > max.value ? method : max, { value: 0 });
        return (
          <>
            <p><strong>Most Common Method:</strong> {topMethod.name}</p>
            <p><strong>Total Methods Reported:</strong> {methods.length}</p>
            <p><strong>Alumni Using Top Method:</strong> {topMethod.value} ({((topMethod.value / data.totalRespondents) * 100).toFixed(1)}%)</p>
          </>
        );

      case 'firstJobDuration':
        const durations = formatBarData(data?.jobData?.firstJobDuration || {});
        const topDuration = durations.reduce((max, dur) => dur.value > max.value ? dur : max, { value: 0 });
        return (
          <>
            <p><strong>Most Common Duration:</strong> {topDuration.name}</p>
            <p><strong>Total Duration Ranges:</strong> {durations.length}</p>
            <p><strong>Alumni in Top Duration:</strong> {topDuration.value} ({((topDuration.value / data.totalRespondents) * 100).toFixed(1)}%)</p>
          </>
        );

      default:
        return <p>{insights}</p>;
    }
  };

  const getChartData = (questionId) => {
    switch (questionId) {
      case 'respondents':
        return [{ name: 'Respondents', value: data?.totalRespondents || 0 }];
      case 'employmentStatus':
        return formatBarData(data?.job_status || {});
      case 'degreeHolders':
        return degreeHolderData;
      case 'jobLevel':
        return formatBarData(data?.jobData?.position || {});
      case 'coreCompetencies':
        return formatRadarData(data?.jobData?.coreCompetencies || {});
      case 'lineOfBusiness':
        return formatBarData(data?.jobData?.lineOfBusiness || {});
      case 'placeOfWork':
        return formatBarData(data?.jobData?.placeOfWork || {});
      case 'firstJobSearch':
        return formatBarData(data?.jobData?.firstJobSearch || {});
      case 'firstJobDuration':
        return formatBarData(data?.jobData?.firstJobDuration || {});
      case 'jobLandingTime':
        return formatBarData(data?.jobData?.jobLandingTime || {});
      case 'reasons':
        return formatReasonsData(data?.reasons || {});
      case 'workAlignment':
        return formatBarData(data?.jobData?.work_alignment || {});
      default:
        return [];
    }
  };

  // Filter questions if a specific question is selected
  const visibleQuestions = appliedFilters.question
    ? QUESTIONS.filter(q => q.id === appliedFilters.question)
    : QUESTIONS;

  return (
    <div className={styles.container}>
      {/* Filter Section - Updated to match Tracer 1 */}
      <div className={styles.filterSection}>
        <div className={styles.filterHeader}>

          <h3 className={styles.filterTitle}>Filter Data</h3>

        </div>

        <div className={styles.filterContent}>
          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label>Batch Year</label>
              <select
                value={pendingFilters.batchYear}
                onChange={(e) => handleFilterChange("batchYear", e.target.value)}
              >
                <option value="">All Years</option>
                {batchYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>College</label>
              <select
                value={pendingFilters.college}
                onChange={(e) => handleFilterChange("college", e.target.value)}
              >
                <option value="">All Colleges</option>
                {availableFilters.colleges.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Course</label>
              <select
                value={pendingFilters.course}
                onChange={(e) => handleFilterChange("course", e.target.value)}
                disabled={!pendingFilters.college}
              >
                <option value="">All Courses</option>
                {pendingFilters.college &&
                  availableFilters.collegeToCourses[pendingFilters.college]?.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Question</label>
              <select
                value={pendingFilters.question}
                onChange={(e) => handleFilterChange("question", e.target.value)}
              >
                <option value="">All Questions</option>
                {QUESTIONS.map(q => (
                  <option key={q.id} value={q.id}>{q.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.filterActions}>
            <button className={styles.resetButton} onClick={resetFilters}>
              Reset
            </button>
            <button
              className={styles.applyButton}
              onClick={applyFilters}
              disabled={JSON.stringify(pendingFilters) === JSON.stringify(appliedFilters)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className={styles.activeFilters}>
          <div className={styles.activeFiltersLabel}>Active Filters:</div>
          <div className={styles.filterBadges}>
            {activeFilters.map((filter) => (
              <div key={`${filter.type}-${filter.value}`} className={styles.filterBadge}>
                <span>
                  {filter.type === "batchYear" && `Year: ${filter.value}`}
                  {filter.type === "college" && `College: ${filter.value}`}
                  {filter.type === "course" && `Course: ${filter.value}`}
                  {filter.type === "question" && `Question: ${filter.value}`}
                </span>
                <button
                  className={styles.removeFilter}
                  onClick={() => removeFilter(filter.type)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button className={styles.clearAll} onClick={resetFilters}>
              Clear All
            </button>
          </div>
        </div>
      )}


      <div className={styles.dashboardGrid}>
        {/* Dashboard Content */}
        {visibleQuestions.map(question => {
          const isSingleQuestion = appliedFilters.question !== "";

          if (isSingleQuestion) {
            return (
              <div key={question.id} className={styles.singleQuestionView}>
                <div className={`${styles.card} ${styles.singleQuestionCard}`}>
                  <div className={styles.singleQuestionChart}>
                    <ResponsiveContainer width="100%" height="100%">
                      {/* Render the appropriate chart based on question.type */}
                      {renderQuestionChart(question)}
                    </ResponsiveContainer>
                  </div>

                  <div className={styles.trendAnalysis}>
                    <h3>Key Insights</h3>
                    <p><strong>Overview:</strong> {generateInsights(question.id)}</p>
                    {/* Add additional insights specific to each question */}
                    {renderAdditionalInsights(question)}
                  </div>
                </div>
              </div>
            );
          } else {

            switch (question.id) {
              case 'respondents':
                return (
                  <div key={question.id} className={styles.row0} >
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
                return (
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
                return (
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
                return (
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
                return (
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
                return (
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

              default:
                return null;
            }
          }
        })}
      </div>
    </div>
  );
}