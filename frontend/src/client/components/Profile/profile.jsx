import React, { useState, useEffect } from 'react';
import '../../components/Styles/popup.css';
import './profile.css'
import Header from '../Header/header';
import Footer from '../../../admin/components/Footer/Footer';
import ProfilePic from '../../components/image/ayne.jpg'

function Profile() {
  return (
    <div>
      <Header />
      <ProfilePage/>
      <Footer />
    </div>
  );
}

function ProfilePage (){

  return (
    <div className='profile-container'>
      <section className="personal-info">
        <h2>PERSONAL INFORMATION</h2>
        <div className='profile-section'>
            <div className="profile-pic">
              <img src={ProfilePic} alt="Profile" />
            </div>
              <div className="details">

                <div className='row-group'>
                  <div className='row'>
                    <label for="College">College</label>
                    <input type="text" id="College." name="College." placeholder="College"  required/>
                  </div>

                  <div className='row'>
                    <label for="YearGrad">Year Graduted</label>
                    <input type="text" id="YearGrad" name="Yeargrad" placeholder="Year Graduated"  required/>
                  </div>
                </div>

              <div className='row'>
                <label for="Course">Course</label>
                <input type="text" id="Course" name="Course" placeholder="Course"  required />
                <div className='underline'></div>
              </div>

              <div className='row'>
                <label for="last_name">Last Name</label>
                <input type="text" id="lastname" name="lastname" placeholder="Last Name"  required/>
              </div>

              <div className='row'>
                <label for="first_name">First Name</label>
                <input type="text" id="firstname" name="firstname" placeholder="First Name"  required/>
              </div>

              <div className='row'>
                <label for="middle_name">Middle Name</label>
                <input type="text" id="middlename" name="middlename" placeholder="Middle Name"  required/>
              </div>

              <div className='row'>
                <label for="suffix">Suffix</label>
                <input type="text" id="suffix" name="suffix" placeholder="suffix"  required/>
              </div>

              <div className='row'>
                <label for="Address">Address</label>
                <input type="text" id="Contact No." name="Contact No." placeholder="Contact No."  required/>
              </div>

              <div className='row'>
                <label for="birthday">Birthday</label>
                <input type="text" id="birthday" name="birthday" placeholder="birthday"  required/>
              </div>

              <div className='row'>
                <label for="Email">Email</label>
                <input type="text" id="email" name="email" placeholder="Email"  required/>
              </div>

              <div className='row'>
                <label for="ContactNo.">Contact No.</label>
                <input type="text" id="Contact No." name="ContactNo." placeholder="Contact No."  required/>
              </div>


            </div>

        </div>
        
      </section>

      <section className="employment-status">
        <h2>Employment Status</h2>
        <div className="details">
            <label for="occupation">Occupation</label>
            <input type="text" id="occupation" name="occupation" placeholder="Occupation"  required/>
      
            <label for="Employer">Employer</label>
            <input type="text" id="employer" name="employer" placeholder="employer"  required/>

            <label for="job_status">Job Status</label>
            <input type="text" id="jobstatus" name="jobstatus" placeholder="Job Status"  required/>
         
            <label for="year_start">Year Started</label>
            <input type="text" id="yearstart" name="yearstart" placeholder="Year Started"  required/>
          
        </div>
      </section>

    </div>
  );
}


export default Profile;
