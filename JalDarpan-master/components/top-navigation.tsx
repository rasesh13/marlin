"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Bell, Brain, Fish, Home, LogOut, MapPin, Menu, Radio, User, Waves, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Command", href: "/", icon: Home },
  { name: "Ocean", href: "/ocean-data", icon: Waves },
  { name: "Fisheries", href: "/fish-distribution", icon: Fish },
  { name: "Biodiversity", href: "/biodiversity", icon: BarChart3 },
  { name: "AI Lab", href: "/ai-predictions", icon: Brain },
  { name: "Geo Map", href: "/map", icon: MapPin },
]

export function TopNavigation() {
  const [isOpen, setIsOpen] = useState(false)
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
    <header className="sticky top-0 z-50 border-b border-[#dce7e5] bg-white/90 text-[#062a36] shadow-[0_8px_30px_rgba(29,68,75,.06)] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1480px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="MARLIN command centre">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#087f7b] shadow-[0_8px_22px_rgba(8,127,123,.18)]">
            <Waves className="h-5 w-5 text-white transition group-hover:scale-110" />
            <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-[#8bf4ad] shadow-[0_0_8px_#8bf4ad]" />
          </div>
          <div>
            <div className="flex items-center gap-2"><p className="text-lg font-bold tracking-[0.04em]">MARLIN</p><span className="rounded border border-[#d2dfdd] bg-[#f2f7f6] px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-[#70888b]">BETA</span></div>
            <p className="hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-[#70888b] sm:block">Marine intelligence network</p>
          </div>
        </Link>

        <nav className="mx-auto hidden items-center rounded-2xl border border-[#e0e9e7] bg-[#f4f8f7] p-1 lg:flex">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href} className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all",
                isActive ? "bg-white text-[#087f7b] shadow-[0_4px_14px_rgba(30,72,77,.08)]" : "text-[#6d8589] hover:bg-white/70 hover:text-[#062a36]",
              )}>
                <item.icon className="h-3.5 w-3.5" />{item.name}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          <div className="hidden items-center gap-2 rounded-xl border border-[#cfe4dc] bg-[#eff9f5] px-3 py-2 xl:flex">
            <Radio className="h-3.5 w-3.5 text-[#2b9d70]" />
            <div><p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#25865f]">Network live</p><p className="text-[9px] text-[#71898c]">326 sensors</p></div>
          </div>
          <Link href="/#alerts" aria-label="View live alerts" className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce7e5] bg-white text-[#71898c] transition hover:border-[#9ec9c4] hover:text-[#062a36]">
            <Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#ff8d83] shadow-[0_0_7px_#ff8d83]" />
          </Link>
          <div className="relative">
            <button aria-label="Account menu" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce7e5] bg-white text-[#71898c] transition hover:border-[#9ec9c4] hover:text-[#062a36]" onClick={() => setAccountOpen((open) => !open)}><User className="h-4 w-4" /></button>
            {accountOpen && (
              <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-[#dce7e5] bg-white/95 p-3 shadow-2xl backdrop-blur-xl">
                {user ? <><div className="border-b border-white/10 px-3 pb-3"><p className="font-semibold">{user.name}</p><p className="mt-1 text-xs text-[#789baa]">{user.email}</p><p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#b9ec71]">{user.role}</p></div><button onClick={handleLogout} className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-[#ff9e95] hover:bg-white/[0.05]"><LogOut className="h-4 w-4" /> Sign out</button></> : <Link href="/login" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/[0.05]"><User className="h-4 w-4" /> Sign in</Link>}
              </div>
            )}
          </div>
          <button aria-label="Toggle navigation" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce7e5] text-[#71898c] lg:hidden" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
        </div>
      </div>

      {isOpen && (
        <nav className="grid grid-cols-2 gap-2 border-t border-[#dce7e5] bg-white/95 p-4 sm:grid-cols-3 lg:hidden">
          {navigation.map((item) => <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)} className={cn("flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold", pathname === item.href ? "bg-[#e1f5f1] text-[#087f7b]" : "bg-[#f4f8f7] text-[#6c8589]")}><item.icon className="h-4 w-4" />{item.name}</Link>)}
        </nav>
      )}
    </header>
  )
}
