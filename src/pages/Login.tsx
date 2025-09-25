import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import '../styles/auth.css';
import ForgotPassword from "./ForgotPassword"; // Importa el componente ForgotPassword

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isRegister) {
        // Registro de usuario con valores reales
        await axios.post("http://localhost:3000/api/auth/register", {
          name,
          email,
          password,
          role: "client",
        });
        toast({
          title: "¡Usuario creado!",
          description: "Ahora puedes iniciar sesión.",
        });
        setIsRegister(false);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        // Login
        const success = await login(email, password);
        if (success) {
          navigate("/dashboard");
          toast({
            title: "¡Inicio de sesión exitoso!",
            description: "Bienvenido a EcoTech.",
          });
        } else {
          setError("Credenciales inválidas. Por favor, inténtalo de nuevo.");
        }
      }
    } catch (err) {
      setError("Ocurrió un error. Por favor, inténtalo más tarde.");
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
          {isRegister ? "Crear cuenta EcoTech" : "Bienvenido a EcoTech"}
        </h1>
        <p className="text-base text-gray-700 mb-6 text-center">
          {isRegister
            ? "Regístrate para comenzar a reciclar tecnología y ganar EcoPuntos."
            : "Inicia sesión en tu cuenta para gestionar tus dispositivos y EcoPuntos."}
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          {isRegister && (
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-green-700 mb-1">
                Usuario
              </label>
              <input
                id="name"
                type="text"
                className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:border-green-600 focus:outline-none bg-gray-50 text-black"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Usuario"
              />
            </div>
          )}
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
            {isLoading
              ? isRegister
                ? "Creando cuenta..."
                : "Ingresando..."
              : isRegister
              ? "Crear cuenta"
              : "Iniciar sesión"}
          </button>
        </form>
        <div className="flex flex-col items-center mt-6 w-full">
          {!isRegister && (
            <a
              href="/forgot-password"
              className="text-green-700 hover:underline font-medium text-sm mb-2"
            >
              ¿Olvidaste tu contraseña?
            </a>
          )}
          {isRegister && (
            <button
              className="text-green-700 hover:underline font-medium text-sm"
              onClick={() => {
                setIsRegister(false);
                setError("");
              }}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          )}
        </div>
        <p className="mt-4 text-sm text-center text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-green-700 hover:underline font-medium"
          >
            Crear cuenta
          </Link>
        </p>
      </div>
      <footer className="mt-10 text-gray-300 text-xs text-center">
        © {new Date().getFullYear()} EcoTech. Todos los derechos reservados.
      </footer>
    </div>
  );
}