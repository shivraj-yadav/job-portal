import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import ProtectedRoute from "./components/ProtectedRoute";
// Admin
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";

const appRouter = createBrowserRouter([
  // ─── Public routes ───────────────────────────────────────────────
  { path: "/login",  element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/",       element: <Home /> },

  // ─── Student protected routes ─────────────────────────────────────
  {
    path: "/jobs",
    element: <ProtectedRoute allowedRole="student"><Jobs /></ProtectedRoute>,
  },
  {
    path: "/description/:id",
    element: <ProtectedRoute allowedRole="student"><JobDescription /></ProtectedRoute>,
  },
  {
    path: "/browse",
    element: <ProtectedRoute allowedRole="student"><Browse /></ProtectedRoute>,
  },
  {
    path: "/profile",
    element: <ProtectedRoute allowedRole="student"><Profile /></ProtectedRoute>,
  },

  // ─── Recruiter (admin) protected routes ───────────────────────────
  {
    path: "/admin/companies",
    element: <ProtectedRoute allowedRole="recruiter"><Companies /></ProtectedRoute>,
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute allowedRole="recruiter"><CompanyCreate /></ProtectedRoute>,
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute allowedRole="recruiter"><CompanySetup /></ProtectedRoute>,
  },
  {
    path: "/admin/jobs",
    element: <ProtectedRoute allowedRole="recruiter"><AdminJobs /></ProtectedRoute>,
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute allowedRole="recruiter"><PostJob /></ProtectedRoute>,
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute allowedRole="recruiter"><Applicants /></ProtectedRoute>,
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
