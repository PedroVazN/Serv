import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const links = [
  { to: '/contratar', label: 'Skill Pods' },
  { to: '/freelancers', label: 'Freelancers' },
  { to: '/skillpods', label: 'Catálogo' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[1000] border-b border-white/10 bg-serv-950/95 text-white shadow-[0_8px_30px_rgba(20,10,36,.12)] backdrop-blur-xl">
        <div className="container flex h-[76px] items-center justify-between gap-5">
          <Link to="/" className="relative z-[1002] shrink-0 text-[1.65rem] font-black leading-none tracking-[-.07em]" onClick={closeMenu} aria-label="SERV+ início">
            SERV<span className="text-serv-200">+</span>
          </Link>

          <nav id="main-navigation" aria-label="Navegação principal" className={`fixed inset-y-0 right-0 z-[1001] flex w-[min(84vw,360px)] flex-col gap-1 bg-serv-950 px-7 pb-8 pt-24 shadow-[-18px_0_60px_rgba(0,0,0,.3)] transition-transform duration-300 min-[901px]:static min-[901px]:w-auto min-[901px]:translate-x-0 min-[901px]:flex-row min-[901px]:items-center min-[901px]:gap-9 min-[901px]:bg-transparent min-[901px]:p-0 min-[901px]:shadow-none ${menuOpen ? 'translate-x-0' : 'translate-x-full min-[901px]:translate-x-0'}`}>
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) => `border-b border-white/10 py-4 text-base font-semibold transition-colors hover:text-serv-200 min-[901px]:border-0 min-[901px]:py-2 min-[901px]:text-sm ${isActive ? 'text-serv-200' : 'text-white/70'}`}
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/login" onClick={closeMenu} className="mt-3 border-b border-white/10 py-4 text-base font-semibold text-white/70 transition-colors hover:text-serv-200 min-[901px]:hidden">Entrar</Link>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-5">
            <Link to="/login" className="hidden text-sm font-semibold text-white/70 transition-colors hover:text-white min-[901px]:inline-flex">Entrar</Link>
            <button type="button" onClick={() => { closeMenu(); navigate('/contratar') }} className="rounded-full bg-serv-200 px-5 py-2.5 text-sm font-bold text-serv-950 transition-colors hover:bg-white focus-visible:ring-offset-serv-950 max-[440px]:px-3.5 max-[440px]:text-xs">
              Começar projeto
            </button>
          </div>

          <button
            type="button"
            className="relative z-[1002] grid size-10 shrink-0 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10 min-[901px]:hidden"
            onClick={() => setMenuOpen(open => !open)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            <span className="flex w-4 flex-col gap-[5px]" aria-hidden="true">
              <span className={`h-px w-full bg-current transition-transform ${menuOpen ? 'translate-y-[3px] rotate-45' : ''}`} />
              <span className={`h-px w-full bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-px w-full bg-current transition-transform ${menuOpen ? '-translate-y-[9px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </header>

      {menuOpen && <button type="button" tabIndex={-1} aria-label="Fechar menu" className="fixed inset-0 z-[999] cursor-default bg-black/55 min-[901px]:hidden" onClick={closeMenu} />}
    </>
  )
}
