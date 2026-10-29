import SectionTag from '../SectionTag/SectionTag'

export default function PageHero({ tag, title, highlight, subtitle, children }) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-serv-950 via-serv-900 to-serv-800 py-16 text-center text-white sm:py-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[min(600px,100vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(107,70,193,.4)_0%,transparent_70%)]" />
      <div className="container relative z-10">
        {tag && <SectionTag>{tag}</SectionTag>}
        <h1 className="mb-4 text-4xl font-black leading-[1.1] sm:text-5xl md:text-[3.2rem]">
          {title}<br />
          <span className="bg-gradient-to-br from-serv-300 to-serv-200 bg-clip-text text-transparent">{highlight}</span>
        </h1>
        {subtitle && <p className="mx-auto max-w-[520px] text-base leading-relaxed text-white/65">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}
