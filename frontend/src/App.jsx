import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home       from './pages/Home/Home'
import Contratar  from './pages/Contratar/Contratar'
import SkillPods  from './pages/SkillPods/SkillPods'
import Freelancers from './pages/Freelancers/Freelancers'
import Login      from './pages/Login/Login'
import { Link } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/contratar"   element={<Contratar />} />
        <Route path="/skillpods"   element={<SkillPods />} />
        <Route path="/freelancers" element={<Freelancers />} />
        <Route path="/login"       element={<Login />} />
        <Route path="*"            element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-12 text-center">
      <div className="max-w-xl">
        <p className="font-extrabold tracking-[.3em] text-serv-200">ERRO 404</p>
        <h1 className="my-3 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">Página não encontrada</h1>
        <p className="mb-6 text-white/65">O endereço pode ter mudado ou não existe.</p>
        <Link to="/" className="inline-flex rounded-full bg-serv-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-serv-400">Voltar ao início</Link>
      </div>
    </main>
  )
}
