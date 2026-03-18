// Base URL — reads from Vite env variable in all environments.
// Development: set VITE_API_BASE_URL in frontend/.env
// Production:  set VITE_API_BASE_URL in your hosting platform (Vercel, Netlify, etc.)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const USER_API_END_POINT        = `${BASE_URL}/user`;
export const JOB_API_END_POINT         = `${BASE_URL}/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/application`;
export const COMPANY_API_END_POINT     = `${BASE_URL}/company`;