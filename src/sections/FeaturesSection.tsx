import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MapPin, BrainCircuit, QrCode, Wallet } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      title: "Multimodal Route Planner",
      description: "Seamlessly combine bus, metro, and train routes for the fastest journey.",
      icon: MapPin,
      color: "text-blue-500",
    },
    {
      title: "AI Congestion Prediction",
      description: "Know before you go. Real-time crowding predictions powered by AI.",
      icon: BrainCircuit,
      color: "text-purple-500",
    },
    {
      title: "Smart QR Ticketing",
      description: "One digital ticket for your entire multimodal journey. Validated instantly.",
      icon: QrCode,
      color: "text-green-500",
    },
    {
      title: "Unified Digital Wallet",
      description: "Auto-deductions based on distance traveled. No more physical cash.",
      icon: Wallet,
      color: "text-teal-500",
    },
  ]

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-primary/5 skew-y-3 origin-top-left -z-10" />
      
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16">
          Powered by <span className="text-primary">Next-Gen Technology</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card className="h-full group border-border">
                <CardHeader className="items-center text-center pb-2">
                  <div className={`p-5 rounded-2xl bg-background border border-border mb-4 transition-all duration-300 ${feature.color}`}>
                    <feature.icon size={40} strokeWidth={1.5} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
