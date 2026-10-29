import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header   from '../../components/Header/Header'
import Footer   from '../../components/Footer/Footer'
import PodCard  from '../../components/PodCard/PodCard'
import TiltedGridHero from '../../components/TiltedGridHero/TiltedGridHero'
import { catalogPods } from '../../data/skillPods'

export default function SkillPods() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const visible = catalogPods.filter(p => filter === 'all' || p.category === filter)

  return (
    <>
      <Header />
      <main>
        <TiltedGridHero>
          <span className="mb-3.5 inline-flex rounded-full border border-serv-200/35 bg-serv-500/30 px-3.5 py-2 text-xs font-extrabold tracking-[.13em] text-serv-100">CATÁLOGO COMPLETO</span>
          <h1 className="text-[clamp(2.6rem,6vw,4.8rem)] font-black leading-none tracking-[-.05em]">Conheça nossas<br /><span className="text-serv-200">Skill Pods</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-white/80">Equipes modulares, talentos complementares e soluções para cada projeto.</p>
          <div className="relative z-10 mt-7 flex flex-wrap justify-center gap-2.5">
            {[['all','Todas'],['digital','Digital'],['presencial','Presencial']].map(([val, label]) => (
              <button
                key={val}
                aria-pressed={filter === val}
                className={`rounded-full border px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-serv-200 ${filter === val ? 'border-serv-400 bg-serv-500/40 text-white' : 'border-white/15 bg-white/10 text-white/75 hover:border-serv-300/50 hover:bg-serv-500/25 hover:text-white'}`}
                onClick={() => setFilter(val)}
              >{label}</button>
            ))}
          </div>
        </TiltedGridHero>

        <section className="bg-[#f4f2f8] py-16 sm:py-20 lg:py-24">
          <div className="container">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7">
              {visible.map(pod => <PodCard key={pod.id} pod={pod} />)}
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-gradient-to-br from-serv-950 to-serv-800 py-16 text-white sm:py-24">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-[min(500px,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(107,70,193,.4)_0%,transparent_70%)]" />
          <div className="container relative z-10 text-center">
            <h2 className="mb-3 text-3xl font-black leading-tight sm:text-4xl">Não encontrou a Pod<br /><span className="bg-gradient-to-br from-serv-300 to-serv-200 bg-clip-text text-transparent">ideal para você?</span></h2>
            <p className="mx-auto mb-8 max-w-xl text-white/65">Monte uma Skill Pod personalizada com os especialistas que seu projeto precisa.</p>
            <button className="rounded-full bg-white px-7 py-3.5 font-extrabold text-serv-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl" onClick={() => navigate('/contratar')}>
              Montar Pod Personalizada →
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
