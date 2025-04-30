import { Download, X } from "lucide-react";
import React, { useEffect, useState } from 'react';
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
    AreaChart, Area
} from "recharts";
import styles from "./SurveyDetailsModal.module.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SurveyDetailsModal({ isOpen, onClose, selectedSurvey }) {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    if (!isOpen || !selectedSurvey) return null;

    const handleExport = () => {
        if (!selectedSurvey) return;

        const params = new URLSearchParams();
        if (selectedSurvey.batch) params.append("batch", selectedSurvey.batch);

        const type = selectedSurvey.type === "Tracer1" ? "Tracer1" : selectedSurvey.type === "Tracer2" ? "Tracer2" : selectedSurvey.title;

        const url = `https://alumnitracersystem.onrender.com/tempReport/export/${encodeURIComponent(type)}?${params.toString()}`;
        const win = window.open(url, "_blank");

        if (!win) {
            toast.warning("Popup blocked. Please allow popups for this site.");
        }
    };

    useEffect(() => {
        if (!selectedSurvey) return;

        const fetchChartData = async () => {
            try {
                setLoading(true);
                
                const params = new URLSearchParams();
                if (selectedSurvey.batch) params.append('batch', selectedSurvey.batch);
                if (selectedSurvey._id) params.append('surveyId', selectedSurvey._id);
                
                const type = selectedSurvey.type === "Tracer1" 
                    ? "Tracer1" 
                    : selectedSurvey.type === "Tracer2" 
                    ? "Tracer2" 
                    : selectedSurvey.title;
                
                const url = `https://alumnitracersystem.onrender.com/tempReport/chart-summary/${encodeURIComponent(type)}?${params.toString()}`;
                const response = await axios.get(url);
                
                const data = response.data.data || {};
                
                // Calculate employed and unemployed counts
                const employedCount = data.totalEmployed || 0;
                const unemployedCount = data.job_status?.Unemployed || 0;
                
                // Format data for advanced degree holders
                const degreeHolderData = [
                    { name: "Doctorate", value: data.advancedDegreeHolders?.doctorate || 0, color: COLORS[0] },
                    { name: "Masters", value: data.advancedDegreeHolders?.masters || 0, color: COLORS[1] },
                ];
                
                // Format data for core competencies radar chart
                const coreCompetenciesData = formatRadarData(data.jobData?.coreCompetencies || {});
                
                setChartData({
                    respondentCount: data.respondentCount || 0,
                    degreeData: data.degreeData || [],
                    collegeData: data.collegeData || [],
                    yearStartedData: data.yearStartedData || [],
                    employmentStatusData: data.employmentStatusData || [],
                    organizationTypeData: data.organizationTypeData || [],
                    workAlignmentData: data.workAlignmentData || [],
                    
                    // New fields for Tracer2
                    employedCount,
                    unemployedCount,
                    degreeHolderData,
                    coreCompetenciesData,
                    jobLevelData: formatBarData(data.jobData?.position || {}),
                    lineOfBusinessData: formatBarData(data.jobData?.lineOfBusiness || {}),
                    placeOfWorkData: formatBarData(data.jobData?.placeOfWork || {}),
                    firstJobSearchData: formatBarData(data.jobData?.firstJobSearch || {}),
                    firstJobDurationData: formatBarData(data.jobData?.firstJobDuration || {}),
                    jobLandingTimeData: formatBarData(data.jobData?.jobLandingTime || {}),
                    reasonsData: formatReasonsData(data.reasons || {}),
                });
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching survey details chart data:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchChartData();
    }, [selectedSurvey]);

    // Determine survey type
    const surveyType = selectedSurvey.tracer2 ? "Tracer 2" : selectedSurvey.tracer1 ? "Tracer 1" : "Custom";

    // Chart colors
    const COLORS = ["#4CC3C8", "#FF6B81", "#FFD166", "#FF9F43", "#7E57C2", "#26A69A"];

    // Custom tooltip component
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

    // Helper function to format data for charts
const formatBarData = (obj) => {
    if (!obj) return [];
    return Object.entries(obj).map(([name, value]) => ({ name, value }));
};

const formatReasonsData = (obj) => {
    if (!obj) return [];
    return Object.entries(obj).map(([name, value]) => ({
        name,
        undergraduate: value.undergraduate || 0,
        graduate: value.graduate || 0,
    }));
};

const formatRadarData = (obj) =>
    Object.entries(obj).map(([key, val]) => ({
        skill: key,
        value: val,
    }));

    if (loading) return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.loading}>Loading survey data for batch {selectedSurvey.batch}...</div>
            </div>
        </div>
    );

    if (error) return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.error}>Error loading data for batch {selectedSurvey.batch}: {error}</div>
            </div>
        </div>
    );
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        Survey Details: {surveyType} - {selectedSurvey.tracer2 || selectedSurvey.tracer1}
                    </h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                        <span className="sr-only">Close</span>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.surveyInfo}>
                        <div className={styles.infoCard}>
                            <h3>Survey Information</h3>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Batch:</span>
                                    <span className={styles.infoValue}>{selectedSurvey.batch}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Survey Type:</span>
                                    <span className={styles.infoValue}>{surveyType}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Value:</span>
                                    <span className={styles.infoValue}>{selectedSurvey.tracer2 || selectedSurvey.tracer1}</span>
                                </div>
                                {selectedSurvey.tracer2 && (
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Version:</span>
                                        <span className={styles.infoValue}>{selectedSurvey.version}</span>
                                    </div>
                                )}
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Date:</span>
                                    <span className={styles.infoValue}>{selectedSurvey.date}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Total Responses:</span>
                                    <span className={styles.infoValue}>{selectedSurvey.responses}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.chartsSection}>
                        <h3>Response Summary</h3>

                        {/* Different chart visualizations based on survey type */}
                        {surveyType === "Tracer 1" && (
                            <>
                                {/* <div className={styles.topRow}>
                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}><h2 className={styles.cardTitle}>TRACER SURVEY FORM RESPONDENTS</h2></div>
                                        <div className={styles.cardContent}><span className={styles.counterValue}>{chartData?.respondentCount || 0}</span></div>
                                    </div>

                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}><h2 className={styles.cardTitle}>DEGREE</h2></div>
                                        <div className={styles.cardContent}>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <PieChart>
                                                    <Pie 
                                                        data={chartData?.degreeData || []} 
                                                        dataKey="value" 
                                                        nameKey="name" 
                                                        cx="50%" 
                                                        cy="50%" 
                                                        outerRadius={80} 
                                                        paddingAngle={2}
                                                    >
                                                        {(chartData?.degreeData || []).map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}><h2 className={styles.cardTitle}>COLLEGE</h2></div>
                                        <div className={styles.cardContent}>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <PieChart>
                                                    <Pie 
                                                        data={chartData?.collegeData || []} 
                                                        dataKey="value" 
                                                        nameKey="name" 
                                                        cx="50%" 
                                                        cy="50%" 
                                                        outerRadius={80} 
                                                        paddingAngle={2}
                                                    >
                                                        {(chartData?.collegeData || []).map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div> */}

                                <div className={styles.barRow}>
                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}><h2 className={styles.cardTitle}>YEAR STARTED</h2></div>
                                        <div className={styles.cardContent}>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart
                                                    data={chartData?.yearStartedData || []}
                                                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                                                >
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Bar dataKey="value" fill="#7DD3FC" name="Count" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}><h2 className={styles.cardTitle}>EMPLOYMENT STATUS</h2></div>
                                        <div className={styles.cardContent}>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart
                                                    data={chartData?.employmentStatusData || []}
                                                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                                                >
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Bar dataKey="value" fill="#7DD3FC" name="Count" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.barRow}>
                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}><h2 className={styles.cardTitle}>TYPE OF ORGANIZATION</h2></div>
                                        <div className={styles.cardContent}>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart
                                                    data={chartData?.organizationTypeData || []}
                                                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                                                >
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Bar dataKey="value" fill="#7DD3FC" name="Count" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}><h2 className={styles.cardTitle}>WORK ALIGNMENT IN COURSE</h2></div>
                                        <div className={styles.cardContent}>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart
                                                    data={chartData?.workAlignmentData || []}
                                                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                                                >
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Bar dataKey="value" fill="#7DD3FC" name="Count" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {surveyType === "Tracer 2" && (
                            <>
                                {/* ROW 0 - Total Responses */}
                                <div className={styles.row0}>
                                    <div className={`${styles.card} ${styles.respondentsCard}`}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}>TRACER SURVEY FORM RESPONDENTS</h2>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <span className={styles.counterValue}>{chartData?.respondentCount || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ROW 1 - Degree Holder, Total Employed, Total Unemployed */}
                                <div className={styles.row1}>
                                    {/* Degree Holders Chart */}
                                    <div className={`${styles.card} ${styles.educationalAttainmentCard}`}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}>DEGREE HOLDERS (MASTERAL & DOCTORATE)</h2>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.chartContainer}>
                                                <ResponsiveContainer width="100%" height={200}>
                                                    <PieChart>
                                                        <Pie
                                                            data={chartData?.degreeHolderData || []}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={80}
                                                            paddingAngle={2}
                                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                        >
                                                            {(chartData?.degreeHolderData || []).map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Employed Counter */}
                                    <div className={`${styles.card} ${styles.employedCard}`}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}>TOTAL NUMBER OF EMPLOYED</h2>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <span className={styles.counterValue}>{chartData?.employedCount || 0}</span>
                                        </div>
                                    </div>

                                    {/* Total Unemployed Counter */}
                                    <div className={`${styles.card} ${styles.unemployedCard}`}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}>TOTAL NUMBER OF UNEMPLOYED</h2>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <span className={styles.counterValue}>{chartData?.unemployedCount || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ROW 2 - Employment Status, Job Level, Core Competencies */}
                                <div className={styles.row2}>
                                    {/* Employment Status */}
                                    <div className={`${styles.card} ${styles.employmentStatusCard}`}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}>PRESENT EMPLOYMENT STATUS</h2>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.chartContainer}>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <PieChart>
                                                        <Pie
                                                            data={chartData?.employmentStatusData || []}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={100}
                                                            paddingAngle={2}
                                                            label
                                                        >
                                                            {(chartData?.employmentStatusData || []).map((_, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job Level Chart */}
                                    <div className={`${styles.card} ${styles.jobLevelCard}`}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}>JOB LEVEL</h2>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.chartContainer}>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <BarChart
                                                        data={chartData?.jobLevelData || []}
                                                        layout="vertical"
                                                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                                                    >
                                                        <XAxis type="number" />
                                                        <YAxis type="category" dataKey="name" />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Bar dataKey="value">
                                                            {(chartData?.jobLevelData || []).map((_, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Core Competencies */}
                                    <div className={`${styles.card} ${styles.coreCompetenciesCard}`}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}>CORE COMPETENCIES THAT HELPED IN JOB</h2>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.chartContainer}>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <RadarChart data={chartData?.coreCompetenciesData || []}>
                                                        <PolarGrid />
                                                        <PolarAngleAxis dataKey="skill" />
                                                        <PolarRadiusAxis />
                                                        <Radar name="Skills" dataKey="value" stroke="#d32f2f" fill="#d32f2f" fillOpacity={0.6} />
                                                        <Tooltip />
                                                        <Legend />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ROW 3 - Major Line, Place of work */}
                                <div className={styles.row3}>
                                    {/* Line of Business */}
                                    <div className={`${styles.card} ${styles.lineOfBusinessCard}`}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}>MAJOR LINE OF BUSINESS</h2>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.chartContainer}>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <Treemap
                                                        data={chartData?.lineOfBusinessData || []}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        ratio={4 / 3}
                                                        stroke="#fff"
                                                        content={({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {
                                                            const formattedData = chartData?.lineOfBusinessData || [];
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
                                                            );
                                                        }}
                                                    />
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Place of Work */}
                                    <div className={`${styles.card} ${styles.placeOfWorkCard}`}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}>PLACE OF WORK</h2>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.chartContainer}>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <PieChart>
                                                        <Pie
                                                            data={chartData?.placeOfWorkData || []}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={100}
                                                            paddingAngle={2}
                                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                        >
                                                            {(chartData?.placeOfWorkData || []).map((_, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ROW 4 - How did you find your first job, How long did you stay in your first job, How long did it take for you to land your first job */}
                                <div className={styles.row4}>
                                    {/* How did you find your first job */}
                                    <div className={`${styles.card} ${styles.findFirstJobCard}`}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}>HOW DID YOU FIND YOUR FIRST JOB</h2>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.chartContainer}>
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <PieChart>
                                                        <Pie
                                                            data={chartData?.firstJobSearchData || []}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={40}
                                                            outerRadius={80}
                                                            paddingAngle={2}
                                                        >
                                                            {(chartData?.firstJobSearchData || []).map((_, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>

                                    {/* First Job Duration */}
                                    <div className={`${styles.card} ${styles.firstJobDurationCard}`}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}>HOW LONG DID YOU STAY IN YOUR FIRST JOB</h2>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.chartContainer}>
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <AreaChart
                                                        data={chartData?.firstJobDurationData || []}
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
                                        </div>
                                    </div>

                                    {/* Time to Land First Job */}
                                    <div className={`${styles.card} ${styles.firstJobLandingTimeCard}`}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}>HOW LONG DID IT TAKE TO LAND YOUR FIRST JOB</h2>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.chartContainer}>
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <BarChart
                                                        data={chartData?.jobLandingTimeData || []}
                                                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                                                        <YAxis />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Bar dataKey="value">
                                                            {(chartData?.jobLandingTimeData || []).map((_, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ROW 5 - Reasons for pursuing advanced studies, Course alignment to work */}
                                <div className={styles.row5}>
                                    {/* Reasons for pursuing advanced studies */}
                                    <div className={`${styles.card} ${styles.reasonsCard}`}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}>REASONS FOR PURSUING ADVANCED STUDIES</h2>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.chartContainer}>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <BarChart
                                                        data={chartData?.reasonsData || []}
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
                                        </div>
                                    </div>

                                    {/* Curriculum Alignment to Job */}
                                    <div className={`${styles.card} ${styles.curriculumJobAlignmentCard}`}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}>WAS YOUR CURRICULUM ALIGNED TO YOUR JOB?</h2>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.chartContainer}>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <PieChart>
                                                        <Pie
                                                            data={chartData?.workAlignmentData || []}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={70}
                                                            outerRadius={90}
                                                            paddingAngle={2}
                                                            label
                                                        >
                                                            {(chartData?.workAlignmentData || []).map((_, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {surveyType !== "Tracer 1" && surveyType !== "Tracer 2" && (
                            <div className={styles.chartsGrid}>
                                {/* Default Pie Chart for Custom Surveys */}
                                <div className={styles.chartCard}>
                                    <h4>Completion Rate</h4>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={chartData?.pieData || []}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                paddingAngle={2}
                                                label
                                            >
                                                {(chartData?.pieData || []).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.exportButton} onClick={handleExport}>
                        <Download size={16} />
                        Export Survey Data
                    </button>
                </div>
            </div>
        </div>
    );
}