import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PodCard({ pod }) {
  const navigate = useNavigate()
  const cardRef  = useRef(null)

  function onMouseMove(e) {
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    cardRef.current.style.transform =
      `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(16px)`
  }

  function onMouseLeave() {
    cardRef.current.style.transform = ''
  }

  return (
    <div
      ref={cardRef}
      className={`group relative h-full overflow-hidden rounded-[28px] border transition-[border-color,box-shadow,background-color] duration-300 will-change-transform [transform-style:preserve-3d] hover:border-serv-500/35 hover:shadow-[0_24px_64px_rgba(107,70,193,.18)] ${pod.featured ? 'border-serv-500/30 bg-gradient-to-br from-purple-50 to-serv-100 shadow-[0_12px_40px_rgba(107,70,193,.15)]' : 'border-serv-500/15 bg-white'}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {pod.featured && <span className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-br from-serv-600 to-serv-400 px-3.5 py-1.5 text-[.7rem] font-extrabold uppercase tracking-wide text-white">Mais popular</span>}

      <div className="pointer-events-none absolute -right-[50px] -top-[50px] z-0 size-[200px] rounded-full opacity-[.12] blur-[70px] transition-opacity group-hover:opacity-[.22]" style={{ background: pod.glowColor }} />

      {pod.image && <img src={pod.image} alt="" aria-hidden="true" className="relative z-[1] h-40 w-full object-cover sm:h-44" />}

      <div className="relative z-[1] flex flex-1 flex-col p-5 sm:p-8">
        <div className="mb-4 flex items-start justify-between">
          <span className="text-4xl leading-none">{pod.emoji}</span>
          <div className="flex flex-col items-end gap-1">
            <span className={`rounded-full border px-2.5 py-1 text-[.67rem] font-bold uppercase tracking-wider ${pod.category === 'presencial' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600' : 'border-serv-500/20 bg-serv-500/10 text-serv-600'}`}>
              {pod.category === 'presencial' ? 'Presencial' : 'Digital'}
            </span>
            <span className="text-[.68rem] font-semibold text-gray-400">{pod.size}</span>
          </div>
        </div>

        <h3 className="mb-2 text-xl font-black tracking-tight text-serv-900">{pod.name}</h3>
        <p className="mb-5 text-sm leading-relaxed text-gray-500">{pod.desc}</p>

        <ul className="mb-6 flex flex-col gap-2">
          {pod.members.map(m => (
            <li key={m.label} className="flex items-center gap-2.5 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2 text-sm text-gray-700 transition group-hover:border-serv-500/25 group-hover:bg-purple-100">
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-purple-100 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {pod.tags.map(t => <span key={t} className="rounded-full border border-gray-200 bg-[#f4f2f8] px-2.5 py-1 text-[.7rem] font-semibold text-gray-500">{t}</span>)}
          </div>
          <button className="whitespace-nowrap rounded-full bg-gradient-to-br from-serv-500 to-serv-700 px-5 py-2 text-xs font-bold text-white shadow-[0_4px_16px_rgba(107,70,193,.3)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(107,70,193,.45)]" onClick={() => navigate('/contratar')}>
            Contratar →
          </button>
        </div>
      </div>
    </div>
  )
}
