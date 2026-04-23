import { motion } from "framer-motion"
import { ABOUT } from "@/lib/data"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export function About() {
  return (
    <section id="about" className="section-dark py-32 lg:py-40">
      <div className="content-wrap">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          {/* Badge & Heading */}
          <div className="text-center mb-12">
            <span className="section-badge mb-6 inline-block">About Me</span>
            <h2 className="section-heading">
              Building Systems That{" "}
              <span className="gradient-text">Think & Scale</span>
            </h2>
          </div>

          {/* Glass Card with bio */}
          <div className="glass-card p-8 lg:p-10 mb-6">
            <div className="space-y-5">
              {ABOUT.paragraphs.map((p, i) => (
                <p key={i} className="text-[15px] lg:text-base leading-[1.8] text-zinc-400">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {ABOUT.highlights.map((h, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                className="glass-card flex items-center gap-3 px-5 py-4 !rounded-2xl"
              >
                <span className="text-xl flex-shrink-0">{h.icon}</span>
                <span className="text-[13px] font-semibold text-zinc-300">{h.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
