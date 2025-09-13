import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Recycle, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Bienvenido a EcoTech",
          description: "Has iniciado sesión correctamente en tu cuenta.",
        });
        navigate("/dashboard");
      } else {
        setError("Credenciales inválidas. Por favor, inténtalo de nuevo.");
      }
    } catch (err) {
      setError("Ocurrió un error. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero">
  <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-full">
            <img src="/logo.png" alt="Logo" className="w-80 h-80 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">EcoTech</h1>
          <p className="text-white/90">Plataforma de Recogida de Residuos Tecnológicos Inteligente</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bienvenido a EcoTech</CardTitle>
            <CardDescription>Inicia sesión en tu cuenta de EcoTech</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                variant="eco"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>


          </CardContent>
        </Card>

        
      </div>
    </div>
  );
}