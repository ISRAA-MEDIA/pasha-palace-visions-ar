
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/auth";

type AuthenticatedRouteProps = {
  element: React.ReactNode;
};

const AuthenticatedRoute = ({ element }: AuthenticatedRouteProps) => {
  const { user } = useAuth();
  
  return user ? <>{element}</> : <Navigate to="/auth" />;
};

export default AuthenticatedRoute;
