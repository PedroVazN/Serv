import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header   from '../../components/Header/Header'
import Footer   from '../../components/Footer/Footer'
import PageHero from '../../components/PageHero/PageHero'
import { freelancers } from '../../data/skillPods'

function FreelancerCard({ f }) {
  const ref = useRef(null)
  const onMove = e => {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - .5
    const y = (e.clientY - r.top)  / r.height - .5
    ref.current.style.transform = `perspective(700px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateZ(10px)`
  }
  const onLeave = () => { ref.current.style.transform = '' }

  return (
    <article ref={ref} className="group relative flex flex-col items-center overflow-hidden rounded-[28px] border border-serv-500/15 bg-white p-7 text-center transition-[border-color,box-shadow] duration-300 will-change-transform [transform-style:preserve-3d] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-serv-700 before:to-serv-400 before:opacity-0 before:transition-opacity hover:border-serv-500/35 hover:shadow-[0_20px_56px_rgba(107,70,193,.15)] hover:before:opacity-100 sm:p-9" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="relative mb-5">
        <img src={f.image} alt={f.name} className="relative z-10 size-24 rounded-full border-[3px] border-white object-cover shadow-[0_4px_20px_rgba(107,70,193,.2)]" />
        <div className="pointer-events-none absolute -inset-[5px] rounded-full border-2 border-serv-300 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="mb-5 flex-1">
        <h3 className="mb-1.5 text-lg font-extrabold text-serv-900">{f.name}</h3>
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-serv-500">{f.role}</p>
        <ul className="flex flex-wrap justify-center gap-1.5">
          {f.skills.map(s => <li key={s} className="rounded-full border border-serv-500/15 bg-[#f4f2f8] px-3 py-1 text-xs font-semibold text-gray-600 transition group-hover:border-serv-500/30 group-hover:bg-serv-100 group-hover:text-serv-700">{s}</li>)}
        </ul>
      </div>
      <button className="w-full rounded-full border border-serv-500/35 px-6 py-2.5 text-sm font-bold text-serv-600 transition hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-serv-500 hover:to-serv-700 hover:text-white hover:shadow-md">Ver perfil →</button>
    </article>
  )
}

export default function Freelancers() {
  const navigate = useNavigate()
  return (
    <>
      <Header />
      <main>
        <PageHero
          tag="Talentos individuais"
          title="Freelancers"
          highlight="disponíveis"
          subtitle="Profissionais especializados prontos para colaborar no seu projeto. Contrate individualmente ou combine em uma Skill Pod."
        />

        <section className="bg-[#f4f2f8] py-16 sm:py-20 lg:py-24">
          <div className="container">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-7">
              {freelancers.map(f => <FreelancerCard key={f.id} f={f} />)}
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-gradient-to-br from-serv-950 to-serv-800 py-16 text-white sm:py-24">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-[min(500px,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(107,70,193,.4)_0%,transparent_70%)]" />
          <div className="container relative z-10 text-center">
            <h2 className="mb-3 text-3xl font-black leading-tight sm:text-4xl">Prefere uma equipe<br /><span className="bg-gradient-to-br from-serv-300 to-serv-200 bg-clip-text text-transparent">completa?</span></h2>
            <p className="mx-auto mb-8 max-w-xl text-white/65">Monte uma Skill Pod e tenha um time auto-gerido entregando do início ao fim.</p>
            <button className="rounded-full bg-white px-7 py-3.5 font-extrabold text-serv-700 transition hover:-translate-y-0.5 hover:shadow-xl" onClick={() => navigate('/skillpods')}>Ver Skill Pods →</button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
