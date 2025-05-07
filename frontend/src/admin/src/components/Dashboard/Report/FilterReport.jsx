"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import styles from "./FilterReports.module.css"

export default function FilterDropdown({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)

  // Check if this dropdown should be disabled based on the other one
  const shouldDisable = () => {
    const tracer = document.querySelector('[data-label="Tracer Type"] span')?.innerText
    const survey = document.querySelector('[data-label="Custom Survey"] span')?.innerText

    if (label === "Tracer Type" && survey && survey !== "Select Custom Survey") return true
    if (label === "Custom Survey" && tracer && tracer !== "Select Tracer Type") return true

    return false
  }

  const handleSelect = (option) => {
    onChange(option)
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    if (shouldDisable()) return
    setIsOpen((prev) => !prev)
  }

  return (
    <div className={styles.dropdownContainer}>
      <label className={styles.label}>{label}</label>
      <div className={styles.dropdownWrapper}>
        <button
          type="button"
          data-label={label}
          className={`${styles.dropdownTrigger} ${shouldDisable() ? styles.disabled : ""}`}
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={shouldDisable()}
        >
          <span>{value || `Select ${label}`}</span>
          <ChevronDown
            size={16}
            className={isOpen ? styles.iconRotated : ""}
          />
        </button>

        {isOpen && (
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
