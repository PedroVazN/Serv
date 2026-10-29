import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import PodCard from '../../components/PodCard/PodCard'
import TiltedGridHero from '../../components/TiltedGridHero/TiltedGridHero'
import { catalogPods } from '../../data/skillPods'

const filters = [
  { value: 'all', label: 'Todas' },
  { value: 'digital', label: 'Digital' },
  { value: 'presencial', label: 'Presencial' },
]

export default function SkillPods() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const visible = catalogPods.filter(pod => filter === 'all' || pod.category === filter)

  return (
    <>
      <Header />
      <main>
        <TiltedGridHero>
          <div className="mx-auto max-w-4xl">
            <span className="mb-5 inline-flex border border-serv-200/30 bg-white/[.06] px-3.5 py-2 text-xs font-bold text-serv-100">Equipes prontas para colaborar</span>
            <h1 className="font-display text-[clamp(3.5rem,9vw,7rem)] font-bold leading-[.9] tracking-[-.08em] text-white">
              Encontre seu<br /><span className="text-serv-200">time ideal.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              Skill Pods reúnem especialistas que trabalham juntos para levar seu projeto da ideia à entrega.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5" role="group" aria-label="Filtrar equipes por formato">
              {filters.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={filter === value}
                  className={`min-h-11 border px-5 text-sm font-semibold transition-colors focus-visible:ring-offset-serv-950 ${filter === value ? 'border-serv-200 bg-serv-200 text-serv-950' : 'border-white/20 bg-white/[.04] text-white/75 hover:border-serv-200/60 hover:text-white'}`}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </TiltedGridHero>

        <section className="bg-[#f7f5fa] py-14 sm:py-20 lg:py-24">
          <div className="container">
            <div className="mb-8 flex flex-col gap-3 border-b border-serv-950/15 pb-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-serv-600">Catálogo SERV+</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-serv-950 sm:text-3xl">Equipes para cada tipo de trabalho</h2>
              </div>
              <p className="text-sm text-serv-900/60" aria-live="polite">{visible.length} {visible.length === 1 ? 'equipe disponível' : 'equipes disponíveis'}</p>
            </div>
            <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {visible.map(pod => <PodCard key={pod.id} pod={pod} />)}
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-serv-950 py-14 text-white sm:py-20">
          <span aria-hidden="true" className="pointer-events-none absolute -right-4 top-[-.6em] -z-10 font-display text-[min(45vw,24rem)] font-bold leading-none text-white/[.035]">+</span>
          <div className="container grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-serv-200">Um projeto específico?</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-.04em] sm:text-4xl">Monte uma equipe com as habilidades certas.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">Conte o que precisa e escolha os especialistas que vão trabalhar juntos na sua entrega.</p>
            </div>
            <button type="button" className="inline-flex min-h-12 items-center justify-center gap-4 border border-serv-200 bg-serv-200 px-6 text-sm font-bold text-serv-950 transition-colors hover:border-white hover:bg-white" onClick={() => navigate('/contratar')}>
              Criar minha equipe <span aria-hidden="true">↗</span>
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
