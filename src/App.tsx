import { ThemeProvider } from "./components/theme-provider"
import Navbar from "./components/Navbar"
import HeroSection from "./sections/HeroSection"
import ProblemStatement from "./sections/ProblemStatement"
import FeaturesSection from "./sections/FeaturesSection"
import RoutePlanner from "./sections/RoutePlanner"
import CongestionPanel from "./sections/CongestionPanel"
import QRTicketing from "./sections/QRTicketing"
import DigitalWallet from "./sections/DigitalWallet"
import AnalyticsDashboard from "./sections/AnalyticsDashboard"
import ArchitectureDiagram from "./sections/ArchitectureDiagram"
import Roadmap from "./sections/Roadmap"
import Footer from "./sections/Footer"

function AppContent() {
  return (
    <div className="min-h-screen font-sans selection:bg-primary/30">
      <Navbar />
      <main>
        <div id="home"><HeroSection /></div>
        <ProblemStatement />
        <FeaturesSection />
        <div id="planner"><RoutePlanner /></div>
        <CongestionPanel />
        <div id="tickets"><QRTicketing /></div>
        <div id="wallet"><DigitalWallet /></div>
        <div id="dashboard"><AnalyticsDashboard /></div>
        <ArchitectureDiagram />
        <Roadmap />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppContent />
    </ThemeProvider>
  )
}

export default App
