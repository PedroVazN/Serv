import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home'
import Contratar from './pages/Contratar/Contratar'
import SkillPods from './pages/SkillPods/SkillPods'
import Login from './pages/Login/Login'
import { AuthProvider } from './context/AuthContext'
import { FreelancersDirectory, ServicesDirectory, ProfessionalProfile, ServiceDetail } from './pages/Marketplace/Directory'
import Dashboard from './pages/Marketplace/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/contratar"   element={<Contratar />} />
        <Route path="/skillpods"   element={<SkillPods />} />
        <Route path="/freelancers" element={<FreelancersDirectory />} />
        <Route path="/servicos" element={<ServicesDirectory />} />
        <Route path="/servicos/:id" element={<ServiceDetail />} />
        <Route path="/profissionais/:id" element={<ProfessionalProfile />} />
        <Route path="/painel" element={<Dashboard />} />
        <Route path="/login"       element={<Login />} />
        <Route path="*"            element={<NotFound />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-[#f7f5fa] px-6 py-12 text-serv-950">
      <span aria-hidden="true" className="pointer-events-none absolute -right-12 -top-32 -z-10 font-display text-[min(70vw,48rem)] font-bold leading-none tracking-[-.15em] text-serv-950/[.035]">+</span>
      <div className="max-w-2xl">
        <p className="font-display text-sm font-bold text-serv-600">Erro 404</p>
        <h1 className="my-4 text-[clamp(3.5rem,8vw,6rem)] font-bold leading-[.95] tracking-[-.08em]">Esta página saiu do caminho.</h1>
        <p className="mb-8 max-w-lg text-base leading-7 text-serv-900/65">O endereço não existe ou foi alterado. Volte ao início e encontre a equipe certa para seu projeto.</p>
        <Link to="/" className="inline-flex min-h-12 items-center gap-6 bg-serv-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-serv-950">Voltar ao início <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) }, [pathname])
  return null
}
