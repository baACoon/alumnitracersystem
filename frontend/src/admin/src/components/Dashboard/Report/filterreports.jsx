"use client"
import { useState } from "react"
import FilterDropdown from "./FilterReport" // Adjust the path if necessary

export default function FilterReportContainer() {
    const [tracerType, setTracerType] = useState("")
    const [customSurvey, setCustomSurvey] = useState("")

    const handleTracerTypeChange = (value) => {
        setTracerType(value)
        if (value) {
            setCustomSurvey("") // Reset custom survey when tracer type is selected
        }
    }

    const handleCustomSurveyChange = (value) => {
        setCustomSurvey(value)
        if (value) {
            setTracerType("") // Reset tracer type when custom survey is selected
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
                disabled={!!customSurvey} // Disable if custom survey is selected
            />

            {/* Custom Survey Dropdown */}
            <FilterDropdown
                label="Custom Survey"
                options={["Survey 1", "Survey 2", "Survey 3"]}
                value={customSurvey}
                onChange={handleCustomSurveyChange}
                disabled={!!tracerType} // Disable if tracer type is selected
            />
        </div>
    )
}