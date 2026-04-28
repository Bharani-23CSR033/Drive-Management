// src/hooks/useApplication.js

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const useApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      // Replace with real API: const res = await studentApi.getApplications();
      // setApplications(res.data);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, []);

  const applyToDrive = useCallback(async (driveId, resumeUrl) => {
    setLoading(true);
    try {
      // Replace with real API:
      // const res = await applicationApi.apply({ driveId, resumeUrl });
      // setApplications((prev) => [...prev, res.data]);
      toast.success('Application submitted successfully');
      return true;
    } catch (err) {
      toast.error(err?.message || 'Failed to apply');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkDuplicate = useCallback((driveId) => {
    return applications.some((app) => app.driveId === driveId);
  }, [applications]);

  const getStatusCount = useCallback(() => {
    return {
      applied: applications.filter((a) => a.status === 'applied').length,
      shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
      rejected: applications.filter((a) => a.status === 'rejected').length,
      selected: applications.filter((a) => a.status === 'selected').length,
    };
  }, [applications]);

  return {
    applications,
    loading,
    fetchApplications,
    applyToDrive,
    checkDuplicate,
    getStatusCount,
  };
};

export default useApplication;