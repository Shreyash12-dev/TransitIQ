import { useState, useEffect, memo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QRCodeSVG } from "qrcode.react"
import { ScanLine, CheckCircle2, QrCode } from "lucide-react"

const MemoizedQR = memo(({ value }: { value: string }) => (
  <QRCodeSVG 
    value={value} 
    size={220} 
    level="H"
    includeMargin={true}
    fgColor="#000000"
    bgColor="#ffffff"
  />
))

export default function QRTicketing() {
  const [ticketGenerated, setTicketGenerated] = useState(false)
  const [timeLeft, setTimeLeft] = useState(3600) // 1 hour
  const [isVerifying, setIsVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [qrData, setQrData] = useState("")
  
  const [passengerName, setPassengerName] = useState("")
  const [activeTicket, setActiveTicket] = useState<any>(null)
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [walletBalance, setWalletBalance] = useState(450)

  useEffect(() => {
    const storedRoute = localStorage.getItem('selectedTransitRoute');
    if (storedRoute) {
      try { setSelectedRoute(JSON.parse(storedRoute)); } catch (e) {}
    }
    const storedBal = localStorage.getItem('walletBalance');
    if (storedBal) {
      try { setWalletBalance(parseFloat(storedBal)); } catch (e) {}
    }

    const handleRouteSelected = (e: any) => {
      setSelectedRoute(e.detail);
    };
    const handleWallet = (e: any) => {
      setWalletBalance(e.detail);
    };

    window.addEventListener('routeSelected', handleRouteSelected);
    window.addEventListener('walletBalanceUpdated', handleWallet);
    return () => {
      window.removeEventListener('routeSelected', handleRouteSelected);
      window.removeEventListener('walletBalanceUpdated', handleWallet);
    }
  }, []);

  const hasEnoughBalance = selectedRoute ? walletBalance >= selectedRoute.fare : true;
  const isSameLocation = selectedRoute ? selectedRoute.source.trim().toLowerCase() === selectedRoute.destination.trim().toLowerCase() : false;

  useEffect(() => {
    if (ticketGenerated && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [ticketGenerated, timeLeft])

  useEffect(() => {
    if (ticketGenerated && !qrData && selectedRoute) {
      const tId = "TXN-" + Math.floor(1000 + Math.random() * 9000) + "-IQ";
      const ticketObj = {
        ticketId: tId,
        passenger: passengerName || "Guest",
        source: selectedRoute.source,
        destination: selectedRoute.destination,
        routeType: selectedRoute.transportMode,
        fare: selectedRoute.fare,
        issueTime: new Date().toISOString(),
        expiresIn: 3600
      };
      setActiveTicket(ticketObj);
      setQrData(JSON.stringify(ticketObj));
      window.dispatchEvent(new CustomEvent('ticketPurchased', { detail: { fare: selectedRoute.fare, title: selectedRoute.transportMode } }));
    } else if (!ticketGenerated) {
      setQrData("")
      setActiveTicket(null)
      setTimeLeft(3600)
      setVerified(false)
    }
  }, [ticketGenerated, qrData, passengerName, selectedRoute])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleVerify = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      setVerified(true)
    }, 1500)
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 max-w-6xl">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h2 className="text-3xl md:text-5xl font-bold">Smart QR Ticketing</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Say goodbye to paper tickets. Generate a unified digital QR ticket for your entire journey across different transport modes.
          </p>

          {!ticketGenerated && (
            <div className="space-y-4 max-w-sm mx-auto lg:mx-0">
              <Input 
                placeholder="Passenger Name" 
                value={passengerName} 
                onChange={(e) => setPassengerName(e.target.value)} 
              />
              <div className="flex gap-4">
                <Input 
                  placeholder="Source (Select in Route Planner)" 
                  value={selectedRoute?.source || ""} 
                  readOnly
                  className="bg-muted/50 cursor-not-allowed"
                />
                <Input 
                  placeholder="Destination (Select in Route Planner)" 
                  value={selectedRoute?.destination || ""} 
                  readOnly
                  className="bg-muted/50 cursor-not-allowed"
                />
              </div>
              {!selectedRoute && <p className="text-sm text-destructive font-medium">Please select a route in the Route Planner first.</p>}
              {selectedRoute && !hasEnoughBalance && !isSameLocation && (
                <p className="text-sm text-destructive font-medium">Insufficient Wallet Balance (₹{walletBalance.toFixed(2)}). Fare requires ₹{selectedRoute.fare}.</p>
              )}
              {isSameLocation && (
                <p className="text-sm text-destructive font-medium">Source and destination cannot be the same.</p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
            {!ticketGenerated ? (
              <Button 
                size="lg" 
                onClick={() => setTicketGenerated(true)} 
                disabled={!passengerName || !selectedRoute || !hasEnoughBalance || isSameLocation} 
                className={`gap-2 text-white ${hasEnoughBalance && !isSameLocation ? 'bg-green-600 hover:bg-green-700' : 'bg-muted-foreground/50 cursor-not-allowed'}`}
              >
                <ScanLine className="w-5 h-5" /> Generate Ticket
              </Button>
            ) : (
              <Button size="lg" variant="outline" onClick={() => setTicketGenerated(false)}>
                Reset
              </Button>
            )}
            
            {ticketGenerated && !verified && (
              <Button size="lg" variant="glow" onClick={handleVerify} disabled={isVerifying} className="gap-2">
                {isVerifying ? "Verifying Scanner..." : "Simulate Scanner"}
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 w-full max-w-sm">
          {ticketGenerated ? (
            <motion.div
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="perspective-1000"
            >
              <Card className={`glass border-2 overflow-hidden relative transition-colors duration-500 ${verified ? 'border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'border-primary/20'}`}>
                {/* Header */}
                <div className={`p-4 text-center text-white transition-colors duration-500 ${verified ? 'bg-green-600' : 'bg-primary'}`}>
                  <h3 className="font-bold text-lg">Universal Transit Pass</h3>
                  <p className="text-xs opacity-80">{activeTicket?.ticketId}</p>
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Passenger Info */}
                  <div className="flex justify-between items-end border-b border-border pb-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Passenger</p>
                      <p className="font-semibold">{activeTicket?.passenger}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Fare</p>
                      <p className="font-bold text-lg text-primary">₹{activeTicket?.fare?.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Route Info */}
                  <div className="flex justify-between items-center relative">
                    <div className="w-1/3">
                      <p className="text-2xl font-bold truncate" title={activeTicket?.source}>{activeTicket?.source}</p>
                      <p className="text-xs text-muted-foreground">Source</p>
                    </div>
                    <div className="w-1/3 flex justify-center">
                      <div className="h-0.5 w-full bg-muted-foreground/30 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                      </div>
                    </div>
                    <div className="w-1/3 text-right">
                      <p className="text-2xl font-bold truncate" title={activeTicket?.destination}>{activeTicket?.destination}</p>
                      <p className="text-xs text-muted-foreground">Destination</p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center py-4 relative">
                    <div className="p-4 bg-white rounded-xl">
                      {qrData && <MemoizedQR value={qrData} />}
                    </div>
                    {verified && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl"
                      >
                        <div className="text-center text-green-500 flex flex-col items-center">
                          <CheckCircle2 className="w-16 h-16 mb-2" />
                          <span className="font-bold text-xl">Verified</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center text-sm border-t border-border pt-4">
                    <div>
                      <p className="text-muted-foreground text-xs">Issued At</p>
                      <p className="font-semibold text-xs">{activeTicket ? new Date(activeTicket.issueTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Expires In</p>
                      <p className="font-mono font-bold text-destructive">{formatTime(timeLeft)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs">Status</p>
                      <p className={`font-bold ${verified ? 'text-green-500' : 'text-yellow-500'}`}>
                        {verified ? 'Used' : 'Active'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="glass h-[500px] flex items-center justify-center border-dashed border-2 border-muted-foreground/30">
              <div className="text-center text-muted-foreground p-6">
                <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Click "Generate Mock Ticket" to view the smart QR pass.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
