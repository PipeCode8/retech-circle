import { useState, useEffect } from "react";
import axios from "axios";
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
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

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
  { value: "laptop", label: "Portátil", icon: Laptop, points: 150 },
  { value: "desktop", label: "Computador de escritorio", icon: Monitor, points: 200 },
  { value: "smartphone", label: "Teléfono inteligente", icon: Smartphone, points: 80 },
  { value: "tablet", label: "Tableta", icon: Package, points: 100 },
  { value: "monitor", label: "Monitor", icon: Monitor, points: 120 },
  { value: "accessories", label: "Accesorios", icon: Package, points: 30 },
];

const conditions = [
  { value: "working", label: "Funciona", multiplier: 1.2 },
  { value: "minor-issues", label: "Con fallas menores", multiplier: 1.0 },
  { value: "broken", label: "No funciona", multiplier: 0.8 },
  { value: "parts-only", label: "Solo para partes", multiplier: 0.6 },
];

export default function CollectionRequest() {
  const user = useUser();
  const navigate = useNavigate();
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
  const [solicitudesPendientes, setSolicitudesPendientes] = useState<any[]>([]);

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

  const userId = localStorage.getItem("userId"); // Esto obtiene el userId real del cliente

  useEffect(() => {
    fetch(`http://localhost:3000/api/solicitudes?userId=${user?.id}`)
      .then(res => res.json())
      .then(data => setSolicitudesPendientes(data))
      .catch(error => console.error("Error al obtener solicitudes:", error));
  }, [user]);

  const handleSubmit = async () => {
    const body = {
      userId: user.id, // NO user.userId
      items,
      address,
      preferredDate,
      preferredTime,
      specialInstructions,
      status: "pendiente"
    };

    console.log("user.id enviado:", user?.id);

    try {
      const response = await fetch("http://localhost:3000/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert("Error al enviar la solicitud: " + errorText);
        return;
      }
      const data = await response.json();
      setSolicitudesPendientes([...solicitudesPendientes, data]);
      setStep(4);
    } catch (error: any) {
      alert("Error al enviar la solicitud: " + (error.message || "Intenta de nuevo."));
    }
  };

  if (step === 4) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="text-center">
          <CardContent className="p-8">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">¡Recolección solicitada!</h2>
            <p className="text-muted-foreground mb-6">
              Tu solicitud de recolección de residuos tecnológicos ha sido agendada. Pronto recibirás un correo de confirmación con los detalles de seguimiento.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="font-medium">EcoPuntos estimados: {totalEstimatedPoints}</p>
              <p className="text-sm text-muted-foreground">Recibirás estos puntos una vez se complete la recolección.</p>
            </div>
            <Button variant="eco" onClick={() => {
              setStep(1);
              setItems([]);
              setAddress("");
              setPreferredDate("");
              setPreferredTime("");
              setSpecialInstructions("");
            }}>
              Solicitar otra recolección
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
          <h1 className="text-3xl font-bold">Solicitar recolección</h1>
          <p className="text-muted-foreground">Agenda la recogida de tus residuos tecnológicos</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Paso {step} de 3
        </Badge>
      </div>

      {/* Pasos de progreso */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: "Agregar dispositivos" },
          { num: 2, label: "Detalles de recolección" },
          { num: 3, label: "Revisar y enviar" },
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

      {/* Paso 1: Agregar dispositivos */}
      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agrega tus dispositivos</CardTitle>
              <CardDescription>Cuéntanos qué residuos tecnológicos deseas recolectar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="device-type">Tipo de dispositivo</Label>
                  <Select value={currentItem.type} onValueChange={(value) => setCurrentItem({...currentItem, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de dispositivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceTypes.map((device) => (
                        <SelectItem key={device.value} value={device.value}>
                          <div className="flex items-center gap-2">
                            <device.icon className="w-4 h-4" />
                            {device.label} (+{device.points} puntos)
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condición</Label>
                  <Select value={currentItem.condition} onValueChange={(value) => setCurrentItem({...currentItem, condition: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition.value} value={condition.value}>
                          {condition.label} ({Math.round(condition.multiplier * 100)}% puntos)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Marca (opcional)</Label>
                  <Input 
                    placeholder="Ejemplo: Apple, Samsung, Dell"
                    value={currentItem.brand}
                    onChange={(e) => setCurrentItem({...currentItem, brand: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Modelo (opcional)</Label>
                  <Input 
                    placeholder="Ejemplo: iPhone 12, MacBook Pro"
                    value={currentItem.model}
                    onChange={(e) => setCurrentItem({...currentItem, model: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <Label>Cantidad</Label>
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
                  Agregar dispositivo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de dispositivos */}
          {items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tus dispositivos ({items.length})</CardTitle>
                <CardDescription>Total estimado: {totalEstimatedPoints} EcoPuntos</CardDescription>
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
                              {conditions.find(c => c.value === item.condition)?.label} • +{item.estimatedPoints} puntos
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
              Continuar a detalles de recolección
            </Button>
          </div>
        </div>
      )}

      {/* Paso 2: Detalles de recolección */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Detalles de recolección</CardTitle>
            <CardDescription>¿Cuándo y dónde debemos recoger tus dispositivos?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Dirección de recogida</Label>
              <div className="relative">
               <Textarea 
                  placeholder="Ingresa tu dirección completa incluyendo apartamento o unidad"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha preferida</Label>
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
                <Label htmlFor="time">Horario preferido</Label>
                <Select value={preferredTime} onValueChange={setPreferredTime}>
                  <SelectTrigger>
                    <Clock className="w-4 h-4" />
                    <SelectValue placeholder="Selecciona el horario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Mañana (9 AM - 12 PM)</SelectItem>
                    <SelectItem value="afternoon">Tarde (12 PM - 5 PM)</SelectItem>
                    <SelectItem value="evening">Noche (5 PM - 8 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instrucciones especiales (opcional)</Label>
              <Textarea 
                placeholder="¿Alguna instrucción especial para nuestro equipo? (ejemplo: acceso al edificio, notas de parqueo)"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Volver a dispositivos
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!address || !preferredDate || !preferredTime}
                variant="eco"
              >
                Revisar solicitud
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 3: Revisar y enviar */}
      {step === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revisa tu solicitud</CardTitle>
              <CardDescription>Por favor revisa todos los detalles antes de enviar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Dispositivos a recolectar ({items.length})</h3>
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
                        <Badge variant="secondary">+{item.estimatedPoints} puntos</Badge>
                      </div>
                    );
                  })}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-semibold">
                  <span>Total de puntos estimados:</span>
                  <span className="text-primary">{totalEstimatedPoints}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Detalles de recolección</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Dirección:</strong> {address}</p>
                  <p><strong>Fecha:</strong> {preferredDate}</p>
                  <p><strong>Horario:</strong> {preferredTime}</p>
                  {specialInstructions && <p><strong>Instrucciones:</strong> {specialInstructions}</p>}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Volver a detalles
                </Button>
                <Button onClick={handleSubmit} variant="hero" size="lg">
                  Enviar solicitud de recolección
                </Button>
              </div>
            </CardContent>
          </Card>

          {solicitudesPendientes.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Mis solicitudes de recolección pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {solicitudesPendientes.map((sol, idx) => (
                    <li key={idx} className="mb-2">
                      <strong>Dirección:</strong> {sol.address} <br />
                      <strong>Fecha:</strong> {sol.preferredDate} <br />
                      <strong>Horario:</strong> {sol.preferredTime} <br />
                      <strong>Estado:</strong> {sol.status}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Módulo: Mis solicitudes de recolección */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Mis solicitudes de recolección</CardTitle>
          <CardDescription>Consulta el estado de tus solicitudes recientes</CardDescription>
        </CardHeader>
        <CardContent>
          {solicitudesPendientes.length === 0 ? (
            <p className="text-muted-foreground">No tienes solicitudes registradas aún.</p>
          ) : (
            <ul className="space-y-3">
              {solicitudesPendientes.map((sol, idx) => (
                <li key={idx} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p><strong>Dirección:</strong> {sol.address}</p>
                      <p><strong>Fecha:</strong> {sol.preferredDate}</p>
                      <p><strong>Horario:</strong> {sol.preferredTime}</p>
                      {/* Mostrar items */}
                      <div>
                        <strong>Dispositivos:</strong>
                        <ul>
                          {sol.items.map((item: any, i: number) => (
                            <li key={i}>
                              {item.quantity}x {item.type} {item.brand && `- ${item.brand}`} {item.model && `- ${item.model}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Badge variant="secondary">{sol.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}