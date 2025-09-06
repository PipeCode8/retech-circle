import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Package, Truck, DollarSign, Eye, CheckCircle, Clock, XCircle, Coins } from "lucide-react";

const marketplaceOrders = [
  {
    id: "ORD001",
    customer: {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+1-234-567-8901",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
    },
    items: [
      {
        id: "REF001",
        name: "Refurbished MacBook Pro 13\"",
        price: 899,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop"
      }
    ],
    total: 899,
    paymentMethod: "credit_card",
    status: "pending",
    orderDate: "2025-01-06",
    shippingAddress: "456 Recycle Ave, Green Town, CA 90210",
    trackingNumber: null
  },
  {
    id: "ORD002",
    customer: {
      name: "John Smith", 
      email: "john@example.com",
      phone: "+1-234-567-8902",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
    },
    items: [
      {
        id: "REF002",
        name: "Recycled Gaming Chair",
        points: 450,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=100&h=100&fit=crop"
      }
    ],
    total: 0,
    totalPoints: 450,
    paymentMethod: "points",
    status: "shipped",
    orderDate: "2025-01-05",
    shippingAddress: "789 Tech Street, Innovation City, NY 10001",
    trackingNumber: "TRK123456789"
  },
  {
    id: "ORD003",
    customer: {
      name: "Alice Johnson",
      email: "alice@example.com", 
      phone: "+1-234-567-8903",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
    },
    items: [
      {
        id: "REF003",
        name: "Restored iPhone 12",
        price: 549,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop"
      },
      {
        id: "REF004", 
        name: "Upcycled Desk Lamp",
        points: 280,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
      }
    ],
    total: 549,
    totalPoints: 280,
    paymentMethod: "mixed",
    status: "delivered",
    orderDate: "2025-01-04",
    deliveredDate: "2025-01-06",
    shippingAddress: "321 Green Valley Rd, Eco City, TX 75001",
    trackingNumber: "TRK987654321"
  },
  {
    id: "ORD004",
    customer: {
      name: "Bob Wilson",
      email: "bob@example.com",
      phone: "+1-234-567-8904", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
    },
    items: [
      {
        id: "REF005",
        name: "Refurbished Gaming Laptop",
        price: 1299,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=100&h=100&fit=crop"
      }
    ],
    total: 1299,
    paymentMethod: "credit_card",
    status: "cancelled",
    orderDate: "2025-01-03",
    shippingAddress: "654 Sustainable Ave, Green Hills, FL 33101",
    trackingNumber: null
  }
];

export default function MarketplaceOrders() {
  const [selectedOrder, setSelectedOrder] = useState<typeof marketplaceOrders[0] | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'shipped': return 'bg-primary text-primary-foreground';
      case 'delivered': return 'bg-success text-success-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentMethodDisplay = (method: string, total: number, totalPoints?: number) => {
    switch (method) {
      case 'credit_card':
        return <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />${total}</span>;
      case 'points':
        return <span className="flex items-center gap-1"><Coins className="w-4 h-4 text-warning" />{totalPoints} pts</span>;
      case 'mixed':
        return (
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />${total}</span>
            <span className="flex items-center gap-1"><Coins className="w-4 h-4 text-warning" />{totalPoints} pts</span>
          </div>
        );
      default:
        return <span>${total}</span>;
    }
  };

  const filteredOrders = marketplaceOrders.filter(order => {
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    const paymentMatch = paymentFilter === "all" || order.paymentMethod === paymentFilter;
    return statusMatch && paymentMatch;
  });

  const totalRevenue = marketplaceOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);
  
  const totalPointsUsed = marketplaceOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => sum + (order.totalPoints || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Marketplace Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and shipping</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Package className="w-4 h-4" />
            Export Orders
          </Button>
          <Button variant="eco" className="gap-2">
            <Truck className="w-4 h-4" />
            Bulk Ship
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{marketplaceOrders.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Points Used</p>
                <p className="text-2xl font-bold">{totalPointsUsed.toLocaleString()}</p>
              </div>
              <Coins className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {marketplaceOrders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
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
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Filter by payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="points">Points</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>Manage customer orders and track shipments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
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
                        <AvatarImage src={order.customer.avatar} />
                        <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img 
                        src={order.items[0].image} 
                        alt={order.items[0].name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">{order.items[0].name}</p>
                        {order.items.length > 1 && (
                          <p className="text-xs text-muted-foreground">+{order.items.length - 1} more</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodDisplay(order.paymentMethod, order.total, order.totalPoints)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {order.paymentMethod === 'credit_card' ? 'Card' : 
                       order.paymentMethod === 'points' ? 'Points' : 'Mixed'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)} gap-1`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{order.orderDate}</p>
                      {order.deliveredDate && (
                        <p className="text-muted-foreground">Delivered: {order.deliveredDate}</p>
                      )}
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
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Order Details</DialogTitle>
                          <DialogDescription>
                            Order {selectedOrder?.id} - {selectedOrder?.customer.name}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Customer & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">Customer</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage src={selectedOrder.customer.avatar} />
                                      <AvatarFallback>{selectedOrder.customer.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{selectedOrder.customer.name}</p>
                                      <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                                      <p className="text-sm text-muted-foreground">{selectedOrder.customer.phone}</p>
                                    </div>
                                  </div>
                                  <div className="pt-2">
                                    <p className="text-sm font-medium">Shipping Address:</p>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress}</p>
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
                                    <span className="text-sm">Order Date:</span>
                                    <span className="text-sm font-medium">{selectedOrder.orderDate}</span>
                                  </div>
                                  {selectedOrder.trackingNumber && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">Tracking:</span>
                                      <span className="text-sm font-medium">{selectedOrder.trackingNumber}</span>
                                    </div>
                                  )}
                                  {selectedOrder.deliveredDate && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">Delivered:</span>
                                      <span className="text-sm font-medium">{selectedOrder.deliveredDate}</span>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>

                            {/* Items */}
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base">Order Items</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                      <div className="flex items-center gap-3">
                                        <img 
                                          src={item.image} 
                                          alt={item.name}
                                          className="w-12 h-12 rounded object-cover"
                                        />
                                        <div>
                                          <p className="font-medium">{item.name}</p>
                                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        {item.price ? (
                                          <p className="font-medium">${item.price}</p>
                                        ) : (
                                          <div className="flex items-center gap-1">
                                            <Coins className="w-4 h-4 text-warning" />
                                            <p className="font-medium">{item.points} points</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="border-t pt-4 mt-4">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">Total:</span>
                                    <div className="text-right">
                                      {selectedOrder.total > 0 && (
                                        <p className="font-bold text-lg">${selectedOrder.total}</p>
                                      )}
                                      {selectedOrder.totalPoints && (
                                        <div className="flex items-center gap-1 justify-end">
                                          <Coins className="w-4 h-4 text-warning" />
                                          <p className="font-bold text-lg">{selectedOrder.totalPoints} points</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                              {selectedOrder.status === 'pending' && (
                                <>
                                  <Button variant="eco" className="flex-1">
                                    Mark as Shipped
                                  </Button>
                                  <Button variant="outline" className="flex-1">
                                    Cancel Order
                                  </Button>
                                </>
                              )}
                              {selectedOrder.status === 'shipped' && (
                                <Button variant="eco" className="flex-1">
                                  Mark as Delivered
                                </Button>
                              )}
                              <Button variant="outline">
                                Contact Customer
                              </Button>
                              <Button variant="outline">
                                Print Label
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