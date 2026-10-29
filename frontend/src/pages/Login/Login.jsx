import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [tab,    setTab]    = useState('login')   // 'login' | 'register'
  const [form,   setForm]   = useState({ nome:'', email:'', senha:'', tipo:'cliente' })
  const [error,  setError]  = useState('')
  const [loading,setLoading]= useState(false)

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/registro'
      const body = tab === 'login'
        ? { email: form.email, senha: form.senha }
        : { nome: form.nome, email: form.email, senha: form.senha, tipo: form.tipo }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.erro || 'Erro desconhecido')
      localStorage.setItem('serv_token', data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Painel esquerdo */}
      <div className="relative flex flex-1 flex-col items-start justify-center overflow-hidden bg-gradient-to-br from-serv-950 to-serv-700 px-6 py-12 text-white sm:px-12 md:px-[60px]">
        <Link to="/" className="relative z-10 mb-10 text-3xl font-black tracking-[2px] sm:mb-[60px]">SERV<span className="bg-gradient-to-br from-serv-300 to-serv-200 bg-clip-text text-transparent">+</span></Link>
        <div className="relative z-10 max-w-[340px]">
          <h1 className="mb-4 text-3xl font-black leading-tight sm:text-[2.4rem]">Bem-vindo{tab === 'register' ? '' : ' de volta'}!</h1>
          <p className="text-base leading-relaxed text-white/70">{tab === 'login' ? 'Acesse sua conta e gerencie seus projetos e Skill Pods.' : 'Crie sua conta e comece a montar sua equipe ideal.'}</p>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 size-[300px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-[200px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute left-[10%] top-[30%] animate-pulse text-3xl font-light text-white/15">+</div>
        <div className="pointer-events-none absolute bottom-1/4 right-[15%] animate-pulse text-3xl font-light text-white/15">+</div>
      </div>

      {/* Painel direito */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-10 text-gray-800 sm:px-10">
        <div className="w-full max-w-[420px]">
          {/* Tabs */}
          <div className="mb-9 flex rounded-full bg-[#f4f2f8] p-1">
            <button className={`flex-1 rounded-full px-3 py-3 text-sm font-bold transition ${tab === 'login' ? 'bg-white text-serv-700 shadow-sm' : 'text-gray-400'}`} onClick={() => { setTab('login'); setError('') }}>Entrar</button>
            <button className={`flex-1 rounded-full px-3 py-3 text-sm font-bold transition ${tab === 'register' ? 'bg-white text-serv-700 shadow-sm' : 'text-gray-400'}`} onClick={() => { setTab('register'); setError('') }}>Criar conta</button>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-5">
            {tab === 'register' && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nome" className="text-sm font-bold text-gray-700">Nome completo</label>
                <input id="nome" autoComplete="name" className="rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-[.95rem] text-gray-800 outline-none transition focus:border-serv-400 focus:ring-4 focus:ring-serv-500/10" name="nome" type="text" value={form.nome} onChange={change} placeholder="Seu nome" required />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-bold text-gray-700">E-mail</label>
              <input id="email" autoComplete="email" className="rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-[.95rem] text-gray-800 outline-none transition focus:border-serv-400 focus:ring-4 focus:ring-serv-500/10" name="email" type="email" value={form.email} onChange={change} placeholder="seu@email.com" required />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="senha" className="text-sm font-bold text-gray-700">Senha</label>
              <input id="senha" autoComplete={tab === 'login' ? 'current-password' : 'new-password'} className="rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-[.95rem] text-gray-800 outline-none transition focus:border-serv-400 focus:ring-4 focus:ring-serv-500/10" name="senha" type="password" value={form.senha} onChange={change} placeholder="••••••••" required minLength={6} />
            </div>

            {tab === 'register' && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="tipo" className="text-sm font-bold text-gray-700">Tipo de conta</label>
                <select id="tipo" className="rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-[.95rem] text-gray-800 outline-none transition focus:border-serv-400 focus:ring-4 focus:ring-serv-500/10" name="tipo" value={form.tipo} onChange={change}>
                  <option value="cliente">Cliente — quero contratar</option>
                  <option value="freelancer">Freelancer — quero ser contratado</option>
                </select>
              </div>
            )}

            {tab === 'login' && (
              <div className="flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-500">
                  <input type="checkbox" /> Lembrar de mim
                </label>
                <a href="#" className="text-sm font-semibold text-serv-600 hover:underline">Esqueceu a senha?</a>
              </div>
            )}

            {error && <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

            <button type="submit" disabled={loading} className="rounded-[20px] bg-gradient-to-br from-serv-500 to-serv-700 p-4 text-base font-extrabold text-white shadow-purple transition enabled:hover:-translate-y-0.5 enabled:hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Aguarde...' : tab === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {tab === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
            <button type="button" className="bg-transparent text-sm font-bold text-serv-600 hover:underline" onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError('') }}>
              {tab === 'login' ? 'Criar conta grátis' : 'Fazer login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
