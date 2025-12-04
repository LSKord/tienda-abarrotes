import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
}

export const PrivateRoute = ({ children }: Props) => {
  const { token,loading } = useAuth();

  if (loading && !token) return null;          

  if (!token) return <Navigate to="/" replace />;
  
  return children;
};