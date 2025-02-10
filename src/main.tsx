import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AddPlayer } from "./components/AddPlayer.tsx";
import { Players } from "./pages/Players.tsx";
import { Navbar } from "./components/Navbar.tsx";
import { ToastContainer } from "react-toastify";

export const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Players />} />
            <Route path="/add" element={<AddPlayer />} />
          </Routes>
        </div>
        <ToastContainer />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
