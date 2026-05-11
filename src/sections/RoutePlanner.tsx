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

        <Card className={`glass border-primary/20 neon-glow p-2 md:p-6 ${isSameLocation ? 'mb-4' : 'mb-12'}`}>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 md:p-0">
            <div className="relative">
              <MapPin className={`absolute left-3 top-3 w-4 h-4 ${isSameLocation ? 'text-destructive' : 'text-muted-foreground'}`} />
              <Input placeholder="Enter Source (e.g. RSCOE)" value={source} onChange={(e) => setSource(e.target.value)} className={`pl-9 ${isSameLocation ? 'border-destructive focus-visible:ring-destructive' : ''}`} />
            </div>
            <div className="relative">
              <MapPin className={`absolute left-3 top-3 w-4 h-4 ${isSameLocation ? 'text-destructive' : 'text-primary'}`} />
              <Input placeholder="Enter Destination (e.g. Swargate)" value={destination} onChange={(e) => setDestination(e.target.value)} className={`pl-9 ${isSameLocation ? 'border-destructive focus-visible:ring-destructive' : 'border-primary/30'}`} />
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
                    className={`hover:border-primary/50 transition-all cursor-pointer group ${isSelected ? 'border-primary shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-primary/5' : ''}`}
                    onClick={() => {
                      setSelectedRoute(route.id);
                      const rData = { source: source || "Pune Station", destination: destination || "Shivajinagar", fare: route.fareVal, duration: route.duration, transportMode: route.name, congestion: route.congestionVal, routeName: route.name };
                      localStorage.setItem('selectedTransitRoute', JSON.stringify(rData));
                      window.dispatchEvent(new CustomEvent('routeSelected', { detail: rData }));
                    }}
                  >
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className={`p-3 rounded-full transition-colors ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
                          <route.icon size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-lg">{route.name}</h4>
                            <Badge variant={route.badgeVariant}>{route.badge}</Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock size={14} /> {route.duration}</span>
                            <span className="flex items-center gap-1 text-primary font-medium">{route.fare}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">Congestion</p>
                          <Badge variant={route.congestionVal > 70 ? 'destructive' : route.congestionVal > 40 ? 'warning' : 'success'}>
                            {route.congestionVal}%
                          </Badge>
                        </div>
                        <div className="text-center hidden sm:block">
                          <p className="text-xs text-muted-foreground mb-1">Eco Score</p>
                          <span className="text-green-500 font-bold">{route.ecoScore}</span>
                        </div>
                        <Button 
                          variant={isSelected ? "default" : "outline"} 
                          className={isSelected ? "" : "group-hover:bg-primary group-hover:text-primary-foreground"}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoute(route.id);
                            const rData = { source: source || "Pune Station", destination: destination || "Shivajinagar", fare: route.fareVal, duration: route.duration, transportMode: route.name, congestion: route.congestionVal, routeName: route.name };
                            localStorage.setItem('selectedTransitRoute', JSON.stringify(rData));
                            window.dispatchEvent(new CustomEvent('routeSelected', { detail: rData }));
                          }}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </Button>
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
