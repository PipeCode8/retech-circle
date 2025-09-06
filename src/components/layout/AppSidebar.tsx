import { 
  Home, 
  Users, 
  Package, 
  ShoppingCart, 
  Truck, 
  User,
  Settings,
  LogOut,
  Recycle
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const adminItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Users", url: "/users", icon: Users },
  { title: "Products", url: "/products", icon: Package },
  { title: "Collection Orders", url: "/admin/collection-orders", icon: Truck },
  { title: "Marketplace Orders", url: "/admin/marketplace-orders", icon: ShoppingCart },
  { title: "Marketplace", url: "/marketplace", icon: ShoppingCart },
];

const clientItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Request Collection", url: "/request", icon: Recycle },
  { title: "Marketplace", url: "/marketplace", icon: ShoppingCart },
  { title: "My Collections", url: "/my-collections", icon: Package },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const menuItems = user?.role === 'admin' ? adminItems : clientItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavClass = (isActive: boolean) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";

  if (!user) return null;

  return (
    <Sidebar className="w-64" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <Recycle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">EcoCollect</h2>
            <p className="text-xs text-sidebar-foreground/70">Tech Waste Solution</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {user.role === 'admin' ? 'Administration' : 'Collection'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavClass(isActive)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/profile"
                className={({ isActive }) => getNavClass(isActive)}
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-white text-primary text-xs">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-sidebar-foreground/70 capitalize">{user.role}</p>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}