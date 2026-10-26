import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './PodCard.module.css'

export default function PodCard({ pod }) {
  const navigate = useNavigate()
  const cardRef  = useRef(null)

  function onMouseMove(e) {
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    cardRef.current.style.transform =
      `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(16px)`
  }

  function onMouseLeave() {
    cardRef.current.style.transform = ''
  }

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${pod.featured ? styles.featured : ''}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {pod.featured && <span className={styles.ribbon}>Mais popular</span>}

      <div className={styles.glow} style={{ '--glow': pod.glowColor }} />

      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.emoji}>{pod.emoji}</span>
          <div className={styles.meta}>
            <span className={`${styles.badge} ${pod.category === 'presencial' ? styles.presencial : styles.digital}`}>
              {pod.category === 'presencial' ? 'Presencial' : 'Digital'}
            </span>
            <span className={styles.size}>{pod.size}</span>
          </div>
        </div>

        <h3 className={styles.name}>{pod.name}</h3>
        <p  className={styles.desc}>{pod.desc}</p>

        <ul className={styles.members}>
          {pod.members.map(m => (
            <li key={m.label} className={styles.member}>
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <div className={styles.tags}>
            {pod.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
          <button className={styles.cta} onClick={() => navigate('/contratar')}>
            Contratar →
          </button>
        </div>
      </div>
    </div>
  )
}
