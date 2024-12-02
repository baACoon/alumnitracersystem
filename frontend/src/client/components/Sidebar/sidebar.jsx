import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './sidebar.css'

function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
  
    const goToPending = () => {
      navigate ('/Survey')
    }
  
    const goToCompleted = () => {
      navigate ('/CompletedForm')
    }
  
  
    return (
      <div className="d-flex">
        {/* Sidebar */}
        <div
          className={`sidebar p-3 ${isSidebarOpen ? 'show' : ''}`}
          id="sidebar"
          aria-expanded={isSidebarOpen}
        >
          <ul className="list-unstyled">
            <li>
              <a onClick={goToPending} className="text-dark text-decoration-none">
                Pending Surveys
              </a>
            </li>
            <li>
              <a onClick={goToCompleted} className="text-dark text-decoration-none">
                Completed Surveys
              </a>
            </li>
          </ul>
        </div>
              
              {/* Mobile Toggle Button */}
              <button
          className="sidebar-toggle-btn d-md-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>
  
      </div>
    );
  }

  export default Sidebar