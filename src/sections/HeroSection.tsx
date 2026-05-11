import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Train, Bus, Car, Zap } from "lucide-react"

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
      transition: { duration: 0.8, type: "spring" as const },
    },
  }

  const floatingIcons = [
    { icon: Train, top: "20%", left: "10%", delay: 0 },
    { icon: Bus, top: "60%", right: "15%", delay: 1 },
    { icon: Car, bottom: "20%", left: "20%", delay: 2 },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />

      {/* Floating Icons */}
      {floatingIcons.map((item, i) => {
        const Icon = item.icon
        return (
          <motion.div
            key={i}
            className="absolute p-4 rounded-full glass neon-glow text-primary hidden md:block"
            style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
          >
            <Icon size={32} />
          </motion.div>
        )
      })}

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-4">
            <Zap className="text-primary w-4 h-4" />
            <span className="text-sm font-medium tracking-wider uppercase">Project Phase 1 Prototype</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              TransitIQ
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
            Smart AI-powered journey planning with unified transport access and QR ticketing.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button size="lg" variant="glow" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full" onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector("#features");
              if (element) window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
            }}>
              Explore Features
            </Button>
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full" onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector("#planner");
              if (element) window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
            }}>
              Plan Journey
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full glass border-primary/20" onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector("#tickets");
              if (element) window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
            }}>
              Generate Ticket
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
