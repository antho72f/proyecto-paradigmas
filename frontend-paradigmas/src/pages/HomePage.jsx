import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="bg-red-500 flex justify-center items-center">
      <header className="bg-zinc-800 p-10">
        <h1 className="text-5xl py-2 font-bold">CreativeGPT</h1>
        <p className="text-md text-slate-400">
          El proyecto consiste en
          desarrollar un software demostrativo que utilice
          técnicas de generación automática de
          contenido creativo en el lenguaje de
          programación JavaScript. El objetivo principal
          es explorar cómo los paradigmas de
          programación pueden ser aplicados para
          generar textos, imágenes u otros tipos de
          contenido de forma automatizada y creativa.

        </p>

        <Link
          className="bg-zinc-500 text-white px-4 py-2 rounded-md mt-4 inline-block"
          to="/register"
        >
          Iniciar
        </Link>
      </header>
    </section>
  );
}

export default HomePage;
