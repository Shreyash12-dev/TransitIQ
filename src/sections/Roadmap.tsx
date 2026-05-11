import { motion } from "framer-motion"
import { CheckCircle2, Circle, Clock } from "lucide-react"

export default function Roadmap() {
  const phases = [
    {
      phase: "Phase 1: Prototype",
      status: "current",
      items: ["Mock AI & Routing UI", "Smart QR Ticketing Demo", "Wallet Simulation", "Responsive Dashboard"],
      date: "Q2 2026",
    },
    {
      phase: "Phase 2: Core Engine",
      status: "upcoming",
      items: ["Real ML Models Integration", "Live Traffic APIs", "Real-time Congestion Data", "Payment Gateway Demo"],
      date: "Q3 2026",
    },
    {
      phase: "Phase 3: Ecosystem",
      status: "future",
      items: ["Smart City Integration", "GTFS-Realtime Support", "Federated Learning", "Public Beta Launch"],
      date: "Q4 2026",
    },
  ]

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Future Roadmap</h2>
          <p className="text-muted-foreground text-lg">Our path to redefining urban mobility.</p>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {phases.map((phase, idx) => {
            const isCurrent = phase.status === "current"
            const Icon = isCurrent ? CheckCircle2 : phase.status === "upcoming" ? Clock : Circle

            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                {/* Icon */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Icon size={16} className={isCurrent ? "" : "opacity-50"} />
                </div>
                
                {/* Content */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border glass hover:border-primary/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h3 className={`font-bold text-xl ${isCurrent ? 'text-primary' : ''}`}>{phase.phase}</h3>
                    <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full w-fit mt-2 sm:mt-0">{phase.date}</span>
                  </div>
                  <ul className="space-y-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
