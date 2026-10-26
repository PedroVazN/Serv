import SectionTag from '../SectionTag/SectionTag'
import styles from './PageHero.module.css'

export default function PageHero({ tag, title, highlight, subtitle, children }) {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} />
      <div className="container">
        {tag && <SectionTag>{tag}</SectionTag>}
        <h1 className={styles.title}>
          {title}<br />
          <span className={styles.highlight}>{highlight}</span>
        </h1>
        {subtitle && <p className={styles.sub}>{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}
