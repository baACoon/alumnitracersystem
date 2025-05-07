"use client"

import { useState } from "react"
import FilterDropdown from "./FilterReport" // Adjust the path if necessary

export default function FilterReportContainer() {
    const [tracerType, setTracerType] = useState("") // State for Tracer Type
    const [customSurvey, setCustomSurvey] = useState("") // State for Custom Survey

    // Handle Tracer Type selection
    const handleTracerTypeChange = (value) => {
        setTracerType(value)
        if (value) {
            setCustomSurvey("") // Reset Custom Survey when Tracer Type is selected
        }
    }

    // Handle Custom Survey selection
    const handleCustomSurveyChange = (value) => {
        setCustomSurvey(value)
        if (value) {
            setTracerType("") // Reset Tracer Type when Custom Survey is selected
        }
    }

    return (
        <div>
            {/* Tracer Type Dropdown */}
            <FilterDropdown
                label="Tracer Type"
                options={["Tracer 1", "Tracer 2", "Tracer 3"]}
                value={tracerType}
                onChange={handleTracerTypeChange}
                disabled={!!customSurvey} // Disable if Custom Survey is selected
            />

            {/* Custom Survey Dropdown */}
            <FilterDropdown
                label="Custom Survey"
                options={["Survey 1", "Survey 2", "Survey 3"]}
                value={customSurvey}
                onChange={handleCustomSurveyChange}
                disabled={!!tracerType} // Disable if Tracer Type is selected
            />
        </div>
    )
}