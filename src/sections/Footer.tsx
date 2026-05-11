import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-card py-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-2xl font-bold tracking-tight">AI Unified Public Transport</h3>
          
          <p className="text-muted-foreground max-w-md">
            Engineering Design & Innovation Project<br />
            Department of Computer Engineering<br />
            JSPM RSCOE
          </p>

          <div className="pt-4 flex items-center justify-center gap-2 text-sm font-medium">
            <span>Academic Year 2025–2026</span>
          </div>
          
          <div className="pt-8 text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Smart Cities
          </div>
        </div>
      </div>
    </footer>
  )
}
