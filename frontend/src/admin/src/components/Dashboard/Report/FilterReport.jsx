"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import styles from "./FilterReports.module.css"

export default function FilterReports() {
  const tracerOptions = ["Tracer1", "Tracer2"]
  const customSurveyOptions = ["Custom Survey A", "Custom Survey B"]

  const [tracerType, setTracerType] = useState("")
  const [customSurvey, setCustomSurvey] = useState("")
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleTracerSelect = (value) => {
    setTracerType(value)
    if (value) setCustomSurvey("") // reset custom survey if tracer selected
    setOpenDropdown(null)
  }

  const handleCustomSurveySelect = (value) => {
    setCustomSurvey(value)
    if (value) setTracerType("") // reset tracer type if custom selected
    setOpenDropdown(null)
  }

  const renderDropdown = (label, options, value, onSelect, disabled) => (
    <div className={styles.dropdownContainer}>
      <label className={styles.label}>{label}</label>
      <div className={styles.dropdownWrapper}>
        <button
          type="button"
          className={`${styles.dropdownTrigger} ${disabled ? styles.disabled : ""}`}
          onClick={() => !disabled && setOpenDropdown(openDropdown === label ? null : label)}
          aria-haspopup="listbox"
          aria-expanded={openDropdown === label}
          disabled={disabled}
        >
          <span>{value || `Select ${label}`}</span>
          <ChevronDown
            size={16}
            className={openDropdown === label ? styles.iconRotated : ""}
          />
        </button>

        {openDropdown === label && !disabled && (
          <ul className={styles.dropdownMenu} role="listbox">
            <li
              className={styles.dropdownItem}
              role="option"
              onClick={() => onSelect("")}
              aria-selected={value === ""}
            >
              All {label}s
            </li>
            {options.map((option) => (
              <li
                key={option}
                className={`${styles.dropdownItem} ${value === option ? styles.selected : ""}`}
                role="option"
                onClick={() => onSelect(option)}
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

  return (
    <div>
      {renderDropdown("Tracer Type", tracerOptions, tracerType, handleTracerSelect, !!customSurvey)}
      {renderDropdown("Custom Survey", customSurveyOptions, customSurvey, handleCustomSurveySelect, !!tracerType)}
    </div>
  )
}
