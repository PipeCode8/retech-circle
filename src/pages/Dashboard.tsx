import { useAuth } from "@/contexts/AuthContext";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return user.role === 'admin' ? <AdminDashboard /> : <ClientDashboard />;
}