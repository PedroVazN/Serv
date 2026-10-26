import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Carousel.module.css'

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
    autoRef.current = setInterval(() => move(1), 4000)
  }, [move])

  const stopAuto = useCallback(() => {
    clearInterval(autoRef.current)
  }, [])

  useEffect(() => {
    startAuto()
    return stopAuto
  }, [startAuto, stopAuto])

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
    if (diff === 0) return styles.active
    if (diff === 1) return styles.next
    if (diff === total - 1) return styles.prev
    if (diff === 2) return styles.farNext
    if (diff === total - 2) return styles.farPrev
    return styles.hidden
  }

  // Touch support
  const touchRef = useRef(0)

  return (
    <>
      <div
        className={styles.section}
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
      >
        <p className={styles.label}>Escolha sua área</p>

        <div className={styles.container}>
          <button className={`${styles.btn} ${styles.btnPrev}`} onClick={() => move(-1)} aria-label="Anterior">‹</button>

          <div className={styles.wrapper}>
            <div className={styles.track}>
              {pods.map((pod, i) => (
                <div
                  key={pod.id}
                  className={`${styles.slide} ${getSlideClass(i)}`}
                  onClick={() => setPopup(pod)}
                  onTouchStart={e => { touchRef.current = e.touches[0].clientX }}
                  onTouchEnd={e => {
                    const diff = touchRef.current - e.changedTouches[0].clientX
                    if (Math.abs(diff) > 50) move(diff > 0 ? 1 : -1)
                  }}
                >
                  <img src={pod.image} alt={pod.title} className={styles.img} />
                  <div className={styles.overlay}>
                    <span className={styles.tag}>{pod.tag}</span>
                    <h3 className={styles.slideTitle}>{pod.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className={`${styles.btn} ${styles.btnNext}`} onClick={() => move(1)} aria-label="Próximo">›</button>
        </div>

        <div className={styles.indicators}>
          {pods.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <p className={styles.hint}>Clique em uma Pod para ver detalhes</p>
      </div>

      {/* Popup */}
      {popup && (
        <div className={styles.popupOverlay} onClick={() => setPopup(null)}>
          <div className={styles.popup} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setPopup(null)} aria-label="Fechar">✕</button>
            <div className={styles.popupHeader}>
              <img src={popup.image} alt={popup.title} />
              <div>
                <h2>{popup.title}</h2>
                <p>{popup.description}</p>
              </div>
            </div>
            <div className={styles.popupBody}>
              <div className={styles.popupInfo}>
                <h3>👥 Profissionais incluídos</h3>
                <ul>{popup.professionals.map(p => <li key={p}>{p}</li>)}</ul>
              </div>
              <div className={styles.popupInfo}>
                <h3>✨ Benefícios</h3>
                <ul>{popup.benefits.map(b => <li key={b}>{b}</li>)}</ul>
              </div>
            </div>
            <div className={styles.popupFooter}>
              <button className={styles.popupCta} onClick={() => navigate('/skillpods')}>
                Contratar esta Skill Pod →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
