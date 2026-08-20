"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, LockKeyhole, Mail } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@marlin.network")
  const [password, setPassword] = useState("Marlin@123")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to sign in")
      router.push("/")
      router.refresh()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06172c] px-4 py-10 text-white">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a2536] shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden p-12 lg:block">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[24px] border-[#24d7ff]/10" />
          <div className="relative flex h-full flex-col justify-between">
            <Link href="/" className="flex items-center gap-3"><span className="relative h-14 w-14 overflow-hidden rounded-full shadow-[0_10px_30px_rgba(20,133,255,.25)] ring-1 ring-[#24d7ff]/30"><Image src="/marlin-brand-logo.png" alt="" fill sizes="56px" className="object-cover" /></span><span className="font-display text-2xl font-bold">MARLIN</span></Link>
            <div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#d8f36b]">Marine intelligence network</p><h1 className="max-w-md text-5xl font-bold leading-tight">Read the water<br /><span className="text-[#8fd4d0]">with clarity.</span></h1><p className="mt-6 max-w-md leading-7 text-[#9dbbc2]">Secure access to live stations, field surveys, ocean parameters, and predictive ecosystem signals.</p></div>
            <p className="text-xs text-[#6f929c]">MARLIN / Research operations workspace</p>
          </div>
        </section>
        <section className="bg-[#092b43] p-7 text-white sm:p-12">
          <div className="mx-auto max-w-sm">
            <div className="relative mb-10 h-14 w-14 overflow-hidden rounded-full shadow-[0_10px_30px_rgba(20,133,255,.2)]"><Image src="/marlin-brand-logo.png" alt="MARLIN logo" fill sizes="56px" className="object-cover" /></div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#13c8d8]">Welcome back</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Sign in to MARLIN</h2>
            <p className="mt-3 text-sm text-[#8fb6c4]">Use your research workspace credentials.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block text-sm font-semibold">Email<div className="relative mt-2"><Mail className="absolute left-3 top-3 h-4 w-4 text-[#628b9c]" /><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="h-11 w-full rounded-xl border border-white/10 bg-[#041827] pl-10 pr-3 text-white outline-none focus:border-[#13c8d8]" /></div></label>
              <label className="block text-sm font-semibold">Password<div className="relative mt-2"><LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-[#628b9c]" /><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required className="h-11 w-full rounded-xl border border-white/10 bg-[#041827] pl-10 pr-3 text-white outline-none focus:border-[#13c8d8]" /></div></label>
              {error && <p className="rounded-lg bg-[#e66f61]/15 px-3 py-2 text-sm text-[#ffb9b1]">{error}</p>}
              <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#13c8d8] font-semibold text-[#041827] transition hover:bg-[#27d3c2] disabled:cursor-wait disabled:opacity-60">{loading ? "Signing in..." : "Enter workspace"}<ArrowRight className="h-4 w-4" /></button>
            </form>
            <p className="mt-6 text-center text-xs text-[#628b9c]">Demo access: admin@marlin.network / Marlin@123</p>
          </div>
        </section>
      </div>
    </main>
  )
}
