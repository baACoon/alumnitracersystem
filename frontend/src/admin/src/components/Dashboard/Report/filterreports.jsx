"use client"
import { useState } from "react"
import FilterDropdown from "./FilterReport"
import styles from "./FilterReports.module.css"

export default function ReportsFilter() {
    // State for all filters
    const [batch, setBatch] = useState("")
    const [tracerType, setTracerType] = useState("")
    const [customSurvey, setCustomSurvey] = useState("")

    // Sample options
    const batchOptions = ["2023", "2024", "2025"]
    const tracerOptions = ["Tracer 1", "Tracer 2", "Tracer 3"]
    const surveyOptions = ["Alumni Survey", "Employability Survey", "Event Feedback"]

    // Handler for Tracer Type
    const handleTracerTypeChange = (selected) => {
        setTracerType(selected)
        if (selected) setCustomSurvey("") // Clear custom survey when tracer is selected
    }

    // Handler for Custom Survey
    const handleCustomSurveyChange = (selected) => {
        setCustomSurvey(selected)
        if (selected) setTracerType("") // Clear tracer type when survey is selected
    }

    return (
        <div className={styles.filterContainer}>
            {/* Batch - Always enabled */}
            <FilterDropdown
                label="Batch"
                options={batchOptions}
                value={batch}
                onChange={setBatch}
            />
            
            {/* Tracer Type - Disabled when Custom Survey has value */}
            <FilterDropdown
                label="Tracer Type"
                options={tracerOptions}
                value={tracerType}
                onChange={handleTracerTypeChange}
                disabled={!!customSurvey}
            />
            
            {/* Custom Survey - Disabled when Tracer Type has value */}
            <FilterDropdown
                label="Custom Survey"
                options={surveyOptions}
                value={customSurvey}
                onChange={handleCustomSurveyChange}
                disabled={!!tracerType}
            />
        </div>
    )
}