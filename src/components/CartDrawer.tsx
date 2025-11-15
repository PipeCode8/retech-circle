import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, Coins } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface CartDrawerProps {
  children: React.ReactNode;
}

export default function CartDrawer({ children }: CartDrawerProps) {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
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

    toast({
      title: "Procesando compra",
      description: "Redirigiendo al proceso de pago...",
      variant: "default",
    });

    // Aquí implementarías la lógica real del checkout
    console.log("Procesando checkout con items:", state.items);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrito de Compras
            {state.itemCount > 0 && (
              <Badge variant="secondary">{state.itemCount}</Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            {state.items.length === 0 
              ? "Tu carrito está vacío" 
              : `${state.items.length} producto${state.items.length !== 1 ? 's' : ''} en tu carrito`
            }
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Lista de productos */}
          <div className="flex-1 overflow-y-auto py-4">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  Tu carrito está vacío
                </p>
                <p className="text-sm text-muted-foreground">
                  Explora nuestros productos y encuentra tecnología reacondicionada
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.seller}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          {item.price > 0 ? (
                            <span className="font-semibold text-primary">
                              ${item.price}
                            </span>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Coins className="w-4 h-4 text-warning" />
                              <span className="font-semibold text-warning">
                                {item.points}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="w-8 h-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumen y botones */}
          {state.items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                {state.total > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total (USD):</span>
                    <span className="text-lg font-bold text-primary">
                      ${state.total.toFixed(2)}
                    </span>
                  </div>
                )}
                
                {state.totalPoints > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total (EcoPoints):</span>
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-warning" />
                      <span className="text-lg font-bold text-warning">
                        {state.totalPoints}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{state.itemCount} artículo{state.itemCount !== 1 ? 's' : ''}</span>
                  <span>Envío gratuito</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button 
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  Proceder al Pago
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="w-full text-destructive hover:text-destructive"
                  size="sm"
                >
                  Vaciar Carrito
                </Button>
              </div>

              {/* Impacto ambiental */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-600">🌱</span>
                  <span className="text-sm font-medium text-green-800">
                    Impacto Ambiental
                  </span>
                </div>
                <p className="text-xs text-green-700">
                  Con esta compra evitarás la emisión de aproximadamente{' '}
                  <span className="font-semibold">
                    {(state.itemCount * 15).toFixed(0)} kg de CO₂
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}