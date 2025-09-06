import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Plus, 
  Minus, 
  Smartphone, 
  Laptop, 
  Monitor,
  Package,
  Trash2,
  CheckCircle2
} from "lucide-react";

interface CollectionItem {
  id: string;
  type: string;
  brand?: string;
  model?: string;
  condition: string;
  quantity: number;
  estimatedPoints: number;
}

const deviceTypes = [
  { value: "laptop", label: "Laptop", icon: Laptop, points: 150 },
  { value: "desktop", label: "Desktop Computer", icon: Monitor, points: 200 },
  { value: "smartphone", label: "Smartphone", icon: Smartphone, points: 80 },
  { value: "tablet", label: "Tablet", icon: Package, points: 100 },
  { value: "monitor", label: "Monitor", icon: Monitor, points: 120 },
  { value: "accessories", label: "Accessories", icon: Package, points: 30 },
];

const conditions = [
  { value: "working", label: "Working", multiplier: 1.2 },
  { value: "minor-issues", label: "Minor Issues", multiplier: 1.0 },
  { value: "broken", label: "Not Working", multiplier: 0.8 },
  { value: "parts-only", label: "Parts Only", multiplier: 0.6 },
];

export default function CollectionRequest() {
  const [step, setStep] = useState(1);
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    type: "",
    brand: "",
    model: "",
    condition: "working",
    quantity: 1,
  });
  
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const addItem = () => {
    if (!currentItem.type) return;
    
    const deviceType = deviceTypes.find(d => d.value === currentItem.type);
    const conditionMultiplier = conditions.find(c => c.value === currentItem.condition)?.multiplier || 1;
    const basePoints = deviceType?.points || 0;
    
    const newItem: CollectionItem = {
      id: Date.now().toString(),
      type: currentItem.type,
      brand: currentItem.brand,
      model: currentItem.model,
      condition: currentItem.condition,
      quantity: currentItem.quantity,
      estimatedPoints: Math.round(basePoints * conditionMultiplier * currentItem.quantity),
    };
    
    setItems([...items, newItem]);
    setCurrentItem({
      type: "",
      brand: "",
      model: "",
      condition: "working",
      quantity: 1,
    });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, change: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        const deviceType = deviceTypes.find(d => d.value === item.type);
        const conditionMultiplier = conditions.find(c => c.value === item.condition)?.multiplier || 1;
        const basePoints = deviceType?.points || 0;
        
        return {
          ...item,
          quantity: newQuantity,
          estimatedPoints: Math.round(basePoints * conditionMultiplier * newQuantity),
        };
      }
      return item;
    }));
  };

  const totalEstimatedPoints = items.reduce((sum, item) => sum + item.estimatedPoints, 0);

  const handleSubmit = () => {
    // Here you would normally submit to your backend
    console.log("Collection request:", {
      items,
      address,
      preferredDate,
      preferredTime,
      specialInstructions,
    });
    setStep(4);
  };

  if (step === 4) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="text-center">
          <CardContent className="p-8">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Collection Requested!</h2>
            <p className="text-muted-foreground mb-6">
              Your tech waste collection has been scheduled. You'll receive a confirmation email shortly with tracking details.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="font-medium">Estimated EcoPoints: {totalEstimatedPoints}</p>
              <p className="text-sm text-muted-foreground">You'll earn these points after collection is completed</p>
            </div>
            <Button variant="eco" onClick={() => {
              setStep(1);
              setItems([]);
              setAddress("");
              setPreferredDate("");
              setPreferredTime("");
              setSpecialInstructions("");
            }}>
              Request Another Collection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Request Collection</h1>
          <p className="text-muted-foreground">Schedule a pickup for your tech waste</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Step {step} of 3
        </Badge>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: "Add Items" },
          { num: 2, label: "Collection Details" },
          { num: 3, label: "Review & Submit" },
        ].map((stepItem) => (
          <div key={stepItem.num} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step >= stepItem.num 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {stepItem.num}
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">{stepItem.label}</span>
            {stepItem.num < 3 && <div className="flex-1 h-px bg-muted mx-4" />}
          </div>
        ))}
      </div>

      {/* Step 1: Add Items */}
      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Your Items</CardTitle>
              <CardDescription>Tell us what tech waste you'd like us to collect</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="device-type">Device Type</Label>
                  <Select value={currentItem.type} onValueChange={(value) => setCurrentItem({...currentItem, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceTypes.map((device) => (
                        <SelectItem key={device.value} value={device.value}>
                          <div className="flex items-center gap-2">
                            <device.icon className="w-4 h-4" />
                            {device.label} (+{device.points} points)
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={currentItem.condition} onValueChange={(value) => setCurrentItem({...currentItem, condition: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition.value} value={condition.value}>
                          {condition.label} ({Math.round(condition.multiplier * 100)}% points)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand (Optional)</Label>
                  <Input 
                    placeholder="e.g., Apple, Samsung, Dell"
                    value={currentItem.brand}
                    onChange={(e) => setCurrentItem({...currentItem, brand: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model (Optional)</Label>
                  <Input 
                    placeholder="e.g., iPhone 12, MacBook Pro"
                    value={currentItem.model}
                    onChange={(e) => setCurrentItem({...currentItem, model: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setCurrentItem({...currentItem, quantity: Math.max(1, currentItem.quantity - 1)})}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center">{currentItem.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setCurrentItem({...currentItem, quantity: currentItem.quantity + 1})}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button onClick={addItem} disabled={!currentItem.type} className="mt-7">
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Items List */}
          {items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Items ({items.length})</CardTitle>
                <CardDescription>Total estimated: {totalEstimatedPoints} EcoPoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item) => {
                    const deviceType = deviceTypes.find(d => d.value === item.type);
                    const DeviceIcon = deviceType?.icon || Package;
                    
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <DeviceIcon className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">
                              {deviceType?.label}
                              {item.brand && ` - ${item.brand}`}
                              {item.model && ` ${item.model}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {conditions.find(c => c.value === item.condition)?.label} • +{item.estimatedPoints} points
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button 
              onClick={() => setStep(2)} 
              disabled={items.length === 0}
              variant="eco"
            >
              Continue to Collection Details
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Collection Details */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Collection Details</CardTitle>
            <CardDescription>When and where should we collect your items?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Pickup Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Textarea 
                  placeholder="Enter your full address including apartment/unit number"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Select value={preferredTime} onValueChange={setPreferredTime}>
                  <SelectTrigger>
                    <Clock className="w-4 h-4" />
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                    <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Special Instructions (Optional)</Label>
              <Textarea 
                placeholder="Any special instructions for our collection team? (e.g., building access, parking notes)"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back to Items
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!address || !preferredDate || !preferredTime}
                variant="eco"
              >
                Review Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Your Request</CardTitle>
              <CardDescription>Please review all details before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Items to Collect ({items.length})</h3>
                <div className="space-y-2">
                  {items.map((item) => {
                    const deviceType = deviceTypes.find(d => d.value === item.type);
                    return (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span>
                          {item.quantity}x {deviceType?.label}
                          {item.brand && ` - ${item.brand}`}
                          {item.model && ` ${item.model}`}
                        </span>
                        <Badge variant="secondary">+{item.estimatedPoints} points</Badge>
                      </div>
                    );
                  })}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-semibold">
                  <span>Total Estimated Points:</span>
                  <span className="text-primary">{totalEstimatedPoints}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Collection Details</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Address:</strong> {address}</p>
                  <p><strong>Date:</strong> {preferredDate}</p>
                  <p><strong>Time:</strong> {preferredTime}</p>
                  {specialInstructions && <p><strong>Instructions:</strong> {specialInstructions}</p>}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back to Details
                </Button>
                <Button onClick={handleSubmit} variant="hero" size="lg">
                  Submit Collection Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}