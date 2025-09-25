import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-700 via-blue-900 to-gray-900">
      <div className="bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-2xl w-full border border-green-600">
        <img
          src="/logo.png"
          alt="EcoTech Logo"
          className="mb-8 w-32 h-32 object-contain drop-shadow-lg"
        />
        <h1 className="text-5xl font-extrabold text-green-700 mb-4 text-center">EcoTech</h1>
        <p className="text-xl text-gray-700 mb-8 text-center font-medium leading-relaxed">
          Plataforma inteligente para la gestión y reciclaje de tecnología.<br />
          Únete, ayuda al planeta y gana EcoPuntos por cada dispositivo reciclado.
        </p>
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow transition text-lg"
            onClick={() => navigate("/login")}
          >
            Iniciar sesión / Crear cuenta
          </button>
          <button
            className="bg-white border border-green-600 text-green-700 font-bold py-3 px-8 rounded-lg shadow transition text-lg hover:bg-green-50"
            onClick={() => window.open("https://www.ecotech.com/info", "_blank")}
          >
            Más información
          </button>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="bg-green-50 rounded-xl p-6 shadow flex flex-col items-center text-center">
            <span className="text-green-700 text-3xl font-bold mb-2">♻️</span>
            <h2 className="text-lg font-semibold text-green-700 mb-1">Recicla tecnología</h2>
            <p className="text-gray-600 text-sm">Solicita la recolección de tus dispositivos y contribuye al cuidado del medio ambiente.</p>
          </div>
          <div className="bg-green-50 rounded-xl p-6 shadow flex flex-col items-center text-center">
            <span className="text-green-700 text-3xl font-bold mb-2">🏆</span>
            <h2 className="text-lg font-semibold text-green-700 mb-1">Gana EcoPuntos</h2>
            <p className="text-gray-600 text-sm">Obtén recompensas por cada dispositivo reciclado y participa en el marketplace ecológico.</p>
          </div>
          <div className="bg-green-50 rounded-xl p-6 shadow flex flex-col items-center text-center">
            <span className="text-green-700 text-3xl font-bold mb-2">🌎</span>
            <h2 className="text-lg font-semibold text-green-700 mb-1">Impacto positivo</h2>
            <p className="text-gray-600 text-sm">Forma parte de la comunidad EcoTech y ayuda a reducir la huella de CO₂ en el planeta.</p>
          </div>
        </div>
      </div>
      <footer className="mt-10 text-gray-300 text-xs text-center">
        © {new Date().getFullYear()} EcoTech. Todos los derechos reservados.
      </footer>
    </div>
  );
}
