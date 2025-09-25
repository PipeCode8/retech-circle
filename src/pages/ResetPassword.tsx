import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      await axios.post("http://localhost:3000/api/auth/update-password", {
        email,
        newPassword,
      });
      setMessage("✅ Contraseña actualizada correctamente. Ahora puedes iniciar sesión.");
      setEmail("");
      setNewPassword("");
    } catch {
      setMessage("❌ No se pudo actualizar la contraseña. Verifica el correo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-700 via-blue-900 to-gray-900">
      <div className="bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-md w-full border border-green-600">
        <img
          src="/logo.png"
          alt="EcoTech Logo"
          className="mb-6 w-24 h-24 object-contain drop-shadow-lg"
        />
        <h1 className="text-3xl font-extrabold text-green-700 mb-2 text-center">
          Restablecer contraseña
        </h1>
        <p className="text-base text-gray-700 mb-6 text-center">
          Ingresa tu correo y la nueva contraseña para actualizar tu acceso.
        </p>
        <form onSubmit={handleReset} className="w-full flex flex-col gap-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-green-700 mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:border-green-600 focus:outline-none bg-gray-50 text-black"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-semibold text-green-700 mb-1">
              Nueva contraseña
            </label>
            <input
              id="newPassword"
              type="password"
              className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:border-green-600 focus:outline-none bg-gray-50 text-black"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow transition"
          >
            {isLoading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </form>
        {message && (
          <div className={`mt-6 text-center text-lg font-semibold ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </div>
        )}
        <a
          href="/login"
          className="mt-8 text-green-700 hover:underline font-medium text-sm"
        >
          Volver al inicio de sesión
        </a>
      </div>
      <footer className="mt-10 text-gray-300 text-xs text-center">
        © {new Date().getFullYear()} EcoTech. Todos los derechos reservados.
      </footer>
    </div>
  );
}