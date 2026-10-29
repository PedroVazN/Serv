export default function TiltedGridHero({ images = [], children, className = '' }) {
  const loop = images.length ? [...images, ...images] : []

  return (
    <section className={`relative isolate grid min-h-[510px] place-items-center overflow-hidden pb-12 pt-32 text-white [perspective:1100px] sm:min-h-[550px] sm:pb-16 sm:pt-36 [background:radial-gradient(ellipse_at_65%_70%,rgba(107,70,193,.28),transparent_55%),linear-gradient(135deg,#1a0f2e,#302050_58%,#170d29)] ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-[.18] [background-image:linear-gradient(rgba(196,181,253,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(196,181,253,.14)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)]" />
      <span aria-hidden="true" className="pointer-events-none absolute -right-12 bottom-[-.45em] -z-10 select-none font-display text-[min(46vw,30rem)] font-bold leading-none tracking-[-.12em] text-white/[.035]">+</span>
      {loop.length > 0 && <div className="pointer-events-none absolute inset-0 z-0 opacity-45 [transform-style:flat] [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-hidden="true">
        {loop.map((image, index) => (
          <article className="absolute left-1/2 top-[56%] aspect-[16/10] w-[clamp(170px,22vw,280px)] animate-orbit overflow-hidden rounded-2xl border border-purple-100/40 bg-[#30204b] shadow-[0_22px_55px_rgba(8,3,20,.45)] [backface-visibility:hidden] [transform-style:preserve-3d] [animation-delay:calc(var(--index)*-4s)] motion-reduce:animate-none max-[760px]:w-[clamp(150px,52vw,230px)]" key={`${image.title}-${index}`} style={{ '--index': index }}>
            <img src={image.image} alt="" className="block size-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#140a23]/90 to-transparent px-3.5 pb-3 pt-8 text-xs font-extrabold uppercase tracking-wide text-white">{image.title}</span>
          </article>
        ))}
      </div>}
      <div className="container relative z-10 w-full max-w-[1000px] py-8 text-center">{children}</div>
    </section>
  )
}
