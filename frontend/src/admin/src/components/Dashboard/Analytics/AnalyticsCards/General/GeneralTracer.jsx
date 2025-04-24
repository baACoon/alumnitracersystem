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
import styles from "./GeneralTracer.module.css"

// Color palette for charts
const COLORS = {
  tracer1: "#4CC3C8",
  tracer2: "#C31D3C",
}

export default function GeneralTracer() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://alumnitracersystem.onrender.com/dashboard/tracer/comparison");
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
  }, []);
  

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
        </p>
      </div>
    </div>
  )
}