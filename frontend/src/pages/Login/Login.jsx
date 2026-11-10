import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { authenticate, requestMFA, verifyMFA } = useAuth()
  const [params] = useSearchParams()

  const [tab, setTab] = useState(
    params.get('cadastro') === 'profissional'
      ? 'register'
      : 'login'
  )

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo:
      params.get('cadastro') === 'profissional'
        ? 'freelancer'
        : 'cliente',
  })

  const [mfa, setMfa] = useState({
    codigo: '',
  })

  const [mfaStep, setMfaStep] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const change = event => {
    setForm(value => ({
      ...value,
      [event.target.name]: event.target.value,
    }))
  }

  const changeMFA = event => {
    setMfa(value => ({
      ...value,
      [event.target.name]: event.target.value,
    }))
  }

  async function submit(event) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      // ==========================
      // CADASTRO
      // ==========================

      if (tab === 'register') {
        const body = {
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          tipo: form.tipo,
        }

        await authenticate('registro', body)

        const next = params.get('next') || ''

        navigate(
          /^\/(painel|servicos(?:\/[a-f\d]{24})?)$/.test(next)
            ? next
            : '/painel',
          { replace: true }
        )

        return
      }

      // ==========================
      // LOGIN - PRIMEIRA ETAPA
      // ==========================

      const result = await requestMFA({
        email: form.email,
        senha: form.senha,
      })

      if (result) {
        setMfaStep(true)
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  async function submitMFA(event) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      await verifyMFA({
        email: form.email,
        codigo: mfa.codigo,
      })

      const next = params.get('next') || ''

      navigate(
        /^\/(painel|servicos(?:\/[a-f\d]{24})?)$/.test(next)
          ? next
          : '/painel',
        { replace: true }
      )
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  function selectTab(nextTab) {
    setTab(nextTab)
    setError('')
    setMfaStep(false)
    setMfa({ codigo: '' })
  }

  function voltarParaLogin() {
    setMfaStep(false)
    setMfa({ codigo: '' })
    setError('')
  }

  return (
    <main className="grid min-h-screen bg-[#f7f5fa] lg:grid-cols-[1.04fr_.96fr]">

      {/* LADO ESQUERDO */}
      <section className="relative isolate flex min-h-[300px] flex-col overflow-hidden bg-serv-950 px-6 py-8 text-white sm:px-10 sm:py-10 lg:min-h-screen lg:px-14 lg:py-12 xl:px-20">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[.16] [background-image:linear-gradient(rgba(196,181,253,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(196,181,253,.2)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:linear-gradient(120deg,#000,transparent_82%)]"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-5 -z-10 font-display text-[min(60vw,34rem)] font-bold leading-none tracking-[-.14em] text-white/[.04]"
        >
          +
        </span>

        <Link
          to="/"
          className="w-fit text-3xl font-black leading-none tracking-[-.07em]"
          aria-label="SERV+ início"
        >
          SERV<span className="text-serv-200">+</span>
        </Link>

        <div className="my-10 max-w-xl lg:my-auto lg:py-16">
          <p className="mb-4 text-sm font-semibold text-serv-200">
            Um espaço para fazer acontecer
          </p>

          <h1 className="text-4xl font-bold leading-[.98] tracking-[-.06em] sm:text-5xl lg:text-6xl">
            {mfaStep
              ? 'Confirme seu acesso.'
              : tab === 'login'
                ? 'Bom ter você de volta.'
                : 'Comece com as pessoas certas.'}
          </h1>

          <p className="mt-5 max-w-md text-sm leading-7 text-white/65 sm:text-base">
            {mfaStep
              ? 'Enviamos um código de segurança para o seu e-mail.'
              : tab === 'login'
                ? 'Entre para acompanhar seus projetos e equipes.'
                : 'Crie seu acesso para encontrar profissionais e montar sua equipe.'}
          </p>
        </div>

        <figure className="relative hidden max-w-lg overflow-hidden border border-white/15 sm:block lg:mt-auto">
          <img
            src="/Assets/editorial/web.webp"
            alt="Espaço de trabalho de desenvolvimento"
            className="aspect-[2.5/1] w-full object-cover opacity-70"
          />

          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-serv-950/90 to-transparent px-5 pb-4 pt-10 text-sm font-semibold text-white">
            Talentos diferentes, trabalhando na mesma direção.
          </figcaption>
        </figure>
      </section>

      {/* LADO DIREITO */}
      <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-14 lg:py-16">

        <div className="w-full max-w-md">

          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-serv-900/55 transition-colors hover:text-serv-700 lg:hidden"
          >
            <span aria-hidden="true">←</span>
            Voltar ao início
          </Link>

          {!mfaStep ? (
            <>
              <p className="text-sm font-semibold text-serv-600">
                Sua conta SERV+
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-serv-950 sm:text-4xl">
                {tab === 'login'
                  ? 'Acesse sua conta'
                  : 'Crie sua conta'}
              </h2>

              <p className="mt-3 text-sm leading-6 text-serv-900/60">
                {tab === 'login'
                  ? 'Informe seus dados para continuar.'
                  : 'Leva poucos instantes para começar.'}
              </p>

              {/* ABAS */}
              <div
                className="mt-8 grid grid-cols-2 border-b border-serv-950/15"
                role="group"
                aria-label="Acesso à conta"
              >
                <button
                  type="button"
                  aria-pressed={tab === 'login'}
                  className={`border-b-2 px-3 py-3 text-sm font-bold transition-colors ${
                    tab === 'login'
                      ? 'border-serv-600 text-serv-700'
                      : 'border-transparent text-serv-900/45 hover:text-serv-900'
                  }`}
                  onClick={() => selectTab('login')}
                >
                  Entrar
                </button>

                <button
                  type="button"
                  aria-pressed={tab === 'register'}
                  className={`border-b-2 px-3 py-3 text-sm font-bold transition-colors ${
                    tab === 'register'
                      ? 'border-serv-600 text-serv-700'
                      : 'border-transparent text-serv-900/45 hover:text-serv-900'
                  }`}
                  onClick={() => selectTab('register')}
                >
                  Criar conta
                </button>
              </div>

              {/* FORMULÁRIO DE LOGIN/CADASTRO */}
              <form
                onSubmit={submit}
                className="mt-7 flex flex-col gap-5"
              >

                {tab === 'register' && (
                  <FormField
                    id="nome"
                    label="Nome completo"
                  >
                    <input
                      id="nome"
                      autoComplete="name"
                      className={inputClass}
                      name="nome"
                      type="text"
                      value={form.nome}
                      onChange={change}
                      placeholder="Seu nome"
                      required
                    />
                  </FormField>
                )}

                <FormField
                  id="email"
                  label="E-mail"
                >
                  <input
                    id="email"
                    autoComplete="email"
                    className={inputClass}
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={change}
                    placeholder="voce@email.com"
                    required
                  />
                </FormField>

                <FormField
                  id="senha"
                  label="Senha"
                >
                  <input
                    id="senha"
                    autoComplete={
                      tab === 'login'
                        ? 'current-password'
                        : 'new-password'
                    }
                    className={inputClass}
                    name="senha"
                    type="password"
                    value={form.senha}
                    onChange={change}
                    placeholder="Mínimo de 6 caracteres"
                    required
                    minLength={6}
                  />
                </FormField>

                {tab === 'register' && (
                  <FormField
                    id="tipo"
                    label="Como você vai usar a SERV?"
                  >
                    <select
                      id="tipo"
                      className={inputClass}
                      name="tipo"
                      value={form.tipo}
                      onChange={change}
                    >
                      <option value="cliente">
                        Quero contratar profissionais
                      </option>

                      <option value="freelancer">
                        Quero oferecer meus serviços
                      </option>
                    </select>
                  </FormField>
                )}

                {error && (
                  <p
                    role="alert"
                    className="border border-red-300 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 inline-flex min-h-12 items-center justify-center gap-3 bg-serv-600 px-6 text-sm font-bold text-white transition-colors hover:bg-serv-950 disabled:cursor-wait disabled:opacity-60"
                >
                  {loading
                    ? 'Aguarde…'
                    : tab === 'login'
                      ? 'Continuar'
                      : 'Criar conta'}

                  {!loading && (
                    <span aria-hidden="true">
                      ↗
                    </span>
                  )}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-serv-900/55">
                {tab === 'login'
                  ? 'Ainda não tem conta?'
                  : 'Já tem uma conta?'}{' '}

                <button
                  type="button"
                  className="font-bold text-serv-700 underline decoration-serv-300 underline-offset-4 hover:text-serv-950"
                  onClick={() =>
                    selectTab(
                      tab === 'login'
                        ? 'register'
                        : 'login'
                    )
                  }
                >
                  {tab === 'login'
                    ? 'Criar conta'
                    : 'Entrar'}
                </button>
              </p>
            </>
          ) : (
            /* ==========================
               TELA DO MFA
               ========================== */

            <>
              <p className="text-sm font-semibold text-serv-600">
                Verificação de segurança
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-serv-950 sm:text-4xl">
                Digite o código
              </h2>

              <p className="mt-3 text-sm leading-6 text-serv-900/60">
                Enviamos um código de 6 dígitos para:
              </p>

              <p className="mt-2 font-semibold text-serv-950">
                {form.email}
              </p>

              <form
                onSubmit={submitMFA}
                className="mt-8 flex flex-col gap-5"
              >
                <FormField
                  id="codigo"
                  label="Código de verificação"
                >
                  <input
                    id="codigo"
                    name="codigo"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    className={`${inputClass} text-center text-xl tracking-[0.4em]`}
                    value={mfa.codigo}
                    onChange={changeMFA}
                    placeholder="000000"
                    required
                  />
                </FormField>

                {error && (
                  <p
                    role="alert"
                    className="border border-red-300 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    mfa.codigo.length !== 6
                  }
                  className="mt-1 inline-flex min-h-12 items-center justify-center gap-3 bg-serv-600 px-6 text-sm font-bold text-white transition-colors hover:bg-serv-950 disabled:cursor-wait disabled:opacity-60"
                >
                  {loading
                    ? 'Verificando…'
                    : 'Verificar código'}

                  {!loading && (
                    <span aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              </form>

              <button
                type="button"
                className="mt-6 w-full text-sm font-semibold text-serv-700 underline decoration-serv-300 underline-offset-4 hover:text-serv-950"
                onClick={voltarParaLogin}
              >
                Voltar para o login
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

const inputClass =
  'min-h-12 w-full border border-serv-950/15 bg-white px-4 text-sm text-serv-950 placeholder:text-serv-900/35 focus-visible:ring-offset-white'

function FormField({ id, label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-serv-950"
      >
        {label}
      </label>

      {children}
    </div>
  )
}