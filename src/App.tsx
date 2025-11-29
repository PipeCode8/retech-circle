import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { EcoPointsProvider } from "@/contexts/EcoPointsContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import CollectionRequest from "./pages/CollectionRequest";
import MyCollections from "./pages/MyCollections";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CollectionOrders from "./pages/admin/CollectionOrders";
import MarketplaceOrders from "./pages/admin/MarketplaceOrders";
import Home from "./pages/Home";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import AdminRegister from "./pages/admin/adminRegister";
import ForgotPassword from "./pages/ForgotPassword";
import { UserContext } from "./context/UserContext";


const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? <AppLayout>{children}</AppLayout> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

const App = () => {
  return (
    <AuthProvider>
      <UserContextWrapper />
    </AuthProvider>
  );
};

// Nuevo componente para obtener el usuario y proveer el contexto
function UserContextWrapper() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Puedes mostrar un loader mientras carga el usuario
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const content = (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <EcoPointsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Router>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                  <Route path="/request" element={<ProtectedRoute><CollectionRequest /></ProtectedRoute>} />
                  <Route path="/my-collections" element={<ProtectedRoute><MyCollections /></ProtectedRoute>} />
                  <Route path="/admin/collection-orders" element={<ProtectedRoute><CollectionOrders /></ProtectedRoute>} />
                  <Route path="/admin/marketplace-orders" element={<ProtectedRoute><MarketplaceOrders /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/collectionrequest" element={<ProtectedRoute><CollectionRequest /></ProtectedRoute>} />
                  <Route path="/admin/adminRegister" element={<AdminRegister />} />
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
              </Router>
            </TooltipProvider>
          </EcoPointsProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );

  // Solo provee el contexto si hay usuario
  return user
    ? <UserContext.Provider value={{ id: Number(user.id) }}>{content}</UserContext.Provider>
    : content;
}

export default App;
