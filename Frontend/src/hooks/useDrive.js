// src/hooks/useDrive.js

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import useDriveStore from '../store/driveStore';

const useDrive = () => {
  const { drives, setDrives, addDrive, updateDrive, removeDrive } = useDriveStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDrives = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Replace with real API: const res = await driveApi.getAll(filters);
      // setDrives(res.data);
    } catch (err) {
      setError(err?.message || 'Failed to fetch drives');
      toast.error('Failed to load drives');
    } finally {
      setLoading(false);
    }
  }, [setDrives]);

  const fetchDriveById = useCallback(async (id) => {
    setLoading(true);
    try {
      // Replace with real API: const res = await driveApi.getById(id);
      // return res.data;
      return null;
    } catch (err) {
      toast.error('Failed to load drive details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createDrive = useCallback(async (data) => {
    setLoading(true);
    try {
      // Replace with real API: const res = await driveApi.create(data);
      // addDrive(res.data);
      toast.success('Drive created successfully');
    } catch (err) {
      toast.error('Failed to create drive');
    } finally {
      setLoading(false);
    }
  }, [addDrive]);

  const editDrive = useCallback(async (id, data) => {
    setLoading(true);
    try {
      // Replace with real API: const res = await driveApi.update(id, data);
      // updateDrive(id, res.data);
      toast.success('Drive updated');
    } catch (err) {
      toast.error('Failed to update drive');
    } finally {
      setLoading(false);
    }
  }, [updateDrive]);

  const deleteDrive = useCallback(async (id) => {
    setLoading(true);
    try {
      // Replace with real API: await driveApi.delete(id);
      removeDrive(id);
      toast.success('Drive deleted');
    } catch (err) {
      toast.error('Failed to delete drive');
    } finally {
      setLoading(false);
    }
  }, [removeDrive]);

  return {
    drives,
    loading,
    error,
    fetchDrives,
    fetchDriveById,
    createDrive,
    editDrive,
    deleteDrive,
  };
};

export default useDrive;