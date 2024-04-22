import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { ButtonLink } from "./ui/ButtonLink";

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg">
      <h1 className="text-2xl font-bold">
        <Link to={isAuthenticated ? "/chat" : "/"}>CreativeGPT</Link>
      </h1>
      <ul className="flex items-center gap-x-4">
        {isAuthenticated ? (
          <>
            <li className="text-white font-semibold">
              Bienvenido, {user.Nombre}
            </li>
            <li>
              <ButtonLink to="/chat">Chat</ButtonLink>
            </li>
            <li>
              <ButtonLink to="/profile">Perfil</ButtonLink>
            </li>
            <li>
              <Link
                to="/"
                onClick={() => logout()}
                className="text-white hover:text-gray-300 transition duration-300"
              >
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <ButtonLink to="/login" className="btn-primary">
                Login
              </ButtonLink>
            </li>
            <li>
              <ButtonLink to="/register" className="btn-secondary">
                Registrarse
              </ButtonLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
