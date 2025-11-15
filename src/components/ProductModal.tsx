import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Coins, Shield, Truck, RotateCcw, Package } from "lucide-react";
import { Product, useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addItem, isInCart, getItemQuantity } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product);
  };

  // Simular imágenes adicionales del producto
  const productImages = [
    product.image,
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&sat=-100",
  ];

  const inCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
          <DialogDescription>
            Producto reacondicionado por {product.seller}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-gray-100">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-success text-success-foreground">
                {product.condition}
              </Badge>
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-warning fill-current'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reseñas)</span>
            </div>

            {/* Precio */}
            <div className="space-y-2">
              {product.price > 0 ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">${product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg line-through text-muted-foreground">
                      ${product.originalPrice}
                    </span>
                  )}
                  {product.originalPrice > product.price && (
                    <Badge variant="secondary">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Coins className="w-6 h-6 text-warning" />
                  <span className="text-3xl font-bold text-warning">{product.points}</span>
                  <span className="text-lg text-muted-foreground">EcoPoints</span>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Características */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Información del producto</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span>Condición: {product.condition}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span>Garantía: {product.warranty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span>Envío gratuito</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-muted-foreground" />
                  <span>30 días de devolución</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Vendedor */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Vendido por</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">
                    {product.seller.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{product.seller}</p>
                  <p className="text-sm text-muted-foreground">Vendedor verificado</p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              {inCart && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm font-medium">
                    ✓ Ya tienes {quantity} {quantity === 1 ? 'unidad' : 'unidades'} en tu carrito
                  </p>
                </div>
              )}
              
              <Button
                onClick={handleAddToCart}
                className="w-full gap-2 h-12 text-lg"
                variant="eco"
              >
                <ShoppingCart className="w-5 h-5" />
                {inCart ? 'Agregar otra unidad' : 'Agregar al carrito'}
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-lg"
                onClick={() => {
                  handleAddToCart();
                  // Aquí podrías navegar al checkout directamente
                }}
              >
                Comprar ahora
              </Button>
            </div>

            {/* Impacto ambiental */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">🌱 Impacto Ambiental</h4>
              <p className="text-sm text-green-700">
                Al comprar este producto reacondicionado, evitas la emisión de aproximadamente{' '}
                <span className="font-semibold">15 kg de CO₂</span> y ayudas a extender la vida útil de la tecnología.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}