import { ReactElement } from "react";
import { useAuth } from "./hooks/useAuth.ts";
import { Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar.tsx";

export const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { user, loading } = useAuth();

  if (loading)
    return <p className="text-center text-gray-600">Carregando...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
