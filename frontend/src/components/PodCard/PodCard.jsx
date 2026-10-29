import { useNavigate } from 'react-router-dom'

export default function PodCard({ pod }) {
  const navigate = useNavigate()
  const category = pod.category === 'presencial' ? 'Presencial' : 'Digital'

  return (
    <article className={`group flex h-full flex-col overflow-hidden border bg-white transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 ${pod.featured ? 'border-serv-500/35 shadow-[0_18px_50px_rgba(42,27,61,.1)] hover:shadow-[0_24px_60px_rgba(42,27,61,.16)]' : 'border-serv-950/10 hover:border-serv-500/30 hover:shadow-[0_18px_50px_rgba(42,27,61,.1)]'}`}>
      <div className="relative aspect-[16/9] overflow-hidden bg-serv-900">
        {pod.image ? (
          <img src={pod.image} alt="" aria-hidden="true" className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
        ) : (
          <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_70%_25%,rgba(196,181,253,.28),transparent_30%),linear-gradient(135deg,#3d2560,#1a0f2e)]">
            <span className="font-display text-7xl text-white/90" aria-hidden="true">{pod.emoji}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-serv-950/65 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
          <span className="text-xs font-semibold text-white/80">{pod.size}</span>
          <span className={`border px-2.5 py-1 text-[.68rem] font-bold ${pod.category === 'presencial' ? 'border-emerald-200/50 bg-emerald-950/45 text-emerald-100' : 'border-white/35 bg-serv-950/45 text-white'}`}>{category}</span>
        </div>
        {pod.featured && <span className="absolute left-4 top-4 bg-serv-200 px-3 py-1 text-[.68rem] font-bold text-serv-950">Em destaque</span>}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-xl font-bold tracking-tight text-serv-950 sm:text-2xl">{pod.name}</h3>
        <p className="mt-2 min-h-[3.25rem] text-sm leading-6 text-serv-900/65">{pod.desc}</p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Especialidades">
          {pod.tags.slice(0, 3).map(tag => <li key={tag} className="border border-serv-950/10 px-2.5 py-1 text-xs font-medium text-serv-900/70">{tag}</li>)}
        </ul>

        <div className="mt-auto border-t border-serv-950/10 pt-5">
          <div className="mb-5 flex flex-wrap gap-x-3 gap-y-1.5 text-xs leading-5 text-serv-900/65">
            {pod.members.slice(0, 3).map(member => <span key={member.label}>{member.label}</span>)}
            {pod.members.length > 3 && <span>+{pod.members.length - 3}</span>}
          </div>
          <button type="button" className="group/action inline-flex w-full items-center justify-between border border-serv-950/15 px-4 py-3 text-sm font-bold text-serv-950 transition-colors hover:border-serv-950 hover:bg-serv-950 hover:text-white focus-visible:ring-offset-white" onClick={() => navigate('/contratar')}>
            Conhecer equipe <span aria-hidden="true" className="transition-transform group-hover/action:translate-x-1">↗</span>
          </button>
        </div>
      </div>
    </article>
  )
}
