import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Clock, CheckCircle, XCircle, Eye, Phone, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CollectionItem {
	id: string;
	type: string;
	brand?: string;
	model?: string;
	condition: string;
	quantity: number;
	estimatedPoints: number;
}

interface CollectionOrder {
	id: number;
	userId: number;
	status: string;
	address: string;
	preferredDate: string;
	preferredTime: string;
	specialInstructions?: string;
	items: CollectionItem[];
	user?: {
		id: number;
		name: string;
		email: string;
		phone?: string;
	};
}

export default function CollectionOrders() {
	const [orders, setOrders] = useState<CollectionOrder[]>([]);
	const [selectedOrder, setSelectedOrder] = useState<CollectionOrder | null>(null);
	const [statusFilter, setStatusFilter] = useState("todos");
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	// Cargar órdenes al montar el componente
	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			setIsLoading(true);
			const response = await api.get("/api/solicitudes");
			console.log("Órdenes recibidas:", response.data);
			
			// Obtener datos de usuarios para cada orden
			const ordersWithUsers = await Promise.all(
				response.data.map(async (order: CollectionOrder) => {
					try {
						const userResponse = await api.get(`/api/users/${order.userId}`);
						return {
							...order,
							user: userResponse.data
						};
					} catch (error) {
						console.error(`Error al cargar usuario ${order.userId}:`, error);
						return {
							...order,
							user: {
								id: order.userId,
								name: "Usuario no encontrado",
								email: "No disponible"
							}
						};
					}
				})
			);
			
			setOrders(ordersWithUsers);
		} catch (error) {
			console.error("Error al cargar órdenes:", error);
			toast({
				title: "Error",
				description: "No se pudieron cargar las órdenes de recolección",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const updateOrderStatus = async (orderId: number, newStatus: string) => {
		try {
			console.log(`Actualizando orden ${orderId} a estado: ${newStatus}`);
			
			// Cambiar la ruta para que coincida con el backend
			await api.patch(`/api/collection-orders/${orderId}/status`, { 
				status: newStatus 
			});
			
			toast({
				title: "✅ Estado actualizado",
				description: `La orden #${orderId} ha sido marcada como ${newStatus}`,
			});
			
			await fetchOrders();
			
		} catch (error: any) {
			console.error("Error al actualizar estado:", error);
			console.error("Respuesta del servidor:", error.response?.data);
			
			const errorMessage = error.response?.data?.error || 
								error.response?.data?.message || 
								"No se pudo actualizar el estado de la orden";
			
			toast({
				title: "❌ Error",
				description: errorMessage,
				variant: "destructive",
			});
		}
	};

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "pendiente":
				return "bg-warning text-warning-foreground";
			case "recolectado":
				return "bg-success text-success-foreground";
			case "procesando":
				return "bg-primary text-primary-foreground";
			case "cancelado":
				return "bg-destructive text-destructive-foreground";
			default:
				return "bg-muted text-muted-foreground";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status.toLowerCase()) {
			case "pendiente":
				return <Clock className="w-4 h-4" />;
			case "recolectado":
				return <CheckCircle className="w-4 h-4" />;
			case "procesando":
				return <Clock className="w-4 h-4" />;
			case "cancelado":
				return <XCircle className="w-4 h-4" />;
			default:
				return <Clock className="w-4 h-4" />;
		}
	};

	const getTimeLabel = (time: string) => {
		const timeLabels: { [key: string]: string } = {
			morning: "Mañana (9 AM - 12 PM)",
			afternoon: "Tarde (12 PM - 5 PM)",
			evening: "Noche (5 PM - 8 PM)",
		};
		return timeLabels[time] || time;
	};

	const filteredOrders = orders.filter((order) => {
		const statusMatch = statusFilter === "todos" || order.status.toLowerCase() === statusFilter.toLowerCase();
		return statusMatch;
	});

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
					<h1 className="text-3xl font-bold">Órdenes de Recolección</h1>
					<p className="text-muted-foreground">Gestiona solicitudes de recolección de residuos tecnológicos</p>
				</div>
				<Button variant="eco" className="gap-2 lg:w-auto w-full" onClick={fetchOrders}>
					Actualizar
				</Button>
			</div>

			{/* Filtros */}
			<Card>
				<CardContent className="p-6">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
							<Input placeholder="Buscar órdenes..." className="pl-9" />
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="md:w-48">
								<SelectValue placeholder="Filtrar por estado" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="todos">Todos los Estados</SelectItem>
								<SelectItem value="pendiente">Pendiente</SelectItem>
								<SelectItem value="recolectado">Recolectado</SelectItem>
								<SelectItem value="procesando">Procesando</SelectItem>
								<SelectItem value="cancelado">Cancelado</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Tabla de Órdenes */}
			<Card>
				<CardHeader>
					<CardTitle>Solicitudes de Recolección ({filteredOrders.length})</CardTitle>
					<CardDescription>Gestiona y rastrea todas las órdenes de recolección</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID Orden</TableHead>
								<TableHead>Cliente</TableHead>
								<TableHead>Dirección</TableHead>
								<TableHead>Artículos</TableHead>
								<TableHead>Estado</TableHead>
								<TableHead>Fecha Programada</TableHead>
								<TableHead>Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredOrders.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="text-center text-muted-foreground">
										No hay órdenes de recolección
									</TableCell>
								</TableRow>
							) : (
								filteredOrders.map((order) => (
									<TableRow key={order.id}>
										<TableCell className="font-medium">#{order.id}</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Avatar className="w-8 h-8">
													<AvatarFallback>{order.user?.name?.charAt(0) || "U"}</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">{order.user?.name || "Usuario"}</p>
													<p className="text-sm text-muted-foreground">{order.user?.email || "Sin correo"}</p>
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
												<p className="font-medium">{order.items?.length || 0} artículos</p>
												{order.items?.[0] && (
													<p className="text-muted-foreground">{order.items[0].type}...</p>
												)}
											</div>
										</TableCell>
										<TableCell>
											<Badge className={`${getStatusColor(order.status)} gap-1 capitalize`}>
												{getStatusIcon(order.status)}
												{order.status}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="text-sm">
												<p className="font-medium">{order.preferredDate}</p>
												<p className="text-muted-foreground">{getTimeLabel(order.preferredTime)}</p>
											</div>
										</TableCell>
										<TableCell>
											<Dialog>
												<DialogTrigger asChild>
													<Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
														<Eye className="w-4 h-4" />
													</Button>
												</DialogTrigger>
												<DialogContent className="max-w-2xl">
													<DialogHeader>
														<DialogTitle>Detalles de Orden de Recolección</DialogTitle>
														<DialogDescription>Orden #{selectedOrder?.id}</DialogDescription>
													</DialogHeader>
													{selectedOrder && (
														<div className="space-y-6">
															{/* Información del Cliente */}
															<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																<Card>
																	<CardHeader className="pb-3">
																		<CardTitle className="text-base">Información del Cliente</CardTitle>
																	</CardHeader>
																	<CardContent className="space-y-3">
																		<div className="flex items-center gap-3">
																			<Avatar>
																				<AvatarFallback>{selectedOrder.user?.name?.charAt(0) || "U"}</AvatarFallback>
																			</Avatar>
																			<div>
																				<p className="font-medium">{selectedOrder.user?.name || "Usuario"}</p>
																				<div className="flex items-center gap-1 text-sm text-muted-foreground">
																					<Mail className="w-3 h-3" />
																					{selectedOrder.user?.email || "Sin correo"}
																				</div>
																				{selectedOrder.user?.phone && (
																					<div className="flex items-center gap-1 text-sm text-muted-foreground">
																						<Phone className="w-3 h-3" />
																						{selectedOrder.user.phone}
																					</div>
																				)}
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
																		<CardTitle className="text-base">Estado de la Orden</CardTitle>
																	</CardHeader>
																	<CardContent className="space-y-3">
																		<div className="flex items-center justify-between">
																			<span className="text-sm">Estado:</span>
																			<Badge className={`${getStatusColor(selectedOrder.status)} capitalize`}>
																				{selectedOrder.status}
																			</Badge>
																		</div>
																		<div className="flex items-center justify-between">
																			<span className="text-sm">Fecha:</span>
																			<span className="text-sm font-medium">{selectedOrder.preferredDate}</span>
																		</div>
																		<div className="flex items-center justify-between">
																			<span className="text-sm">Horario:</span>
																			<span className="text-sm font-medium">
																				{getTimeLabel(selectedOrder.preferredTime)}
																			</span>
																		</div>
																	</CardContent>
																</Card>
															</div>

															{/* Artículos */}
															<Card>
																<CardHeader className="pb-3">
																	<CardTitle className="text-base">Artículos para Recolectar</CardTitle>
																</CardHeader>
																<CardContent>
																	<div className="space-y-3">
																		{selectedOrder.items?.map((item, index) => (
																			<div
																				key={index}
																				className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
																			>
																				<div>
																					<p className="font-medium">
																						{item.quantity}x {item.type}
																					</p>
																					{item.brand && <p className="text-sm text-muted-foreground">{item.brand}</p>}
																					{item.model && <p className="text-sm text-muted-foreground">{item.model}</p>}
																				</div>
																				<Badge variant="outline" className="bg-background capitalize">
																					{item.condition}
																				</Badge>
																			</div>
																		))}
																	</div>
																</CardContent>
															</Card>

															{/* Notas */}
															{selectedOrder.specialInstructions && (
																<Card>
																	<CardHeader className="pb-3">
																		<CardTitle className="text-base">Instrucciones Especiales</CardTitle>
																	</CardHeader>
																	<CardContent>
																		<p className="text-sm">{selectedOrder.specialInstructions}</p>
																	</CardContent>
																</Card>
															)}

															{/* Acciones */}
															<div className="flex gap-2 pt-4">
																{selectedOrder.status.toLowerCase() === "pendiente" && (
																	<>
																		<Button
																			variant="eco"
																			className="flex-1"
																			onClick={() => {
																				updateOrderStatus(selectedOrder.id, "Recolectado");
																				setSelectedOrder(null);
																			}}
																		>
																			Marcar como Recolectado
																		</Button>
																		<Button
																			variant="outline"
																			className="flex-1"
																			onClick={() => {
																				updateOrderStatus(selectedOrder.id, "Procesando");
																				setSelectedOrder(null);
																			}}
																		>
																			Marcar como Procesando
																		</Button>
																	</>
																)}
																
																{selectedOrder.status.toLowerCase() === "recolectado" && (
																	<Button
																		variant="eco"
																		className="flex-1"
																		onClick={() => {
																			updateOrderStatus(selectedOrder.id, "Procesando");
																			setSelectedOrder(null);
																		}}
																	>
																		Iniciar Procesamiento
																	</Button>
																)}
																
																{selectedOrder.status.toLowerCase() === "procesando" && (
																	<Button
																		variant="eco"
																		className="flex-1"
																		onClick={() => {
																			updateOrderStatus(selectedOrder.id, "Completado");
																			setSelectedOrder(null);
																		}}
																	>
																		Completar Procesamiento
																	</Button>
																)}
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