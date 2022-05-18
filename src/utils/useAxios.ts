import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useHistory } from "umi";
import * as _ from "lodash";

axios.defaults.baseURL = '/zstack/v1'

const useAxios = <T>({ url, method, headers, data, params}: AxiosRequestConfig) => {
  const [response, setResponse] = useState<T>();
  const [error, setError] = useState<AxiosError>();
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  const fetchData = useCallback(() =>
    axios
      .request({ url, method, headers, data, params })
      .then(resp => {
        setResponse(resp.data);
      })
      .catch(err => {
        if (_.get(err, 'response.data.error.code') === 'ID.1001') {
          history.push('/login');
        }
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