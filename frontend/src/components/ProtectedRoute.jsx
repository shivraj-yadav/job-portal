import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Wraps routes that require authentication.
// Optionally pass allowedRole ("student" | "recruiter") to also enforce role.
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useSelector((store) => store.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect each role to their home page
    return <Navigate to={user.role === "recruiter" ? "/admin/companies" : "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
