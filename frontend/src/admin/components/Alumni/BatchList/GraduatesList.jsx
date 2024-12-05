import React, { useState } from 'react';
import styles from './GraduatesList.module.css';

export function GraduatesList() {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batches, setBatches] = useState(
    Array.from({ length: 9 }, (_, i) => ({
      year: i + 2016,
      title: `Graduates ${i + 2016}`,
      graduates: [],
      importedDate: null
    }))
  );
  const [newBatchYear, setNewBatchYear] = useState('');
  const [newBatchTitle, setNewBatchTitle] = useState('');
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleBatchClick = (batch) => {
    setSelectedBatch(batch);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      console.log("Imported file:", file);
      // TODO: Implement actual file parsing logic
    }
  };

  const handleAddBatch = () => {
    setIsAddingBatch(true);
    setNewBatchYear('');
    setNewBatchTitle('');
  };

  const handleSaveNewBatch = () => {
    if (newBatchYear && newBatchTitle) {
      const newBatchYearNum = parseInt(newBatchYear);
      const isDuplicate = batches.some(batch => batch.year === newBatchYearNum);

      if (!isDuplicate && !isNaN(newBatchYearNum)) {
        const newBatch = {
          year: newBatchYearNum,
          title: newBatchTitle,
          graduates: [],
          importedDate: null
        };

        const updatedBatches = [...batches, newBatch]
          .sort((a, b) => b.year - a.year);

        setBatches(updatedBatches);
        setNewBatchYear('');
        setNewBatchTitle('');
        setIsAddingBatch(false);
      } else {
        alert('Please enter a valid, unique batch year and title');
      }
    }
  };

  const handleCancelAddBatch = () => {
    setNewBatchYear('');
    setNewBatchTitle('');
    setIsAddingBatch(false);
  };

  const handleSaveBatchDetails = (e) => {
    e.preventDefault();
    // TODO: Implement save logic for batch details
    const batchIndex = batches.findIndex(b => b.year === selectedBatch);
    if (batchIndex !== -1) {
      const updatedBatches = [...batches];
      updatedBatches[batchIndex] = {
        ...updatedBatches[batchIndex],
        importedDate: uploadedFile ? new Date().toLocaleDateString() : null
      };
      setBatches(updatedBatches);
    }
  };

  const handleDeleteBatch = (batchYear) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete Batch ${batchYear}?`);
    if (confirmDelete) {
      setBatches(batches.filter(batch => batch.year !== batchYear));
      setSelectedBatch(null);
    }
  };

  return (
    <div className={styles.graduatesContainer}>
      {!selectedBatch && (
        <div className={styles.batchesContainer}>
          {isAddingBatch && (
            <div className={styles.newBatchForm}>
              <input
                type="number"
                placeholder="Batch Year"
                value={newBatchYear}
                onChange={(e) => setNewBatchYear(e.target.value)}
                className={styles.inputField}
                min="2000"
                max="2030"
                required
              />
              <input
                type="text"
                placeholder="Batch Title"
                value={newBatchTitle}
                onChange={(e) => setNewBatchTitle(e.target.value)}
                className={styles.inputField}
                required
              />
              <div className={styles.newBatchButtons}>
                <button 
                  onClick={handleSaveNewBatch} 
                  className={styles.saveButton}
                  disabled={!newBatchYear || !newBatchTitle}
                >
                  Save
                </button>
                <button 
                  onClick={handleCancelAddBatch} 
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div className={styles.batchButtonsContainer}>
            {batches.map((batch) => (
              <div key={batch.year} className={styles.batchButtonWrapper}>
                <button
                  className={styles.batchButton}
                  onClick={() => handleBatchClick(batch.year)}
                >
                  BATCH {batch.year} {batch.title}
                </button>
              </div>
            ))}
            <button 
              className={styles.addBatchButton}
              onClick={handleAddBatch}
            >
              + 
            </button>
          </div>
        </div>
      )}

      {selectedBatch && (
        <div className={styles.batchDetails}>
          <div className={styles.batchDetailsHeader}>
            <button 
              className={styles.backButton}
              onClick={() => setSelectedBatch(null)}
            >
              ← 
            </button>
            <button
              className={styles.deleteBatchButton}
              onClick={() => handleDeleteBatch(selectedBatch)}
            >
              Delete Batch
            </button>
          </div>
          
          <h2>BATCH {selectedBatch} GRADUATES</h2>
          
          <form 
            className={styles.importForm}
            onSubmit={handleSaveBatchDetails}
          >
            <div className={styles.formGroup}>
              <label htmlFor="title">Batch Title</label>
              <input 
                type="text" 
                id="title" 
                placeholder="Enter Batch Title" 
                className={styles.inputField}
                defaultValue={
                  batches.find(b => b.year === selectedBatch)?.title || ''
                }
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="file">Import Excel File</label>
              <div className={styles.fileInputWrapper}>
                <input
                  type="file"
                  id="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
                <label 
                  htmlFor="file" 
                  className={styles.fileInputButton}
                >
                  {uploadedFile ? uploadedFile.name : 'Choose File'}
                </label>
              </div>
            </div>
            
            <div className={styles.graduateListStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Graduates:</span>
                <span className={styles.statValue}>
                  {batches.find(b => b.year === selectedBatch)?.graduates.length || 0}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Imported Date:</span>
                <span className={styles.statValue}>
                  {batches.find(b => b.year === selectedBatch)?.importedDate || 'Not Imported'}
                </span>
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.viewListButton}
                disabled={!uploadedFile}
              >
                View Graduate List
              </button>
              <button 
                type="submit" 
                className={styles.saveButton}
                disabled={!uploadedFile}
              >
                SAVE
              </button>
            </div>
          </form>

          <div className={styles.uploadedList}>
            <h3>Uploaded Graduates</h3>
            <table className={styles.graduatesTable}>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFile ? (
                  <tr>
                    <td>{uploadedFile.name}</td>
                    <td>Uploaded File</td>
                    <td>{uploadedFile.type}</td>
                    <td>
                      <button onClick={() => setUploadedFile(null)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr className={styles.emptyRow}>
                    <td colSpan="4">No graduates uploaded yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default GraduatesList;