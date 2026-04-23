import { motion } from "framer-motion"
import { PERSONAL } from "@/lib/data"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const LINKS = [
  { icon: "📧", label: "Email", value: PERSONAL.email, href: `mailto:${PERSONAL.email}` },
  { icon: "💼", label: "LinkedIn", value: "in/aagam2301", href: PERSONAL.linkedin },
  { icon: "🐙", label: "GitHub", value: "asheth2310", href: PERSONAL.github },
  { icon: "📱", label: "Phone", value: PERSONAL.phone, href: `tel:${PERSONAL.phone.replace(/-/g, "")}` },
]

export function Connect() {
  return (
    <section id="connect" className="section-raised py-32 lg:py-40 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-indigo-500/[0.04] blur-[120px] pointer-events-none" />

      <div className="content-wrap relative z-10">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="section-badge mb-6 inline-block">Connect</span>
          <h2 className="section-heading mb-5">
            Let's Work <span className="gradient-text">Together</span>
          </h2>
          <p className="text-[15px] text-zinc-400 mb-1">Currently open for Software Engineer, ML Engineer, and Data roles.</p>
          <p className="text-[13px] text-zinc-600">Graduating May 2026 — available for full-time opportunities.</p>
        </motion.div>

        {/* Contact Cards */}
        <div className="max-w-2xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {LINKS.map((link, i) => (
            <motion.a
              key={i}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass-card flex flex-col items-center gap-3 p-6 hover:-translate-y-1 group no-underline text-center"
            >
              <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-xl group-hover:border-indigo-500/20 group-hover:bg-indigo-500/[0.05] transition-all duration-300">
                {link.icon}
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[2px] text-zinc-600 group-hover:text-zinc-400 transition-colors mb-1">{link.label}</span>
                <span className="block text-[12px] font-medium text-zinc-400 group-hover:text-white transition-colors">{link.value}</span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Resume */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <a
            href={PERSONAL.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 text-[13px] font-bold rounded-xl overflow-hidden text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300" />
            <div className="absolute inset-0 shadow-[0_8px_30px_rgba(99,102,241,0.3)] group-hover:shadow-[0_12px_40px_rgba(99,102,241,0.45)] transition-all duration-300" />
            <span className="relative">Download Resume</span>
            <svg className="relative w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
