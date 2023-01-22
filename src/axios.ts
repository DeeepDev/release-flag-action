import axios from "axios";
import axiosRetry from "axios-retry";

const axiosClient = axios.create();
axiosRetry(axiosClient, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  onRetry: (_, error) => {
    console.log(`Retrying request to ${error.config?.url}`);
  },
});

export { axiosClient };
