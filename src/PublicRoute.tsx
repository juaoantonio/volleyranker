import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar.tsx";

export const PublicRoute = () => {
    return (
        <>
            <Navbar />
            <div className={"h-[calc(100vh-3.8rem)] px-2 py-4"}>
                <Outlet />
            </div>
        </>
    );
};
