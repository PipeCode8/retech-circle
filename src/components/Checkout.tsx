import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function Checkout() {
    const user = useUser();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [shippingAddress, setShippingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    const [isLoading, setIsLoading] = useState(false);

    // Obtener items del carrito del localStorage
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    
    const total = cartItems.reduce(
        (sum: number, item: any) => sum + (item.price || 0) * item.quantity,
        0
    );

    const handlePurchase = async () => {
        if (!shippingAddress.trim()) {
            toast({
                title: "Error",
                description: "Por favor ingresa una dirección de envío",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsLoading(true);

            await api.post("/api/purchases", {
                userId: user?.id,
                items: cartItems,
                total,
                totalPoints: 0,
                paymentMethod,
                shippingAddress,
            });

            localStorage.removeItem("cart");
            
            toast({
                title: "¡Compra exitosa!",
                description: "Tu pedido ha sido procesado correctamente",
            });

            navigate("/marketplace");
        } catch (error) {
            console.error("Error al realizar compra:", error);
            toast({
                title: "Error",
                description: "No se pudo procesar la compra",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <Card>
                    <CardContent className="p-12">
                        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
                        <Button onClick={() => navigate("/marketplace")}>
                            Ir al Marketplace
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resumen del pedido */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resumen del Pedido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {cartItems.map((item: any, index: number) => (
                            <div key={index} className="flex items-center gap-3 pb-3 border-b">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 rounded object-cover"
                                />
                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Cantidad: {item.quantity}
                                    </p>
                                </div>
                                <p className="font-bold">${item.price * item.quantity}</p>
                            </div>
                        ))}
                        
                        <div className="pt-4 border-t">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total:</span>
                                <span className="text-2xl text-primary">${total}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Formulario de pago */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información de Envío</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Dirección de Envío *</Label>
                            <Input
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="Calle, número, ciudad, código postal"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label>Método de Pago</Label>
                            <select
                                className="w-full p-2 border rounded mt-1"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="credit_card">💳 Tarjeta de Crédito</option>
                                <option value="points">🪙 Puntos EcoCollect</option>
                                <option value="mixed">💰 Mixto (Tarjeta + Puntos)</option>
                            </select>
                        </div>

                        <Button
                            variant="eco"
                            className="w-full"
                            onClick={handlePurchase}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                `Pagar $${total}`
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}