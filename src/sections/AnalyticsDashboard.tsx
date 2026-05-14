import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { BarChart3, Users, Ticket, Coins } from "lucide-react"

export default function AnalyticsDashboard() {
  const usageData = [
    { name: "Mon", routes: 1200, tickets: 950 },
    { name: "Tue", routes: 1400, tickets: 1100 },
    { name: "Wed", routes: 1100, tickets: 900 },
    { name: "Thu", routes: 1500, tickets: 1250 },
    { name: "Fri", routes: 1800, tickets: 1600 },
    { name: "Sat", routes: 900, tickets: 750 },
    { name: "Sun", routes: 700, tickets: 550 },
  ]

  const transportData = [
    { name: "Bus", value: 45 },
    { name: "Metro", value: 40 },
    { name: "Train", value: 15 },
  ]
  const COLORS = ["#3b82f6", "#a855f7", "#10b981"]

  const stats = [
    { title: "Total Users", value: "24.5k", icon: Users, color: "text-blue-500" },
    { title: "Tickets Generated", value: "128k", icon: Ticket, color: "text-green-500" },
    { title: "Wallet Volume", value: "₹4.2M", icon: Coins, color: "text-teal-500" },
    { title: "Routes Optimized", value: "450k", icon: BarChart3, color: "text-purple-500" },
  ]

  return (
    <section className="py-24 bg-muted/20 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">System Analytics</h2>
          <p className="text-muted-foreground text-lg">City-wide transit performance at a glance.</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="bg-card border shadow-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <stat.icon className={`${stat.color} w-8 h-8 mb-3`} />
                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <Card className="bg-card border shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Usage Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      cursor={{ fill: 'hsl(var(--muted))' }}
                    />
                    <Bar dataKey="routes" name="Routes Searched" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="tickets" name="Tickets Generated" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="bg-card border shadow-sm">
            <CardHeader>
              <CardTitle>Transport Mode Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transportData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {transportData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {transportData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    {entry.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
