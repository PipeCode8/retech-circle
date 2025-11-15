import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Star, ShoppingCart, Coins, Eye } from "lucide-react";
import { useState } from "react";
import { Product, useCart } from "@/contexts/CartContext";
import ProductModal from "@/components/ProductModal";
import CartDrawer from "@/components/CartDrawer";

const featuredProducts: Product[] = [
  {
    id: "REF001",
    name: "MacBook Pro 13\" Reacondicionado",
    description: "Modelo 2020, 8GB RAM, 256GB SSD. Completamente probado y restaurado.",
    price: 899,
    originalPrice: 1299,
    points: 0,
    rating: 4.8,
    reviews: 124,
    seller: "EcoTech Refurbish",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
    condition: "Excelente",
    warranty: "6 meses"
  },
  {
    id: "REF002", 
    name: "Silla Gamer Reciclada",
    description: "Diseño ergonómico fabricado con plásticos electrónicos reciclados.",
    price: 0,
    originalPrice: 0,
    points: 450,
    rating: 4.6,
    reviews: 89,
    seller: "Green Furniture Co",
    image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=300&h=300&fit=crop",
    condition: "Como Nuevo",
    warranty: "1 año"
  },
  {
    id: "REF003",
    name: "iPhone 12 Restaurado",
    description: "128GB, Liberado. Salud de batería 95%. Condición Grado A.",
    price: 549,
    originalPrice: 799,
    points: 0,
    rating: 4.9,
    reviews: 203,
    seller: "Mobile Restore Plus",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
    condition: "Excelente", 
    warranty: "1 año"
  },
  {
    id: "REF004",
    name: "Lámpara de Escritorio Upcycled",
    description: "Lámpara LED moderna fabricada con componentes de laptop reciclados.",
    price: 0,
    originalPrice: 0, 
    points: 280,
    rating: 4.7,
    reviews: 56,
    seller: "EcoDesign Studio",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    condition: "Nuevo",
    warranty: "2 años"
  }
];

const categories = [
  "Todas las Categorías",
  "Laptops y Computadoras",
  "Dispositivos Móviles", 
  "Accesorios",
  "Muebles",
  "Electrónicos",
  "Hogar y Decoración"
];

export default function Marketplace() {
  const { state, addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">EcoMarketplace</h1>
          <p className="text-muted-foreground">Descubre productos tecnológicos reacondicionados y reciclados</p>
        </div>
        <Button variant="eco" className="gap-2 lg:w-auto w-full">
          <CartDrawer>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Ver Carrito ({state.itemCount})
            </div>
          </CartDrawer>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Buscar productos..." 
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="featured">
              <SelectTrigger className="md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destacados</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="rating">Mejor Calificados</SelectItem>
                <SelectItem value="newest">Más Recientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Featured Products */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Productos Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-eco transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge 
                    className="absolute top-2 right-2 bg-success text-success-foreground"
                  >
                    {product.condition}
                  </Badge>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) 
                              ? 'text-warning fill-current' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      {product.price > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">${product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm line-through text-muted-foreground">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Coins className="w-5 h-5 text-warning" />
                          <span className="text-2xl font-bold text-warning">{product.points}</span>
                          <span className="text-sm text-muted-foreground">puntos</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>Vendido por {product.seller}</p>
                    <p>Garantía de {product.warranty}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewProduct(product)}
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </Button>
                    <Button 
                      variant="eco" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Impact Stats */}
      <Card className="gradient-card border-0">
        <CardHeader>
          <CardTitle className="text-center">Tu Impacto Ambiental</CardTitle>
          <CardDescription className="text-center">
            Al comprar productos reacondicionados, estás marcando la diferencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-success">2.4 toneladas</p>
              <p className="text-sm text-muted-foreground">Emisiones de CO₂ evitadas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">847</p>
              <p className="text-sm text-muted-foreground">Dispositivos con nueva vida</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-warning">1,250</p>
              <p className="text-sm text-muted-foreground">EcoPuntos ganados</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de producto */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}