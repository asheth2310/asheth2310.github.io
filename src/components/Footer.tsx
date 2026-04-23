export function Footer() {
  return (
    <footer className="py-10 border-t border-white/[0.04] bg-surface">
      <div className="content-wrap text-center">
        <p className="text-[12px] text-zinc-700 font-medium">
          © {new Date().getFullYear()} Aagam Sheth — Designed & built with React, Three.js & Tailwind CSS
        </p>
      </div>
    </footer>
  )
}
