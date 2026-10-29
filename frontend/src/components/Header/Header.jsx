import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

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
      <header className={`fixed inset-x-0 top-0 z-[1000] border-b py-[18px] backdrop-blur-xl transition-all duration-300 max-[900px]:py-[14px] ${scrolled ? 'border-serv-200/10 bg-serv-950/95 py-3' : 'border-transparent bg-serv-950/75'}`}>
        <div className="container flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0 whitespace-nowrap text-2xl font-black tracking-[2px] text-white max-[400px]:text-xl" onClick={closeMenu}>
            SERV<span className="text-serv-200">+</span>
          </Link>

          <nav className={`flex min-w-0 items-center gap-[clamp(14px,2.2vw,34px)] transition-transform duration-300 max-[900px]:fixed max-[900px]:inset-y-0 max-[900px]:right-0 max-[900px]:z-[1001] max-[900px]:w-[min(82vw,340px)] max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-0 max-[900px]:bg-serv-950 max-[900px]:px-8 max-[900px]:pb-8 max-[900px]:pt-24 max-[900px]:shadow-[-18px_0_60px_rgba(0,0,0,.3)] ${menuOpen ? 'max-[900px]:translate-x-0' : 'max-[900px]:translate-x-[105%]'}`}>
            <NavLink to="/contratar" className={({ isActive }) => `whitespace-nowrap text-sm font-semibold transition-colors hover:text-serv-200 max-[900px]:border-b max-[900px]:border-white/10 max-[900px]:py-[18px] max-[900px]:text-base ${isActive ? 'text-serv-200' : 'text-white/75'}`} onClick={closeMenu}>Skill Pods</NavLink>
            <NavLink to="/freelancers" className={({ isActive }) => `whitespace-nowrap text-sm font-semibold transition-colors hover:text-serv-200 max-[900px]:border-b max-[900px]:border-white/10 max-[900px]:py-[18px] max-[900px]:text-base ${isActive ? 'text-serv-200' : 'text-white/75'}`} onClick={closeMenu}>Freelancers</NavLink>
            <NavLink to="/skillpods" className={({ isActive }) => `whitespace-nowrap text-sm font-semibold transition-colors hover:text-serv-200 max-[900px]:border-b max-[900px]:border-white/10 max-[900px]:py-[18px] max-[900px]:text-base ${isActive ? 'text-serv-200' : 'text-white/75'}`} onClick={closeMenu}>Catálogo</NavLink>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-4 max-[900px]:gap-3">
            <Link to="/login" className="whitespace-nowrap text-sm font-semibold text-white/75 transition-colors hover:text-serv-200 max-[900px]:hidden">Entrar</Link>
            <button className="whitespace-nowrap rounded-full border border-serv-200/45 bg-gradient-to-br from-serv-500 to-serv-400 px-[clamp(12px,1.3vw,18px)] py-[11px] text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-purple max-[900px]:px-[13px] max-[900px]:py-[9px] max-[900px]:text-xs max-[400px]:px-2.5" onClick={() => navigate('/#cadastro')}>
              Começar Grátis
            </button>
          </div>

          <button
            className="relative z-[1002] hidden h-[38px] w-[38px] flex-col justify-center gap-[5px] rounded-[10px] border border-white/15 bg-white/5 px-[7px] py-[9px] max-[900px]:flex"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span className={`block h-0.5 w-full rounded bg-white transition-all ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} /><span className={`block h-0.5 w-full rounded bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} /><span className={`block h-0.5 w-full rounded bg-white transition-all ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[999] bg-black/55 min-[901px]:hidden" onClick={closeMenu} aria-hidden="true" />
      )}
    </>
  )
}
