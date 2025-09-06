import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, MapPin, Clock, CheckCircle, XCircle, Eye, Phone, Mail } from "lucide-react";

const collectionOrders = [
  {
    id: "COL001",
    client: {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+1-234-567-8901",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
    },
    address: "456 Recycle Ave, Green Town, CA 90210",
    items: [
      { name: "MacBook Pro 2019", category: "Laptop", condition: "Good" },
      { name: "iPhone 12", category: "Mobile", condition: "Fair" },
      { name: "iPad Air", category: "Tablet", condition: "Excellent" }
    ],
    status: "pending",
    priority: "high",
    requestDate: "2025-01-06",
    scheduledDate: "2025-01-08",
    notes: "Client will be available after 2 PM. Building has security gate, call upon arrival."
  },
  {
    id: "COL002",
    client: {
      name: "John Smith",
      email: "john@example.com",
      phone: "+1-234-567-8902",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
    },
    address: "789 Tech Street, Innovation City, NY 10001",
    items: [
      { name: "Dell Desktop PC", category: "Desktop", condition: "Good" },
      { name: "24\" Monitor", category: "Monitor", condition: "Fair" },
      { name: "Mechanical Keyboard", category: "Accessory", condition: "Excellent" }
    ],
    status: "collected",
    priority: "medium",
    requestDate: "2025-01-05",
    scheduledDate: "2025-01-06",
    collectedDate: "2025-01-06",
    notes: "All items collected successfully. Client very satisfied with service."
  },
  {
    id: "COL003",
    client: {
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1-234-567-8903",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
    },
    address: "321 Green Valley Rd, Eco City, TX 75001",
    items: [
      { name: "Samsung Galaxy S21", category: "Mobile", condition: "Good" },
      { name: "Wireless Headphones", category: "Accessory", condition: "Fair" }
    ],
    status: "processing",
    priority: "low",
    requestDate: "2025-01-05",
    scheduledDate: "2025-01-07",
    notes: "Items being processed at facility. Expected completion: 2-3 days."
  },
  {
    id: "COL004",
    client: {
      name: "Bob Wilson",
      email: "bob@example.com",
      phone: "+1-234-567-8904",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
    },
    address: "654 Sustainable Ave, Green Hills, FL 33101",
    items: [
      { name: "Gaming Laptop", category: "Laptop", condition: "Excellent" },
      { name: "Gaming Mouse", category: "Accessory", condition: "Good" }
    ],
    status: "cancelled",
    priority: "medium",
    requestDate: "2025-01-04",
    notes: "Client cancelled due to change of plans. Rescheduling requested."
  }
];

export default function CollectionOrders() {
  const [selectedOrder, setSelectedOrder] = useState<typeof collectionOrders[0] | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'collected': return 'bg-success text-success-foreground';
      case 'processing': return 'bg-primary text-primary-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'collected': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = collectionOrders.filter(order => {
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    const priorityMatch = priorityFilter === "all" || order.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Collection Orders</h1>
          <p className="text-muted-foreground">Manage tech waste collection requests</p>
        </div>
        <Button variant="eco" className="gap-2 lg:w-auto w-full">
          <MapPin className="w-4 h-4" />
          View Map
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search orders..." 
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="collected">Collected</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Requests ({filteredOrders.length})</CardTitle>
          <CardDescription>Manage and track all collection orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={order.client.avatar} />
                        <AvatarFallback>{order.client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{order.client.name}</p>
                        <p className="text-sm text-muted-foreground">{order.client.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-1 max-w-xs">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{order.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{order.items.length} items</p>
                      <p className="text-muted-foreground">{order.items[0].name}...</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)} gap-1`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{order.scheduledDate}</p>
                      <p className="text-muted-foreground">Requested: {order.requestDate}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Collection Order Details</DialogTitle>
                          <DialogDescription>
                            Order {selectedOrder?.id} - {selectedOrder?.client.name}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Client Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">Client Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage src={selectedOrder.client.avatar} />
                                      <AvatarFallback>{selectedOrder.client.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{selectedOrder.client.name}</p>
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Mail className="w-3 h-3" />
                                        {selectedOrder.client.email}
                                      </div>
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Phone className="w-3 h-3" />
                                        {selectedOrder.client.phone}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2 pt-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <p className="text-sm">{selectedOrder.address}</p>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">Order Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">Status:</span>
                                    <Badge className={getStatusColor(selectedOrder.status)}>
                                      {selectedOrder.status}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">Priority:</span>
                                    <Badge className={getPriorityColor(selectedOrder.priority)}>
                                      {selectedOrder.priority}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">Requested:</span>
                                    <span className="text-sm font-medium">{selectedOrder.requestDate}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">Scheduled:</span>
                                    <span className="text-sm font-medium">{selectedOrder.scheduledDate}</span>
                                  </div>
                                  {selectedOrder.collectedDate && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">Collected:</span>
                                      <span className="text-sm font-medium">{selectedOrder.collectedDate}</span>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>

                            {/* Items */}
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base">Items for Collection</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                      <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">{item.category}</p>
                                      </div>
                                      <Badge variant="outline" className="bg-background">
                                        {item.condition}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>

                            {/* Notes */}
                            {selectedOrder.notes && (
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm">{selectedOrder.notes}</p>
                                </CardContent>
                              </Card>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                              {selectedOrder.status === 'pending' && (
                                <>
                                  <Button variant="eco" className="flex-1">
                                    Mark as Collected
                                  </Button>
                                  <Button variant="outline" className="flex-1">
                                    Reschedule
                                  </Button>
                                </>
                              )}
                              {selectedOrder.status === 'processing' && (
                                <Button variant="eco" className="flex-1">
                                  Complete Processing
                                </Button>
                              )}
                              <Button variant="outline">
                                Contact Client
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}