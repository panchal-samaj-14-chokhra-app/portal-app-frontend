import axios from "axios"

// Routes through /api/proxy/* so the real backend URL is never exposed in the browser network tab.
// Works for all public (unauthenticated) reads and interactions.
const publicRequest = axios.create({
  baseURL: "/api/proxy",
  headers: { "Content-Type": "application/json" },
})

export default publicRequest
