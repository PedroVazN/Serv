import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import PageHero from '../../components/PageHero/PageHero'
import Carousel from '../../components/Carousel/Carousel'
import { carouselPods } from '../../data/skillPods'

const digitalCombos = [
  'Front-end + Back-end + DevOps',
  'UI/UX + Front-end + Back-end',
  'Full-Stack + DevOps + QA',
  'Mobile + Back-end + DevOps',
  'UI/UX + Front-end + Copywriting',
  'Data Engineer + Data Scientist + DevOps',
  'Front-end + Back-end + Mobile',
  'DevOps + Security + Back-end',
]

const presencialCombos = [
  'Pintor + Ajudante + Limpeza',
  'Pedreiro + Ajudante + Eletricista',
  'Encanador + Eletricista + Pedreiro',
  'Jardineiro + Ajudante + Limpeza',
  'Faxineiro + Ajudante + Organizador',
  'Garçom + Cozinheiro + Auxiliar',
  'Manobrista + Porteiro + Segurança',
  'Pedreiro + Encanador + Eletricista',
]

const compareRows = [
  ['Nº de profissionais', '1', '2–4'],
  ['Gestão', 'Você gerencia', 'Auto-gerida'],
  ['Escopo', 'Tarefas isoladas', 'Projeto completo'],
  ['Prazo', 'Variável', 'Definido'],
  ['Investimento', 'Por hora', 'Por projeto'],
]

