import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminOnly?: boolean;
  admin?: boolean;
  redirect?: string;
}
const protectedRoute = ({
  isAuthenticated,
  adminOnly,
  redirect = "/",
  children,
  admin,
}: Props) => {
  if (!isAuthenticated) return <Navigate to={redirect} />;
  if (adminOnly && !admin) return <Navigate to={redirect} />;
  return children ? children : <Outlet />;
};

export default protectedRoute;
