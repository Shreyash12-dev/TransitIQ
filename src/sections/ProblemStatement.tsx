import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, TicketX, TrafficCone, Map } from "lucide-react"

export default function ProblemStatement() {
  const problems = [
    {
      title: "Multiple Apps",
      description: "Users juggle between different apps for buses, metros, and trains.",
      icon: Smartphone,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "Separate Ticketing",
      description: "Waiting in lines and managing multiple physical or digital tickets.",
      icon: TicketX,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "No Congestion Prediction",
      description: "Unable to foresee crowd levels, leading to uncomfortable journeys.",
      icon: TrafficCone,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Poor Route Optimization",
      description: "Lack of integrated transit data results in longer travel times.",
      icon: Map,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">The Current Problem</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Urban mobility is fragmented. Commuters face daily challenges that make public transport inefficient and stressful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="h-full border-destructive/20 hover:border-destructive/50 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${problem.bg} ${problem.color} mb-2`}>
                    <problem.icon size={32} />
                  </div>
                  <h3 className="text-xl font-semibold">{problem.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
