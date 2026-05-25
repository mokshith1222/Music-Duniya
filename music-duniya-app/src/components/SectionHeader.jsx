export default function SectionHeader({ icon, kicker, title, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div className="flex items-center gap-3">
        {icon && <div className="grid size-12 place-items-center rounded-full bg-white/10 text-cyan-300">{icon}</div>}
        <div>
          {kicker && <p className="mb-1 text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">{kicker}</p>}
          <h2 className="text-2xl font-black text-white md:text-4xl">{title}</h2>
        </div>
      </div>
      {action}
    </div>
  )
}
