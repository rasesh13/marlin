"use client"

import { Button } from "@/components/ui/button"
import { Bell, Settings, User } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#24d7ff]/70 bg-[#06172c]">
            {logoFailed ? <span aria-hidden="true" className="font-display text-xl font-bold italic text-[#24d7ff]">M</span> : <img src="/marlin-logo.png" alt="MARLIN logo" className="h-full w-full object-contain" onError={() => setLogoFailed(true)} />}
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            MARLIN
          </h2>
        </div>
        <div className="ml-4 px-3 py-1 rounded-md bg-gradient-to-r from-orange-500 via-white to-green-600 border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-800 drop-shadow-sm">Marine Analytics, Research, Linkage & Intelligence Network</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
