import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Carousel({ pods }) {
  const [current, setCurrent] = useState(0)
  const [popup, setPopup] = useState(null)
  const total = pods.length
  const navigate = useNavigate()
  const touchRef = useRef(0)
  const suppressClickRef = useRef(false)

  const move = useCallback((direction) => {
    setCurrent(index => (index + direction + total) % total)
  }, [total])

  useEffect(() => {
    if (!popup) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = event => {
      if (event.key === 'Escape') setPopup(null)
      if (event.key === 'ArrowRight') move(1)
      if (event.key === 'ArrowLeft') move(-1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [popup, move])

  function getSlide(index) {
    const distance = (index - current + total) % total
    if (distance === 0) return { className: 'z-[4] opacity-100', transform: 'translateX(0) scale(1.08) rotateY(0)' }
    if (distance === 1) return { className: 'z-[3] opacity-65', transform: 'translateX(clamp(125px,17vw,205px)) scale(.76) rotateY(-16deg)' }
    if (distance === total - 1) return { className: 'z-[3] opacity-65', transform: 'translateX(clamp(-205px,-17vw,-125px)) scale(.76) rotateY(16deg)' }
    if (distance === 2) return { className: 'z-[2] opacity-30 max-md:opacity-0', transform: 'translateX(clamp(215px,30vw,360px)) scale(.56) rotateY(-26deg)' }
    if (distance === total - 2) return { className: 'z-[2] opacity-30 max-md:opacity-0', transform: 'translateX(clamp(-360px,-30vw,-215px)) scale(.56) rotateY(26deg)' }
    return { className: 'pointer-events-none z-0 opacity-0', transform: 'scale(.2)' }
  }

  return (
    <>
      <section className="overflow-hidden bg-serv-950 py-12 text-white sm:py-16" aria-label="Skill Pods em destaque" aria-roledescription="carousel">
        <div className="container">
          <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-serv-200">Uma amostra do catálogo</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Conheça as equipes</h2>
            </div>
            <span className="font-display text-sm font-semibold text-white/45">{String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          </div>

          <div className="relative mx-auto mt-4 flex h-[290px] max-w-5xl items-center justify-center overflow-hidden px-7 sm:h-[350px] sm:px-16">
            <button type="button" className="absolute left-0 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center border border-white/20 text-xl text-white transition-colors hover:border-serv-200 hover:bg-serv-200 hover:text-serv-950 sm:size-12" onClick={() => move(-1)} aria-label="Equipe anterior">←</button>
            <div className="relative h-full w-full [perspective:1100px]" aria-live="polite">
              {pods.map((pod, index) => {
                const slide = getSlide(index)
                return (
                  <button
                    key={pod.id}
                    type="button"
                    aria-label={`Ver detalhes: ${pod.title}`}
                    aria-current={index === current ? 'true' : undefined}
                    tabIndex={index === current ? 0 : -1}
                    className={`absolute left-1/2 top-1/2 aspect-[28/19] w-[clamp(190px,24vw,280px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-white/20 bg-serv-900 shadow-[0_24px_60px_rgba(0,0,0,.36)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(.2,.75,.25,1)] [backface-visibility:hidden] focus-visible:ring-offset-serv-950 ${slide.className}`}
                    style={{ transform: `translate(-50%,-50%) ${slide.transform}` }}
                    onClick={() => {
                      if (suppressClickRef.current) {
                        suppressClickRef.current = false
                        return
                      }
                      setPopup(pod)
                    }}
                    onTouchStart={event => { touchRef.current = event.touches[0].clientX }}
                    onTouchEnd={event => {
                      const distance = touchRef.current - event.changedTouches[0].clientX
                      if (Math.abs(distance) > 50) {
                        suppressClickRef.current = true
                        setTimeout(() => { suppressClickRef.current = false }, 0)
                        move(distance > 0 ? 1 : -1)
                      }
                    }}
                  >
                    <img src={pod.image} alt="" aria-hidden="true" className="size-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 flex flex-col items-start bg-gradient-to-t from-serv-950/95 to-transparent px-4 pb-4 pt-12 text-left sm:px-5 sm:pb-5">
                      <span className="mb-1 text-xs font-semibold text-serv-200">{pod.tag}</span>
                      <span className="text-base font-bold text-white sm:text-lg">{pod.title}</span>
                    </span>
                  </button>
                )
              })}
            </div>
            <button type="button" className="absolute right-0 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center border border-white/20 text-xl text-white transition-colors hover:border-serv-200 hover:bg-serv-200 hover:text-serv-950 sm:size-12" onClick={() => move(1)} aria-label="Próxima equipe">→</button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2" role="group" aria-label="Selecionar equipe">
            {pods.map((pod, index) => <button key={pod.id} type="button" aria-label={`Mostrar ${pod.title}`} aria-current={index === current ? 'true' : undefined} className={`h-1.5 transition-all ${index === current ? 'w-8 bg-serv-200' : 'w-3 bg-white/30 hover:bg-white/60'}`} onClick={() => setCurrent(index)} />)}
          </div>
          <p className="mt-3 text-center text-xs text-white/45">Selecione uma equipe para ver as especialidades.</p>
        </div>
      </section>

      {popup && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-serv-950/85 p-4 backdrop-blur-sm" onClick={() => setPopup(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="pod-dialog-title" className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-serv-950/10 bg-[#f7f5fa] p-5 text-serv-950 shadow-2xl sm:p-9" onClick={event => event.stopPropagation()}>
            <button type="button" className="absolute right-4 top-4 z-10 grid size-10 place-items-center border border-serv-950/15 bg-white text-serv-950 transition-colors hover:bg-serv-950 hover:text-white sm:right-6 sm:top-6" onClick={() => setPopup(null)} aria-label="Fechar detalhes">×</button>
            <div className="mb-7 grid gap-5 border-b border-serv-950/10 pb-7 sm:grid-cols-[180px_1fr] sm:items-center">
              <img src={popup.image} alt="" aria-hidden="true" className="aspect-[16/10] w-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-serv-600">{popup.tag}</p>
                <h2 id="pod-dialog-title" className="mt-1 pr-10 text-2xl font-bold tracking-tight sm:text-3xl">{popup.title}</h2>
                <p className="mt-3 text-sm leading-7 text-serv-900/65">{popup.description}</p>
              </div>
            </div>
            <div className="mb-8 grid gap-7 sm:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-bold text-serv-950">Especialistas</h3>
                <ul className="flex flex-col gap-2">{popup.professionals.map(person => <li key={person} className="border-b border-serv-950/10 py-2 text-sm text-serv-900/70">{person}</li>)}</ul>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-bold text-serv-950">Benefícios</h3>
                <ul className="flex flex-col gap-2">{popup.benefits.map(benefit => <li key={benefit} className="border-b border-serv-950/10 py-2 text-sm text-serv-900/70">{benefit}</li>)}</ul>
              </div>
            </div>
            <button type="button" className="inline-flex min-h-12 items-center justify-center gap-4 bg-serv-600 px-6 text-sm font-bold text-white transition-colors hover:bg-serv-950 focus-visible:ring-offset-[#f7f5fa]" onClick={() => navigate('/skillpods')}>
              Ver no catálogo <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
