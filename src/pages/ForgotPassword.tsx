import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setMessage("Te hemos enviado un correo con instrucciones para restablecer tu contraseña.");
      } else {
        setMessage("No se pudo enviar el correo. Verifica el email ingresado.");
      }
    } catch {
      setMessage("Error de conexión. Intenta de nuevo.");
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
        <h1 className="text-2xl font-extrabold text-green-700 mb-2 text-center">
          Recuperar contraseña
        </h1>
        <p className="text-base text-gray-700 mb-6 text-center">
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
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
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow transition"
          >
            {isLoading ? "Enviando..." : "Enviar instrucciones"}
          </button>
        </form>
        {message && (
          <div className="mt-6 text-center text-lg font-semibold text-green-700">
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