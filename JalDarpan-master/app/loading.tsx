export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#041827] text-white">
      <div className="relative text-center">
        <div className="absolute -inset-12 rounded-full border border-[#13c8d8]/20 animate-[spin_12s_linear_infinite]" />
        <div className="absolute -inset-7 rounded-full border border-dashed border-[#27d3c2]/30 animate-[spin_8s_linear_infinite_reverse]" />
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#13c8d8]/70 bg-[#092b43] shadow-[0_0_36px_rgba(19,200,216,0.22)]"><span className="font-display text-4xl font-bold italic text-[#13c8d8]">M</span></div>
        <p className="mt-7 font-display text-xl font-bold tracking-[0.18em]">MARLIN</p>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#8fb6c4]">Initializing marine intelligence network</p>
        <div className="mx-auto mt-6 h-1 w-40 overflow-hidden rounded-full bg-[#0b3a5b]"><div className="h-full w-1/2 animate-pulse bg-[#13c8d8]" /></div>
      </div>
    </main>
  )
}
