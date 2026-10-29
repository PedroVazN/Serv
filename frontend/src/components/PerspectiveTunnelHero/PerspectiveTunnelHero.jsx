import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './PerspectiveTunnelHero.module.css'

const images = [
  { src: '/Assets/freelancer1.jpg', title: 'Front-end Developer', alt: 'Freelancer de desenvolvimento front-end' },
  { src: '/Assets/design_grafico.png', title: 'Design & Identidade', alt: 'Trabalho de design gráfico' },
  { src: '/Assets/freelancer3.jpg', title: 'Back-end Developer', alt: 'Freelancer de desenvolvimento back-end' },
  { src: '/Assets/marketing_dig.png', title: 'Marketing Digital', alt: 'Profissional de marketing digital' },
  { src: '/Assets/freelancer4.jpg', title: 'DevOps Engineer', alt: 'Freelancer especialista em DevOps' },
  { src: '/Assets/pedreiro.png', title: 'Construção & Reformas', alt: 'Profissional de construção e reformas' },
]

const cards = images.map((item, index) => {
  const angle = index * 137.5 * (Math.PI / 180)

  return {
    item,
    index,
    angleCos: Math.cos(angle),
    angleSin: Math.sin(angle),
    radiusFactorX: 0.27 + (index % 3) * 0.08,
    radiusFactorY: 0.25 + (index % 2) * 0.1,
    rotationZ: (index % 2 === 0 ? 1 : -1) * (4 + (index % 4) * 1.5),
  }
})

const springConfig = { stiffness: 80, damping: 30, mass: 0.5, restDelta: 0.0001 }

function useCameraParallax(enabled) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 60, damping: 25, mass: 0.5 })
  const y = useSpring(rawY, { stiffness: 60, damping: 25, mass: 0.5 })

  useEffect(() => {
    if (!enabled) return undefined

    const onMove = (event) => {
      rawX.set((event.clientX / window.innerWidth - 0.5) * 2)
      rawY.set((event.clientY / window.innerHeight - 0.5) * 2)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, rawX, rawY])

  return { x, y }
}

