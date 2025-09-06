import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Package, Truck, DollarSign, TrendingUp, Calendar } from "lucide-react";

export function AdminDashboard() {
  const stats = [
    { title: "Total Users", value: "1,247", change: "+12%", icon: Users, color: "text-primary" },
    { title: "Active Collections", value: "89", change: "+8%", icon: Truck, color: "text-secondary" },
    { title: "Products Listed", value: "2,156", change: "+15%", icon: Package, color: "text-success" },
    { title: "Monthly Revenue", value: "$12,840", change: "+23%", icon: DollarSign, color: "text-warning" },
  ];

  const recentCollections = [
    { id: "COL001", client: "Jane Doe", items: "Laptop, Phone, Tablet", status: "pending", date: "2025-01-06" },
    { id: "COL002", client: "John Smith", items: "Desktop PC, Monitor", status: "collected", date: "2025-01-05" },
    { id: "COL003", client: "Alice Johnson", items: "Phone, Headphones", status: "processing", date: "2025-01-05" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'collected': return 'bg-primary text-primary-foreground';
      case 'processing': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your EcoCollect operations</p>
        </div>
        <Button variant="eco" className="gap-2">
          <Calendar className="w-4 h-4" />
          Schedule Collection
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
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
            <CardTitle>Recent Collections</CardTitle>
            <CardDescription>Latest collection requests from clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCollections.map((collection) => (
                <div key={collection.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{collection.id}</p>
                      <Badge className={getStatusColor(collection.status)}>
                        {collection.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{collection.client}</p>
                    <p className="text-sm">{collection.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{collection.date}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Collection Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Collection Progress</CardTitle>
            <CardDescription>Monthly collection targets and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Laptops & Computers</span>
                <span>78/100</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mobile Devices</span>
                <span>156/200</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Electronics</span>
                <span>89/150</span>
              </div>
              <Progress value={59} className="h-2" />
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Progress</span>
                <span className="text-2xl font-bold text-primary">71%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}