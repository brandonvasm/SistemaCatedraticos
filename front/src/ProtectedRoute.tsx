import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {

  const userId = localStorage.getItem("user_id");


  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};