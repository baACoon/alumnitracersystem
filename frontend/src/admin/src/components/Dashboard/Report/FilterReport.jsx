"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import styles from "./FilterReports.module.css"

function FilterDropdown({ label, options, value, onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (option) => {
    if (disabled) return
    onChange(option)
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    if (disabled) return
    setIsOpen((prev) => !prev)
  }

  return (
    <div className={styles.dropdownContainer}>
      <label className={styles.label}>{label}</label>
      <div className={styles.dropdownWrapper}>
        <button
          type="button"
          className={`${styles.dropdownTrigger} ${disabled ? styles.disabled : ""}`}
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
        >
          <span>{value || `Select ${label}`}</span>
          <ChevronDown
            size={16}
            className={`${isOpen ? styles.iconRotated : ""} ${
              disabled ? styles.disabledIcon : ""
            }`}
          />
        </button>

        {isOpen && !disabled && (
          <ul className={styles.dropdownMenu} role="listbox">
            <li
              className={styles.dropdownItem}
              role="option"
              onClick={() => handleSelect("")}
              aria-selected={value === ""}
            >
              All {label}s
            </li>
            {options.map((option) => (
              <li
                key={option}
                className={`${styles.dropdownItem} ${value === option ? styles.selected : ""}`}
                role="option"
                onClick={() => handleSelect(option)}
                aria-selected={value === option}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function FilterContainer() {
  const [tracerType, setTracerType] = useState("")
  const [customSurvey, setCustomSurvey] = useState("")

  const handleTracerChange = (val) => {
    setTracerType(val)
    if (val !== "") setCustomSurvey("")
  }

  const handleCustomSurveyChange = (val) => {
    setCustomSurvey(val)
    if (val !== "") setTracerType("")
  }

  return (
    <div style={{ maxWidth: 300, margin: "2rem auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <FilterDropdown
        label="Tracer Type"
        options={["Graduate", "Undergrad", "Others"]}
        value={tracerType}
        onChange={handleTracerChange}
        disabled={customSurvey !== ""}
      />

      <FilterDropdown
        label="Custom Survey"
        options={["Survey A", "Survey B", "Survey C"]}
        value={customSurvey}
        onChange={handleCustomSurveyChange}
        disabled={tracerType !== ""}
      />
    </div>
  )
}
