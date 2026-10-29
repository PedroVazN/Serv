import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import PodCard from '../../components/PodCard/PodCard'
import { catalogPods, freelancers } from '../../data/skillPods'

const featuredPods = ['web-excellence', 'data-insights', 'construcao-premium']
  .map(id => catalogPods.find(pod => pod.id === id))
  .filter(Boolean)

const processSteps = [
  { title: 'Escolha sua equipe', description: 'Encontre uma Skill Pod pronta para as necessidades do seu projeto.' },
  { title: 'Alinhe o trabalho', description: 'Converse com os especialistas e combine o escopo e as entregas.' },
  { title: 'Faça acontecer', description: 'Acompanhe sua equipe trabalhando em direção ao resultado.' },
]

const testimonials = [
  { initial: 'M', name: 'Marcos Henrique', role: 'CEO, Loja Moderna', quote: 'Contratei a Web Excellence Pod para refazer meu e-commerce. Em três semanas tinha tudo pronto, funcionando e lindo.' },
  { initial: 'A', name: 'Ana Beatriz', role: 'Head of Data, FinTech SP', quote: 'A Data Insights Pod transformou como tomamos decisões. Entregaram um dashboard completo em menos de um mês.' },
  { initial: 'R', name: 'Rafael Torres', role: 'Founder, DeliveryNow', quote: 'Meu app de delivery saiu do papel em seis semanas. A equipe é incrível e entrega com qualidade.' },
]

