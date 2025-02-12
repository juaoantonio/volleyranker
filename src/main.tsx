import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { Login } from "./components/Login.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";
import { PublicRoute } from "./PublicRoute.tsx";

import { Players } from "./pages/Players.tsx";
import { AddPlayer } from "./components/AddPlayer.tsx";
import { EditPlayer } from "./components/EditPlayer.tsx";
import { PlayerDetail } from "./components/PlayerDetail.tsx";
import { PlayersRanking } from "./components/PlayersRanking.tsx";
import { TeamGenerator } from "./components/TeamGenerator.tsx";
import { GameDetail } from "./components/GameDetail.tsx";
import { GameList } from "./components/GameList.tsx";

export const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    {/* Rotas públicas */}
                    <Route element={<PublicRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<PlayersRanking />} />
                        <Route path="/team" element={<TeamGenerator />} />
                        <Route
                            path="/admin/player/:id"
                            element={<PlayerDetail />}
                        />
                    </Route>

                    {/* Rotas protegidas */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin/" element={<Players />} />
                        <Route path="/admin/add" element={<AddPlayer />} />
                        <Route
                            path="/admin/edit/:id"
                            element={<EditPlayer />}
                        />
                        <Route path="/games/:id" element={<GameDetail />} />
                        <Route path="/games" element={<GameList />} />
                    </Route>
                </Routes>

                <ToastContainer />
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
);
