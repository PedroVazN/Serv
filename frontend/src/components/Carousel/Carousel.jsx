import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Carousel({ pods }) {
  const [current, setCurrent] = useState(0)
  const [popup, setPopup]     = useState(null)
  const total = pods.length
  const navigate  = useNavigate()
  const autoRef   = useRef(null)

  const move = useCallback((dir) => {
    setCurrent(c => (c + dir + total) % total)
  }, [total])

  const startAuto = useCallback(() => {
    clearInterval(autoRef.current)
    autoRef.current = setInterval(() => move(1), 4000)
  }, [move])

  const stopAuto = useCallback(() => {
    clearInterval(autoRef.current)
  }, [])

  useEffect(() => {
    if (popup) stopAuto()
    else startAuto()
    return stopAuto
  }, [startAuto, stopAuto, popup])

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  move(-1)
      if (e.key === 'ArrowRight') move(1)
      if (e.key === 'Escape')     setPopup(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [move])

  // Block scroll when popup open
  useEffect(() => {
    document.body.style.overflow = popup ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [popup])

  function getSlideClass(index) {
    const diff = (index - current + total) % total
    if (diff === 0) return { className: 'z-[4] opacity-100 shadow-[0_24px_64px_rgba(107,70,193,.4)]', transform: 'translateX(0) scale(1.35) rotateY(0)' }
    if (diff === 1) return { className: 'z-[3] opacity-65', transform: 'translateX(clamp(145px,18vw,220px)) scale(.78) rotateY(-18deg)' }
    if (diff === total - 1) return { className: 'z-[3] opacity-65', transform: 'translateX(clamp(-220px,-18vw,-145px)) scale(.78) rotateY(18deg)' }
    if (diff === 2) return { className: 'z-[2] opacity-35 max-md:opacity-0', transform: 'translateX(clamp(235px,32vw,390px)) scale(.58) rotateY(-28deg)' }
    if (diff === total - 2) return { className: 'z-[2] opacity-35 max-md:opacity-0', transform: 'translateX(clamp(-390px,-32vw,-235px)) scale(.58) rotateY(28deg)' }
    return { className: 'pointer-events-none z-0 scale-50 opacity-0', transform: 'scale(.2)' }
  }

  // Touch support
  const touchRef = useRef(0)
  const suppressClickRef = useRef(false)

  return (
    <>
      <div
        className="bg-serv-950 py-12 sm:py-16"
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
      >
        <p className="mb-8 text-center text-xs font-bold uppercase tracking-[.14em] text-white/50">Escolha sua área</p>

        <div className="relative mx-auto flex h-[300px] max-w-site items-center justify-center overflow-hidden px-4 sm:h-[380px] sm:px-10">
          <button type="button" className="absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-serv-500/80 text-3xl text-white shadow-lg backdrop-blur transition hover:scale-110 hover:bg-serv-500 sm:left-5 sm:size-[52px]" onClick={() => move(-1)} aria-label="Anterior">‹</button>

          <div className="relative h-full w-full [perspective:1200px]">
            <div className="relative flex h-full items-center justify-center">
              {pods.map((pod, i) => (
                <button
                  key={pod.id}
                  type="button"
                  aria-label={`Ver detalhes: ${pod.title}`}
                  className={`absolute aspect-[28/19] w-[clamp(190px,24vw,280px)] overflow-hidden rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,.3)] transition-[transform,opacity,box-shadow] duration-[600ms] ease-[cubic-bezier(.25,.46,.45,.94)] [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-serv-200 ${getSlideClass(i).className}`}
                  style={{ transform: getSlideClass(i).transform }}
                  onClick={() => {
                    if (suppressClickRef.current) {
                      suppressClickRef.current = false
                      return
                    }
                    setPopup(pod)
                  }}
                  onTouchStart={e => { stopAuto(); touchRef.current = e.touches[0].clientX }}
                  onTouchEnd={e => {
                    const diff = touchRef.current - e.changedTouches[0].clientX
                    if (Math.abs(diff) > 50) {
                      suppressClickRef.current = true
                      setTimeout(() => { suppressClickRef.current = false }, 0)
                      move(diff > 0 ? 1 : -1)
                    }
                    startAuto()
                  }}
                >
                  <img src={pod.image} alt="" aria-hidden="true" className="size-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-serv-950/95 via-serv-950/45 to-transparent px-4 pb-4 pt-8 text-left sm:px-5 sm:pb-5">
                    <span className="w-fit rounded-full bg-serv-500/40 px-2.5 py-1 text-[.68rem] font-bold uppercase tracking-wider text-serv-200">{pod.tag}</span>
                    <h3 className="m-0 text-base font-extrabold text-white sm:text-lg">{pod.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-serv-500/80 text-3xl text-white shadow-lg backdrop-blur transition hover:scale-110 hover:bg-serv-500 sm:right-5 sm:size-[52px]" onClick={() => move(1)} aria-label="Próximo">›</button>
        </div>

        <div className="mt-7 flex justify-center gap-2">
          {pods.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-current={i === current ? 'true' : undefined}
              className={`h-2 rounded-full transition-all ${i === current ? 'w-5 bg-serv-300' : 'w-2 bg-white/25 hover:bg-white/50'}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-white/40">Escolha uma Pod para ver os detalhes</p>
      </div>

      {/* Popup */}
      {popup && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" onClick={() => setPopup(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="pod-dialog-title" className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-5 text-serv-950 shadow-2xl sm:p-10" onClick={e => e.stopPropagation()}>
            <button type="button" className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-serv-500/10 text-serv-700 transition hover:rotate-90 hover:bg-serv-500/20 sm:right-5 sm:top-5" onClick={() => setPopup(null)} aria-label="Fechar">✕</button>
            <div className="mb-7 flex flex-col gap-5 border-b border-purple-200 pb-7 sm:flex-row sm:items-start sm:gap-6">
              <img src={popup.image} alt="" aria-hidden="true" className="h-40 w-full shrink-0 rounded-[20px] object-cover sm:h-[100px] sm:w-[140px]" />
              <div>
                <h2 id="pod-dialog-title" className="mb-2 pr-8 text-2xl font-black text-serv-700 sm:text-3xl">{popup.title}</h2>
                <p className="text-sm leading-relaxed text-purple-800">{popup.description}</p>
              </div>
            </div>
            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-[20px] border border-purple-200 bg-purple-50 p-5">
                <h3 className="mb-3 text-base font-bold text-serv-700">👥 Profissionais incluídos</h3>
                <ul className="flex flex-col gap-2">{popup.professionals.map(p => <li key={p} className="relative pl-5 text-sm text-purple-900 before:absolute before:left-0 before:font-bold before:text-serv-500 before:content-['✓']">{p}</li>)}</ul>
              </div>
              <div className="rounded-[20px] border border-purple-200 bg-purple-50 p-5">
                <h3 className="mb-3 text-base font-bold text-serv-700">✨ Benefícios</h3>
                <ul className="flex flex-col gap-2">{popup.benefits.map(b => <li key={b} className="relative pl-5 text-sm text-purple-900 before:absolute before:left-0 before:font-bold before:text-serv-500 before:content-['✓']">{b}</li>)}</ul>
              </div>
            </div>
            <div className="text-center">
              <button type="button" className="rounded-full bg-gradient-to-br from-serv-500 to-serv-700 px-7 py-3.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(107,70,193,.3)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(107,70,193,.45)] sm:px-8" onClick={() => navigate('/skillpods')}>
                Contratar esta Skill Pod →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
