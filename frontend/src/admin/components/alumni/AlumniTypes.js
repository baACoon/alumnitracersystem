import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  surveys: [],
  isLoading: false,
  error: null
};

const alumniSlice = createSlice({
  name: 'alumni',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setSurveys: (state, action) => {
      state.surveys = action.payload;
    },
    updateProfile: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setProfile, setSurveys, updateProfile, setLoading, setError } = alumniSlice.actions;
export default alumniSlice.reducer;