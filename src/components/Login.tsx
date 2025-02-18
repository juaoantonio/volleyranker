import { useState } from "react";
import { loginWithEmail } from "../services/auth.ts";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useNavigate();

    const handleLogin = async () => {
        setError("");
        if (!email || !password) {
            setError("Preencha todos os campos.");
            return;
        }

        const loggedInUser = await loginWithEmail(email, password);
        if (!loggedInUser) {
            setError("Email ou senha inválidos.");
            return;
        }

        router("/");
    };

    return (
        <div className="mx-auto flex w-96 flex-col items-center space-y-4 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Login</h2>
            <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
                onClick={handleLogin}
                className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
            >
                <LogIn size={18} /> Entrar
            </button>
        </div>
    );
};
