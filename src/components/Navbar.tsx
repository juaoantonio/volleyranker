import { Link } from "react-router-dom";
import { Home, PlusCircle, Volleyball } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        {/* Logo Responsiva */}
        <Link
          to="/"
          className="text-white text-2xl font-bold flex items-center gap-2"
        >
          <Volleyball size={28} />
          <span className="hidden sm:inline">VolleyRanker</span>
        </Link>

        {/* Links de Navegação */}
        <div className="flex gap-6">
          <Link
            to="/"
            className="text-white flex items-center gap-2 hover:text-yellow-300 transition duration-300"
          >
            <Home size={20} /> <span className="hidden sm:inline">Ranking</span>
          </Link>
          <Link
            to="/add"
            className="text-white flex items-center gap-2 hover:text-yellow-300 transition duration-300"
          >
            <PlusCircle size={20} />{" "}
            <span className="hidden sm:inline">Adicionar Jogador</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
