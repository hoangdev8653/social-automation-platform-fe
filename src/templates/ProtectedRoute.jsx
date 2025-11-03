import { Navigate } from "react-router-dom";
import { getLocalStorage } from "../utils/localStorage";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = getLocalStorage("user");
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
