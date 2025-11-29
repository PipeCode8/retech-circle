import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Package, Truck, DollarSign, Eye, CheckCircle, Clock, XCircle, Coins, Loader2 } from "lucide-react";

export default function MarketplaceOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [paymentFilter, setPaymentFilter] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/purchases");
      console.log("Compras recibidas:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Error al cargar compras:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las órdenes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }; 

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await api.patch(`/api/purchases/${orderId}/status`, {
        status: newStatus,
      });

      toast({
        title: "✅ Estado actualizado",
        description: `La orden ha sido marcada como ${newStatus}`,
      });

      await fetchOrders();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast({
        title: "❌ Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente': 
      case 'pending': 
        return 'bg-warning text-warning-foreground';
      case 'enviado':
      case 'shipped': 
        return 'bg-primary text-primary-foreground';
      case 'entregado':
      case 'delivered': 
        return 'bg-success text-success-foreground';
      case 'cancelado':
      case 'cancelled': 
        return 'bg-destructive text-destructive-foreground';
      default: 
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
      case 'pending': 
        return <Clock className="w-4 h-4" />;
      case 'enviado':
      case 'shipped': 
        return <Truck className="w-4 h-4" />;
      case 'entregado':
      case 'delivered': 
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelado':
      case 'cancelled': 
        return <XCircle className="w-4 h-4" />;
      default: 
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado',
      'pendiente': 'Pendiente',
      'enviado': 'Enviado',
      'entregado': 'Entregado',
      'cancelado': 'Cancelado'
    };
    return statusMap[status.toLowerCase()] || status;
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

  const filteredOrders = orders.filter(order => {
    const statusMatch = statusFilter === "todos" || order.status.toLowerCase() === statusFilter.toLowerCase();
    const paymentMatch = paymentFilter === "todos" || order.paymentMethod === paymentFilter;
    return statusMatch && paymentMatch;
  });

  const totalRevenue = orders
    .filter(o => o.status.toLowerCase() !== 'cancelado' && o.status.toLowerCase() !== 'cancelled')
    .reduce((sum, order) => sum + (order.total || 0), 0);
  
  const totalPointsUsed = orders
    .filter(o => o.status.toLowerCase() !== 'cancelado' && o.status.toLowerCase() !== 'cancelled')
    .reduce((sum, order) => sum + (order.totalPoints || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Órdenes del Marketplace</h1>
          <p className="text-muted-foreground">Gestiona pedidos de clientes y envíos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Package className="w-4 h-4" />
            Exportar Órdenes
          </Button>
          <Button variant="eco" className="gap-2" onClick={fetchOrders}>
            Actualizar
          </Button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Órdenes</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos</p>
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
                <p className="text-sm font-medium text-muted-foreground">Puntos Usados</p>
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
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.status.toLowerCase() === 'pendiente' || o.status.toLowerCase() === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Buscar órdenes..." 
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los Estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="entregado">Entregado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Filtrar por pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los Pagos</SelectItem>
                <SelectItem value="credit_card">Tarjeta</SelectItem>
                <SelectItem value="points">Puntos</SelectItem>
                <SelectItem value="mixed">Mixto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Órdenes */}
      <Card>
        <CardHeader>
          <CardTitle>Órdenes ({filteredOrders.length})</CardTitle>
          <CardDescription>Gestiona pedidos de clientes y rastrea envíos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Orden</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Artículos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No hay órdenes de compra
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={order.customer?.avatar} />
                          <AvatarFallback>{order.customer?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{order.customer?.name || "Usuario"}</p>
                          <p className="text-sm text-muted-foreground">{order.customer?.email || ""}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {order.items?.[0]?.image && (
                          <img 
                            src={order.items[0].image} 
                            alt={order.items[0].name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-sm">{order.items?.[0]?.name || "Producto"}</p>
                          {order.items?.length > 1 && (
                            <p className="text-xs text-muted-foreground">+{order.items.length - 1} más</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPaymentMethodDisplay(order.paymentMethod, order.total, order.totalPoints)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {order.paymentMethod === 'credit_card' ? 'Tarjeta' : 
                         order.paymentMethod === 'points' ? 'Puntos' : 'Mixto'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status)} gap-1 capitalize`}>
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{order.orderDate || new Date(order.createdAt).toLocaleDateString()}</p>
                        {order.deliveredDate && (
                          <p className="text-muted-foreground">Entregado: {order.deliveredDate}</p>
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
                            <DialogTitle>Detalles de la Orden</DialogTitle>
                            <DialogDescription>
                              Orden #{selectedOrder?.id} - {selectedOrder?.customer?.name || "Usuario"}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              {/* Cliente y Estado */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Cliente</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div className="flex items-center gap-3">
                                      <Avatar>
                                        <AvatarImage src={selectedOrder.customer?.avatar} />
                                        <AvatarFallback>{selectedOrder.customer?.name?.charAt(0) || "U"}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">{selectedOrder.customer?.name || "Usuario"}</p>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.customer?.email || ""}</p>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.customer?.phone || ""}</p>
                                      </div>
                                    </div>
                                    <div className="pt-2">
                                      <p className="text-sm font-medium">Dirección de Envío:</p>
                                      <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress}</p>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Estado de la Orden</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">Estado:</span>
                                      <Badge className={getStatusColor(selectedOrder.status)}>
                                        {getStatusLabel(selectedOrder.status)}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">Fecha de Orden:</span>
                                      <span className="text-sm font-medium">
                                        {selectedOrder.orderDate || new Date(selectedOrder.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    {selectedOrder.trackingNumber && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm">Seguimiento:</span>
                                        <span className="text-sm font-medium">{selectedOrder.trackingNumber}</span>
                                      </div>
                                    )}
                                    {selectedOrder.deliveredDate && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm">Entregado:</span>
                                        <span className="text-sm font-medium">{selectedOrder.deliveredDate}</span>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Artículos */}
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">Artículos de la Orden</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    {selectedOrder.items?.map((item: any, index: number) => (
                                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-3">
                                          <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-12 h-12 rounded object-cover"
                                          />
                                          <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          {item.price ? (
                                            <p className="font-medium">${item.price}</p>
                                          ) : (
                                            <div className="flex items-center gap-1">
                                              <Coins className="w-4 h-4 text-warning" />
                                              <p className="font-medium">{item.points} puntos</p>
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
                                            <p className="font-bold text-lg">{selectedOrder.totalPoints} puntos</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Acciones */}
                              <div className="flex gap-2 pt-4">
                                {(selectedOrder.status.toLowerCase() === 'pendiente' || selectedOrder.status.toLowerCase() === 'pending') && (
                                  <>
                                    <Button 
                                      variant="eco" 
                                      className="flex-1"
                                      onClick={() => {
                                        updateOrderStatus(selectedOrder.id, "Enviado");
                                        setSelectedOrder(null);
                                      }}
                                    >
                                      Marcar como Enviado
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      className="flex-1"
                                      onClick={() => {
                                        updateOrderStatus(selectedOrder.id, "Cancelado");
                                        setSelectedOrder(null);
                                      }}
                                    >
                                      Cancelar Orden
                                    </Button>
                                  </>
                                )}
                                {(selectedOrder.status.toLowerCase() === 'enviado' || selectedOrder.status.toLowerCase() === 'shipped') && (
                                  <Button 
                                    variant="eco" 
                                    className="flex-1"
                                    onClick={() => {
                                      updateOrderStatus(selectedOrder.id, "Entregado");
                                      setSelectedOrder(null);
                                    }}
                                  >
                                    Marcar como Entregado
                                  </Button>
                                )}
                                <Button variant="outline">
                                  Contactar Cliente
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}