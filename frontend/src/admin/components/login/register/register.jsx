import React, {useState, useEffect} from "react";
import './register.css';


function RegisterPage() {
    const [showModal, setShowModal] = useState(true);

    const closeModal = () => { 
        document.body.style.overflow ='';
        setShowModal(false);
    };

    useEffect (() =>{
        document.body.style.overflow = 'hidden';
        return() => {
            document.body.style.overflow ='';
        };
    }, []);

    return(
        <div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>

                        <h2>Register Form</h2>
                            {/* Display errors if any */}
                            {errors.length > 0 && (
                            <div className="errors">
                                <ul>
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                                </ul>
                            </div>
                            )}

                            
                        
                    </div> 

                </div>
            )}
        </div>
    );
}

export default RegisterPage;

