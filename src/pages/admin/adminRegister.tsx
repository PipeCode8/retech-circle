import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function AdminRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Cambia "CLAVE-SECRETA" por la clave que definas en el backend
      if (adminKey !== "CLAVE-SECRETA") {
        setError("Clave de administrador incorrecta.");
        setIsLoading(false);
        return;
      }
      await axios.post("http://localhost:3000/api/auth/register", {
        name,
        email,
        password,
        role: "admin",
      });
      toast({
        title: "¡Administrador creado!",
        description: "Ahora puedes iniciar sesión como administrador.",
      });
      navigate("/login");
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
          Registro de Administrador
        </h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
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
            <label htmlFor="password" className="block text-sm font-semibold text-green-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:border-green-600 focus:outline-none bg-gray-50 text-black"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="********"
            />
          </div>
          <div>
            <label htmlFor="adminKey" className="block text-sm font-semibold text-green-700 mb-1">
              Clave de administrador
            </label>
            <input
              id="adminKey"
              type="password"
              className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:border-green-600 focus:outline-none bg-gray-50 text-black"
              value={adminKey}
              onChange={e => setAdminKey(e.target.value)}
              required
              placeholder="Clave secreta"
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
            {isLoading ? "Creando administrador..." : "Crear administrador"}
          </button>
        </form>
      </div>
    </div>
  );
}

