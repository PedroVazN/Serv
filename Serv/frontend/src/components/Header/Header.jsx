import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fecha menu ao mudar de rota
  const closeMenu = () => setMenuOpen(false)

  // Trava scroll quando menu aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.headerFlex}`}>
          <Link to="/" className={styles.logo} onClick={closeMenu}>
            SERV<span className={styles.logoPlus}>+</span>
          </Link>

          <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
            <NavLink to="/contratar"   className={({ isActive }) => isActive ? styles.navActive : ''} onClick={closeMenu}>Skill Pods</NavLink>
            <NavLink to="/freelancers" className={({ isActive }) => isActive ? styles.navActive : ''} onClick={closeMenu}>Freelancers</NavLink>
            <NavLink to="/skillpods"   className={({ isActive }) => isActive ? styles.navActive : ''} onClick={closeMenu}>Catálogo</NavLink>
          </nav>

          <div className={styles.actions}>
            <Link to="/login" className={styles.btnLink}>Entrar</Link>
            <button className={styles.btnCadastro} onClick={() => navigate('/#cadastro')}>
              Começar Grátis
            </button>
          </div>

          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div className={styles.overlay} onClick={closeMenu} aria-hidden="true" />
      )}
    </>
  )
}
