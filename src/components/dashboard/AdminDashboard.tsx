import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Package, Truck, DollarSign, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Stats {
  totalUsers: number;
  activeCollections: number;
  listedProducts: number;
  monthlyRevenue: number;
}

interface CollectionOrder {
  id: number;
  userId: number;
  status: string;
  address: string;
  preferredDate: string;
  items: any[];
  user?: {
    name: string;
    email: string;
  };
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeCollections: 0,
    listedProducts: 0,
    monthlyRevenue: 0,
  });
  const [recentCollections, setRecentCollections] = useState<CollectionOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
        setIsLoading(true);

        // Obtener solicitudes primero (este endpoint sí funciona)
        const solicitudesResponse = await api.get("/api/solicitudes");
        const solicitudes = solicitudesResponse.data;

        // Calcular recolecciones activas
        const activeCollections = solicitudes.filter(
            (s: any) =>
                s.status.toLowerCase() === "pendiente" ||
                s.status.toLowerCase() === "procesando" ||
                s.status.toLowerCase() === "recolectado"
        ).length;

        // Intentar obtener usuarios, si falla usar 0
        let totalUsers = 0;
        try {
            const usersResponse = await api.get("/api/users");
            totalUsers = usersResponse.data.length;
        } catch (error) {
            console.log("No se pudieron cargar usuarios (endpoint requiere autenticación)");
            // Estimar usuarios basados en solicitudes únicas
            const uniqueUserIds = new Set(solicitudes.map((s: any) => s.userId));
            totalUsers = uniqueUserIds.size;
        }

        // Intentar obtener productos
        let listedProducts = 0;
        try {
            const productsResponse = await api.get("/api/devices");
            listedProducts = productsResponse.data.length;
        } catch (error) {
            console.log("No se pudieron cargar productos");
        }

        // Intentar obtener compras
        let monthlyRevenue = 0;
        try {
            const purchasesResponse = await api.get("/api/purchases");
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            monthlyRevenue = purchasesResponse.data
                .filter((p: any) => {
                    const purchaseDate = new Date(p.createdAt);
                    return (
                        purchaseDate.getMonth() === currentMonth &&
                        purchaseDate.getFullYear() === currentYear
                    );
                })
                .reduce((sum: number, p: any) => sum + (p.totalPrice || 0), 0);
        } catch (error) {
            console.log("No se pudieron cargar compras");
        }

        setStats({
            totalUsers,
            activeCollections,
            listedProducts,
            monthlyRevenue,
        });

        // Obtener solicitudes recientes con datos de usuario
        const recentSolicitudes = await Promise.all(
            solicitudes.slice(0, 3).map(async (solicitud: any) => {
                try {
                    const userResponse = await api.get(`/api/users/${solicitud.userId}`);
                    return {
                        ...solicitud,
                        user: userResponse.data,
                    };
                } catch (error) {
                    // Si falla, usar el userId como nombre
                    return {
                        ...solicitud,
                        user: { 
                            name: `Usuario #${solicitud.userId}`, 
                            email: "" 
                        },
                    };
                }
            })
        );

        setRecentCollections(recentSolicitudes);
    } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendiente":
        return "bg-warning text-warning-foreground";
      case "recolectado":
        return "bg-primary text-primary-foreground";
      case "procesando":
        return "bg-secondary text-secondary-foreground";
      case "completado":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getItemsDescription = (items: any[]) => {
    if (!items || items.length === 0) return "Sin artículos";
    return items
      .map((item) => `${item.quantity || 1}x ${item.type}`)
      .slice(0, 2)
      .join(", ");
  };

  // Calcular porcentajes de progreso (basado en objetivos mensuales)
  const laptopsProgress = Math.min((stats.activeCollections / 100) * 100, 100);
  const mobilesProgress = Math.min((stats.listedProducts / 200) * 100, 100);
  const electronicsProgress = Math.min((stats.totalUsers / 150) * 100, 100);
  const totalProgress = Math.round((laptopsProgress + mobilesProgress + electronicsProgress) / 3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statsData = [
    {
      title: "Total de Usuarios",
      value: stats.totalUsers.toLocaleString(),
      change: "+12%",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Recolecciones Activas",
      value: stats.activeCollections.toString(),
      change: "+8%",
      icon: Truck,
      color: "text-secondary",
    },
    {
      title: "Productos Listados",
      value: stats.listedProducts.toLocaleString(),
      change: "+15%",
      icon: Package,
      color: "text-success",
    },
    {
      title: "Ingresos Mensuales",
      value: formatCurrency(stats.monthlyRevenue),
      change: "+23%",
      icon: DollarSign,
      color: "text-warning",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona tus operaciones de EcoCollect</p>
        </div>
        <Button
          variant="eco"
          className="gap-2"
          onClick={() => navigate("/admin/collection-orders")}
        >
          <Calendar className="w-4 h-4" />
          Ver Recolecciones
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <Card key={stat.title} className="gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-700">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1 text-neutral-900">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-sm text-success font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Collections */}
        <Card>
          <CardHeader>
            <CardTitle>Recolecciones Recientes</CardTitle>
            <CardDescription>Últimas solicitudes de recolección de clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCollections.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay recolecciones recientes
                </p>
              ) : (
                recentCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">#{collection.id}</p>
                        <Badge className={getStatusColor(collection.status)}>
                          {collection.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {collection.user?.name || "Usuario"}
                      </p>
                      <p className="text-sm">{getItemsDescription(collection.items)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{collection.preferredDate}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => navigate("/admin/collection-orders")}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Collection Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso de Recolección</CardTitle>
            <CardDescription>Objetivos mensuales de recolección y progreso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Recolecciones Activas</span>
                <span>
                  {stats.activeCollections}/100
                </span>
              </div>
              <Progress value={laptopsProgress} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Productos en Marketplace</span>
                <span>
                  {stats.listedProducts}/200
                </span>
              </div>
              <Progress value={mobilesProgress} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Usuarios Registrados</span>
                <span>
                  {stats.totalUsers}/150
                </span>
              </div>
              <Progress value={electronicsProgress} className="h-2" />
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-medium">Progreso Total</span>
                <span className="text-2xl font-bold text-primary">{totalProgress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}