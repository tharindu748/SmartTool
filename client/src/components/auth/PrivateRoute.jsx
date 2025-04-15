import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  // If the user is logged in, render the nested route (Outlet)
  // If not logged in, redirect to the SignIn page
  return currentUser ? <Outlet /> : <Navigate to="/SignIn" />;
}
