import axios from "axios";

// note that environment variables that should be available in the browser
// need to start with VITE_*
var backend = import.meta.env.VITE_BACKEND_HOST || "http://localhost:5045";

// format: http://localhost:5000/api
var backendApiEndpoint = backend + "/api";
console.log("Using backend endpoint: " + backendApiEndpoint);

export const Api = axios.create({
  baseURL: backendApiEndpoint,
});
