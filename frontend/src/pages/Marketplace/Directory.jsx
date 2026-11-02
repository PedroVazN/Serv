import { useState } from 'react'
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api, categories, money, serviceImage } from '../../lib/api'
import { Page, Feedback, Field, Empty, Panel, Pager, ServiceCard, useResource, inputClass, buttonClass, secondaryClass } from '../../components/MarketplaceUI'

export function FreelancersDirectory() {
  const [page, setPage] = useState(1), [area, setArea] = useState(''), [filter, setFilter] = useState('')
  const { data, loading, error, reload } = useResource(`/usuarios/freelancers?limit=12&page=${page}&area=${encodeURIComponent(filter)}`)
  return <Page title="Encontre seu profissional." intro="Conheça profissionais cadastrados no SERV+, explore seus serviços e alinhe o trabalho antes de contratar.">
    <form className="mb-7 flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={event => { event.preventDefault(); setPage(1); setFilter(area.trim()) }}><input className={inputClass} aria-label="Área de atuação" placeholder="Buscar por área de atuação" maxLength={120} value={area} onChange={event => setArea(event.target.value)} /><button className={buttonClass}>Buscar</button></form>
    <Feedback error={error} />{error && <button className={secondaryClass} onClick={reload}>Tentar novamente</button>}
    {loading ? <p role="status">Carregando profissionais…</p> : data?.resultados.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{data.resultados.map(person => <article key={person._id} className="flex flex-col gap-4 rounded-2xl border border-serv-950/10 bg-white p-6"><div className="flex items-center gap-4"><span aria-hidden="true" className="grid size-16 shrink-0 place-items-center rounded-full bg-serv-100 font-display text-xl font-bold text-serv-700">{person.nome.split(' ').filter(Boolean).slice(0, 2).map(word => word[0]).join('')}</span><div><h2 className="text-xl font-bold">{person.nome}</h2><p className="text-sm text-serv-600">{person.perfil_freelancer?.area_atuacao || 'Profissional independente'}</p></div></div><p className="line-clamp-3 text-sm leading-7 text-serv-900/65">{person.perfil_freelancer?.descricao || 'Conheça os serviços publicados por este profissional.'}</p><p className="text-xs font-semibold">{person.perfil_freelancer?.disponibilidade === 'indisponivel' ? 'Indisponível para novos projetos' : 'Recebendo solicitações'}</p><Link className={`${buttonClass} mt-auto`} to={`/profissionais/${person._id}`}>Ver perfil e serviços</Link></article>)}</div> : !error && <Empty>Nenhum profissional encontrado. Se você oferece serviços, <Link className="font-bold underline" to="/login">crie uma conta de profissional</Link> e publique seu primeiro serviço.</Empty>}
    {data && <Pager page={page} total={data.total} onChange={setPage} />}
  </Page>
}

export function ServicesDirectory() {
  const [params] = useSearchParams()
  const initialSearch = (params.get('busca') || '').slice(0, 160)
  const [page, setPage] = useState(1), [category, setCategory] = useState(categories.includes(params.get('categoria')) ? params.get('categoria') : ''), [search, setSearch] = useState(initialSearch), [query, setQuery] = useState(initialSearch)
  const { data, loading, error, reload } = useResource(`/servicos?limit=12&page=${page}&categoria=${encodeURIComponent(category)}&busca=${encodeURIComponent(query)}`)
  return <Page title="Serviços para seu projeto." intro="Serviços publicados por profissionais cadastrados. O preço é uma referência: combine valor, prazo e entregas em um orçamento antes de contratar.">
    <form className="mb-7 grid gap-3 md:grid-cols-[1fr_240px_auto]" onSubmit={event => { event.preventDefault(); setQuery(search.trim()); setPage(1) }}><input aria-label="Buscar serviço" className={inputClass} maxLength={160} placeholder="O que você precisa fazer?" value={search} onChange={event => setSearch(event.target.value)} /><select aria-label="Categoria" className={inputClass} value={category} onChange={event => { setCategory(event.target.value); setPage(1) }}><option value="">Todas as categorias</option>{categories.map(category => <option key={category}>{category}</option>)}</select><button className={buttonClass}>Buscar</button></form>
    <Feedback error={error} />{error && <button className={secondaryClass} onClick={reload}>Tentar novamente</button>}
    {loading ? <p role="status">Carregando serviços…</p> : data?.resultados.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{data.resultados.map(service => <ServiceCard key={service._id} service={service} />)}</div> : !error && <Empty>Nenhum serviço encontrado. Tente outra busca ou volte quando novos serviços forem publicados.</Empty>}
    {data && <Pager page={page} total={data.total} onChange={setPage} />}
  </Page>
}

