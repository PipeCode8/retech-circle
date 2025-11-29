import React, { useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CartDrawerProps {
  children: React.ReactNode;
}

export default function CartDrawer({ children }: CartDrawerProps) {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Calcular totales
  const totals = useMemo(() => {
    const totalPrice = state.items.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    );
    const totalPoints = state.items.reduce(
      (sum, item) => sum + (item.points || 0) * item.quantity,
      0
    );
    return { totalPrice, totalPoints };
  }, [state.items]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado del carrito",
      });
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (state.items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega algunos productos antes de proceder al pago",
        variant: "destructive",
      });
      return;
    }

    // Cerrar el drawer
    setOpen(false);

    // Navegar a checkout después de un pequeño delay para que el drawer se cierre
    setTimeout(() => {
      navigate("/checkout");
    }, 300);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrito de Compras
            {state.items.length > 0 && (
              <span className="ml-auto bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {state.items.length}
              </span>
            )}
          </SheetTitle>
          <SheetDescription>
            {state.items.length === 0 
              ? "Tu carrito está vacío" 
              : `${state.items.length} ${state.items.length === 1 ? 'producto' : 'productos'} en tu carrito`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full py-6">
          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No hay productos en tu carrito</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setOpen(false);
                  navigate("/marketplace");
                }}
                className="mt-4"
              >
                Ir al Marketplace
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 rounded-lg border bg-card"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.seller}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {item.price > 0 ? (
                            <p className="font-bold text-primary">${item.price}</p>
                          ) : (
                            <p className="font-bold text-warning">{item.points} pts</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t pt-4 mt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total (USD):</span>
                    <span className="font-bold text-lg">${totals.totalPrice.toFixed(2)}</span>
                  </div>
                  {totals.totalPoints > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Puntos:</span>
                      <span className="font-bold text-lg text-warning">{totals.totalPoints} pts</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {state.items.length} {state.items.length === 1 ? 'artículo' : 'artículos'}
                  </p>
                  <p className="text-xs text-success">Envío gratuito</p>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full"
                    size="lg"
                    variant="eco"
                  >
                    Proceder al Pago
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      clearCart();
                      toast({
                        title: "Carrito vaciado",
                        description: "Todos los productos han sido eliminados",
                      });
                    }}
                  >
                    Vaciar Carrito
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}