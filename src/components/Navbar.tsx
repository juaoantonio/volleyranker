import { Link } from "react-router-dom";
import { Home, PlusCircle, Volleyball } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-white text-2xl font-bold flex items-center gap-2"
        >
          <Volleyball /> VolleyRanker
        </Link>

        {/* Links de Navegação */}
        <div className="flex gap-6">
          <Link
            to="/"
            className="text-white flex items-center gap-2 hover:text-yellow-300 transition duration-300"
          >
            <Home size={20} /> Ranking
          </Link>
          <Link
            to="/add"
            className="text-white flex items-center gap-2 hover:text-yellow-300 transition duration-300"
          >
            <PlusCircle size={20} /> Adicionar Jogador
          </Link>
        </div>
      </div>
    </nav>
  );
};
