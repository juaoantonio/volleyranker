import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar.tsx";

export const PublicRoute = () => {
    return (
        <>
            <Navbar />
            <div className={"h-[calc(100vh-3.8rem)] px-4 py-4 pt-20"}>
                <Outlet />
            </div>
        </>
    );
};
