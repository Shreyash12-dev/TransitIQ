import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wallet, Plus, ArrowRightLeft, ArrowDownToLine, ArrowUpRight } from "lucide-react"

export default function DigitalWallet() {
  const [balance, setBalance] = useState(() => {
    const stored = localStorage.getItem('walletBalance');
    return stored ? parseFloat(stored) : 450.00;
  })
  const [amount, setAmount] = useState("")
  const [transactions, setTransactions] = useState([
    { id: 1, type: "deduct", title: "Bus 401 Fare", amount: 25, date: "Today, 09:15 AM" },
    { id: 2, type: "add", title: "Wallet Recharge", amount: 500, date: "Yesterday, 06:30 PM" },
    { id: 3, type: "deduct", title: "Metro Red Line", amount: 45, date: "Yesterday, 09:00 AM" },
  ])
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    localStorage.setItem('walletBalance', balance.toString());
    window.dispatchEvent(new CustomEvent('walletBalanceUpdated', { detail: balance }));
  }, [balance]);

  useEffect(() => {
    const handleTicketPurchased = (e: any) => {
      const { fare, title } = e.detail;
      setBalance(b => Math.max(0, b - fare));
      setTransactions(prev => [{ id: Date.now(), type: "deduct", title: "Ticket: " + title, amount: fare, date: "Just now" }, ...prev]);
    };
    window.addEventListener('ticketPurchased', handleTicketPurchased);
    return () => window.removeEventListener('ticketPurchased', handleTicketPurchased);
  }, []);

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(amount)
    if (isNaN(val) || val <= 0) return

    setBalance(b => b + val)
    setTransactions([{ id: Date.now(), type: "add", title: "Wallet Recharge", amount: val, date: "Just now" }, ...transactions])
    setAmount("")
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Wallet className="text-teal-500 w-10 h-10" />
            Unified Digital Wallet
          </h2>
          <p className="text-muted-foreground text-lg">
            Manage your transit funds seamlessly. Auto-deductions ensure you never wait in line again.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Balance Card */}
          <div className="space-y-6">
            <Card className="glass border-teal-500/30 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl" />
              <CardContent className="p-8">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Available Balance</p>
                <div className="text-5xl font-bold text-foreground mb-8">
                  ₹<motion.span
                    key={balance}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {balance.toFixed(2)}
                  </motion.span>
                </div>

                <form onSubmit={handleAddMoney} className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input 
                      type="number" 
                      placeholder="Amount" 
                      className="pl-8"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </form>

                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-green-500 text-sm mt-3 flex items-center gap-1"
                    >
                      <ArrowDownToLine className="w-4 h-4" /> Successfully added funds
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-14 glass">
                <ArrowRightLeft className="w-4 h-4 mr-2 text-teal-500" /> Transfer
              </Button>
              <Button variant="outline" className="h-14 glass">
                <ArrowUpRight className="w-4 h-4 mr-2 text-primary" /> Auto-Pay
              </Button>
            </div>
          </div>

          {/* Transactions */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-xl">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {transactions.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${t.type === 'add' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                        {t.type === 'add' ? <Plus size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.title}</p>
                        <p className="text-xs text-muted-foreground">{t.date}</p>
                      </div>
                    </div>
                    <div className={`font-bold ${t.type === 'add' ? 'text-green-500' : 'text-foreground'}`}>
                      {t.type === 'add' ? '+' : '-'}₹{t.amount.toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
