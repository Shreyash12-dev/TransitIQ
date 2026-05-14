import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Clock, Zap, Leaf } from "lucide-react"

export default function RoutePlanner() {
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null)
  const [source, setSource] = useState("")
  const [destination, setDestination] = useState("")
  const [time, setTime] = useState("09:00")
  const [routes, setRoutes] = useState<any[]>([])

  const isSameLocation = source.trim() !== "" && destination.trim() !== "" && source.trim().toLowerCase() === destination.trim().toLowerCase();

  const generateDynamicRoutes = () => {
    const s = source || "Pune Station";
    const d = destination || "Shivajinagar";
    const str = (s + d).toLowerCase();
    
    // Determine realistic distances based on known locations or hash
    let distanceKm = 0;
    if (str.includes("nashik")) distanceKm = 210;
    else if (str.includes("mumbai")) distanceKm = 150;
    else if (str.includes("lonavala")) distanceKm = 65;
    else if (str.includes("hinjewadi")) distanceKm = 20;
    else if (str.includes("shivajinagar")) distanceKm = 5;
    else {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      distanceKm = Math.abs(hash % 200) + 5; 
    }

    const hour = parseInt(time.split(':')[0] || "9");
    let timeFactor = 1;
    let isPeak = false;
    
    if ((hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20)) {
      timeFactor = 1.5; 
      isPeak = true;
    } else if (hour >= 22 || hour <= 5) {
      timeFactor = 0.4; 
    } else {
      timeFactor = 1.0; 
    }

    let r1, r2, r3;
    
    if (distanceKm < 30) {
      // Short Distance
      r1 = {
        id: 1,
        name: "Metro Line " + ((distanceKm % 3) + 1) + " + Local Bus",
        durationMin: Math.round(distanceKm * 2.5 * (1 + timeFactor * 0.1)),
        fareVal: Math.max(20, Math.round(distanceKm * 2.5)),
        congestionVal: Math.min(85, Math.round(30 * timeFactor)),
        ecoScore: 94,
        icon: Zap,
      };
      r2 = {
        id: 2,
        name: "Electric Bus " + Math.round(distanceKm * 3),
        durationMin: Math.round(distanceKm * 3.5 * (1 + timeFactor * 0.3)),
        fareVal: Math.max(15, Math.round(distanceKm * 1.5)),
        congestionVal: Math.min(95, Math.round(50 * timeFactor)),
        ecoScore: 98,
        icon: Leaf,
      };
      r3 = {
        id: 3,
        name: "Local Cab",
        durationMin: Math.round(distanceKm * 1.5 * (1 + timeFactor * 0.4)),
        fareVal: Math.max(80, Math.round(distanceKm * 15 * (isPeak ? 1.4 : 1))),
        congestionVal: Math.min(99, Math.round(70 * timeFactor)),
        ecoScore: 40,
        icon: Clock,
      };
    } else if (distanceKm < 100) {
      // Medium Distance
      r1 = {
        id: 1,
        name: "Intercity Bus " + Math.round(distanceKm),
        durationMin: Math.round(distanceKm * 1.8 * (1 + timeFactor * 0.2)),
        fareVal: Math.max(150, Math.round(distanceKm * 2.5)),
        congestionVal: Math.min(98, Math.round(60 * timeFactor)),
        ecoScore: 85,
        icon: Leaf,
      };
      r2 = {
        id: 2,
        name: "Express Bus",
        durationMin: Math.round(distanceKm * 1.4 * (1 + timeFactor * 0.1)),
        fareVal: Math.max(200, Math.round(distanceKm * 3)),
        congestionVal: Math.min(85, Math.round(50 * timeFactor)),
        ecoScore: 88,
        icon: Zap,
      };
      r3 = {
        id: 3,
        name: "Shared Cab",
        durationMin: Math.round(distanceKm * 1.2 * (1 + timeFactor * 0.3)),
        fareVal: Math.max(400, Math.round(distanceKm * 8 * (isPeak ? 1.3 : 1))),
        congestionVal: Math.min(90, Math.round(65 * timeFactor)),
        ecoScore: 50,
        icon: Clock,
      };
    } else {
      // Long Distance
      r1 = {
        id: 1,
        name: "Express Train",
        durationMin: Math.round(distanceKm * 0.8),
        fareVal: Math.max(120, Math.round(distanceKm * 1.5)),
        congestionVal: Math.min(90, Math.round(45 * timeFactor)),
        ecoScore: 95,
        icon: Zap,
      };
      r2 = {
        id: 2,
        name: "Intercity Express Bus",
        durationMin: Math.round(distanceKm * 1.5 * (1 + timeFactor * 0.15)),
        fareVal: Math.max(300, Math.round(distanceKm * 2.2)),
        congestionVal: Math.min(98, Math.round(55 * timeFactor)),
        ecoScore: 85,
        icon: Leaf,
      };
      r3 = {
        id: 3,
        name: "Premium Outstation Cab",
        durationMin: Math.round(distanceKm * 1.1 * (1 + timeFactor * 0.2)),
        fareVal: Math.max(1500, Math.round(distanceKm * 12 * (isPeak ? 1.2 : 1))),
        congestionVal: Math.min(80, Math.round(50 * timeFactor)),
        ecoScore: 35,
        icon: Clock,
      };
    }

    let generated = [r1, r2, r3];
    let fastest = generated[0];
    let cheapest = generated[0];
    let leastCrowded = generated[0];

    generated.forEach(r => {
      if (r.durationMin < fastest.durationMin) fastest = r;
      if (r.fareVal < cheapest.fareVal) cheapest = r;
      if (r.congestionVal < leastCrowded.congestionVal) leastCrowded = r;
    });

    const maxFare = Math.max(...generated.map(r => r.fareVal));
    const maxDur = Math.max(...generated.map(r => r.durationMin));
    
    let bestScore = Infinity;
    let aiRecommended = generated[0];
    
    generated.forEach(r => {
      const score = (r.fareVal / maxFare) + (r.durationMin / maxDur) + (r.congestionVal / 100);
      if (score < bestScore && r.congestionVal < 85) { 
        bestScore = score;
        aiRecommended = r;
      }
    });

    if (aiRecommended.congestionVal >= 85) {
      aiRecommended = leastCrowded;
    }

    return generated.map(r => {
      let badge = "Alternative";
      let badgeVariant: "default" | "secondary" | "success" | "warning" = "default";
      
      if (r.id === aiRecommended.id) {
         badge = "AI Recommended";
         badgeVariant = "default";
      } else if (r.id === fastest.id) {
         badge = "Fastest Route";
         badgeVariant = "secondary";
      } else if (r.id === cheapest.id) {
         badge = "Best Value";
         badgeVariant = "success";
      } else if (r.id === leastCrowded.id) {
         badge = "Least Crowded";
         badgeVariant = "default";
      }

      const h = Math.floor(r.durationMin / 60);
      const m = Math.floor(r.durationMin % 60);
      const durationStr = h > 0 ? `${h}h ${m}m` : `${m} min`;

      return {
        ...r,
        duration: durationStr,
        fare: "₹" + r.fareVal,
        badge,
        badgeVariant
      }
    });
  };

  const handleSearch = () => {
    setIsSearching(true)
    setShowResults(false)
    setSelectedRoute(null)
    setTimeout(() => {
      setRoutes(generateDynamicRoutes())
      setIsSearching(false)
      setShowResults(true)
    }, 1500)
  }

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Smart Route Planner</h2>
          <p className="text-muted-foreground text-lg">AI-optimized routes considering real-time traffic and crowds.</p>
        </div>

        <Card className={`border bg-card shadow-sm p-4 md:p-6 ${isSameLocation ? 'mb-4' : 'mb-12'}`}>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 p-0">
            <div className="relative">
              <MapPin className={`absolute left-3 top-3 w-4 h-4 ${isSameLocation ? 'text-destructive' : 'text-muted-foreground'}`} />
              <Input placeholder="Enter Source (e.g. RSCOE)" value={source} onChange={(e) => setSource(e.target.value)} className={`pl-9 ${isSameLocation ? 'border-destructive focus-visible:ring-destructive' : ''}`} />
            </div>
            <div className="relative">
              <MapPin className={`absolute left-3 top-3 w-4 h-4 ${isSameLocation ? 'text-destructive' : 'text-primary'}`} />
              <Input placeholder="Enter Destination (e.g. Swargate)" value={destination} onChange={(e) => setDestination(e.target.value)} className={`pl-9 ${isSameLocation ? 'border-destructive focus-visible:ring-destructive' : ''}`} />
            </div>
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="pl-9" />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !source || !destination || isSameLocation} className="w-full h-10">
              {isSearching ? "Analyzing Routes..." : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Find Routes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <AnimatePresence>
          {isSameLocation && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center mb-8">
              <p className="text-sm text-destructive font-medium bg-destructive/10 inline-block px-4 py-2 rounded-full border border-destructive/20">
                Source and destination cannot be the same
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold mb-4 pl-2">Available Routes</h3>
              {routes.map((route, idx) => {
                const isSelected = selectedRoute === route.id;
                return (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card 
                    className={`hover:border-primary/50 transition-all cursor-pointer group overflow-hidden ${isSelected ? 'border-primary ring-1 ring-primary bg-primary/5' : ''}`}
                    onClick={() => {
                      setSelectedRoute(route.id);
                      const rData = { source: source || "Pune Station", destination: destination || "Shivajinagar", fare: route.fareVal, duration: route.duration, transportMode: route.name, congestion: route.congestionVal, routeName: route.name };
                      localStorage.setItem('selectedTransitRoute', JSON.stringify(rData));
                      window.dispatchEvent(new CustomEvent('routeSelected', { detail: rData }));
                    }}
                  >
                    <CardContent className="p-0 flex flex-col md:flex-row">
                      {/* Left side: Timeline/Icons */}
                      <div className="p-6 border-b md:border-b-0 md:border-r border-border w-full md:w-1/3 flex flex-col justify-between bg-muted/30">
                        <div>
                          <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-primary/10 rounded-md text-primary">
                              <route.icon size={20} />
                            </div>
                            <h4 className="font-semibold text-foreground">{route.name}</h4>
                          </div>
                          <div className="flex flex-col relative pl-4 border-l-2 border-primary/30 space-y-6 my-2 ml-2">
                             <div className="relative">
                               <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-primary bg-background"></div>
                               <p className="text-sm font-medium">{source || "Pune Station"}</p>
                               <p className="text-xs text-muted-foreground">{time}</p>
                             </div>
                             <div className="relative">
                               <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-destructive bg-background"></div>
                               <p className="text-sm font-medium">{destination || "Shivajinagar"}</p>
                               <p className="text-xs text-muted-foreground">+{route.duration}</p>
                             </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right side: Details & Action */}
                      <div className="p-6 w-full md:w-2/3 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <Badge variant={route.badgeVariant} className="mb-2">{route.badge}</Badge>
                            <p className="text-2xl font-bold text-primary">{route.fare}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                              <Clock size={14} /> Duration: <span className="font-medium text-foreground">{route.duration}</span>
                            </div>
                            <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                              <Leaf size={14} /> Eco Score: <span className="font-medium text-green-600">{route.ecoScore}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                           <div className="flex flex-col">
                             <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Occupancy</span>
                             <Badge variant={route.congestionVal > 70 ? 'destructive' : route.congestionVal > 40 ? 'warning' : 'success'}>
                               {route.congestionVal}% Full
                             </Badge>
                           </div>
                           <Button 
                             variant={isSelected ? "default" : "outline"} 
                             onClick={(e) => {
                               e.stopPropagation();
                               setSelectedRoute(route.id);
                               const rData = { source: source || "Pune Station", destination: destination || "Shivajinagar", fare: route.fareVal, duration: route.duration, transportMode: route.name, congestion: route.congestionVal, routeName: route.name };
                               localStorage.setItem('selectedTransitRoute', JSON.stringify(rData));
                               window.dispatchEvent(new CustomEvent('routeSelected', { detail: rData }));
                             }}
                           >
                             {isSelected ? "Selected" : "Select Route"}
                           </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
