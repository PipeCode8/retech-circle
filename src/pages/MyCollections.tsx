import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEcoPoints } from "@/contexts/EcoPointsContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { 
  Package, 
  Calendar, 
  MapPin, 
  Coins,
  CheckCircle,
  Clock,
  Truck,
  Smartphone,
  Laptop,
  Headphones,
  Tablet,
  Eye,
  Download,
  Star
} from "lucide-react";

interface CollectionItem {
  id: string;
  type: 'donated' | 'sold';
  status: 'pending' | 'collected' | 'processing' | 'completed';
  items: Array<{
    name: string;
    category: string;
    condition: string;
    icon: React.ComponentType<any>;
  }>;
  requestDate: string;
  collectionDate?: string;
  location: string;
  points: number;
  value?: number;
  pointsAwarded?: boolean; // Para trackear si ya se otorgaron los puntos
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-warning text-warning-foreground';
    case 'collected': return 'bg-secondary text-secondary-foreground';
    case 'processing': return 'bg-info text-info-foreground';
    case 'completed': return 'bg-success text-success-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return Clock;
    case 'collected': return Truck;
    case 'processing': return Package;
    case 'completed': return CheckCircle;
    default: return Clock;
  }
};

export default function MyCollections() {
  const { user } = useAuth();
  const { earnPoints, state: ecoPointsState } = useEcoPoints();
  const { toast } = useToast();
  const [collections, setCollections] = useState<CollectionItem[]>([]);

  // Datos de ejemplo de colecciones
  const initialCollections: CollectionItem[] = [
    {
      id: "COL001",
      type: "donated",
      status: "completed",
      items: [
        { name: "MacBook Pro 2019", category: "Laptop", condition: "Bueno", icon: Laptop },
        { name: "iPhone 12", category: "Smartphone", condition: "Excelente", icon: Smartphone }
      ],
      requestDate: "2025-01-03",
      collectionDate: "2025-01-04",
      location: "456 Recycle Ave, Green Town",
      points: 250,
      pointsAwarded: true
    },
    {
      id: "COL002",
      type: "sold",
      status: "processing",
      items: [
        { name: "Samsung Galaxy S21", category: "Smartphone", condition: "Regular", icon: Smartphone },
        { name: "Sony WH-1000XM4", category: "Audífonos", condition: "Bueno", icon: Headphones }
      ],
      requestDate: "2025-01-05",
      collectionDate: "2025-01-06",
      location: "789 Tech Street, Digital City",
      points: 120,
      value: 180,
      pointsAwarded: false
    },
    {
      id: "COL003",
      type: "donated",
      status: "collected",
      items: [
        { name: "Dell XPS 13", category: "Laptop", condition: "Regular", icon: Laptop },
        { name: "iPad Air", category: "Tablet", condition: "Bueno", icon: Tablet }
      ],
      requestDate: "2025-01-06",
      collectionDate: "2025-01-07",
      location: "123 Green St, Eco City",
      points: 180,
      pointsAwarded: false
    },
    {
      id: "COL004",
      type: "donated",
      status: "pending",
      items: [
        { name: "Gaming PC", category: "Desktop", condition: "Excelente", icon: Package },
        { name: "Mechanical Keyboard", category: "Accesorios", condition: "Bueno", icon: Package }
      ],
      requestDate: "2025-01-07",
      location: "321 Tech Ave, Innovation City",
      points: 300,
      pointsAwarded: false
    }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'collected': return 'Recolectado';
      case 'processing': return 'Procesando';
      case 'completed': return 'Completado';
      default: return 'Desconocido';
    }
  };

  useEffect(() => {
    setCollections(initialCollections);
  }, []);

  // Función para simular el completado de una solicitud y otorgar puntos
  const completeCollection = (collectionId: string) => {
    setCollections(prev => prev.map(collection => {
      if (collection.id === collectionId && collection.status !== 'completed') {
        const updatedCollection = { 
          ...collection, 
          status: 'completed' as const,
          pointsAwarded: true
        };

        // Otorgar los puntos cuando se completa la solicitud
        if (!collection.pointsAwarded) {
          const description = collection.type === 'donated' 
            ? `donación de ${collection.items.length} dispositivo${collection.items.length > 1 ? 's' : ''}`
            : `venta de ${collection.items.length} dispositivo${collection.items.length > 1 ? 's' : ''}`;
          
          earnPoints(collection.points, description, collection.id);
        }

        return updatedCollection;
      }
      return collection;
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header con resumen de EcoPuntos */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mis Recolecciones</h1>
          <p className="text-muted-foreground">
            Historial de dispositivos donados y vendidos
          </p>
        </div>
        <Card className="lg:w-auto w-full">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-full">
                <Coins className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo EcoPuntos</p>
                <p className="text-2xl font-bold text-warning">{ecoPointsState.balance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de recolecciones */}
      <div className="grid gap-6">
        {initialCollections.map((collection) => {
          const StatusIcon = getStatusIcon(collection.status);
          
          return (
            <Card key={collection.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        {collection.type === 'donated' ? 'Donación' : 'Venta'} #{collection.id}
                      </CardTitle>
                      <Badge className={getStatusColor(collection.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {getStatusText(collection.status)}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Solicitado: {new Date(collection.requestDate).toLocaleDateString('es-ES')}
                      </span>
                      {collection.collectionDate && (
                        <span className="flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          Recolectado: {new Date(collection.collectionDate).toLocaleDateString('es-ES')}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-warning">
                      <Coins className="w-4 h-4" />
                      <span className="font-semibold">{collection.points}</span>
                      <span className="text-sm">puntos</span>
                    </div>
                    {collection.value && (
                      <div className="text-sm text-success">
                        ${collection.value} valor estimado
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Dispositivos */}
                <div>
                  <h4 className="font-medium mb-2">Dispositivos ({collection.items.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {collection.items.map((item, index) => {
                      const ItemIcon = item.icon;
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <ItemIcon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.category} • {item.condition}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ubicación */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{collection.location}</span>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="w-4 h-4" />
                      Ver Detalles
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="w-4 h-4" />
                      Descargar Recibo
                    </Button>
                  </div>

                  {/* Botón para simular completar */}
                  {collection.status !== 'completed' && (
                    <Button 
                      variant="eco" 
                      size="sm"
                      onClick={() => completeCollection(collection.id)}
                      className="gap-1"
                    >
                      <Star className="w-4 h-4" />
                      Completar y Ganar Puntos
                    </Button>
                  )}

                  {/* Indicador de puntos otorgados */}
                  {collection.status === 'completed' && collection.pointsAwarded && (
                    <div className="flex items-center gap-1 text-success text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Puntos otorgados
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resumen de impacto */}
      <Card className="gradient-card border-0">
        <CardHeader>
          <CardTitle className="text-center">Tu Impacto Ambiental</CardTitle>
          <CardDescription className="text-center">
            Contribución al reciclaje tecnológico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-success">{initialCollections.filter(c => c.status === 'completed').length}</p>
              <p className="text-sm text-muted-foreground">Recolecciones completadas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-warning">{ecoPointsState.balance}</p>
              <p className="text-sm text-muted-foreground">EcoPuntos actuales</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">
                {initialCollections.reduce((acc, c) => acc + c.items.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Dispositivos reciclados</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}