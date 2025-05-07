"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import styles from "./FilterReports.module.css"

export default function FilterDropdown({ label, options, value, onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (option) => {
    if (disabled) return
    onChange(option)
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
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
          <ChevronDown size={16} className={isOpen ? styles.iconRotated : ""} />
        </button>

        {isOpen && !disabled && (
          <ul className={styles.dropdownMenu} role="listbox">
            {options.length > 0 ? (
              <>
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
              </>
            ) : (
              <li className={styles.dropdownItem}>No options available</li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
