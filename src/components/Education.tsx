import { motion } from "framer-motion"
import { EDUCATION } from "@/lib/data"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export function Education() {
  return (
    <section id="education" className="section-raised py-32 lg:py-40">
      <div className="content-wrap">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-6 inline-block">Education</span>
          <h2 className="section-heading">
            Academic <span className="gradient-text">Foundation</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {EDUCATION.map((edu, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="glass-card p-8 group relative overflow-hidden hover:-translate-y-1"
            >
              {/* Accent glow */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/[0.05] rounded-full blur-3xl group-hover:bg-indigo-500/[0.1] transition-all duration-500 pointer-events-none" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/[0.08] border border-indigo-500/20 flex items-center justify-center text-2xl mb-5">
                  🎓
                </div>
                <h3 className="text-[17px] font-bold text-white mb-2 leading-snug">{edu.degree}</h3>
                <p className="text-sm font-semibold text-indigo-400 mb-4">{edu.school}</p>
                <div className="h-px bg-white/[0.05] mb-4" />
                <div className="flex items-center gap-3 text-[12px] text-zinc-500">
                  <span className="font-mono font-medium bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/[0.04]">{edu.period}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span>{edu.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
