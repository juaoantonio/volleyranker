import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AddPlayer } from "./components/AddPlayer.tsx";
import { Players } from "./pages/Players.tsx";
import { ToastContainer } from "react-toastify";
import { Login } from "./components/Login.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";
import { PlayerDetail } from "./components/PlayerDetail.tsx";
import { EditPlayer } from "./components/EditPlayer.tsx";

export const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Players />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddPlayer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditPlayer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/player/:id"
            element={
              <ProtectedRoute>
                <PlayerDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
