import { useState, useEffect } from "react"
import { NAV_ITEMS, PERSONAL } from "@/lib/data"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(9,9,11,0.85)] backdrop-blur-2xl border-b border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : "bg-transparent"
      }`}
    >
      <div className="content-wrap flex items-center justify-between h-[72px]">
        <a href="#" className="text-xl font-black tracking-tight gradient-text select-none">
          {PERSONAL.name.split(" ").map(n => n[0]).join("")}
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="px-4 py-2 rounded-lg text-[13px] font-medium text-zinc-500 hover:text-white hover:bg-white/[0.04] transition-all duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 rounded-lg flex flex-col items-center justify-center gap-1.5 hover:bg-white/[0.04] transition-colors"
          aria-label="Toggle menu"
        >
          <span className={`w-5 h-0.5 bg-zinc-400 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
          <span className={`w-5 h-0.5 bg-zinc-400 transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-zinc-400 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[rgba(9,9,11,0.95)] backdrop-blur-2xl border-t border-white/[0.04] px-6 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
