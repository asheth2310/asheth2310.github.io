import { motion } from "framer-motion"
import { EXPERIENCES } from "@/lib/data"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export function Experience() {
  return (
    <section id="experience" className="section-raised py-32 lg:py-40">
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
          <span className="section-badge mb-6 inline-block">Experience</span>
          <h2 className="section-heading">
            Where I've <span className="gradient-text">Contributed</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] lg:left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/30 via-indigo-500/10 to-transparent" />

          <div className="space-y-6">
            {EXPERIENCES.map((exp, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative pl-14 lg:pl-16"
              >
                {/* Timeline dot */}
                <div className="absolute left-[12px] lg:left-[16px] top-8 w-[15px] h-[15px] rounded-full border-[2.5px] border-indigo-500 bg-surface-raised z-10">
                  <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" style={{ animationDuration: "3s" }} />
                </div>

                {/* Experience Card */}
                <div className="glass-card p-7 lg:p-8 group">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                    <div>
                      <h3 className="text-[17px] font-bold text-white group-hover:text-indigo-300 transition-colors duration-300">{exp.role}</h3>
                      <p className="text-sm font-semibold text-indigo-400 mt-0.5">{exp.company}</p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1 flex-shrink-0">
                      <span className="text-[12px] font-mono font-semibold text-zinc-500 bg-white/[0.03] px-3 py-1 rounded-md border border-white/[0.05]">{exp.period}</span>
                      <span className="text-[11px] text-zinc-600">{exp.location}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/[0.05] mb-5" />

                  {/* Bullets */}
                  <ul className="space-y-4">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j} className="flex gap-3 text-[14px] text-zinc-400 leading-[1.75]">
                        <span className="text-indigo-500 font-bold mt-1 flex-shrink-0 text-xs">▸</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
