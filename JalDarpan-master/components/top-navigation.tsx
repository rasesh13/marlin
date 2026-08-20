"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, Fish, Waves, Brain, Home, Menu, X, MapPin, Bell, Settings, User, LogOut } from "lucide-react"
import { useEffect } from "react"

const navigation = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Ocean Data", href: "/ocean-data", icon: Waves },
  { name: "Fisheries", href: "/fish-distribution", icon: Fish },
  { name: "Biodiversity", href: "/biodiversity", icon: BarChart3 },
  { name: "AI Intelligence", href: "/ai-predictions", icon: Brain },
  { name: "Map Explorer", href: "/map", icon: MapPin },
]

export function TopNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    fetch("/api/auth/me").then((response) => response.json()).then((result) => {
      if (result.authenticated) setUser(result.user)
    }).catch(() => undefined)
  }, [])

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    setAccountOpen(false)
    window.location.href = "/login"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#062b49] text-white">
      <div className="container flex h-[76px] items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#13c8d8]/50 bg-[#092b47]">
            {logoFailed ? <span aria-hidden="true" className="font-display text-2xl font-bold italic text-[#24d7ff]">M</span> : <img src="/marlin-logo.png" alt="MARLIN logo" className="h-full w-full object-contain" onError={() => setLogoFailed(true)} />}
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-tight">MARLIN</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#8fb6c4]">National marine data platform</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#0b3a5b] text-[#13c8d8] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#13c8d8]"
                    : "text-[#8fb6c4] hover:bg-white/10 hover:text-white",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Link href="/#alerts" aria-label="View alerts" className="hidden h-10 w-10 items-center justify-center rounded-lg text-[#dbe8f0] transition hover:bg-white/10 hover:text-white md:flex">
            <Bell className="w-4 h-4" />
          </Link>
          <Link href="/api/generate-report" aria-label="Download report" className="hidden h-10 w-10 items-center justify-center rounded-lg text-[#dbe8f0] transition hover:bg-white/10 hover:text-white md:flex">
            <Settings className="w-4 h-4" />
          </Link>
          <div className="relative">
            <Button aria-label="Account menu" variant="ghost" size="icon" className="text-[#dbe8f0] hover:bg-white/10 hover:text-white" onClick={() => setAccountOpen((open) => !open)}>
              <User className="w-4 h-4" />
            </Button>
            {accountOpen && <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-white/10 bg-[#0a2536] p-3 text-white shadow-2xl">
              {user ? <><div className="border-b border-white/10 px-3 pb-3"><p className="font-semibold">{user.name}</p><p className="mt-1 text-xs text-[#91adba]">{user.email}</p><p className="mt-2 text-[10px] uppercase tracking-wider text-[#d8f36b]">{user.role}</p></div><button onClick={handleLogout} className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-[#ffb4aa] hover:bg-white/10"><LogOut className="h-4 w-4" /> Sign out</button></> : <Link href="/login" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/10"><User className="h-4 w-4" /> Sign in</Link>}
            </div>}
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-white/10 bg-[#062b49] md:hidden">
          <nav className="container px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#0b3a5b] text-[#13c8d8]"
                      : "text-[#8fb6c4] hover:bg-white/10 hover:text-white",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
