import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styles from './Login.module.css'

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
      const data = await res.json()
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
    <div className={styles.page}>
      {/* Painel esquerdo */}
      <div className={styles.left}>
        <Link to="/" className={styles.leftLogo}>SERV<span>+</span></Link>
        <div className={styles.leftContent}>
          <h1>Bem-vindo{tab === 'register' ? '' : ' de volta'}!</h1>
          <p>{tab === 'login' ? 'Acesse sua conta e gerencie seus projetos e Skill Pods.' : 'Crie sua conta e comece a montar sua equipe ideal.'}</p>
        </div>
        <div className={styles.decorCircle1} />
        <div className={styles.decorCircle2} />
        <div className={styles.decorPlus1}>+</div>
        <div className={styles.decorPlus2}>+</div>
      </div>

      {/* Painel direito */}
      <div className={styles.right}>
        <div className={styles.formBox}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`} onClick={() => { setTab('login'); setError('') }}>Entrar</button>
            <button className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`} onClick={() => { setTab('register'); setError('') }}>Criar conta</button>
          </div>

          <form onSubmit={submit} className={styles.form}>
            {tab === 'register' && (
              <div className={styles.field}>
                <label>Nome completo</label>
                <input name="nome" type="text" value={form.nome} onChange={change} placeholder="Seu nome" required />
              </div>
            )}

            <div className={styles.field}>
              <label>E-mail</label>
              <input name="email" type="email" value={form.email} onChange={change} placeholder="seu@email.com" required />
            </div>

            <div className={styles.field}>
              <label>Senha</label>
              <input name="senha" type="password" value={form.senha} onChange={change} placeholder="••••••••" required minLength={6} />
            </div>

            {tab === 'register' && (
              <div className={styles.field}>
                <label>Tipo de conta</label>
                <select name="tipo" value={form.tipo} onChange={change}>
                  <option value="cliente">Cliente — quero contratar</option>
                  <option value="freelancer">Freelancer — quero ser contratado</option>
                </select>
              </div>
            )}

            {tab === 'login' && (
              <div className={styles.forgotRow}>
                <label className={styles.remember}>
                  <input type="checkbox" /> Lembrar de mim
                </label>
                <a href="#" className={styles.forgot}>Esqueceu a senha?</a>
              </div>
            )}

            {error && <div className={styles.errorMsg}>{error}</div>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Aguarde...' : tab === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          <p className={styles.switchText}>
            {tab === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
            <button className={styles.switchBtn} onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError('') }}>
              {tab === 'login' ? 'Criar conta grátis' : 'Fazer login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
