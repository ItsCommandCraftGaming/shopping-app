import { useEffect, useState } from "react";

const useFetch = (url: string) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const nextData = await response.json();
      setData(nextData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error };
};

export default useFetch;
