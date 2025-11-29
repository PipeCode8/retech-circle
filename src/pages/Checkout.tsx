import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, CreditCard, Coins, Package } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

  const totalPoints = cartItems.reduce(
    (sum: number, item: any) => sum + (item.points || 0) * item.quantity,
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
        totalPoints,
        paymentMethod,
        shippingAddress,
        status: "pendiente"
      });

      localStorage.removeItem("cart");
      
      // Limpiar el carrito del contexto también
      window.dispatchEvent(new Event('storage'));

      toast({
        title: "¡Compra exitosa! 🎉",
        description: "Tu pedido ha sido procesado correctamente",
      });

      navigate("/marketplace");
    } catch (error) {
      console.error("Error al realizar compra:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar la compra. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <Package className="w-16 h-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
            <p className="text-muted-foreground">
              Agrega algunos productos antes de proceder al pago
            </p>
            <Button onClick={() => navigate("/marketplace")} variant="eco">
              Ir al Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/marketplace")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al Marketplace
      </Button>

      <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumen del pedido */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-3 pb-3 border-b last:border-0"
              >
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
                <div className="text-right">
                  {item.price > 0 ? (
                    <p className="font-bold">${item.price * item.quantity}</p>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-warning" />
                      <p className="font-bold text-warning">
                        {item.points * item.quantity}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t space-y-2">
              {total > 0 && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal (USD):</span>
                  <span className="text-lg font-bold">${total}</span>
                </div>
              )}
              {totalPoints > 0 && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Puntos:</span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-5 h-5 text-warning" />
                    <span className="text-lg font-bold text-warning">
                      {totalPoints}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Envío:</span>
                <span className="text-success font-medium">Gratuito</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total:</span>
                <div className="text-right">
                  {total > 0 && (
                    <p className="text-2xl font-bold text-primary">${total}</p>
                  )}
                  {totalPoints > 0 && (
                    <div className="flex items-center gap-1 justify-end">
                      <Coins className="w-5 h-5 text-warning" />
                      <p className="text-2xl font-bold text-warning">
                        {totalPoints} pts
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de pago */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Envío</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  placeholder="Juan Pérez"
                  defaultValue={(user as any)?.name || ""}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@example.com"
                  defaultValue={(user as any)?.email || ""}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+57 300 123 4567"
                  defaultValue={(user as any)?.phone || ""}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="address">Dirección de Envío *</Label>
                <Input
                  id="address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Calle, número, ciudad, código postal"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Método de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Tarjeta de Crédito/Débito</p>
                      <p className="text-sm text-muted-foreground">
                        Paga con tu tarjeta bancaria
                      </p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="points" id="points" />
                  <Label htmlFor="points" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Coins className="w-5 h-5 text-warning" />
                    <div>
                      <p className="font-medium">Puntos EcoCollect</p>
                      <p className="text-sm text-muted-foreground">
                        Canjea tus puntos acumulados
                      </p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed" className="flex items-center gap-2 cursor-pointer flex-1">
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-5 h-5" />
                      <Coins className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">Pago Mixto</p>
                      <p className="text-sm text-muted-foreground">
                        Combina tarjeta y puntos
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Button
            variant="eco"
            className="w-full text-lg py-6"
            onClick={handlePurchase}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                {total > 0 && `Pagar $${total}`}
                {totalPoints > 0 && total === 0 && `Canjear ${totalPoints} puntos`}
                {totalPoints > 0 && total > 0 && ` y ${totalPoints} pts`}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Al realizar tu compra, aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    </div>
  );
}