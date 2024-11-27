import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile, setSurveys, setLoading, setError } from '../store/alumniReducer';
import { fetchAlumniProfile, fetchAlumniSurveys } from '../api/alumniApi';

export const useAlumniData = (alumniId) => {
  const dispatch = useDispatch();
  const { profile, surveys, isLoading, error } = useSelector((state) => state.alumni);

  useEffect(() => {
    const loadAlumniData = async () => {
      dispatch(setLoading(true));
      try {
        const [profileData, surveysData] = await Promise.all([
          fetchAlumniProfile(alumniId),
          fetchAlumniSurveys(alumniId)
        ]);
        dispatch(setProfile(profileData));
        dispatch(setSurveys(surveysData));
      } catch (err) {
        dispatch(setError(err?.message || 'Failed to load alumni data'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (alumniId) {
      loadAlumniData();
    }
  }, [alumniId, dispatch]);

  return { profile, surveys, isLoading, error };
};