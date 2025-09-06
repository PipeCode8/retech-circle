import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Recycle, 
  Laptop, 
  Smartphone, 
  Package, 
  Star, 
  Calendar, 
  MapPin, 
  Clock,
  Coins,
  TrendingUp,
  Users,
  Truck,
  DollarSign
} from "lucide-react";
import heroImage from "@/assets/hero-collection.jpg";

export function ClientDashboard() {
  const { user } = useAuth();

  const myCollections = [
    { id: "COL001", items: "MacBook Pro, iPhone 12", status: "collected", date: "2025-01-03", points: 250 },
    { id: "COL002", items: "Samsung Galaxy, Headphones", status: "processing", date: "2025-01-05", points: 120 },
    { id: "COL003", items: "Dell Laptop", status: "pending", date: "2025-01-06", points: 180 },
  ];

  const recentPurchases = [
    { id: "REF001", item: "Refurbished iPhone 11", price: 450, points: 0, date: "2025-01-04" },
    { id: "REF002", item: "Recycled Laptop Stand", price: 0, points: 300, date: "2025-01-02" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'collected': return 'bg-success text-success-foreground';
      case 'processing': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Track your collections and discover refurbished tech</p>
        </div>
        <Button variant="hero" size="lg" className="gap-2">
          <Recycle className="w-5 h-5" />
          Request Collection
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">EcoPoints</p>
                <p className="text-3xl font-bold text-primary">{user?.points || 0}</p>
              </div>
              <Coins className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Collections</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <Package className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Impact Score</p>
                <p className="text-3xl font-bold text-success">98</p>
              </div>
              <Star className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CO₂ Saved</p>
                <p className="text-3xl font-bold">2.4</p>
                <p className="text-xs text-muted-foreground">tons</p>
              </div>
              <TrendingUp className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Collections */}
        <Card>
          <CardHeader>
            <CardTitle>My Collections</CardTitle>
            <CardDescription>Track your tech waste collection requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myCollections.map((collection) => (
                <div key={collection.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{collection.id}</p>
                      <Badge className={getStatusColor(collection.status)}>
                        {collection.status}
                      </Badge>
                    </div>
                    <p className="text-sm">{collection.items}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {collection.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        +{collection.points} points
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Track
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Purchases */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
            <CardDescription>Your marketplace activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPurchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <p className="font-medium">{purchase.item}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{purchase.date}</span>
                      {purchase.price > 0 ? (
                        <span className="font-medium text-primary">${purchase.price}</span>
                      ) : (
                        <span className="font-medium text-success">{purchase.points} points</span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
              <Button variant="ghost" className="w-full">
                View All Purchases
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hero Section */}
      <Card className="gradient-hero text-white border-0 shadow-eco overflow-hidden relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10">
          <CardContent className="p-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-2">Ready to make an impact?</h2>
              <p className="text-white/90 mb-6">
                Schedule a collection of your old tech devices and earn EcoPoints while helping the environment. 
                Every device you recycle saves CO₂ and creates opportunities for others.
              </p>
              <Button variant="glass" size="lg" className="gap-2">
                <Recycle className="w-5 h-5" />
                Schedule Collection
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with EcoCollect</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <MapPin className="w-6 h-6" />
              <span>Schedule Pickup</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Package className="w-6 h-6" />
              <span>Browse Marketplace</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Clock className="w-6 h-6" />
              <span>Track Collection</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}