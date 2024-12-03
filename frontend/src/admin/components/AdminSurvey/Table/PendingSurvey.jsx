import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PendingSurvey.module.css'; // Custom styles for unique classes

export const PendingSurvey = () => {
  return (
    <div className="pending-table-container">
      <table className="table table-bordered table-hover table-striped pending-table">
        <thead className="table-danger">
          <tr>
            <th>No.</th>
            <th>Title</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Tracer Survey Form (2020)</td>
            <td className="text-center">
              <span className="text-primary edit-button">EDIT</span> |{' '}
              <span className="text-success publish-button">PUBLISH</span>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Subject Alignment</td>
            <td className="text-center">
              <span className="text-primary edit-button">EDIT</span> |{' '}
              <span className="text-success publish-button">PUBLISH</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
