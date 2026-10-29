export default function TiltedGridHero({ images = [], children, className = '' }) {
  const loop = images.length ? [...images, ...images] : []
  return (
    <section className={`relative isolate grid h-[min(72vh,680px)] min-h-[560px] place-items-center overflow-hidden text-white [perspective:1100px] max-[760px]:h-[620px] max-[760px]:min-h-[620px] [background:radial-gradient(ellipse_at_50%_46%,rgba(107,70,193,.42),transparent_62%),linear-gradient(135deg,#1a0f2e,#302050_55%,#170d29)] ${className}`}>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[.22] [background-image:linear-gradient(rgba(196,181,253,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(196,181,253,.12)_1px,transparent_1px)] [background-size:36px_36px] [mask-image:linear-gradient(90deg,transparent,#000_16%,#000_84%,transparent)]" aria-hidden="true" />
      {loop.length > 0 && <div className="pointer-events-none absolute inset-0 z-0 opacity-45 [transform-style:flat] [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-hidden="true">
        {loop.map((image, index) => (
          <article className="absolute left-1/2 top-[56%] aspect-[16/10] w-[clamp(170px,22vw,280px)] animate-orbit overflow-hidden rounded-2xl border border-purple-100/40 bg-[#30204b] shadow-[0_22px_55px_rgba(8,3,20,.45)] [backface-visibility:hidden] [transform-style:preserve-3d] [animation-delay:calc(var(--index)*-4s)] motion-reduce:animate-none max-[760px]:w-[clamp(150px,52vw,230px)]" key={`${image.title}-${index}`} style={{ '--index': index }}>
            <img src={image.image} alt="" className="block size-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#140a23]/90 to-transparent px-3.5 pb-3 pt-8 text-xs font-extrabold uppercase tracking-wide text-white">{image.title}</span>
          </article>
        ))}
      </div>}
      <div className="relative z-10 w-full max-w-[1000px] px-5 py-9 text-center [text-shadow:0_2px_18px_rgba(12,5,25,.7)] sm:px-6 sm:py-11">{children}</div>
    </section>
  )
}
