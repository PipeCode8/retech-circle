import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
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
  Download
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

  const collections: CollectionItem[] = [
    {
      id: "COL001",
      type: "donated",
      status: "completed",
      items: [
        { name: "MacBook Pro 2019", category: "Laptop", condition: "Good", icon: Laptop },
        { name: "iPhone 12", category: "Smartphone", condition: "Excellent", icon: Smartphone }
      ],
      requestDate: "2025-01-03",
      collectionDate: "2025-01-04",
      location: "456 Recycle Ave, Green Town",
      points: 250
    },
    {
      id: "COL002",
      type: "sold",
      status: "processing",
      items: [
        { name: "Samsung Galaxy S21", category: "Smartphone", condition: "Fair", icon: Smartphone },
        { name: "Sony WH-1000XM4", category: "Headphones", condition: "Good", icon: Headphones }
      ],
      requestDate: "2025-01-05",
      collectionDate: "2025-01-06",
      location: "789 Tech Street, Digital City",
      points: 120,
      value: 180
    },
    {
      id: "COL003",
      type: "donated",
      status: "collected",
      items: [
        { name: "Dell XPS 13", category: "Laptop", condition: "Fair", icon: Laptop },
        { name: "iPad Air", category: "Tablet", condition: "Good", icon: Tablet }
      ],
      requestDate: "2025-01-06",
      collectionDate: "2025-01-07",
      location: "123 Green St, Eco City",
      points: 180
    },
    {
      id: "COL004",
      type: "donated",
      status: "pending",
      items: [
        { name: "Google Pixel 6", category: "Smartphone", condition: "Excellent", icon: Smartphone }
      ],
      requestDate: "2025-01-08",
      location: "456 Recycle Ave, Green Town",
      points: 90
    }
  ];

  const stats = {
    totalCollections: collections.length,
    totalPoints: collections.reduce((sum, col) => sum + col.points, 0),
    completedCollections: collections.filter(col => col.status === 'completed').length,
    totalValue: collections.reduce((sum, col) => sum + (col.value || 0), 0)
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Collections</h1>
          <p className="text-muted-foreground">Track your donated and sold tech devices</p>
        </div>
        <Button variant="hero" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Collections</p>
                <p className="text-3xl font-bold">{stats.totalCollections}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">EcoPoints Earned</p>
                <p className="text-3xl font-bold text-success">{stats.totalPoints}</p>
              </div>
              <Coins className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-secondary">{stats.completedCollections}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-3xl font-bold text-warning">${stats.totalValue}</p>
              </div>
              <Package className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collections List */}
      <Card>
        <CardHeader>
          <CardTitle>Collection History</CardTitle>
          <CardDescription>All your tech waste collection requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collections.map((collection) => {
              const StatusIcon = getStatusIcon(collection.status);
              return (
                <div key={collection.id} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{collection.id}</h3>
                        <Badge className={getStatusColor(collection.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {collection.status}
                        </Badge>
                        <Badge variant={collection.type === 'donated' ? 'secondary' : 'default'}>
                          {collection.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Requested: {collection.requestDate}
                        </span>
                        {collection.collectionDate && (
                          <span className="flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            Collected: {collection.collectionDate}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {collection.location}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="w-3 h-3" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Items:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {collection.items.map((item, index) => {
                        const ItemIcon = item.icon;
                        return (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <ItemIcon className="w-4 h-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.category} • {item.condition}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Points & Value */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-success">
                        <Coins className="w-4 h-4" />
                        <span className="font-medium">+{collection.points} EcoPoints</span>
                      </div>
                      {collection.value && (
                        <div className="text-primary font-medium">
                          ${collection.value} estimated value
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}