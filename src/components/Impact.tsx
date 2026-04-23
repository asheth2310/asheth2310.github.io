import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { IMPACT_METRICS } from "@/lib/data"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

function AnimatedCounter({ value }: { value: string }) {
  const [display, setDisplay] = useState("0")
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const numeric = parseInt(value.replace(/[^0-9]/g, ""))
    if (isNaN(numeric)) { setDisplay(value); return }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const startTime = performance.now()

          const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.floor(eased * numeric)

            if (value.includes("K")) {
              setDisplay(current >= 1000 ? Math.floor(current / 1000) + "K" : current.toString())
            } else {
              setDisplay(current.toString())
            }

            if (progress < 1) requestAnimationFrame(animate)
            else setDisplay(value)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return <span ref={ref}>{display}</span>
}

export function Impact() {
  return (
    <section id="impact" className="section-dark py-32 lg:py-40 relative overflow-hidden">
      {/* Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/[0.03] blur-[120px] pointer-events-none" />

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
          <span className="section-badge mb-6 inline-block">Impact</span>
          <h2 className="section-heading">
            Impact of <span className="gradient-text">My Work</span>
          </h2>
        </motion.div>

        {/* Metrics */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {IMPACT_METRICS.map((m, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass-card p-7 hover:-translate-y-1 group"
            >
              <div className="text-[clamp(2.5rem,5vw,3.5rem)] font-black tracking-[-0.03em] gradient-text mb-3 leading-none">
                <AnimatedCounter value={m.value} />
              </div>
              <div className="h-px bg-white/[0.04] mb-3 group-hover:bg-indigo-500/10 transition-colors duration-300" />
              <p className="text-[13px] text-zinc-500 leading-relaxed">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
