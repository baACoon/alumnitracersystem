"use client"

import { useState } from "react"
import FilterDropdown from "./filterreports";

export default function FilterReports() {
  const [tracerType, setTracerType] = useState("")
  const [customSurvey, setCustomSurvey] = useState("")

  return (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column", width: "300px", padding: "1rem" }}>
      <FilterDropdown
        label="Tracer Type"
        options={["Tracer 1", "Tracer 2", "Tracer 3"]}
        value={tracerType}
        onChange={(val) => {
          setTracerType(val)
          if (val) setCustomSurvey("")
        }}
        disabled={!!customSurvey}
      />

      <FilterDropdown
        label="Custom Survey"
        options={["Survey A", "Survey B", "Survey C"]}
        value={customSurvey}
        onChange={(val) => {
          setCustomSurvey(val)
          if (val) setTracerType("")
        }}
        disabled={!!tracerType}
      />
    </div>
  )
}
