import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar.tsx";

export const PublicRoute = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};
