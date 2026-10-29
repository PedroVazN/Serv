import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header    from '../../components/Header/Header'
import Footer    from '../../components/Footer/Footer'
import SectionTag from '../../components/SectionTag/SectionTag'
import PodCard   from '../../components/PodCard/PodCard'
import PerspectiveTunnelHero from '../../components/PerspectiveTunnelHero/PerspectiveTunnelHero'
import { catalogPods } from '../../data/skillPods'

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <Header />

      <PerspectiveTunnelHero />

      {/* ── COMO FUNCIONA ── */}
      <section className="bg-gradient-to-b from-serv-950 to-serv-900 py-16 sm:py-20 lg:py-28">
        <div className="container text-center">
          <SectionTag>Como funciona</SectionTag>
          <h2 className="mb-10 text-3xl font-black leading-tight tracking-tight sm:mb-14 sm:text-4xl md:mb-16">
            Do briefing à entrega<br />
            <span className="bg-gradient-to-br from-serv-300 to-serv-100 bg-clip-text text-transparent">em 3 passos</span>
          </h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {[
              { n:'01', icon:'🎯', title:'Escolha sua Pod',   desc:'Selecione uma Skill Pod pré-montada com as habilidades que seu projeto precisa.' },
              { n:'02', icon:'🤝', title:'Alinhe o escopo',   desc:'A equipe já se conhece. Você apresenta o projeto e eles definem o plano.' },
              { n:'03', icon:'🚀', title:'Receba o resultado', desc:'Acompanhe em tempo real. Prazo definido, gestão simplificada, entrega garantida.' },
            ].map(s => (
              <article key={s.n} className="relative rounded-[28px] border border-white/10 bg-white/[.04] p-7 text-center transition duration-300 hover:-translate-y-1.5 hover:border-serv-500/40 hover:bg-serv-500/10 hover:shadow-purple sm:p-9">
                <span className="absolute right-5 top-5 text-xs font-extrabold tracking-widest text-serv-300/60">{s.n}</span>
                <div className="mb-5 text-5xl" aria-hidden="true">{s.icon}</div>
                <h3 className="mb-3 text-xl font-bold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-white/65">{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PODS SHOWCASE ── */}
      <section className="bg-serv-950 py-16 sm:py-20 lg:py-28">
        <div className="container">
          <div className="text-center">
            <SectionTag>Skill Pods em destaque</SectionTag>
            <h2 className="mb-10 text-3xl font-black leading-tight tracking-tight sm:mb-14 sm:text-4xl md:mb-16">
              Equipes prontas para<br />
              <span className="bg-gradient-to-br from-serv-300 to-serv-100 bg-clip-text text-transparent">qualquer desafio</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
            {catalogPods.slice(0, 6).map(pod => (
              <PodCard key={pod.id} pod={pod} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <button className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-serv-400 to-serv-600 px-7 py-3.5 font-bold text-white shadow-purple transition hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(107,70,193,.5)]" onClick={() => navigate('/skillpods')}>
              Ver todas as Skill Pods <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── COMPARATIVO ── */}
      <section className="bg-gradient-to-b from-serv-950 to-serv-900 py-16 sm:py-20 lg:py-28">
        <div className="container text-center">
          <SectionTag>Por que Skill Pods?</SectionTag>
          <h2 className="mb-10 text-3xl font-black leading-tight tracking-tight sm:mb-14 sm:text-4xl md:mb-16">
            Uma nova forma de<br />
            <span className="bg-gradient-to-br from-serv-300 to-serv-100 bg-clip-text text-transparent">contratar talentos</span>
          </h2>
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-5 text-left md:grid-cols-[1fr_auto_1fr] md:gap-8">
            <div className="rounded-[28px] border border-white/10 bg-white/[.03] p-7 sm:p-10">
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-white/45">Modelo tradicional</div>
              <h3 className="mb-6 text-2xl font-extrabold">Freelancers avulsos</h3>
              <ul className="flex flex-col gap-3.5">{['Você gerencia cada profissional','Habilidades fragmentadas','Prazo incerto','Comunicação descoordenada','Escopo de tarefas isoladas'].map(t => <li key={t} className="flex gap-3 text-sm text-white/70"><span className="text-white/35">✕</span>{t}</li>)}</ul>
            </div>
            <div className="text-center text-xl font-black text-white/25">VS</div>
            <div className="rounded-[28px] border-2 border-serv-500/40 bg-serv-500/10 p-7 shadow-purple sm:p-10">
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-serv-300">SERV+</div>
              <h3 className="mb-6 text-2xl font-extrabold">Skill Pods</h3>
              <ul className="flex flex-col gap-3.5">{['Equipe auto-gerida','Habilidades complementares','Prazo definido e garantido','Comunicação integrada','Projetos completos do início ao fim'].map(t => <li key={t} className="flex gap-3 text-sm text-white/80"><span className="text-emerald-400">✓</span>{t}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="bg-serv-950 py-16 sm:py-20 lg:py-28">
        <div className="container text-center">
          <SectionTag>Depoimentos</SectionTag>
          <h2 className="mb-10 text-3xl font-black leading-tight tracking-tight sm:mb-14 sm:text-4xl md:mb-16">
            O que dizem nossos<br />
            <span className="bg-gradient-to-br from-serv-300 to-serv-100 bg-clip-text text-transparent">clientes</span>
          </h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 text-left lg:grid-cols-3 lg:gap-6">
            {[
              { init:'M', name:'Marcos Henrique', role:'CEO, Loja Moderna', text:'"Contratei a Web Excellence Pod para refazer meu e-commerce. Em 3 semanas tinha tudo pronto, funcionando e lindo."', feat: false },
              { init:'A', name:'Ana Beatriz',     role:'Head of Data, FinTech SP', text:'"A Data Insights Pod transformou como tomamos decisões. Entregaram um dashboard completo com análises preditivas em menos de um mês."', feat: true },
              { init:'R', name:'Rafael Torres',   role:'Founder, DeliveryNow', text:'"Meu app de delivery saiu do papel em 6 semanas com a Mobile Rockets. A equipe é incrível — entregam com qualidade."', feat: false },
            ].map(t => (
              <article key={t.name} className={`rounded-[28px] border p-6 transition hover:-translate-y-1 hover:border-serv-500/40 sm:p-9 ${t.feat ? 'border-serv-500/30 bg-serv-500/10' : 'border-white/10 bg-white/[.04]'}`}>
                <div className="mb-4 tracking-widest text-amber-400" aria-label="5 de 5 estrelas">★★★★★</div>
                <p className="mb-6 text-sm italic leading-relaxed text-white/75">{t.text}</p>
                <div className="flex items-center gap-3.5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-serv-500 to-serv-700 font-extrabold">{t.init}</div>
                  <div><strong className="block text-sm">{t.name}</strong><span className="text-xs text-white/50">{t.role}</span></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-serv-950 to-serv-900 py-20 sm:py-28" id="cadastro">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-96 w-[min(600px,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(107,70,193,.3)_0%,transparent_70%)]" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-5 text-4xl font-black leading-tight sm:text-5xl">
            Pronto para montar<br />
            <span className="bg-gradient-to-br from-serv-300 to-serv-100 bg-clip-text text-transparent">sua equipe ideal?</span>
          </h2>
          <p className="mb-8 text-base text-white/65 sm:text-lg">Comece hoje. Sem mensalidades, sem burocracia — só talento e resultado.</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-serv-400 to-serv-600 px-7 py-3.5 font-bold text-white shadow-purple transition hover:-translate-y-0.5" onClick={() => navigate('/contratar')}>Montar minha Skill Pod <span>→</span></button>
            <button className="rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition hover:border-white/50 hover:bg-white/10" onClick={() => navigate('/freelancers')}>Explorar Freelancers</button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Relógio */}
      <Clock />
    </>
  )
}

function Clock() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false }))
      setDate(now.toLocaleDateString('pt-BR', { weekday:'short', day:'2-digit', month:'short' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="fixed bottom-3 right-3 z-[500] rounded-serv border border-serv-500/30 bg-serv-950/90 px-4 py-3 text-center shadow-lg backdrop-blur-xl sm:bottom-6 sm:right-6 sm:px-5">
      <div className="mb-0.5 bg-gradient-to-br from-white to-serv-200 bg-clip-text text-xl font-extrabold text-transparent">{time}</div>
      <div className="text-xs capitalize text-white/50">{date}</div>
    </div>
  )
}
