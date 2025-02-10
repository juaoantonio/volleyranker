import { useEffect, useState } from "react";
import { loginWithEmail, logout } from "../services/auth.ts";
import { useAuth } from "../hooks/useAuth";
import { LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { user } = useAuth();
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
    }
  };

  useEffect(() => {
    if (!user) return;
    router("/");
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-lg w-96 mx-auto">
      {user ? (
        <>
          <p className="text-lg font-semibold">Olá, {user.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            <LogOut size={18} /> Sair
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold">Login</h2>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            <LogIn size={18} /> Entrar
          </button>
        </>
      )}
    </div>
  );
};
