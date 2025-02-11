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

    router("/admin");
  };

  return (
    <div className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-lg w-96 mx-auto">
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
    </div>
  );
};
