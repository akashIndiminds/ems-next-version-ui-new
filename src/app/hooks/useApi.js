// src/hooks/useApi.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export function useApi(apiCall, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      if (response.data.success) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || 'API call failed');
      }
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = () => fetchData();

  return { data, loading, error, refetch };
}
