import { ReactElement } from "react";
import { Link } from "react-router-dom";

export const PublicRoute = ({ children }: { children: ReactElement }) => {
  return (
    <>
      <header className={"bg-blue-600 flex gap-3 p-4 shadow-md mb-4"}>
        <button
          className={
            "text-white bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-md"
          }
        >
          <Link to={"/admin"}>Acessar Admin</Link>
        </button>
        <button
          className={
            "text-white bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-md"
          }
        >
          <Link to={"/"}>Acessar Ranking</Link>
        </button>
      </header>
      {children}
    </>
  );
};
