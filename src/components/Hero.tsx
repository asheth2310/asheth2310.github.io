import { motion } from "framer-motion"
import { ShaderAnimation } from "@/components/ui/shader-animation"
import { PERSONAL } from "@/lib/data"

const tags = ["Python", "Java", "React", "AWS", "PyTorch", "Docker"]

export function Hero() {
  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {/* Shader */}
      <ShaderAnimation />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/50 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/80 via-[#09090b]/30 to-transparent z-[1]" />

      {/* Content */}
      <div className="absolute inset-0 z-[2] flex items-center">
        <div className="content-wrap w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-[640px]"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-green-500/20 bg-green-500/[0.06] mb-10"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-green-400">
                {PERSONAL.badge}
              </span>
            </motion.div>

            {/* Name */}
            <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-black tracking-[-0.05em] leading-[0.85] mb-8">
              <span className="block bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent">
                {PERSONAL.name.split(" ")[0]}
              </span>
              <span className="block bg-gradient-to-b from-zinc-300 to-zinc-600 bg-clip-text text-transparent">
                {PERSONAL.name.split(" ")[1]}
              </span>
            </h1>

            {/* Titles */}
            <div className="space-y-1.5 mb-5">
              <p className="text-[17px] font-semibold text-white/90">{PERSONAL.subtitle}</p>
              <p className="text-[15px] font-medium text-indigo-400">{PERSONAL.title}</p>
            </div>

            {/* Tagline */}
            <p className="text-[15px] text-zinc-500 leading-[1.7] max-w-[480px] mb-7">
              {PERSONAL.tagline}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 text-[11px] font-mono font-medium text-zinc-500 rounded-lg border border-white/[0.07] bg-white/[0.02] hover:border-indigo-500/30 hover:text-zinc-300 transition-all duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href="#connect"
                className="group relative px-7 py-3.5 text-[13px] font-bold rounded-xl overflow-hidden text-white transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300" />
                <div className="absolute inset-0 shadow-[0_8px_30px_rgba(99,102,241,0.3)] group-hover:shadow-[0_12px_40px_rgba(99,102,241,0.45)] transition-all duration-300" />
                <span className="relative">Get in Touch</span>
              </a>
              <a href={PERSONAL.github} target="_blank" rel="noreferrer" className="px-7 py-3.5 text-[13px] font-semibold rounded-xl border border-white/[0.08] text-zinc-400 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.15] hover:text-white transition-all duration-300 hover:-translate-y-0.5">
                GitHub
              </a>
              <a href={PERSONAL.linkedin} target="_blank" rel="noreferrer" className="px-7 py-3.5 text-[13px] font-semibold rounded-xl border border-white/[0.08] text-zinc-400 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.15] hover:text-white transition-all duration-300 hover:-translate-y-0.5">
                LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-3"
      >
        <span className="text-[10px] tracking-[4px] uppercase text-zinc-700 font-semibold">Scroll</span>
        <div className="w-[22px] h-[34px] rounded-full border-2 border-zinc-700/60 flex items-start justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 rounded-full bg-zinc-600"
          />
        </div>
      </motion.div>
    </section>
  )
}
