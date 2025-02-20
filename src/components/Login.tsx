import { useState } from "react";
import { loginWithEmail } from "../services/auth.ts";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input.tsx";
import { Button } from "./ui/button.tsx";

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
        <div className="mx-auto flex h-full flex-col items-center justify-center space-y-4 rounded-lg bg-white">
            <h2 className="text-xl font-semibold">Login</h2>
            <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
            />
            <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button onClick={handleLogin} className={"w-full"}>
                <LogIn size={18} /> Entrar
            </Button>
        </div>
    );
};
