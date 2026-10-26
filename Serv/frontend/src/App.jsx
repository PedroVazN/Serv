import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home       from './pages/Home'
import Contratar  from './pages/Contratar'
import SkillPods  from './pages/SkillPods'
import Freelancers from './pages/Freelancers'
import Login      from './pages/Login'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/contratar"   element={<Contratar />} />
        <Route path="/skillpods"   element={<SkillPods />} />
        <Route path="/freelancers" element={<Freelancers />} />
        <Route path="/login"       element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
