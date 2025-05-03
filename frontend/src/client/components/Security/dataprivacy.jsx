import React, { useState } from "react";
import { Shield, CheckCircle, AlertCircle, ChevronRight, X, ChevronDown } from "lucide-react";
import styles from "./dataprivacy.module.css";

function DataPrivacyConsent({ onComplete, onDecline, fullPage = false }) {
  const [consentGiven, setConsentGiven] = useState(false);

  const handleProceed = () => {
    if (consentGiven && onComplete) {
      onComplete();
    }
  };

  const handleDecline = () => {
    if (onDecline) {
      onDecline();
    }
  };

  return (
    <div className={`${styles.fullPage} ${fullPage ? styles.fullPage : ''}`}>
      <div className={styles.dialogContent}>
        <div className={styles.dialogHeader}>
          <div className={styles.titleContainer}>
            <Shield className={styles.shieldIcon} />
            <h2 className={styles.dialogTitle}>Data Privacy Notice</h2>
          </div>
          <p className={styles.dialogDescription}>
            Please review our data privacy notice in accordance with the Data Privacy Act of 2012 before proceeding with the survey.
          </p>
        </div>

        <div className={styles.contentContainer}>
          <div className={styles.infoBox}>
            <CheckCircle className={styles.checkIcon} />
            <p className={styles.infoText}>
              Your privacy is important to us. We only collect information that is necessary for the survey and handle it with care.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>How We Use and Protect Your Information</h3>
            <p className={styles.sectionText}>
              This survey is conducted by Technological University of the Philippines Alumni Tracer System(TUPATS), the Personal Information Controller (PIC), in compliance with the Data Privacy Act of 2012. We collect and process your data based on your explicit consent for the following purposes:
            </p>
            <ul className={styles.bulletList}>
              <li>To analyze survey responses for research and policy development</li>
              <li>To improve our services, programs, and user experience</li>
              <li>To generate aggregated and anonymized statistical reports</li>
            </ul>
          </div>

          <div className={styles.accordion}>
            <details className={styles.accordionItem}>
              <summary className={styles.accordionTrigger}>What information do we collect?</summary>
              <div className={styles.accordionContent}>
                We collect the information you provide in the survey, which may include your responses, preferences, and demographic details. We do not collect personally identifiable information (PII) such as your name or contact details unless explicitly requested and with your consent.
              </div>
            </details>
            <details className={styles.accordionItem}>
              <summary className={styles.accordionTrigger}>How do we protect your data?</summary>
              <div className={styles.accordionContent}>
                We implement technical, organizational, and physical safeguards to protect your data against unauthorized access, disclosure, or misuse. Access is strictly limited to authorized personnel only.
              </div>
            </details>
            <details className={styles.accordionItem}>
              <summary className={styles.accordionTrigger}>Your rights regarding your data</summary>
              <div className={styles.accordionContent}>
                Under the Data Privacy Act of 2012, you have the right to access, correct, or delete your personal data. You also have the right to withdraw your consent at any time. To exercise these rights, you may contact our Data Protection Officer at <strong>tupalumni@gmail.com</strong>.
              </div>
            </details>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Retention and Legal Basis</h3>
            <p className={styles.sectionText}>
              Your data will be retained only as long as necessary to fulfill the stated purposes. After that, it will be securely deleted or anonymized. The processing of your information is based on your voluntary and informed consent under Section 12(a) of the Data Privacy Act.
            </p>
          </div>

          <div className={styles.warningBox}>
            <AlertCircle className={styles.alertIcon} />
            <p className={styles.warningText}>
              By proceeding, you acknowledge that you have read and understood our data privacy notice and voluntarily consent to the collection and processing of your data as described in accordance with the Data Privacy Act of 2012.
            </p>
          </div>

          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="consent"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className={styles.checkbox}
            />
            <label htmlFor="consent" className={styles.checkboxLabel}>
              I have read and agree to the data privacy policy and consent to the collection and processing of my data for the purposes described.
            </label>
          </div>
        </div>

        <div className={styles.dialogFooter}>
          <button
            className={styles.declineButton}
            onClick={handleDecline}
          >
            Decline
          </button>
          <button
            className={styles.proceedButton}
            onClick={handleProceed}
            disabled={!consentGiven}
          >
            Proceed to Survey
            <ChevronRight className={styles.chevronIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataPrivacyConsent;
