"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import styles from "./FilterReports.module.css" // Make sure this CSS exists or replace with inline styles

export default function FilterReports() {
  const tracerOptions = ["Tracer 1", "Tracer 2"]
  const surveyOptions = [
    "President Quality",
    "TUP FOUNDATION DAY BOOTHS",
    "Alumni Christmas Party"
  ]

  const [selectedTracer, setSelectedTracer] = useState("")
  const [selectedSurvey, setSelectedSurvey] = useState("")
  const [openDropdown, setOpenDropdown] = useState(null) // "tracer" or "survey"

  const handleSelect = (type, value) => {
    if (type === "tracer") {
      setSelectedTracer(value)
      setSelectedSurvey("") // clear other
    } else if (type === "survey") {
      setSelectedSurvey(value)
      setSelectedTracer("") // clear other
    }
    setOpenDropdown(null)
  }

  const Dropdown = ({ label, type, options, selected, disabled }) => (
    <div className={styles.dropdownContainer}>
      <label className={styles.label}>{label}</label>
      <div className={styles.dropdownWrapper}>
        <button
          type="button"
          className={styles.dropdownTrigger}
          onClick={() => !disabled && setOpenDropdown(openDropdown === type ? null : type)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={openDropdown === type}
        >
          <span>{selected || `Select ${label}`}</span>
          <ChevronDown size={16} className={openDropdown === type ? styles.iconRotated : ""} />
        </button>

        {openDropdown === type && !disabled && (
          <ul className={styles.dropdownMenu} role="listbox">
            <li
              className={styles.dropdownItem}
              role="option"
              onClick={() => handleSelect(type, "")}
              aria-selected={selected === ""}
            >
              All {label}s
            </li>
            {options.map((option) => (
              <li
                key={option}
                className={`${styles.dropdownItem} ${selected === option ? styles.selected : ""}`}
                role="option"
                onClick={() => handleSelect(type, option)}
                aria-selected={selected === option}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <Dropdown
        label="Tracer Type"
        type="tracer"
        options={tracerOptions}
        selected={selectedTracer}
        disabled={!!selectedSurvey}
      />

      <Dropdown
        label="Custom Survey"
        type="survey"
        options={surveyOptions}
        selected={selectedSurvey}
        disabled={!!selectedTracer}
      />
    </div>
  )
}
