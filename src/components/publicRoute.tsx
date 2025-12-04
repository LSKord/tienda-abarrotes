import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
}

export const PublicRoute = ({ children }: Props) => {
  const { token, loading } = useAuth();

  if (loading) return null;

  if (token) return <Navigate to="/inventory" replace />;

  return children;
};