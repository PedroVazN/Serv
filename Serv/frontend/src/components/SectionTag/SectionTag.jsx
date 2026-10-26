import styles from './SectionTag.module.css'

export default function SectionTag({ children, dark = false }) {
  return (
    <span className={`${styles.tag} ${dark ? styles.dark : ''}`}>
      {children}
    </span>
  )
}