export default function Contratar() {
  const navigate = useNavigate()

  return (
    <>
      <Header />
      <main>
        <PageHero
          tag="Comece pelo seu objetivo"
          title="Monte sua"
          highlight="equipe ideal."
          subtitle="Escolha uma equipe pronta ou combine especialistas que se complementam para cuidar do seu projeto."
        >
          <p className="text-sm leading-7 text-white/65">Projetos digitais, serviços presenciais e diferentes formas de trabalhar juntos.</p>
          <div className="mt-5 flex gap-8 border-t border-white/15 pt-5">
            <div><strong className="font-display text-3xl text-serv-200">01</strong><span className="mt-1 block text-xs text-white/55">especialista</span></div>
            <div><strong className="font-display text-3xl text-serv-200">02–04</strong><span className="mt-1 block text-xs text-white/55">equipe colaborativa</span></div>
          </div>
        </PageHero>

        <section aria-label="Skill Pods em destaque">
          <Carousel pods={carouselPods} />
        </section>

        <section className="bg-[#f7f5fa] py-14 sm:py-20 lg:py-24">
          <div className="container">
            <div className="mb-8 max-w-2xl sm:mb-12">
              <p className="text-sm font-semibold text-serv-600">Especialidades que combinam</p>
              <h2 className="mt-2 text-3xl font-bold leading-tight tracking-[-.045em] text-serv-950 sm:text-4xl">Um projeto completo precisa das pessoas certas.</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-2 lg:gap-7">
              <ComboCard title="Produtos e serviços digitais" badge="Remoto" image="/Assets/dev_front.png" combos={digitalCombos} />
              <ComboCard title="Serviços presenciais" badge="Na sua região" image="/Assets/pedreiro.png" combos={presencialCombos} />
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20 lg:py-24">
          <div className="container">
            <div className="mb-8 max-w-2xl sm:mb-12">
              <p className="text-sm font-semibold text-serv-600">Do seu jeito</p>
              <h2 className="mt-2 text-3xl font-bold leading-tight tracking-[-.045em] text-serv-950 sm:text-4xl">Uma pessoa ou um time?</h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-2 lg:gap-7">
              <article className="flex flex-col border border-serv-950/15 p-6 sm:p-9">
                <span className="text-sm font-semibold text-serv-600">Para uma necessidade pontual</span>
                <h3 className="mt-3 text-2xl font-bold text-serv-950">Freelancer individual</h3>
                <p className="mt-3 max-w-lg text-sm leading-7 text-serv-900/65">Trabalhe diretamente com um profissional especializado e acompanhe uma demanda específica.</p>
                <ul className="mt-6 grid gap-3 text-sm text-serv-900/75 sm:grid-cols-2">
                  {['Uma especialidade dedicada', 'Contratação flexível', 'Pagamento por hora ou projeto', 'Ideal para escopos enxutos'].map(item => <li key={item} className="flex gap-2"><span className="text-serv-600" aria-hidden="true">✓</span>{item}</li>)}
                </ul>
                <button type="button" className="mt-8 inline-flex min-h-12 items-center justify-between border-t border-serv-950/10 pt-4 text-left text-sm font-bold text-serv-950 transition-colors hover:text-serv-600" onClick={() => navigate('/freelancers')}>
                  Encontrar um profissional <span aria-hidden="true">↗</span>
                </button>
              </article>

              <article className="relative flex flex-col overflow-hidden bg-serv-950 p-6 text-white sm:p-9">
                <span className="absolute right-0 top-0 h-1 w-full bg-serv-200" aria-hidden="true" />
                <span className="text-sm font-semibold text-serv-200">Para um projeto de ponta a ponta</span>
                <h3 className="mt-3 text-2xl font-bold">Skill Pod</h3>
                <p className="mt-3 max-w-lg text-sm leading-7 text-white/65">Uma equipe com habilidades complementares que combina responsabilidades e trabalha em conjunto.</p>
                <ul className="mt-6 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
                  {['Especialistas que se completam', 'Gestão mais simples', 'Escopo e entregas alinhados', 'Ideal para projetos completos'].map(item => <li key={item} className="flex gap-2"><span className="text-serv-200" aria-hidden="true">✓</span>{item}</li>)}
                </ul>
                <button type="button" className="mt-8 inline-flex min-h-12 items-center justify-between border-t border-white/15 pt-4 text-left text-sm font-bold text-white transition-colors hover:text-serv-200" onClick={() => navigate('/skillpods')}>
                  Explorar Skill Pods <span aria-hidden="true">↗</span>
                </button>
              </article>
            </div>

            <div className="mt-12 overflow-hidden border border-serv-950/10 sm:mt-16">
              <div className="border-b border-serv-950/10 px-5 py-5 sm:px-8">
                <h3 className="text-xl font-bold text-serv-950">Compare os formatos</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[#f7f5fa] text-xs font-bold text-serv-900/65">
                      <th scope="col" className="px-4 py-4 sm:px-8">O que muda</th>
                      <th scope="col" className="px-4 py-4">Freelancer</th>
                      <th scope="col" className="px-4 py-4 text-serv-700">Skill Pod</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareRows.map(([feature, freelancer, pod]) => (
                      <tr key={feature} className="border-t border-serv-950/10">
                        <th scope="row" className="px-4 py-4 text-sm font-semibold text-serv-950 sm:px-8">{feature}</th>
                        <td className="px-4 py-4 text-sm text-serv-900/65">{freelancer}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-serv-700">{pod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function ComboCard({ title, badge, image, combos }) {
  return (
    <article className="overflow-hidden border border-serv-950/10 bg-white">
      <div className="relative h-44 overflow-hidden sm:h-52">
        <img src={image} alt="" aria-hidden="true" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-serv-950/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 sm:p-7">
          <h3 className="text-xl font-bold text-white sm:text-2xl">{title}</h3>
          <span className="border border-white/40 bg-serv-950/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{badge}</span>
        </div>
      </div>
      <ul className="grid gap-x-7 px-5 py-4 sm:grid-cols-2 sm:px-7 sm:py-6">
        {combos.map((combo, index) => (
          <li key={combo} className="flex gap-3 border-b border-serv-950/10 py-3 text-sm leading-6 text-serv-900/75 last:border-0 sm:[&:nth-last-child(2)]:border-0">
            <span className="font-display text-xs font-bold text-serv-500">{String(index + 1).padStart(2, '0')}</span>
            {combo}
          </li>
        ))}
      </ul>
    </article>
  )
}