export function ProfessionalProfile() {
  const { id } = useParams(), [page, setPage] = useState(1)
  const profile = useResource(`/usuarios/freelancers/${id}`)
  const services = useResource(`/servicos?profissional=${id}&limit=12&page=${page}`)
  const person = profile.data, details = person?.perfil_freelancer
  return <Page title={person?.nome || 'Perfil profissional'} intro={details?.area_atuacao}>
    <Feedback error={profile.error || services.error} />
    {profile.loading ? <p role="status">Carregando perfil…</p> : person && <>
      <Panel title="Sobre o profissional"><p className="whitespace-pre-wrap text-sm leading-7 text-serv-900/70">{details?.descricao || 'Este profissional ainda não adicionou uma apresentação.'}</p>{details?.experiencia && <p className="mt-5 whitespace-pre-wrap text-sm leading-7">{details.experiencia}</p>}<p className="mt-5 text-sm font-bold">{details?.disponibilidade === 'indisponivel' ? 'Indisponível para novos projetos' : 'Disponível para receber orçamentos'}</p>{details?.portfolio_url && <a className="mt-5 inline-block font-semibold underline" href={details.portfolio_url} target="_blank" rel="noopener noreferrer">Conhecer portfólio ↗</a>}</Panel>
      <h2 className="mb-5 mt-10 text-2xl font-bold">Serviços publicados</h2>
      {services.loading ? <p role="status">Carregando serviços…</p> : services.data?.resultados.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{services.data.resultados.map(service => <ServiceCard key={service._id} service={service} />)}</div> : !services.error && <Empty>Este profissional ainda não tem serviços ativos.</Empty>}
      {services.data && <Pager page={page} total={services.data.total} onChange={setPage} />}
    </>}
  </Page>
}

export function ServiceDetail() {
  const { id } = useParams(), navigate = useNavigate(), { user } = useAuth()
  const { data: service, error, loading } = useResource(`/servicos/${id}`)
  const [description, setDescription] = useState(''), [busy, setBusy] = useState(false), [submitError, setSubmitError] = useState('')
  async function submit(event) {
    event.preventDefault(); setBusy(true); setSubmitError('')
    try { await api('/orcamentos', { method: 'POST', data: { servico_id: id, descricao: description.trim() } }); navigate('/painel?enviado=1') }
    catch (error) { setSubmitError(error.message) } finally { setBusy(false) }
  }
  const available = service?.usuario?.perfil_freelancer?.disponibilidade !== 'indisponivel'
  return <Page title={service?.titulo || 'Conheça o serviço'} intro={service?.categoria}>
    <Feedback error={error} />{loading && <p role="status">Carregando serviço…</p>}
    {service && <div className="grid gap-7 lg:grid-cols-[1.1fr_1fr]"><section><img width="1440" height="960" className="mb-6 aspect-[3/2] w-full rounded-2xl object-cover" src={serviceImage(service.categoria)} alt={`Imagem ilustrativa de ${service.categoria}`} /><p className="whitespace-pre-wrap text-base leading-8 text-serv-900/75">{service.descricao}</p>{service.usuario && <Link className="mt-5 inline-block font-bold text-serv-600 underline" to={`/profissionais/${service.usuario._id}`}>Conhecer {service.usuario.nome}</Link>}</section>
      <Panel title="Vamos conversar sobre seu projeto?"><p className="mb-3 text-lg font-bold">Valor de referência: {money(service.preco)}</p><p className="mb-6 text-sm leading-7 text-serv-900/65">Conte o que você precisa. O profissional responderá com o escopo, o preço e o prazo. Enviar uma solicitação não gera cobrança.</p><Feedback error={submitError} />
        {!available ? <Empty>Este profissional está indisponível para novas solicitações.</Empty> : !user ? <Link className={buttonClass} to={`/login?next=${encodeURIComponent(`/servicos/${id}`)}`}>Entrar para pedir orçamento</Link> : user.tipo !== 'cliente' ? <Empty>Entre com uma conta de cliente para solicitar este serviço. Sua conta atual é de {user.tipo === 'freelancer' ? 'profissional' : 'administrador'}.</Empty> : <form onSubmit={submit} className="space-y-5"><Field label="Descreva seu projeto"><textarea required minLength={10} maxLength={4000} rows={7} className={inputClass} value={description} onChange={event => setDescription(event.target.value)} placeholder="Objetivo, entregas esperadas e informações importantes…" /></Field><button className={buttonClass} disabled={busy}>{busy ? 'Enviando…' : 'Solicitar orçamento'}</button></form>}
      </Panel></div>}
  </Page>
}
