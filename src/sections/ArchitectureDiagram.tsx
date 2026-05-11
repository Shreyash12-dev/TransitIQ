import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { MonitorSmartphone, Server, Database, BrainCircuit, ArrowDown } from "lucide-react"

export default function ArchitectureDiagram() {
  const nodes = [
    {
      id: "frontend",
      title: "Frontend Layer",
      subtitle: "React + Tailwind + Vite",
      icon: MonitorSmartphone,
      color: "border-blue-500",
      iconColor: "text-blue-500",
      delay: 0,
    },
    {
      id: "backend",
      title: "API Gateway & Backend",
      subtitle: "Node.js + Express",
      icon: Server,
      color: "border-green-500",
      iconColor: "text-green-500",
      delay: 0.2,
    },
    {
      id: "ai",
      title: "AI Prediction Engine",
      subtitle: "Python (TensorFlow/PyTorch)",
      icon: BrainCircuit,
      color: "border-purple-500",
      iconColor: "text-purple-500",
      delay: 0.4,
    },
    {
      id: "db",
      title: "Data Layer",
      subtitle: "PostgreSQL + Redis",
      icon: Database,
      color: "border-orange-500",
      iconColor: "text-orange-500",
      delay: 0.6,
    },
  ]

  return (
    <section className="py-24 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 -skew-y-6 -z-10" />

      <div className="container mx-auto px-4 text-center max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">System Architecture</h2>
        <p className="text-muted-foreground text-lg mb-16">Modular, scalable, and built for modern smart cities.</p>

        <div className="flex flex-col items-center">
          {nodes.map((node, idx) => (
            <div key={node.id} className="flex flex-col items-center w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: node.delay }}
                className="w-full sm:w-[400px] md:w-[500px]"
              >
                <Card className={`glass border-2 ${node.color} relative group`}>
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${node.color.split('-')[1]}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <CardContent className="p-6 flex items-center gap-6 relative z-10">
                    <div className={`p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 ${node.iconColor}`}>
                      <node.icon size={32} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold">{node.title}</h3>
                      <p className="text-muted-foreground">{node.subtitle}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {idx < nodes.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  whileInView={{ opacity: 1, height: "auto" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: node.delay + 0.1 }}
                  className="my-4 text-primary"
                >
                  <ArrowDown className="w-8 h-8 animate-bounce opacity-50" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
