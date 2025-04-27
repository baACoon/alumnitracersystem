import React, { useState, useEffect } from "react"
import { Download } from "lucide-react"
import styles from "./Reports-Content.module.css"
import FilterDropdown from "./FilterReport"
import ReportsTable from "./TableReports"

export default function ReportsTab() {
  const [selectedBatch, setSelectedBatch] = useState("")
  const [selectedTracerType, setSelectedTracerType] = useState("")
  const [selectedVersion, setSelectedVersion] = useState("")
  const [selectedCustomSurvey, setSelectedCustomSurvey] = useState("")
  const [rawData, setRawData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [totalResponses, setTotalResponses] = useState(0)
  const [isExportEnabled, setIsExportEnabled] = useState(false)
  const [fetchError, setFetchError] = useState("")


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5050/tempReport/reports")
        const result = await response.json()
        setRawData(result.reports || [])
        setFetchError("")
      } catch (error) {
        console.error("Error fetching reports:", error)
        setRawData([])
        setFetchError("Failed to fetch survey report data.")
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    let newData = [...rawData]

    if (selectedBatch) {
      newData = newData.filter((item) => item.batch === selectedBatch)
    }

    // Tracer filter
    if (selectedTracerType === "Tracer 1") {
      newData = newData.filter((item) => item.tracer1)
    }

    if (selectedTracerType === "Tracer 2") {
      newData = newData.filter((item) => item.tracer2)
      if (selectedVersion) {
        newData = newData.filter((item) => item.version === selectedVersion)
      }
    }

    // Custom Survey filter (separate logic)
    if (selectedCustomSurvey) {
      newData = newData.filter((item) => item.customSurvey === selectedCustomSurvey)
    }

    setFilteredData(newData)

    const total = newData.reduce((sum, item) => sum + item.responses, 0)
    setTotalResponses(total)

    setIsExportEnabled(
      selectedBatch || selectedTracerType || selectedVersion || selectedCustomSurvey
    )
  }, [selectedBatch, selectedTracerType, selectedVersion, selectedCustomSurvey, rawData])

  const getUniqueValues = (key) => {
    if (!Array.isArray(rawData)) return []
    return [...new Set(rawData.map(item => item[key]).filter(Boolean))]
  }

  const getBatches = () => getUniqueValues("batch")
  const getVersionOptions = () => getUniqueValues("version")
  const getCustomSurveyOptions = () => getUniqueValues("customSurvey")

  const handleReset = () => {
    setSelectedBatch("")
    setSelectedTracerType("")
    setSelectedVersion("")
    setSelectedCustomSurvey("")
  }

  const exportSurvey = (type) => {
    if (!type) {
      alert("Please select a survey to export.");
      return;
    }
  
    const params = new URLSearchParams();
  
    if (selectedBatch) params.append("batch", selectedBatch);
    if (selectedTracerType === "Tracer 1") params.append("surveyType", "Tracer1");
    if (selectedTracerType === "Tracer 2") params.append("surveyType", "Tracer2");
    if (selectedCustomSurvey) params.append("customSurvey", selectedCustomSurvey);
  
    const url = `http://localhost:5050/tempReport/export/${encodeURIComponent(type)}?${params.toString()}`;
    const win = window.open(url, "_blank");
  
    if (!win) {
      alert("Popup blocked. Please allow popups for this site.");
    }
  };
  

  return (
    <div className={styles.reportsContainer}>
      <div className={styles.filtersSection}>
        <div className={styles.filtersGrid}>
          <FilterDropdown label="Batch" options={getBatches()} value={selectedBatch} onChange={setSelectedBatch} />

          <FilterDropdown
            label="Tracer Type"
            options={["Tracer 1", "Tracer 2"]}
            value={selectedTracerType}
            onChange={(value) => {
              setSelectedTracerType(value)
              setSelectedVersion("")
            }}
          />

          {selectedTracerType === "Tracer 2" && (
            <FilterDropdown
              label="Version"
              options={getVersionOptions()}
              value={selectedVersion}
              onChange={setSelectedVersion}
            />
          )}

          {getCustomSurveyOptions().length > 0 && (
            <FilterDropdown
              label="Custom Survey"
              options={getCustomSurveyOptions()}
              value={selectedCustomSurvey}
              onChange={setSelectedCustomSurvey}
            />
          )}
        </div>

        <div className={styles.filterActions}>
          <button className={styles.resetButton} onClick={handleReset}>
            Reset Filters
          </button>
          <button
            className={`${styles.exportButton} ${!isExportEnabled ? styles.disabled : ""}`}
            onClick={() => {
              if (selectedCustomSurvey) {
                exportSurvey(selectedCustomSurvey)
              } else if (selectedTracerType === "Tracer 1") {
                exportSurvey("Tracer1")
              } else if (selectedTracerType === "Tracer 2") {
                exportSurvey("Tracer2")
              } else {
                alert("Please select a survey type to export.")
              }
            }}
            
            disabled={!isExportEnabled}
          >
            <Download size={16} />
            Export Responses
          </button>
        </div>
      </div>

      <div className={styles.resultsSection}>
        <div className={styles.responseStats}>
          <h2 className={styles.sectionTitle}>Survey Responses</h2>
          <div className={styles.responsesCount}>
            <span className={styles.countLabel}>Total Responses:</span>
            <span className={styles.countValue}>{totalResponses}</span>
          </div>
        </div>
        {fetchError && (
          <div className={styles.errorBox}>
            ⚠️ {fetchError}
          </div>
        )}

        <ReportsTable data={filteredData} />
      </div>
    </div>
  )
}