import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import PageHero from '../../components/PageHero/PageHero'
import { freelancers } from '../../data/skillPods'

function FreelancerCard({ freelancer }) {
  const navigate = useNavigate()

  return (
    <article className="group grid overflow-hidden border border-serv-950/10 bg-white transition-colors hover:border-serv-500/35 sm:grid-cols-[.78fr_1.22fr]">
      <div className="relative min-h-56 overflow-hidden bg-serv-900 sm:min-h-0">
        <img src={freelancer.image} alt={freelancer.name} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-serv-950/65 to-transparent" />
      </div>
      <div className="flex flex-col p-5 sm:p-6 lg:p-7">
        <div className="mb-5">
          <p className="text-xs font-semibold text-serv-600">{freelancer.role}</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-serv-950 sm:text-2xl">{freelancer.name}</h2>
        </div>
        <ul className="mb-7 flex flex-wrap gap-2" aria-label={`Especialidades de ${freelancer.name}`}>
          {freelancer.skills.map(skill => <li key={skill} className="border border-serv-950/10 bg-[#f7f5fa] px-2.5 py-1.5 text-xs font-medium text-serv-900/70">{skill}</li>)}
        </ul>
        <button type="button" className="mt-auto inline-flex min-h-11 items-center justify-between border-t border-serv-950/10 pt-4 text-left text-sm font-bold text-serv-950 transition-colors hover:text-serv-600" onClick={() => navigate('/contratar')}>
          Conversar sobre um projeto <span aria-hidden="true">↗</span>
        </button>
      </div>
    </article>
  )
}

export default function Freelancers() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          tag="Talentos individuais"
          title="Freelancers"
          highlight="para seu projeto."
          subtitle="Conheça profissionais especializados e encontre a experiência que falta para sua próxima entrega."
        >
          <p className="text-sm leading-7 text-white/65">Profissionais disponíveis para atuar individualmente ou somar forças em uma Skill Pod.</p>
          <p className="mt-5 font-display text-4xl font-bold tracking-tight text-serv-200">{String(freelancers.length).padStart(2, '0')} <span className="font-sans text-sm font-medium tracking-normal text-white/55">perfis no diretório</span></p>
        </PageHero>

        <section className="bg-[#f7f5fa] py-14 sm:py-20 lg:py-24">
          <div className="container">
            <div className="mb-8 flex flex-col gap-2 border-b border-serv-950/15 pb-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-serv-600">Diretório de talentos</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-serv-950 sm:text-3xl">Conheça quem pode colaborar</h2>
              </div>
              <p className="text-sm text-serv-900/55">Escolha um perfil para iniciar seu projeto.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
              {freelancers.map(freelancer => <FreelancerCard key={freelancer.id} freelancer={freelancer} />)}
            </div>
          </div>
        </section>

        <section className="bg-serv-200 py-12 sm:py-16">
          <div className="container grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-sm font-semibold text-serv-700">Mais habilidades, em sintonia</p>
              <h2 className="mt-2 max-w-2xl text-2xl font-bold leading-tight tracking-tight text-serv-950 sm:text-3xl">Às vezes, o melhor profissional é uma equipe inteira.</h2>
            </div>
            <Link to="/skillpods" className="inline-flex min-h-12 items-center justify-between gap-6 border border-serv-950 px-5 text-sm font-bold text-serv-950 transition-colors hover:bg-serv-950 hover:text-white">
              Ver Skill Pods <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
