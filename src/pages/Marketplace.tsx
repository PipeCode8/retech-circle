import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Star, ShoppingCart, Coins, Eye } from "lucide-react";

const featuredProducts = [
  {
    id: "REF001",
    name: "Refurbished MacBook Pro 13\"",
    description: "2020 Model, 8GB RAM, 256GB SSD. Fully tested and restored.",
    price: 899,
    originalPrice: 1299,
    points: 0,
    rating: 4.8,
    reviews: 124,
    seller: "EcoTech Refurbish",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
    condition: "Excellent",
    warranty: "6 months"
  },
  {
    id: "REF002", 
    name: "Recycled Gaming Chair",
    description: "Ergonomic design made from recycled electronic plastics.",
    price: 0,
    originalPrice: 0,
    points: 450,
    rating: 4.6,
    reviews: 89,
    seller: "Green Furniture Co",
    image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=300&h=300&fit=crop",
    condition: "Like New",
    warranty: "1 year"
  },
  {
    id: "REF003",
    name: "Restored iPhone 12",
    description: "128GB, Unlocked. Battery health 95%. Grade A condition.",
    price: 549,
    originalPrice: 799,
    points: 0,
    rating: 4.9,
    reviews: 203,
    seller: "Mobile Restore Plus",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
    condition: "Excellent", 
    warranty: "1 year"
  },
  {
    id: "REF004",
    name: "Upcycled Desk Lamp",
    description: "Modern LED lamp crafted from recycled laptop components.",
    price: 0,
    originalPrice: 0, 
    points: 280,
    rating: 4.7,
    reviews: 56,
    seller: "EcoDesign Studio",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    condition: "New",
    warranty: "2 years"
  }
];

const categories = [
  "All Categories",
  "Laptops & Computers",
  "Mobile Devices", 
  "Accessories",
  "Furniture",
  "Electronics",
  "Home & Decor"
];

export default function Marketplace() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">EcoMarketplace</h1>
          <p className="text-muted-foreground">Discover refurbished and recycled tech products</p>
        </div>
        <Button variant="eco" className="gap-2 lg:w-auto w-full">
          <ShoppingCart className="w-4 h-4" />
          View Cart (0)
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search products..." 
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
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Featured Products */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
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
                          <span className="text-sm text-muted-foreground">points</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>Sold by {product.seller}</p>
                    <p>{product.warranty} warranty</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button variant="eco" size="sm" className="flex-1">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
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
          <CardTitle className="text-center">Your Environmental Impact</CardTitle>
          <CardDescription className="text-center">
            By shopping refurbished, you're making a difference
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-success">2.4 tons</p>
              <p className="text-sm text-muted-foreground">CO₂ emissions saved</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">847</p>
              <p className="text-sm text-muted-foreground">Devices given new life</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-warning">1,250</p>
              <p className="text-sm text-muted-foreground">EcoPoints earned</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}