import { motion } from "framer-motion"
import { SKILLS } from "@/lib/data"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export function Skills() {
  return (
    <section id="skills" className="section-dark py-32 lg:py-40 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.03] blur-[150px] pointer-events-none" />

      <div className="content-wrap relative z-10">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-6 inline-block">Skills</span>
          <h2 className="section-heading">
            My <span className="gradient-text">Tech Arsenal</span>
          </h2>
        </motion.div>

        {/* Skills Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKILLS.map((group, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass-card p-6 group"
            >
              <h4 className="text-[11px] font-black uppercase tracking-[2.5px] text-indigo-400 mb-5 pb-3 border-b border-white/[0.05]">
                {group.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item, j) => (
                  <span
                    key={j}
                    className="px-3 py-1.5 text-[11px] font-mono font-medium text-zinc-400 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:border-indigo-500/30 hover:text-white hover:bg-indigo-500/[0.08] transition-all duration-250 cursor-default select-none"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
