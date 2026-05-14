import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Train, Bus, Zap } from "lucide-react"

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 bg-background overflow-hidden">
      {/* subtle realistic background grid instead of blurs */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-muted px-4 py-2 rounded-md mb-4 border border-border">
            <Zap className="text-primary w-4 h-4" />
            <span className="text-sm font-medium tracking-wider uppercase text-muted-foreground">Engineering Project Phase 1</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Smart Transit Management
            <br />
            <span className="text-primary">System Prototype</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A unified public transport planner featuring AI-optimized routing, real-time congestion mapping, and a centralized QR ticketing wallet.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-12" onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector("#planner");
              if (element) window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
            }}>
              <Train className="w-5 h-5 mr-2" />
              Plan Journey
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-12" onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector("#tickets");
              if (element) window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
            }}>
              Generate Pass
            </Button>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 h-12" onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector("#features");
              if (element) window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
            }}>
              <Bus className="w-5 h-5 mr-2" />
              View Features
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
