import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import { useAuth } from '../context/AuthContext'
import { api, money, serviceImage } from '../lib/api'

export const inputClass = 'min-h-12 w-full rounded-lg border border-serv-950/20 bg-white px-4 py-3 text-sm text-serv-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-serv-600'
export const buttonClass = 'inline-flex min-h-11 items-center justify-center rounded-full bg-serv-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-serv-950 disabled:cursor-wait disabled:opacity-50'
export const secondaryClass = 'inline-flex min-h-11 items-center justify-center rounded-full border border-serv-950/20 px-5 py-2.5 text-sm font-semibold text-serv-950 hover:bg-serv-100 disabled:opacity-50'

export function Page({ title, intro, children }) {
  return <><Header /><main className="min-h-[80vh] bg-[#f7f5fa] pb-20 pt-32 text-serv-950"><div className="container"><p className="text-sm font-bold text-serv-600">SERV+ · Do encontro à entrega</p><h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>{intro && <p className="mt-4 max-w-3xl text-base leading-7 text-serv-900/65">{intro}</p>}<div className="mt-10">{children}</div></div></main><Footer /></>
}
export function Feedback({ error, notice }) {
  return <>{error && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}{notice && <p role="status" className="mb-5 rounded-lg border border-serv-200 bg-serv-100 p-4 text-sm text-serv-900">{notice}</p>}</>
}
export function Field({ label, children }) { return <label className="flex flex-col gap-2 text-sm font-semibold text-serv-950">{label}{children}</label> }
export function Empty({ children }) { return <p className="rounded-xl border border-dashed border-serv-950/20 bg-white p-8 text-sm leading-7 text-serv-900/65">{children}</p> }
export function Panel({ title, children }) { return <section className="rounded-2xl border border-serv-950/10 bg-white p-5 sm:p-7"><h2 className="mb-5 text-2xl font-bold tracking-tight">{title}</h2>{children}</section> }
export function Protected({ children }) {
  const { user, loading, error } = useAuth(); const location = useLocation()
  if (loading) return <Page title="Carregando sua conta…" />
  if (error) return <Page title="Sua conta"><Feedback error={error} /><a href={location.pathname} className={secondaryClass}>Tentar novamente</a></Page>
  return user ? children : <Navigate replace to={`/login?next=${encodeURIComponent(location.pathname)}`} />
}
export function useResource(path) {
  const [data, setData] = useState(null), [error, setError] = useState(''), [loading, setLoading] = useState(true), [version, setVersion] = useState(0)
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('')
    api(path, { signal: controller.signal }).then(value => { if (!controller.signal.aborted) setData(value) }).catch(error => { if (error.name !== 'AbortError') setError(error.message) }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [path, version])
  return { data, error, loading, reload: () => setVersion(value => value + 1) }
}
export function Pager({ page, total, limit = 12, onChange }) {
  if (total <= limit) return null
  return <nav aria-label="Paginação" className="mt-7 flex items-center gap-4"><button className={secondaryClass} disabled={page === 1} onClick={() => onChange(page - 1)}>Anterior</button><span className="text-sm">Página {page} de {Math.ceil(total / limit)}</span><button className={secondaryClass} disabled={page * limit >= total} onClick={() => onChange(page + 1)}>Próxima</button></nav>
}
export function ServiceCard({ service }) {
  return <article className="overflow-hidden rounded-2xl border border-serv-950/10 bg-white"><img src={serviceImage(service.categoria)} alt="" width="1440" height="960" loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" /><div className="flex flex-col gap-3 p-6"><p className="text-xs font-bold uppercase tracking-wide text-serv-600">{service.categoria}</p><h2 className="text-xl font-bold">{service.titulo}</h2><p className="line-clamp-3 text-sm leading-6 text-serv-900/65">{service.descricao}</p><p className="text-sm text-serv-900/70">{service.usuario?.nome || 'Profissional'}</p><p className="font-semibold">Referência: {money(service.preco)}</p><Link className={buttonClass} to={`/servicos/${service._id}`}>Conhecer e pedir orçamento</Link></div></article>
}
