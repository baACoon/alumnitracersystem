import React, { useState, useEffect } from "react";
import styles from './GraduatesList.module.css';
import axios from "axios";
import { Search,X, AlertTriangle, Trash2 } from "lucide-react"; // Import icons if available


const API_BASE_URL = "http://localhost:5050"; // Change this to your actual backend URL

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    pageNumbers.push(1);

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) pageNumbers.push("...");
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) pageNumbers.push(i);
    }
    if (endPage < totalPages - 1) pageNumbers.push("...");
    if (totalPages > 1) pageNumbers.push(totalPages);

    return pageNumbers;
  };

  return (
    <div className={styles.paginationContent}>
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`${styles.paginationPrev} ${currentPage === 1 ? styles.paginationDisabled : ""}`}
      >
        Previous
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className={styles.paginationEllipsis}>...</span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => setCurrentPage(page)}
            className={`${styles.paginationNumber} ${currentPage === page ? styles.paginationActive : ""}`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`${styles.paginationNext} ${currentPage === totalPages ? styles.paginationDisabled : ""}`}
      >
        Next
      </button>
    </div>
  );
}

export function GraduatesList() {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batches, setBatches] = useState([]);
  const [newBatchYear, setNewBatchYear] = useState('');
  const [newBatchTitle, setNewBatchTitle] = useState('');
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [graduates, setGraduates] = useState([]);
  const [totalGraduates, setTotalGraduates] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const graduatesPerPage = 10;

   // New state for delete confirmation modal
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [batchToDelete, setBatchToDelete] = useState(null);
   const [confirmText, setConfirmText] = useState('');

   useEffect(() => {
    fetchBatches();
  }, []);
  
  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/batches`);
      setBatches(res.data);
    } catch (err) {
      console.error("Failed to fetch batches:", err);
    }
  };

  // Fetch all graduates on component mount
  useEffect(() => {
    fetchGraduates();
  }, []);

  // Recalculate total graduates whenever graduates or selectedBatch changes
  useEffect(() => {
    if (selectedBatch) fetchGraduates();
  }, [selectedBatch]); // Trigger fetch when batch selection changes

  const fetchGraduates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = selectedBatch 
      ? `${API_BASE_URL}/api/graduates?year=${selectedBatch}`
      : `${API_BASE_URL}/api/graduates?year=${new Date().getFullYear()}`;

      const response = await axios.get(url);
    
      setGraduates(response.data.data || []);
      setTotalGraduates(response.data.count || 0);

      console.log(`Graduates fetched successfully for batch ${selectedBatch || new Date().getFullYear()}:`, response.data.data);
    } catch (error) {
      console.error("Error fetching graduates:", error);
      setError("Failed to load graduates.");
    } finally {
      setIsLoading(false);
    }
};
  
  const handleUpload = async () => {
    if (!uploadedFile) {
      alert("Please select a file.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("csvFile", uploadedFile);
    formData.append("batchYear", selectedBatch); // Add the batch year to the form data
    
    console.log(`Uploading file for batch year ${selectedBatch}:`, uploadedFile.name);

    try {
      // Using axios for better error details
      const uploadResponse = await axios.post(
        `${API_BASE_URL}/api/BatchList`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("Upload response:", uploadResponse.data);
      alert(uploadResponse.data.message || "Upload successful");

      // Refresh graduates data after successful upload
      await fetchGraduates();
      
      // Update batch import date
      updateBatchImportDate(selectedBatch);
      
      setUploadedFile(null);
      
    } catch (error) {
      console.error("Upload error details:", error);
      let errorMessage = "Failed to upload file";
      
      if (error.response) {
        // The server responded with an error status
        console.error("Server error response:", error.response.data);
        errorMessage = `Server error: ${error.response.data.error || error.response.status}`;
        if (error.response.data.details) {
          errorMessage += ` - ${error.response.data.details}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Check your connection.";
      } else {
        // Something else caused the error
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBatchImportDate = (batchYear) => {
    const batchIndex = batches.findIndex(b => b.year === batchYear);
    if (batchIndex !== -1) {
      const updatedBatches = [...batches];
      updatedBatches[batchIndex] = {
        ...updatedBatches[batchIndex],
        importedDate: new Date().toLocaleDateString()
      };
      setBatches(updatedBatches);
    }
  };

  const handleBatchClick = (batchYear) => {
    setSelectedBatch(batchYear);
    setCurrentPage(1); // Reset to first page when changing batches
  };
  
  const handleBack = () => {
    setSelectedBatch(null);
    setCurrentPage(1);
  };

  // Filter graduates for selected batch
  const filteredGraduates = graduates.filter((grad) => Number(grad.gradYear) === Number(selectedBatch));

  // Calculate total pages
  const totalPages = Math.ceil(filteredGraduates.length / graduatesPerPage);
  
  // Get graduates for current page
  const indexOfLastGraduate = currentPage * graduatesPerPage;
  const indexOfFirstGraduate = indexOfLastGraduate - graduatesPerPage;
  const searchedGraduates = filteredGraduates.filter((grad) => {
    const query = searchQuery.toLowerCase();
    return (
      grad.firstName?.toLowerCase().includes(query) ||
      grad.middleName?.toLowerCase().includes(query) ||
      grad.lastName?.toLowerCase().includes(query) ||
      grad.tupId?.toLowerCase().includes(query) ||
      grad.email?.toLowerCase().includes(query) ||
      grad.course?.toLowerCase().includes(query)
    );
  });
  
  const currentGraduates = searchedGraduates.slice(indexOfFirstGraduate, indexOfLastGraduate);
  

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      console.log("Imported file:", file);
    }
  };

  const handleAddBatch = () => {
    setIsAddingBatch(true);
    setNewBatchYear('');
    setNewBatchTitle('');
  };

  const handleSaveNewBatch = async () => {
  if (newBatchYear && newBatchTitle) {
    const newBatchYearNum = parseInt(newBatchYear);
    const isDuplicate = batches.some(batch => batch.year === newBatchYearNum);

    if (!isDuplicate && !isNaN(newBatchYearNum)) {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/batches`, {
          year: newBatchYearNum,
          title: newBatchTitle
        });

        console.log("Batch saved:", res.data);
        fetchBatches(); // Refresh list from backend
        setIsAddingBatch(false);
      } catch (err) {
        console.error("Error saving new batch:", err);
        alert("Failed to save new batch to database.");
      }
    } else {
      alert('Please enter a valid, unique batch year and title');
    }
  }
};

  const handleCancelAddBatch = () => {
    setIsAddingBatch(false);
  };

 
  // Open delete modal
  const handleOpenDeleteModal = (e, batchYear) => {
    e.stopPropagation(); // Prevent batch selection when clicking delete icon
    setBatchToDelete(batchYear);
    setShowDeleteModal(true);
    setConfirmText('');
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setBatchToDelete(null);
    setConfirmText('');
  };

  // Delete batch if confirmation is correct
  const handleDeleteBatch = async () => {
    if (confirmText === `BATCH ${batchToDelete}`) {
      try {
        // Add error handling and logging
        console.log(`Attempting to delete batch ${batchToDelete}`);
        
        const res = await axios.delete(`${API_BASE_URL}/api/graduates/batch/${batchToDelete}`, {
          validateStatus: function (status) {
            // Accept 404 as valid response (in case batch is empty)
            return (status >= 200 && status < 300) || status === 404;
          }
        });
        
        console.log("Delete response:", res.data);
        
        // Update local state to reflect deletion
        setBatches(prev => prev.filter(batch => batch.year !== batchToDelete));
        
        // If selected batch is deleted, reset view
        if (selectedBatch === batchToDelete) {
          setSelectedBatch(null);
          setGraduates([]);
        }
        
        // Show success message based on response
        alert(res.data.message || `Batch ${batchToDelete} was successfully deleted.`);
        
      } catch (err) {
        console.error("Error deleting batch:", err);
        
        let errorMessage = "Failed to delete batch";
        if (err.response) {
          errorMessage = err.response.data.error || 
                        err.response.data.message || 
                        `Server responded with ${err.response.status}`;
        } else if (err.request) {
          errorMessage = "No response from server";
        } else {
          errorMessage = err.message;
        }
        
        alert(`Delete failed: ${errorMessage}`);
      } finally {
        setShowDeleteModal(false);
        setBatchToDelete(null);
        setConfirmText('');
      }
    }
  };

  return (
    <div className={styles.container}>
      {!selectedBatch ? (
        <>
          <div className={styles.batchGrid}>
            {batches.map((batch) => (
              <div 
                key={batch.year} 
                className={styles.batchCard}
                onClick={() => handleBatchClick(batch.year)}
              >
                {/* Add delete icon to each batch card */}
                <button 
                  className={styles.deleteBatchIcon}
                  onClick={(e) => handleOpenDeleteModal(e, batch.year)}
                  aria-label={`Delete batch ${batch.year}`}
                >
                  <Trash2 size={16} />
                </button>
                <div className={styles.batchContent}>
                  <h3 className={styles.batchTitle}>BATCH {batch.year}</h3>
                  <p className={styles.batchSubtitle}>{batch.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.addBatchWrapper}>
            {isAddingBatch ? (
              <div className={styles.addBatchDialog}>
                <div className={styles.addBatchForm}>
                  <h2 className={styles.dialogTitle}>Add New Batch</h2>
                  <div className={styles.formField}>
                    <label htmlFor="year">Year</label>
                    <input
                      id="year"
                      type="text"
                      value={newBatchYear}
                      onChange={(e) => setNewBatchYear(e.target.value)}
                      placeholder="e.g. 2025"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label htmlFor="title">Title</label>
                    <input
                      id="title"
                      type="text"
                      value={newBatchTitle}
                      onChange={(e) => setNewBatchTitle(e.target.value)}
                      placeholder="e.g. Graduates 2025"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.dialogActions}>
                    <button 
                      className={styles.cancelButton} 
                      onClick={handleCancelAddBatch}
                    > Cancel
                    </button>
                    <button 
                      className={styles.saveButton} 
                      onClick={handleSaveNewBatch}
                    > Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button className={styles.addBatchButton} onClick={handleAddBatch}>
                <span className={styles.plusIcon}>+</span>
                Add New Batch
              </button>
            )}
          </div>
        </>
      ) : (
        <div className={styles.batchDetailContainer}>
          <div className={styles.batchHeader}>
            <button className={styles.backButton} onClick={handleBack}>
              <span className={styles.backIcon}>←</span>
            </button>
            <h1 className={styles.batchHeading}>BATCH {selectedBatch} GRADUATES</h1>
          </div>

          <div className={styles.importSection}>
            <h2 className={styles.importTitle}>Import CSV File</h2>
            <div className={styles.importControls}>
              <div className={styles.fileInputContainer}>
                <label 
                  htmlFor="file-upload" 
                  className={styles.fileInputLabel}
                >
                  Choose File
                </label>
                <input 
                  id="file-upload" 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileChange} 
                  className={styles.fileInput} 
                />
                <span className={styles.fileName}>
                  {uploadedFile ? uploadedFile.name : "No file chosen"}
                </span>
              </div>
              <button 
                onClick={handleUpload} 
                disabled={!uploadedFile || isLoading} 
                className={styles.uploadButton}
              >
                <span className={styles.uploadIcon}>↑</span>
                {isLoading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Total Graduates:</p>
              <p className={styles.statValue}>{totalGraduates}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Imported Date:</p>
              <p className={styles.statValue}>
                {batches.find(b => b.year === selectedBatch)?.importedDate
                  ? new Date(batches.find(b => b.year === selectedBatch).importedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })
                  : "Not imported yet"}              
              </p>
            </div>
          </div>
          <div className={styles.graduatesTableSection}>
            <div className={styles.tableHeaderRow}>
              <h2 className={styles.tableTitle}>Uploaded Graduates</h2>
              <div className={styles.searchInputWrapper}>
                <input
                  type="text"
                  placeholder="Search graduates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchBar}
                />
                <span className={styles.searchIcon}>
                    <Search size={16} />
                </span>
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.graduatesTable}>
                <thead>
                  <tr>
                    <th className={styles.tableHeader}>TUP-ID</th>
                    <th className={styles.tableHeader}>Name</th>
                    <th className={styles.tableHeader}>Email</th>
                    <th className={styles.tableHeader}>College</th>
                    <th className={styles.tableHeader}>Course</th>
                    <th className={styles.tableHeader}>Year Graduated</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className={styles.loadingCell}>Loading...</td>
                    </tr>
                  ) : currentGraduates.length > 0 ? (
                    currentGraduates.map((grad, index) => (
                      <tr key={index} className={styles.tableRow}>
                        <td>{grad.tupId}</td>
                        <td>
                          {`${grad.firstName} ${
                            grad.middleName !== "N/A" ? grad.middleName : ""
                          } ${grad.lastName}`.trim()}
                        </td>
                        <td>{grad.email}</td>
                        <td>{grad.college}</td>
                        <td className={styles.courseCell}>{grad.course}</td>
                        <td>{grad.gradYear}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '1rem', fontStyle: 'italic', color: 'gray' }}>
                      Sorry, there is no ‘{searchQuery}’ in the graduated list.
                    </td>
                  </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalGraduates > 0 && (
              <div className={styles.pagination}>
                <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
              </div>
                )}
              </div>
            </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.deleteModal}>
            <button className={styles.closeModalButton} onClick={handleCloseDeleteModal} aria-label="Close">
              <X size={20} />
            </button>

            <div className={styles.modalContent}>
              <div className={styles.modalIconWrapper}>
                <div className={styles.modalIcon}>
                  <Trash2 size={32} className={styles.trashIcon} />
                </div>
                <h2 className={styles.modalTitle}>Delete BATCH {batchToDelete}</h2>
              </div>

              <div className={styles.warningBox}>
                <div className={styles.warningContent}>
                  <AlertTriangle size={20} className={styles.warningIcon} />
                  <p className={styles.warningText}>Unexpected bad things will happen if you don't read this!</p>
                </div>
              </div>

              <div className={styles.modalMessage}>
                <p>
                  This will permanently delete the <strong>BATCH {batchToDelete}</strong> container, all uploaded CSV
                  files, and all graduate records associated with this batch.
                </p>
                <p>
                  This action <strong>cannot</strong> be undone. Please be certain.
                </p>
              </div>

              <div className={styles.confirmField}>
                <label htmlFor="confirmText" className={styles.confirmLabel}>
                  To confirm, type "BATCH {batchToDelete}" in the box below
                </label>
                <input
                  id="confirmText"
                  type="text"
                  className={styles.confirmInput}
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={`BATCH ${batchToDelete}`}
                />
              </div>

              <div className={styles.modalActions}>
                <button className={styles.cancelDeleteButton} onClick={handleCloseDeleteModal}>
                  Cancel
                </button>
                <button
                  className={`${styles.confirmDeleteButton} ${
                    confirmText === `BATCH ${batchToDelete}` ? styles.confirmDeleteEnabled : styles.confirmDeleteDisabled
                  }`}
                  onClick={handleDeleteBatch}
                  disabled={confirmText !== `BATCH ${batchToDelete}`}
                >
                  Delete this batch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default GraduatesList;