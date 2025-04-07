import React, { useState } from "react";
import styles from "./Dash-Filter.module.css";
import SidebarLayout from "../../SideBar/SideBarLayout";
import Analytics from "../Analytics/Admin-Analytics";
import Reports from "../Report/Admin-Reports";
import NewsArticles from "../News/NewsArticles"

export function DashFilter() {
  const [activeTab, setActiveTab] = useState("analytics");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <SidebarLayout>
      <section className={styles.filterSection} aria-label="Dashboard filters">
        <h2 className={styles.databaseTitle}>DASHBOARD</h2>

        {/* Tabs for Analytics and Reports */}
        <div className={styles.viewToggle} role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "analytics"}
            className={`${styles.tab} ${
              activeTab === "analytics" ? styles.activeTab : ""
            }`}
            onClick={() => handleTabChange("analytics")}
          >
            ANALYTICS
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "reports"}
            className={`${styles.tab} ${
              activeTab === "reports" ? styles.activeTab : ""
            }`}
            onClick={() => handleTabChange("reports")}
          >
            REPORTS
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "news"}
            className={`${styles.tab} ${
              activeTab === "news" ? styles.activeTab : ""
            }`}
            onClick={() => handleTabChange("news")}
          >
            NEWS
          </button>
        </div>

        {/* Conditional Rendering */}
        {activeTab === "analytics" &&  <Analytics/>}
        {activeTab === "reports" && <Reports />}
        {activeTab === "news" && <NewsArticles/>}
      </section>
    </SidebarLayout>
  );
}

export default DashFilter;
