import { useAuth } from "./hooks/useAuth.ts";
import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar.tsx";
import { Loading } from "./components/loading.tsx";

export const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <Loading />;
    if (!user) return <Navigate to="/login" replace />;

    return (
        <>
            <Navbar />
            <div className={"h-[calc(100vh-3.8rem)] px-4 py-4 pt-20"}>
                <Outlet />
            </div>
        </>
    );
};
