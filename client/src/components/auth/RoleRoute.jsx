import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RoleRoute({ children, allowedRoles }) {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && allowedRoles.includes(currentUser.role)
    ? children
    : <Navigate to="/unauthorized" />;
}
