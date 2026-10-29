import { useNavigate } from 'react-router-dom'
import Header   from '../../components/Header/Header'
import Footer   from '../../components/Footer/Footer'
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
      <main className="bg-[#f4f2f8]">
        <PageHero
          tag="Contratação"
          title="Monte sua"
          highlight="Skill Pod"
          subtitle="Escolha a equipe certa para o seu projeto. Cada Pod é pré-montada com especialistas que se complementam."
        />

        {/* Carrossel */}
        <Carousel pods={carouselPods} />

        {/* Categorias */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container">
            <span className="mb-4 inline-flex rounded-full border border-serv-500/25 bg-serv-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-serv-600">Todas as combinações</span>
            <h2 className="mb-10 text-3xl font-black leading-tight text-serv-900 sm:mb-12 sm:text-4xl">Encontre a combinação<br /><span className="bg-gradient-to-br from-serv-600 to-serv-400 bg-clip-text text-transparent">certa para você</span></h2>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-7">
              <CatCard title="Skill Pods Digitais"   badge="Remoto"     badgeAlt={false} icon="/Assets/pessoa1.svg" combos={digitalCombos} />
              <CatCard title="Skill Pods Presenciais" badge="Presencial" badgeAlt={true}  icon="/Assets/pessoa2.svg" combos={presencialCombos} />
            </div>
          </div>
        </section>

        {/* Freelancer vs Pod */}
        <section className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="container">
            <span className="mb-4 inline-flex rounded-full border border-serv-500/25 bg-serv-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-serv-600">Escolha seu modelo</span>
            <h2 className="mb-10 text-3xl font-black leading-tight text-serv-900 sm:mb-12 sm:text-4xl">Como prefere<br /><span className="bg-gradient-to-br from-serv-600 to-serv-400 bg-clip-text text-transparent">contratar?</span></h2>
            <div className="mb-10 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
              <div className="relative flex flex-col overflow-hidden rounded-[28px] border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(107,70,193,.1)] sm:p-10">
                <div className="mb-4 text-4xl">👤</div>
                <h3 className="mb-3 text-xl font-extrabold text-serv-900">Freelancer Individual</h3>
                <p className="mb-6 text-sm leading-relaxed text-gray-500">Ideal para tarefas pontuais e específicas. Você escolhe um profissional e gerencia o trabalho.</p>
                <ul className="mb-7 flex flex-col gap-2.5 text-sm text-gray-700">
                  {['Profissional especializado','Contratação flexível','Pagamento por hora ou projeto','Perfeito para escopo reduzido'].map(f=><li key={f}><span className="mr-2 text-serv-500">✓</span>{f}</li>)}
                </ul>
                <button className="mt-auto w-full rounded-full border-2 border-serv-500/40 px-7 py-3.5 text-sm font-bold text-serv-700 transition hover:-translate-y-0.5 hover:bg-serv-500/5" onClick={() => navigate('/freelancers')}>Explorar Freelancers →</button>
              </div>
              <div className="relative flex flex-col overflow-hidden rounded-[28px] border-2 border-serv-500/30 bg-gradient-to-br from-purple-50 to-serv-100 p-6 shadow-[0_8px_32px_rgba(107,70,193,.12)] transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(107,70,193,.2)] sm:p-10">
                <span className="absolute right-4 top-4 rounded-full bg-gradient-to-br from-serv-600 to-serv-400 px-3.5 py-1.5 text-[.7rem] font-bold uppercase tracking-wide text-white sm:right-5 sm:top-5">Recomendado</span>
                <div className="mb-4 text-4xl">👥</div>
                <h3 className="mb-3 text-xl font-extrabold text-serv-900">Skill Pod</h3>
                <p className="mb-6 text-sm leading-relaxed text-gray-500">Equipe completa, auto-gerida, com habilidades complementares. Do início ao fim, sem complicação.</p>
                <ul className="mb-7 flex flex-col gap-2.5 text-sm text-gray-700">
                  {['Equipe pré-selecionada','Habilidades complementares','Gestão simplificada','Ideal para projetos completos'].map(f=><li key={f}><span className="mr-2 text-serv-500">✓</span>{f}</li>)}
                </ul>
                <button className="mt-auto w-full rounded-full bg-gradient-to-br from-serv-500 to-serv-700 px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(107,70,193,.4)]" onClick={() => navigate('/skillpods')}>Explorar Skill Pods →</button>
              </div>
            </div>

            {/* Tabela */}
            <div className="rounded-[28px] border border-gray-200 bg-gray-50 p-5 sm:p-10">
              <h3 className="mb-6 text-xl font-extrabold text-serv-900">Comparativo rápido</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-gray-100 px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-700 sm:px-5">Característica</th>
                      <th className="border-b border-gray-100 px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-700 sm:px-5">Freelancer</th>
                      <th className="border-b border-gray-100 px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-serv-600 sm:px-5">Skill Pod</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareRows.map(([feat, fl, sp]) => (
                      <tr key={feat}>
                        <td className="border-b border-gray-100 px-3 py-3.5 text-sm text-gray-700 sm:px-5">{feat}</td>
                        <td className="border-b border-gray-100 px-3 py-3.5 text-sm text-gray-700 sm:px-5">{fl}</td>
                        <td className="border-b border-gray-100 px-3 py-3.5 text-sm font-bold text-serv-700 sm:px-5">{sp}</td>
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

function CatCard({ title, badge, badgeAlt, icon, combos }) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-serv-500/10 bg-white p-6 shadow-[0_4px_24px_rgba(107,70,193,.08)] transition hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(107,70,193,.15)] sm:p-10 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-serv-700 before:to-serv-400">
      <div className="mb-7 flex items-center gap-4">
        <img src={icon} alt="" aria-hidden="true" className="size-14 object-contain" />
        <div>
          <h3 className="mb-1.5 text-lg font-extrabold text-serv-900">{title}</h3>
          <span className={`rounded-full border px-2.5 py-1 text-[.72rem] font-bold uppercase tracking-wide ${badgeAlt ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-600' : 'border-serv-500/20 bg-serv-500/10 text-serv-600'}`}>{badge}</span>
        </div>
      </div>
      <ul className="flex flex-col">
        {combos.map(c => <li key={c} className="relative border-b border-gray-100 py-3 pl-6 text-sm text-gray-600 transition last:border-0 before:absolute before:left-0 before:text-xs before:font-bold before:text-serv-400 before:content-['→'] hover:pl-[30px] hover:text-serv-700">{c}</li>)}
      </ul>
    </div>
  )
}
