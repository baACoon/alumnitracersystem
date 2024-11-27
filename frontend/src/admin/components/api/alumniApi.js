import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchAlumniProfile = async (alumniId) => {
  const response = await axios.get(`${API_BASE_URL}/alumni/${alumniId}`);
  return response.data;
};

export const fetchAlumniSurveys = async (alumniId) => {
  const response = await axios.get(`${API_BASE_URL}/alumni/${alumniId}/surveys`);
  return response.data;
};

export const updateAlumniProfile = async (alumniId, updates) => {
  const response = await axios.patch(`${API_BASE_URL}/alumni/${alumniId}`, updates);
  return response.data;
};

export const updateProfileImage = async (alumniId, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await axios.post(
    `${API_BASE_URL}/alumni/${alumniId}/image`, 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data.imageUrl;
};