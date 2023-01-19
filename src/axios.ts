import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";

const isRetryableError = (error: AxiosError) =>
  error.code !== "ECONNABORTED" && (!error.response || (error.response.status >= 400 && error.response.status <= 599));

const axiosClient = axios.create();
axiosRetry(axiosClient, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: isRetryableError,
  onRetry: (_, error) => {
    console.log(`Retrying request to ${error.config?.url}`);
  },
});

export { axiosClient };
