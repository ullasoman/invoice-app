// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function ProtectedRoute() {
  const { isAuthed } = useAuth();

  if (!isAuthed) {
    // Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }

  // Logged in → render child routes
  return <Outlet />;
}
