import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Recycle, Coins, Package, Star, TrendingUp, Calendar, Badge, Clock, MapPin } from "lucide-react";
import { useUser } from "src/context/UserContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export function ClientDashboard() {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3000/api/solicitudes?userId=${user.id}`)
      .then(res => res.json())
      .then(data => setSolicitudes(data))
      .catch(error => console.error("Error al obtener solicitudes:", error));
  }, [user]);

  // Datos iniciales en cero para usuarios nuevos
  const ecoPuntos = user?.points ?? 0;
  const colecciones = []; // Sin colecciones al iniciar
  const puntajeImpacto = 0;
  const co2Ahorrado = 0;
  const comprasRecientes = []; // Sin compras al iniciar

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">¡Bienvenido de nuevo, {user?.name?.split(' ')[0] || "usuario"}!</h1>
          <p className="text-muted-foreground">Consulta tus colecciones y descubre tecnología reacondicionada</p>
        </div>
        <Button
          variant="hero"
          size="lg"
          className="gap-2"
          onClick={() => navigate("/collectionrequest")}
        >
          <Recycle className="w-5 h-5" />
          Solicitar recolección
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <Card className="gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inicio</p>
                <p className="text-3xl font-bold text-green-700">{ecoPuntos}</p>
              </div>
              <Coins className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Solicitar recolección</p>
                <p className="text-3xl font-bold text-green-700">0</p>
              </div>
              <Package className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Marketplace</p>
                <p className="text-3xl font-bold text-green-700">{puntajeImpacto}</p>
              </div>
              <Star className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CO₂ Ahorrado</p>
                <p className="text-3xl font-bold text-green-700">{co2Ahorrado}</p>
                <p className="text-xs text-muted-foreground">toneladas</p>
              </div>
              <TrendingUp className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Mis colecciones */}
        <Card>
          <CardHeader>
            <CardTitle>Mis colecciones</CardTitle>
            <CardDescription>Consulta tus solicitudes de recolección de residuos tecnológicos</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                paddingRight: "8px"
              }}
              className="scroll-elegante"
            >
              {solicitudes.length === 0 ? (
                <p>No tienes colecciones registradas aún.</p>
              ) : (
                <ul>
                  {solicitudes.map((sol, idx) => (
                    <li key={idx} className="p-3 bg-muted/50 rounded-lg mb-2">
                      <div>
                        <strong>Dirección:</strong> {sol.address}<br />
                        <strong>Fecha:</strong> {sol.preferredDate}<br />
                        <strong>Horario:</strong> {sol.preferredTime}<br />
                        <strong>Estado:</strong>
                        <span
                          style={{
                            background: sol.status === "pendiente" ? "#3b82f6" : "#22c55e",
                            color: "#fff",
                            borderRadius: "8px",
                            padding: "2px 10px",
                            marginLeft: "8px",
                            fontWeight: "bold"
                          }}
                        >
                          {sol.status}
                        </span>
                        <br />
                        <strong>Dispositivos:</strong>
                        <ul>
                          {sol.items.map((item, i) => (
                            <li key={i}>
                              {item.quantity}x {item.type} {item.brand && `- ${item.brand}`} {item.model && `- ${item.model}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Compras recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Compras recientes</CardTitle>
            <CardDescription>Actividad en el marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            {comprasRecientes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No tienes compras registradas aún.<br />
                ¡Explora el marketplace ecológico para tu primera compra!
              </div>
            ) : (
              <div className="space-y-4">
                {/* Aquí iría el listado de compras si existieran */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hero Section */}
      <Card className="gradient-hero text-white border-0 shadow-eco overflow-hidden relative mt-6">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(/hero-image.jpg)` }}
        />
        <div className="relative z-10">
          <CardContent className="p-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-2">¿Listo para generar impacto?</h2>
              <p className="text-white/90 mb-6">
                Agenda la recolección de tus dispositivos tecnológicos antiguos y gana EcoPuntos ayudando al medio ambiente.
                Cada dispositivo reciclado ahorra CO₂ y crea oportunidades para otros.
              </p>
              <Button
                variant="glass"
                size="lg"
                className="gap-2"
                onClick={() => navigate("/collectionrequest")}
              >
                <Recycle className="w-5 h-5" />
                Agendar recolección
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Acciones rápidas</CardTitle>
          <CardDescription>Comienza con EcoCollect</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <MapPin className="w-6 h-6" />
              <span>Agendar recogida</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Package className="w-6 h-6" />
              <span>Explorar marketplace</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Clock className="w-6 h-6" />
              <span>Rastrear colección</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}