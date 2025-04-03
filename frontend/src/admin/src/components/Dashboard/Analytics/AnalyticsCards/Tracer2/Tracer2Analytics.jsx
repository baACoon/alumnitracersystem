
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import styles from "./Tracer2Analytics.module.css"

export default function Tracer2Analytics() {
  // Sample data for the donut charts
  const chartData = [
    { name: "Category 1", value: 45, color: "#4CC3C8" }, // Teal
    { name: "Category 2", value: 30, color: "#FF6B81" }, // Pink
    { name: "Category 3", value: 20, color: "#FFD166" }, // Yellow
    { name: "Category 4", value: 5, color: "#FF9F43" }, // Orange
  ]

  // Sample data for the bar charts
  const barChartData = [
    { category: "Red", value: 12 },
    { category: "Blue", value: 19 },
    { category: "Yellow", value: 3 },
    { category: "Green", value: 5 },
    { category: "Purple", value: 2 },
    { category: "Orange", value: 3 },
    { category: "Red", value: 12 },
  ]

  // Sample data for the occupation list
  const occupationData = [
    { occupation: "ELECTRICAL ENGINEERING", value: 57 },
    { occupation: "MECHANICAL ENGINEERING", value: 54 },
    { occupation: "TEACHER", value: 40 },
    { occupation: "DENTIST", value: 34 },
    { occupation: "WEB DEVELOPER", value: 21 },
    { occupation: "CALL CENTER REPRESENTATIVE", value: 14 },
  ]

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

  // Reusable donut chart component
  const DonutChart = ({ title }) => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles.dashboardGrid}>
      {/* ROW 1 */}
      <div className={styles.row1}>
        {/* Respondents Counter */}
        <div className={`${styles.card} ${styles.respondentsCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>TRACER SURVEY FORM RESPONDENTS</h2>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.counterValue}>3</span>
          </div>
        </div>

        {/* Educational Attainment Chart */}
        <div className={`${styles.card} ${styles.educationalAttainmentCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>EDUCATIONAL ATTAINMENT</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Examination Passed Chart */}
        <div className={`${styles.card} ${styles.examinationPassedCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>EXAMINATION PASSED</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2 */}
      <div className={styles.row2}>
        {/* Reasons of Taking the Course */}
        <div className={`${styles.card} ${styles.reasonsCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>REASONS OF TAKING THE COURSE</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.splitCharts}>
              <div className={styles.splitChart}>
                <h3 className={styles.subTitle}>UNDERGRADUATE PROGRAMS</h3>
                <div className={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        paddingAngle={2}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={styles.splitChart}>
                <h3 className={styles.subTitle}>GRADUATE PROGRAMS</h3>
                <div className={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        paddingAngle={2}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prof Training Program */}
        <div className={`${styles.card} ${styles.trainingProgramCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>PROF TRAINING PROGRAM</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3 */}
      <div className={styles.row3}>
        {/* Present Employment Status */}
        <div className={`${styles.card} ${styles.employmentStatusCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>PRESENT EMPLOYMENT STATUS</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20 }}>
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="# of Votes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Present Occupation */}
        <div className={`${styles.card} ${styles.occupationCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>PRESENT OCCUPATION</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.occupationList}>
              {occupationData.map((item, index) => (
                <div key={index} className={styles.occupationItem}>
                  <span className={styles.occupationName}>{item.occupation}</span>
                  <span className={styles.occupationValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ROW 4 */}
      <div className={styles.row4}>
        {/* Line of Business */}
        <div className={`${styles.card} ${styles.lineOfBusinessCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>LINE OF BUSINESS</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
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
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* First Job After College */}
        <div className={`${styles.card} ${styles.firstJobCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>FIRST JOB AFTER COLLEGE</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 5 */}
      <div className={styles.row5}>
        {/* Job Related Course */}
        <div className={`${styles.card} ${styles.jobRelatedCourseCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>JOB RELATED COURSE</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* First Job Duration */}
        <div className={`${styles.card} ${styles.firstJobDurationCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>FIRST JOB DURATION</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="# of Votes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 6 */}
      <div className={styles.row6}>
        {/* Reason for Changing Job */}
        <div className={`${styles.card} ${styles.reasonChangingJobCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>REASON FOR CHANGING JOB</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="# of Votes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* First Job Landing Time */}
        <div className={`${styles.card} ${styles.firstJobLandingTimeCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>FIRST JOB LANDING TIME</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#7DD3FC" name="# of Votes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

