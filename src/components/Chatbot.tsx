import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CHATBOT_FAQ } from "@/lib/data"

const DEFAULT_RESPONSE = "I can help with questions about Aagam's skills, experience, projects, education, and contact info. Try asking:\n\n• What tech does he use?\n• Tell me about his experience\n• How can I contact him?"

function findAnswer(input: string): string {
  const lower = input.toLowerCase()
  let bestMatch: (typeof CHATBOT_FAQ)[number] | null = null
  let bestScore = 0

  for (const faq of CHATBOT_FAQ) {
    const score = faq.keywords.filter((kw) => lower.includes(kw)).length
    if (score > bestScore) {
      bestScore = score
      bestMatch = faq
    }
  }

  return bestScore > 0 && bestMatch ? bestMatch.answer : DEFAULT_RESPONSE
}

interface Message {
  from: "bot" | "user"
  text: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hey! 👋 I'm Aagam's portfolio assistant. Ask me about skills, projects, experience, or contact info!" },
  ])
  const [input, setInput] = useState("")
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages((prev) => [...prev, { from: "user", text: userMsg }])
    setInput("")

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: findAnswer(userMsg) }])
    }, 400)
  }

  return (
    <>
      {/* Toggle */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-[0_8px_30px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.5)] border border-indigo-500/30 cursor-pointer transition-shadow duration-300"
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </motion.button>

      {/* Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-[99] w-[360px] max-h-[480px] flex flex-col rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            style={{
              background: "rgba(15, 15, 20, 0.9)",
              backdropFilter: "blur(40px) saturate(1.5)",
              WebkitBackdropFilter: "blur(40px) saturate(1.5)",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.05]">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-sm font-semibold text-white">Portfolio Assistant</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[320px] scrollbar-thin">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                      msg.from === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-md"
                        : "bg-white/[0.04] border border-white/[0.05] text-zinc-300 rounded-2xl rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.05]">
              <input
                type="text"
                placeholder="Ask about skills, projects..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-[13px] text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500/30 transition-colors font-[inherit]"
              />
              <button
                onClick={handleSend}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 hover:opacity-90 cursor-pointer transition-opacity"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
