import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Crown,
  Home,
  LogIn,
  LogOut,
  Menu,
  PlusCircle,
  Users,
  Volleyball,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.ts";
import { logout } from "../services/auth.ts";

export const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav className="bg-blue-600 p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-white text-2xl font-bold italic flex items-center gap-2"
          >
            <Volleyball size={28} />
            <span>VolleyRanker</span>
          </Link>

          <button
            className="text-white sm:hidden"
            onClick={toggleMenu}
            aria-label="Abrir menu"
          >
            <Menu size={28} />
          </button>

          <div className="hidden sm:flex gap-6">
            <Link
              to="/"
              className="text-white flex items-center gap-2 hover:text-yellow-300 transition duration-300"
            >
              <Crown size={20} />{" "}
              <span className="hidden sm:inline">Ranking Geral</span>
            </Link>

            <Link
              to="/team"
              className="text-white flex items-center gap-2 hover:text-yellow-300 transition duration-300"
            >
              <Users size={20} />{" "}
              <span className="hidden sm:inline">Gerar Times</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/admin"
                  className="text-white flex items-center gap-2 hover:text-yellow-300 transition duration-300"
                >
                  <Home size={20} />{" "}
                  <span className="hidden sm:inline">
                    Painel do Administrador
                  </span>
                </Link>

                <Link
                  to="/admin/add"
                  className="text-white flex items-center gap-2 hover:text-yellow-300 transition duration-300"
                >
                  <PlusCircle size={20} />{" "}
                  <span className="hidden sm:inline">Adicionar Jogador</span>
                </Link>

                <button
                  onClick={logout}
                  className="text-white flex items-center gap-2 hover:text-red-400 transition duration-300"
                >
                  <LogOut size={20} />{" "}
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className=" flex items-center px-4 py-3 rounded bg-white text-blue-950 gap-2 hover:text-green-400 transition duration-300"
              >
                <LogIn size={20} />{" "}
                <span className="hidden sm:inline">Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold text-gray-800">Menu</h2>
          <button onClick={toggleMenu} aria-label="Fechar menu">
            <X size={24} />
          </button>
        </div>

        <ul className="p-4 space-y-4">
          <li>
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
              onClick={toggleMenu}
            >
              <Crown size={20} /> Ranking Geral
            </Link>
          </li>

          <li>
            <Link
              to="/team"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
              onClick={toggleMenu}
            >
              <Users size={20} /> Gerar Times
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                  onClick={toggleMenu}
                >
                  <Home size={20} /> Painel do Administrador
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/add"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                  onClick={toggleMenu}
                >
                  <PlusCircle size={20} /> Adicionar Jogador
                </Link>
              </li>
              <li className="border-t pt-4">
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 transition w-full"
                >
                  <LogOut size={20} /> Sair
                </button>
              </li>
            </>
          ) : (
            <li className="border-t pt-4">
              <Link
                to="/login"
                className="flex items-center gap-2 text-green-500 hover:text-green-700 transition"
                onClick={toggleMenu}
              >
                <LogIn size={20} /> Entrar
              </Link>
            </li>
          )}
        </ul>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};
