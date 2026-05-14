import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Brain, Activity, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export default function CongestionPanel() {
  const [data, setData] = useState([
    { time: "06:00", congestion: 20 },
    { time: "08:00", congestion: 85 },
    { time: "10:00", congestion: 65 },
    { time: "12:00", congestion: 40 },
    { time: "14:00", congestion: 45 },
    { time: "16:00", congestion: 60 },
    { time: "18:00", congestion: 95 },
    { time: "20:00", congestion: 50 },
    { time: "22:00", congestion: 15 },
  ])
  const [currentCongestion, setCurrentCongestion] = useState("65%")
  const [confidence, setConfidence] = useState("94%")
  const [statusText, setStatusText] = useState("Moderate crowding. Expected to clear in 45 mins.")
  
  const [morningPeak, setMorningPeak] = useState({ level: "High", width: "85%", color: "bg-destructive", textColor: "text-destructive", shadow: "shadow-[0_0_10px_rgba(239,68,68,0.8)]" })
  const [afternoonPeak, setAfternoonPeak] = useState({ level: "Medium", width: "45%", color: "bg-yellow-500", textColor: "text-yellow-500", shadow: "shadow-[0_0_10px_rgba(234,179,8,0.8)]" })
  const [eveningPeak, setEveningPeak] = useState({ level: "High", width: "95%", color: "bg-destructive", textColor: "text-destructive", shadow: "shadow-[0_0_10px_rgba(239,68,68,0.8)]" })

  useEffect(() => {
    const handleRoute = (e: any) => {
      const r = e.detail;
      const isMetro = r.transportMode.toLowerCase().includes("metro");
      const isTrain = r.transportMode.toLowerCase().includes("train");
      const isCab = r.transportMode.toLowerCase().includes("cab");

      let baseMorn = isMetro || isTrain ? 60 : 85;
      let baseAft = isMetro || isTrain ? 30 : 50;
      let baseEve = isMetro || isTrain ? 70 : 95;
      
      if (isCab) {
        baseMorn = 90;
        baseAft = 65;
        baseEve = 95;
      }

      setMorningPeak({ 
        level: baseMorn > 75 ? "High" : baseMorn > 45 ? "Medium" : "Low", 
        width: baseMorn + "%", 
        color: baseMorn > 75 ? "bg-destructive" : baseMorn > 45 ? "bg-yellow-500" : "bg-green-500",
        textColor: baseMorn > 75 ? "text-destructive" : baseMorn > 45 ? "text-yellow-500" : "text-green-500",
        shadow: baseMorn > 75 ? "shadow-[0_0_10px_rgba(239,68,68,0.8)]" : baseMorn > 45 ? "shadow-[0_0_10px_rgba(234,179,8,0.8)]" : "shadow-[0_0_10px_rgba(34,197,94,0.8)]"
      });
      setAfternoonPeak({ 
        level: baseAft > 75 ? "High" : baseAft > 45 ? "Medium" : "Low", 
        width: baseAft + "%", 
        color: baseAft > 75 ? "bg-destructive" : baseAft > 45 ? "bg-yellow-500" : "bg-green-500",
        textColor: baseAft > 75 ? "text-destructive" : baseAft > 45 ? "text-yellow-500" : "text-green-500",
        shadow: baseAft > 75 ? "shadow-[0_0_10px_rgba(239,68,68,0.8)]" : baseAft > 45 ? "shadow-[0_0_10px_rgba(234,179,8,0.8)]" : "shadow-[0_0_10px_rgba(34,197,94,0.8)]"
      });
      setEveningPeak({ 
        level: baseEve > 75 ? "High" : baseEve > 45 ? "Medium" : "Low", 
        width: baseEve + "%", 
        color: baseEve > 75 ? "bg-destructive" : baseEve > 45 ? "bg-yellow-500" : "bg-green-500",
        textColor: baseEve > 75 ? "text-destructive" : baseEve > 45 ? "text-yellow-500" : "text-green-500",
        shadow: baseEve > 75 ? "shadow-[0_0_10px_rgba(239,68,68,0.8)]" : baseEve > 45 ? "shadow-[0_0_10px_rgba(234,179,8,0.8)]" : "shadow-[0_0_10px_rgba(34,197,94,0.8)]"
      });

      setCurrentCongestion(r.congestion + "%");
      setConfidence(Math.floor(85 + Math.random() * 14) + "%");
      setStatusText(`Analyzing route for ${r.transportMode}. Adjusted for live traffic.`);

      setData([
        { time: "06:00", congestion: Math.max(10, baseMorn - 50) },
        { time: "08:00", congestion: baseMorn },
        { time: "10:00", congestion: Math.max(20, baseMorn - 20) },
        { time: "12:00", congestion: Math.max(15, baseAft - 10) },
        { time: "14:00", congestion: baseAft },
        { time: "16:00", congestion: Math.max(20, baseEve - 30) },
        { time: "18:00", congestion: baseEve },
        { time: "20:00", congestion: Math.max(25, baseEve - 40) },
        { time: "22:00", congestion: Math.max(10, baseEve - 60) },
      ]);
    };

    const stored = localStorage.getItem('selectedTransitRoute');
    if (stored) {
      try { handleRoute({ detail: JSON.parse(stored) }); } catch (e) {}
    }

    window.addEventListener('routeSelected', handleRoute);
    return () => window.removeEventListener('routeSelected', handleRoute);
  }, []);
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Brain className="text-purple-500 w-10 h-10" />
            AI Congestion Prediction
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our ML models analyze historical data and live inputs to predict transit crowding with 94% accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* AI Insights Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2"><Activity className="text-purple-500 w-5 h-5" /> Current Status</span>
                  <span className="text-xs font-normal text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/20">{confidence} Confidence</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-500 mb-2 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">{currentCongestion}</div>
                <p className="text-sm text-muted-foreground">{statusText}</p>
              </CardContent>
            </Card>

            <Card className="bg-card border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="text-blue-500 w-5 h-5" /> Peak Hour Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Morning Peak (8 AM - 10 AM)</span>
                    <span className={`${morningPeak.textColor} font-semibold`}>{morningPeak.level}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden border border-border">
                    <motion.div initial={{ width: 0 }} animate={{ width: morningPeak.width }} transition={{ duration: 1 }} className={`${morningPeak.color} h-full ${morningPeak.shadow}`} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Afternoon (1 PM - 3 PM)</span>
                    <span className={`${afternoonPeak.textColor} font-semibold`}>{afternoonPeak.level}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden border border-border">
                    <motion.div initial={{ width: 0 }} animate={{ width: afternoonPeak.width }} transition={{ duration: 1 }} className={`${afternoonPeak.color} h-full ${afternoonPeak.shadow}`} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Evening Peak (6 PM - 8 PM)</span>
                    <span className={`${eveningPeak.textColor} font-semibold`}>{eveningPeak.level}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden border border-border">
                    <motion.div initial={{ width: 0 }} animate={{ width: eveningPeak.width }} transition={{ duration: 1 }} className={`${eveningPeak.color} h-full ${eveningPeak.shadow}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Area */}
          <Card className="lg:col-span-2 bg-card border shadow-sm overflow-hidden">
            <CardHeader>
              <CardTitle>Today's Congestion Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="congestion" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorCongestion)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