const faqs = [
  { question: 'O que é uma Skill Pod?', answer: 'É uma equipe com profissionais de habilidades complementares, reunida para trabalhar em um projeto ou desafio específico.' },
  { question: 'Posso contratar apenas uma pessoa?', answer: 'Sim. Você pode encontrar um freelancer para uma demanda específica ou escolher uma equipe completa.' },
  { question: 'Há serviços presenciais?', answer: 'Sim. O catálogo tem equipes digitais e presenciais, incluindo opções de construção e reforma.' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <Header />
      <main className="overflow-hidden bg-[#f7f5fa] text-serv-950">
        <section className="relative isolate">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(rgba(85,60,154,.12)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(110deg,#000,transparent_75%)]" />
          <div className="container grid min-h-[690px] items-center gap-12 pb-16 pt-32 sm:pt-36 lg:min-h-[780px] lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:pb-20">
            <div className="max-w-3xl">
              <p className="mb-6 flex items-center gap-3 text-sm font-semibold text-serv-600">
                <span aria-hidden="true" className="h-px w-8 bg-serv-500" />
                Talentos que trabalham juntos
              </p>
              <h1 className="font-display text-[clamp(3.6rem,8.2vw,7.25rem)] font-bold leading-[.88] tracking-[-.09em] text-serv-950">
                Monte o time.<br /><span className="text-serv-600">Faça acontecer.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-serv-900/70 sm:text-lg sm:leading-8">
                Encontre profissionais que combinam com seu projeto — em equipes digitais ou presenciais, prontas para colaborar.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" onClick={() => navigate('/skillpods')} className="inline-flex min-h-12 items-center justify-center gap-5 bg-serv-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-serv-950">
                  Explorar Skill Pods <span aria-hidden="true">↗</span>
                </button>
                <button type="button" onClick={() => navigate('/freelancers')} className="inline-flex min-h-12 items-center justify-center border border-serv-950/20 px-6 py-3 text-sm font-bold text-serv-950 transition-colors hover:border-serv-950 hover:bg-white">
                  Encontrar um profissional
                </button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-serv-950/15 pt-6">
                <Metric number={String(catalogPods.length).padStart(2, '0')} label="equipes no catálogo" />
                <Metric number={String(freelancers.length).padStart(2, '0')} label="profissionais" />
                <Metric number="02" label="formatos de trabalho" />
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[590px] lg:ml-auto">
              <div aria-hidden="true" className="absolute -right-7 -top-7 z-0 size-28 border border-serv-500/25 sm:-right-10 sm:-top-10 sm:size-36" />
              <figure className="relative z-10 overflow-hidden border-[8px] border-white bg-serv-900 shadow-[0_28px_70px_rgba(42,27,61,.2)] sm:border-[12px]">
                <div className="relative aspect-[.92] sm:aspect-[1.04]">
                  <img src="/Assets/dev_front.png" alt="Espaço de trabalho de desenvolvimento de software" className="size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-serv-950/90 via-transparent to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                    <span className="text-xs font-semibold text-serv-200">Equipe digital</span>
                    <strong className="mt-1 block font-display text-3xl font-bold tracking-tight sm:text-4xl">Web Excellence</strong>
                    <span className="mt-2 block max-w-sm text-sm leading-6 text-white/75">Do design à entrega de um produto digital completo.</span>
                    <button type="button" onClick={() => navigate('/contratar')} className="mt-5 border-b border-serv-200 pb-1 text-sm font-bold text-white transition-colors hover:text-serv-200">Conhecer a equipe <span aria-hidden="true">↗</span></button>
                  </figcaption>
                </div>
              </figure>
              <div className="absolute -bottom-5 -left-3 z-20 hidden items-center gap-3 border border-serv-950/10 bg-white px-4 py-3 shadow-lg sm:flex sm:-bottom-6 sm:-left-7">
                <div className="flex -space-x-2" aria-hidden="true">
                  {['/Assets/freelancer1.jpg', '/Assets/freelancer2.jpg', '/Assets/freelancer3.jpg'].map((src, index) => <img key={src} src={src} alt="" className="size-9 border-2 border-white object-cover" style={{ zIndex: 3 - index }} />)}
                </div>
                <span className="text-xs font-bold text-serv-900">Uma equipe, várias habilidades</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-serv-950/10 bg-white py-12 sm:py-16">
          <div className="container grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-start lg:gap-16">
            <div>
              <p className="text-sm font-semibold text-serv-600">Um jeito mais simples de trabalhar</p>
              <h2 className="mt-2 max-w-md text-3xl font-bold leading-tight tracking-[-.05em] text-serv-950 sm:text-4xl">Da ideia ao resultado, em equipe.</h2>
            </div>
            <div className="grid gap-0 sm:grid-cols-3">
              {processSteps.map((step, index) => (
                <article key={step.title} className="border-t border-serv-950/15 py-5 sm:border-l sm:border-t-0 sm:px-5 sm:py-0 first:sm:border-l-0 first:sm:pl-0 last:sm:pr-0">
                  <span className="font-display text-sm font-bold text-serv-500">0{index + 1}</span>
                  <h3 className="mt-3 text-lg font-bold text-serv-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-serv-900/60">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f5fa] py-16 sm:py-20 lg:py-24">
          <div className="container">
            <div className="mb-8 flex flex-col gap-5 sm:mb-10 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-serv-600">Seleção SERV+</p>
                <h2 className="mt-2 text-3xl font-bold leading-tight tracking-[-.05em] text-serv-950 sm:text-4xl lg:text-5xl">Gente boa, pronta para colaborar.</h2>
              </div>
              <button type="button" onClick={() => navigate('/skillpods')} className="inline-flex w-fit items-center gap-4 border-b border-serv-500/35 pb-2 text-sm font-bold text-serv-700 transition-colors hover:border-serv-950 hover:text-serv-950">
                Ver todas as equipes <span aria-hidden="true">↗</span>
              </button>
            </div>
            <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
              {featuredPods.map(pod => <PodCard key={pod.id} pod={pod} />)}
            </div>
          </div>
        </section>

        <section className="bg-serv-950 py-16 text-white sm:py-20 lg:py-24">
          <div className="container grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
            <div>
              <p className="text-sm font-semibold text-serv-200">Por que trabalhar em equipe?</p>
              <h2 className="mt-3 max-w-lg text-3xl font-bold leading-tight tracking-[-.05em] sm:text-4xl">As habilidades certas se encontram no mesmo projeto.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/60 sm:text-base">Uma Skill Pod aproxima especialistas para dividir responsabilidades e construir a entrega em conjunto.</p>
              <button type="button" onClick={() => navigate('/contratar')} className="mt-7 inline-flex min-h-11 items-center gap-5 border border-white/30 px-5 text-sm font-bold transition-colors hover:border-serv-200 hover:text-serv-200">
                Como contratar <span aria-hidden="true">↗</span>
              </button>
            </div>
            <div className="divide-y divide-white/15 border-y border-white/15">
              {[
                ['Competências que se completam', 'Especialistas de diferentes áreas colaboram no mesmo objetivo.'],
                ['Um plano mais claro', 'As etapas, responsabilidades e entregas são alinhadas com a equipe.'],
                ['Mais opções para o seu projeto', 'Escolha entre soluções digitais, serviços presenciais ou profissionais individuais.'],
              ].map(([title, text]) => (
                <article key={title} className="grid gap-2 py-5 sm:grid-cols-[.8fr_1.2fr] sm:gap-6 sm:py-6">
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <p className="text-sm leading-6 text-white/60">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="container">
            <div className="mb-8 max-w-2xl sm:mb-10">
              <p className="text-sm font-semibold text-serv-600">Onde você precisa de ajuda?</p>
              <h2 className="mt-2 text-3xl font-bold leading-tight tracking-[-.05em] text-serv-950 sm:text-4xl">Trabalho digital ou presencial.</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <ServiceCard image="/Assets/marketing_dig.png" label="Digital" title="Construa sua presença online" description="Desenvolvimento, design, dados e marketing reunidos para o seu produto." onClick={() => navigate('/skillpods')} />
              <ServiceCard image="/Assets/pedreiro.png" label="Presencial" title="Transforme seu espaço" description="Profissionais para construção, reformas e serviços realizados de perto." onClick={() => navigate('/skillpods')} />
            </div>
          </div>
        </section>

        <section className="bg-[#eeeaf5] py-16 sm:py-20 lg:py-24">
          <div className="container">
            <div className="mb-8 max-w-2xl sm:mb-10">
              <p className="text-sm font-semibold text-serv-600">Experiências compartilhadas</p>
              <h2 className="mt-2 text-3xl font-bold leading-tight tracking-[-.05em] text-serv-950 sm:text-4xl">Projetos que saíram do papel.</h2>
            </div>
            <div className="grid gap-0 border-y border-serv-950/15 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <figure key={testimonial.name} className={`flex flex-col py-6 sm:py-8 lg:px-7 ${index > 0 ? 'border-t border-serv-950/15 lg:border-l lg:border-t-0' : ''} ${index > 0 ? 'lg:pl-7' : 'lg:pl-0'} ${index < testimonials.length - 1 ? 'lg:pr-7' : 'lg:pr-0'}`}>
                  <blockquote className="flex-1 text-base leading-7 text-serv-900/80">“{testimonial.quote}”</blockquote>
                  <figcaption className="mt-7 flex items-center gap-3 border-t border-serv-950/10 pt-4">
                    <span className="grid size-10 shrink-0 place-items-center bg-serv-700 font-display font-bold text-white">{testimonial.initial}</span>
                    <span><strong className="block text-sm text-serv-950">{testimonial.name}</strong><span className="text-xs text-serv-900/55">{testimonial.role}</span></span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="container grid gap-8 md:grid-cols-[.75fr_1.25fr] md:gap-16">
            <div>
              <p className="text-sm font-semibold text-serv-600">Perguntas frequentes</p>
              <h2 className="mt-2 max-w-sm text-3xl font-bold leading-tight tracking-[-.05em] text-serv-950 sm:text-4xl">O que você precisa saber.</h2>
            </div>
            <div className="divide-y divide-serv-950/15 border-y border-serv-950/15">
              {faqs.map(faq => (
                <details key={faq.question} className="group py-5 sm:py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-bold text-serv-950 marker:content-none sm:text-lg">
                    {faq.question}
                    <span className="grid size-8 shrink-0 place-items-center border border-serv-950/20 font-normal text-serv-700 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="max-w-2xl pr-10 pt-4 text-sm leading-7 text-serv-900/65">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-serv-200 py-14 sm:py-20">
          <div className="container grid gap-7 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-serv-700">Seu próximo projeto começa aqui</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-.055em] text-serv-950 sm:text-4xl lg:text-5xl">Encontre as pessoas que vão fazer acontecer.</h2>
            </div>
            <button type="button" onClick={() => navigate('/contratar')} className="inline-flex min-h-12 items-center justify-between gap-8 bg-serv-950 px-6 text-sm font-bold text-white transition-colors hover:bg-serv-700">
              Montar minha equipe <span aria-hidden="true">↗</span>
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function Metric({ number, label }) {
  return (
    <div className="flex items-baseline gap-2">
      <strong className="font-display text-2xl font-bold tracking-tight text-serv-950">{number}</strong>
      <span className="text-xs font-medium text-serv-900/55 sm:text-sm">{label}</span>
    </div>
  )
}

function ServiceCard({ image, label, title, description, onClick }) {
  return (
    <button type="button" onClick={onClick} className="group relative isolate min-h-[320px] overflow-hidden bg-serv-900 text-left text-white sm:min-h-[390px]">
      <img src={image} alt="" aria-hidden="true" className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-serv-950/90 via-serv-950/25 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
        <span className="text-sm font-semibold text-serv-200">{label}</span>
        <span className="mt-2 block max-w-md font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</span>
        <span className="mt-2 block max-w-md text-sm leading-6 text-white/75">{description}</span>
        <span className="mt-5 inline-flex items-center gap-4 border-b border-white/45 pb-1 text-sm font-bold">Explorar opções <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span></span>
      </span>
    </button>
  )
}