function TunnelCard({ card, progress, pointer, stage }) {
  const staggerSpan = 0.58
  const start = (card.index / cards.length) * (1 - staggerSpan)
  const end = start + staggerSpan
  const localProgress = useTransform(progress, [start, end], [0, 1])

  const farZ = stage.isMobile ? -1200 : -1700
  const nearZ = stage.isMobile ? 350 : 500
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ])
  const opacity = useTransform(localProgress, [0, 0.16, 0.74, 1], [0, 1, 1, 0])
  const cardWidth = stage.isMobile
    ? Math.max(130, Math.min(180, stage.width * 0.38))
    : Math.max(180, Math.min(270, stage.width * 0.18))

  const baseX = card.angleCos * (stage.width * card.radiusFactorX)
  const baseY = card.angleSin * (stage.height * card.radiusFactorY)
  const panStrength = stage.isMobile ? 20 : 45
  const transform = useTransform(
    [z, pointer.x, pointer.y],
    ([currentZ, pointerX, pointerY]) => {
      const offsetX = baseX - pointerX * panStrength
      const offsetY = baseY - pointerY * panStrength
      return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currentZ}px) rotateZ(${card.rotationZ}deg)`
    },
  )

  return (
    <motion.article
      className={styles.cardPosition}
      style={{ width: cardWidth, transform, opacity, zIndex: card.index + 1 }}
      aria-label={card.item.title}
    >
      <div className={styles.cardSurface}>
        <img src={card.item.src} alt={card.item.alt} draggable="false" />
        <div className={styles.cardScrim} />
        <span className={styles.cardTitle}>{card.item.title}</span>
      </div>
    </motion.article>
  )
}

export default function PerspectiveTunnelHero() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const [stage, setStage] = useState({
    width: 1440,
    height: 900,
    isMobile: false,
  })

  const rawProgress = useMotionValue(reduceMotion ? 1 : 0)
  const smoothProgress = useSpring(rawProgress, springConfig)
  const pointer = useCameraParallax(!reduceMotion)

  useEffect(() => {
    const updateStage = () => {
      setStage({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
      })
    }

    updateStage()
    window.addEventListener('resize', updateStage)
    return () => window.removeEventListener('resize', updateStage)
  }, [])

  useEffect(() => {
    if (reduceMotion) rawProgress.set(1)
  }, [reduceMotion, rawProgress])

  useEffect(() => {
    const element = containerRef.current
    if (!element || reduceMotion) return undefined

    const handleWheel = (event) => {
      const current = rawProgress.get()
      const visibleProgress = smoothProgress.get()
      const movingInsideTunnel = (event.deltaY > 0 && visibleProgress < 0.999) || (event.deltaY < 0 && visibleProgress > 0.001)
      if (!movingInsideTunnel) return

      event.preventDefault()
      rawProgress.set(Math.max(0, Math.min(1, current + event.deltaY * 0.0008)))
    }

    let lastTouchY = null
    const handleTouchStart = (event) => {
      lastTouchY = event.touches[0]?.clientY ?? null
    }
    const handleTouchMove = (event) => {
      if (lastTouchY === null) return

      const currentTouchY = event.touches[0]?.clientY
      if (currentTouchY === undefined) return

      const deltaY = lastTouchY - currentTouchY
      lastTouchY = currentTouchY
      const current = rawProgress.get()
      const visibleProgress = smoothProgress.get()
      const movingInsideTunnel = (deltaY > 0 && visibleProgress < 0.999) || (deltaY < 0 && visibleProgress > 0.001)
      if (!movingInsideTunnel) return

      event.preventDefault()
      rawProgress.set(Math.max(0, Math.min(1, current + deltaY * 0.0022)))
    }
    const handleTouchEnd = () => { lastTouchY = null }

    element.addEventListener('wheel', handleWheel, { passive: false })
    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('wheel', handleWheel)
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [reduceMotion, rawProgress, smoothProgress])

  const titleScale = useTransform(smoothProgress, [0, 0.82, 1], [0.72, 0.88, 1])
  const titleOpacity = useTransform(smoothProgress, [0, 0.72, 0.94, 1], [0, 0, 1, 1])
  const promptOpacity = useTransform(smoothProgress, [0, 0.12, 0.7, 0.85], [1, 1, 0.35, 0])

  return (
    <section
      ref={containerRef}
      className={styles.tunnelHero}
      aria-label="SERV+ — encontre sua equipe ideal"
      style={{ perspective: stage.isMobile ? '900px' : '1200px' }}
    >
      <div className={styles.dotGrid} />
      <div className={styles.centerGlow} />
      <div className={styles.depthRing} />
      <div className={styles.outerRing} />

      <motion.div className={styles.centerCopy} style={{ scale: titleScale, opacity: titleOpacity }}>
        <p className={styles.centerEyebrow}>Skill Pods — o futuro da contratação</p>
        <div className={styles.brand}>SERV<span>+</span></div>
        <h1>Monte sua <span>equipe ideal.</span></h1>
        <p className={styles.centerDescription}>
          Especialistas que se complementam, prontos para transformar seu projeto em resultado.
        </p>
        <div className={styles.actions}>
          <button className={styles.primaryButton} onClick={() => navigate('/contratar')}>
            Montar minha equipe <span aria-hidden="true">↗</span>
          </button>
          <button className={styles.secondaryButton} onClick={() => navigate('/skillpods')}>
            Explorar Skill Pods
          </button>
        </div>
        <div className={styles.stats}>
          <div><strong>100<span>+</span></strong><small>Skill Pods</small></div>
          <i aria-hidden="true" />
          <div><strong>500<span>+</span></strong><small>Especialistas</small></div>
          <i aria-hidden="true" />
          <div><strong>98<span>%</span></strong><small>Satisfação</small></div>
        </div>
      </motion.div>

      <motion.div className={styles.scrollPrompt} style={{ opacity: promptOpacity }} aria-hidden="true">
        <span>Role para explorar</span>
        <i />
      </motion.div>

      <div className={styles.cardsPlane} aria-hidden="true">
        {cards.map((card) => (
          <TunnelCard
            key={card.index}
            card={card}
            progress={smoothProgress}
            pointer={pointer}
            stage={stage}
          />
        ))}
      </div>
    </section>
  )
}
