import React, { useState } from "react";
import { api } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import "../styles/auth.css";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
        role: "client",
      });

      if (res.data && res.data.user) {
        // Muestra mensaje de éxito antes de redirigir
        toast({
          title: "¡Cuenta creada exitosamente!",
          description: "Ahora puedes iniciar sesión con tus credenciales.",
          variant: "default",
        });
        
        // Esperar un momento antes de navegar para que el usuario vea el toast
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError("No se pudo crear la cuenta");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al crear la cuenta");
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
          Crear cuenta EcoTech
        </h1>
        <p className="text-base text-gray-700 mb-6 text-center">
          Regístrate para comenzar a reciclar tecnología y ganar EcoPuntos.
        </p>
        <form onSubmit={handleRegister} className="w-full flex flex-col gap-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-green-700 mb-1"
            >
              Usuario
            </label>
            <input
              id="name"
              type="text"
              className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:border-green-600 focus:outline-none bg-gray-50 text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Usuario"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-green-700 mb-1"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:border-green-600 focus:outline-none bg-gray-50 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-green-700 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:border-green-600 focus:outline-none bg-gray-50 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center font-semibold">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow transition"
          >
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
        <div className="flex flex-col items-center mt-6 w-full">
          <button
            className="text-green-700 hover:underline font-medium text-sm"
            onClick={() => navigate("/login")}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
      <footer className="mt-10 text-gray-300 text-xs text-center">
        © {new Date().getFullYear()} EcoTech. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Register;