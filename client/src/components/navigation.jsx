import { Link } from "react-router-dom"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          CivicFix
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-primary transition">
            Home
          </Link>
          <Link to="/report" className="text-foreground hover:text-primary transition">
            Report Issue
          </Link>
          <Link to="/track" className="text-foreground hover:text-primary transition">
            Track Issue
          </Link>
          <Link to="/dashboard" className="text-foreground hover:text-primary transition">
            Dashboard
          </Link>
          <Link to="/authority">
            <Button size="sm" variant="outline" className="bg-transparent">
              Authority Login
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link to="/" className="text-foreground hover:text-primary transition">
              Home
            </Link>
            <Link to="/report" className="text-foreground hover:text-primary transition">
              Report Issue
            </Link>
            <Link to="/track" className="text-foreground hover:text-primary transition">
              Track Issue
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-primary transition">
              Dashboard
            </Link>
            <Link to="/authority">
              <Button size="sm" variant="outline" className="w-full bg-transparent">
                Authority Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
