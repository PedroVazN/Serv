import SectionTag from '../SectionTag/SectionTag'

export default function PageHero({ tag, title, highlight, subtitle, children }) {
  return (
    <section className="relative isolate overflow-hidden bg-serv-950 pb-14 pt-32 text-white sm:pb-20 sm:pt-36 lg:pb-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-[.14] [background-image:linear-gradient(rgba(196,181,253,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(196,181,253,.25)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:linear-gradient(100deg,#000,transparent_80%)]" />
      <span aria-hidden="true" className="pointer-events-none absolute -right-12 top-12 -z-10 font-display text-[22rem] font-bold leading-none text-white/[.035]">+</span>
      <div className="container grid items-end gap-10 md:grid-cols-[1.2fr_.8fr] lg:gap-16">
        <div className="max-w-3xl">
          {tag && <SectionTag>{tag}</SectionTag>}
          <h1 className="max-w-[12ch] text-[clamp(3.4rem,8vw,6.3rem)] font-bold leading-[.94] tracking-[-.075em] text-white">
            {title}<span className="block text-serv-200">{highlight}</span>
          </h1>
          {subtitle && <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">{subtitle}</p>}
        </div>
        <aside className="min-h-36 border-l border-serv-200/25 pl-6 md:mb-1 md:pl-8">
          {children || <p className="max-w-xs text-sm leading-7 text-white/60">Pessoas com experiência e habilidades que se completam, reunidas para fazer o trabalho avançar.</p>}
        </aside>
      </div>
    </section>
  )
}
