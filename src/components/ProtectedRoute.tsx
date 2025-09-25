import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}