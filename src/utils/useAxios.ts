import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

axios.defaults.baseURL = '/zstack/v1'


const useAxios = <T>({ url, method, headers, data, params}: AxiosRequestConfig) => {
  const [response, setResponse] = useState<T>();
  const [error, setError] = useState<AxiosError>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(() => axios
    .request({ url, method, headers, data, params })
    .then(resp => {
      setResponse(resp.data);
    })
    .catch(err => {
      setError(err);
    })
    .finally(() => {
      setIsLoading(false);
    }
  ), [])

  useEffect(() => {
    fetchData();
  }, []);

  return { response, error, isLoading, refresh: fetchData };
};


export default useAxios;