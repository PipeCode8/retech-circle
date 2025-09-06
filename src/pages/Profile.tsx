import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Award,
  Coins,
  Package,
  Star,
  Calendar,
  Edit2,
  Save,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleSave = () => {
    // Here you would normally save to your backend
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setIsEditing(false);
  };

  const achievements = [
    { name: "Eco Warrior", description: "Collected 10+ devices", icon: Award, earned: true },
    { name: "Green Pioneer", description: "First collection completed", icon: Star, earned: true },
    { name: "Sustainability Champion", description: "Saved 1 ton of CO₂", icon: Coins, earned: true },
    { name: "Tech Recycler Pro", description: "25+ successful collections", icon: Package, earned: false },
  ];

  const recentActivity = [
    { date: "2025-01-06", action: "Collection requested", details: "3 devices", points: 180 },
    { date: "2025-01-05", action: "Item purchased", details: "Refurbished laptop stand", points: -300 },
    { date: "2025-01-03", action: "Collection completed", details: "MacBook Pro, iPhone", points: 250 },
    { date: "2025-01-01", action: "Joined EcoCollect", details: "Welcome bonus", points: 100 },
  ];

  if (!user) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and track your impact</p>
        </div>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} className="gap-2">
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button variant="eco" onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xl">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since January 2025
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={!isEditing}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={!isEditing}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="pl-9"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      disabled={!isEditing}
                      className="pl-9 min-h-[80px]"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions with EcoCollect</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={activity.points > 0 ? "default" : "secondary"}
                      className={activity.points > 0 ? "bg-success text-success-foreground" : ""}
                    >
                      {activity.points > 0 ? "+" : ""}{activity.points} points
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats & Achievements */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
              <CardDescription>Making a difference for our planet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="w-6 h-6 text-warning" />
                  <span className="text-3xl font-bold text-primary">{user.points || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">EcoPoints Balance</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Collections</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">CO₂ Saved</span>
                  <span className="font-medium">2.4 tons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Devices Recycled</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Impact Score</span>
                  <span className="font-medium text-success">Excellent</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your eco-friendly milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      achievement.earned ? 'bg-success/10 border border-success/20' : 'bg-muted/50'
                    }`}
                  >
                    <achievement.icon 
                      className={`w-8 h-8 ${
                        achievement.earned ? 'text-success' : 'text-muted-foreground'
                      }`} 
                    />
                    <div className="flex-1">
                      <p className={`font-medium ${
                        achievement.earned ? 'text-success-foreground' : 'text-muted-foreground'
                      }`}>
                        {achievement.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <Badge className="bg-success text-success-foreground">
                        Earned
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}