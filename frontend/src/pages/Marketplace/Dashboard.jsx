import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api, categories, money } from '../../lib/api'
import { Page, Feedback, Field, Empty, Panel, Pager, Protected, useResource, inputClass, buttonClass, secondaryClass } from '../../components/MarketplaceUI'

const statuses = { solicitado: 'Aguardando profissional', respondido: 'Proposta recebida', aceito: 'Aceito', recusado: 'Recusado', pendente: 'Pendente', em_andamento: 'Em andamento', concluido: 'Concluído', cancelado: 'Cancelado' }
export default function Dashboard() { return <Protected><Account /></Protected> }

function Account() {
  const { user } = useAuth(), [params] = useSearchParams()
  const [tab, setTab] = useState('orcamentos'), [quotePage, setQuotePage] = useState(1), [orderPage, setOrderPage] = useState(1)
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState(params.has('enviado') ? 'Solicitação enviada. Você pode acompanhar a resposta por aqui.' : '')
  const professional = user.tipo === 'freelancer', admin = user.tipo === 'admin'
  const quotes = useResource(`/orcamentos?limit=12&page=${quotePage}`)
  const orders = useResource(`/pedidos${professional ? '/recebidos' : admin ? '/todos' : ''}?limit=12&page=${orderPage}`)
  const services = useResource(professional ? '/servicos/meus' : '/auth/me')
  async function perform(path, method, data, message) {
    setBusy(true); setError(''); setNotice('')
    try { await api(path, { method, data }); setNotice(message); quotes.reload(); orders.reload(); services.reload(); return true }
    catch (error) { setError(error.message); return false } finally { setBusy(false) }
  }
  const tabs = [['orcamentos', 'Orçamentos'], ['pedidos', 'Pedidos'], ...(professional ? [['servicos', 'Meus serviços']] : []), ['perfil', 'Meu perfil']]
  return <Page title={professional ? 'Meu trabalho' : admin ? 'Administração' : 'Meus projetos'} intro={`${user.nome} · ${professional ? 'Conta de profissional' : admin ? 'Administração da plataforma' : 'Conta de cliente'}`}>
    <div className="mb-6 flex flex-wrap gap-3">{tabs.map(([key, label]) => <button key={key} aria-pressed={tab === key} onClick={() => { setTab(key); setError(''); setNotice('') }} className={tab === key ? buttonClass : secondaryClass}>{label}</button>)}<Link to="/servicos" className={secondaryClass}>Explorar serviços</Link></div>
    <Feedback error={error} notice={notice} />
    {tab === 'perfil' && <ProfileEditor />}
    {tab === 'servicos' && professional && <div className="grid gap-7 lg:grid-cols-2"><ServiceEditor busy={busy} onSave={(data) => perform('/servicos', 'POST', data, 'Serviço publicado. Ele já aparece na busca de serviços.')} /><Panel title="Seus serviços"><Feedback error={services.error} />{services.loading ? <p role="status">Carregando…</p> : services.data?.length ? <div className="space-y-4">{services.data.map(service => <article key={service._id} className="rounded-xl border border-serv-950/10 p-4"><h3 className="font-bold">{service.titulo}</h3><p className="my-2 text-sm">{money(service.preco)} · {service.ativo ? 'Publicado' : 'Pausado'}</p><button disabled={busy} className={secondaryClass} onClick={() => perform(`/servicos/${service._id}`, 'PATCH', { ativo: !service.ativo }, service.ativo ? 'Serviço pausado.' : 'Serviço reativado.')}>{service.ativo ? 'Pausar' : 'Publicar novamente'}</button></article>)}</div> : !services.error && <Empty>Publique seu primeiro serviço usando o formulário ao lado.</Empty>}</Panel></div>}
    {tab === 'orcamentos' && <Panel title={professional ? 'Solicitações e propostas' : 'Orçamentos'}><div className="mb-5"><button className={secondaryClass} disabled={quotes.loading} onClick={quotes.reload}>Atualizar orçamentos</button></div><Feedback error={quotes.error} />{quotes.loading ? <p role="status">Carregando orçamentos…</p> : quotes.data?.resultados.length ? <div className="space-y-5">{quotes.data.resultados.map(quote => <QuoteCard key={quote._id} quote={quote} professional={professional} admin={admin} busy={busy} perform={perform} />)}</div> : !quotes.error && <Empty>{professional ? 'Quando um cliente solicitar orçamento para um serviço seu, a solicitação aparecerá aqui.' : 'Você ainda não tem solicitações. Explore os serviços e conte o que precisa fazer.'}</Empty>}{quotes.data && <Pager page={quotePage} total={quotes.data.total} onChange={setQuotePage} />}</Panel>}
    {tab === 'pedidos' && <Panel title={professional ? 'Projetos contratados' : 'Acompanhe seus pedidos'}><p className="mb-5 text-sm leading-7 text-serv-900/65">O aceite registra o combinado. O SERV+ ainda não processa pagamentos nem confirma recebimentos de valores.</p><button className={`${secondaryClass} mb-5`} onClick={orders.reload}>Atualizar pedidos</button><Feedback error={orders.error} />{orders.loading ? <p role="status">Carregando pedidos…</p> : orders.data?.resultados.length ? <div className="space-y-5">{orders.data.resultados.map(order => <OrderCard key={order._id} order={order} client={!professional && !admin} busy={busy} perform={perform} />)}</div> : !orders.error && <Empty>Os pedidos aparecem após o aceite de uma proposta.</Empty>}{orders.data && <Pager page={orderPage} total={orders.data.total} onChange={setOrderPage} />}</Panel>}
  </Page>
}

function ProfileEditor() {
  const { user, updateUser } = useAuth(), details = user.perfil_freelancer || {}
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); setBusy(true); setError(''); setNotice('')
    const { nome, ...perfil } = values
    try { const saved = await api(`/usuarios/${user._id}`, { method: 'PATCH', data: { nome, ...(user.tipo === 'freelancer' ? { perfil_freelancer: perfil } : {}) } }); updateUser(saved); setNotice('Perfil atualizado.') }
    catch (error) { setError(error.message) } finally { setBusy(false) }
  }
  return <Panel title="Seu perfil"><form onSubmit={submit} className="max-w-2xl space-y-5"><Feedback error={error} notice={notice} /><Field label="Nome"><input name="nome" className={inputClass} required maxLength={120} defaultValue={user.nome} /></Field><p className="text-sm text-serv-900/60">Conta: {user.email} · {user.tipo === 'freelancer' ? 'Profissional' : user.tipo === 'admin' ? 'Administrador' : 'Cliente'}</p>{user.tipo === 'freelancer' && <><Field label="Área de atuação"><input className={inputClass} name="area_atuacao" required maxLength={120} defaultValue={details.area_atuacao || ''} placeholder="Ex.: desenvolvimento web" /></Field><Field label="Apresente seu trabalho"><textarea className={inputClass} name="descricao" required maxLength={2000} rows={4} defaultValue={details.descricao || ''} /></Field><Field label="Experiência"><textarea className={inputClass} name="experiencia" maxLength={2000} rows={3} defaultValue={details.experiencia || ''} /></Field><Field label="Portfólio (endereço HTTPS)"><input className={inputClass} name="portfolio_url" type="url" pattern="https://.*" maxLength={500} defaultValue={details.portfolio_url || ''} placeholder="https://…" /></Field><Field label="Disponibilidade"><select className={inputClass} name="disponibilidade" defaultValue={details.disponibilidade || 'disponivel'}><option value="disponivel">Recebendo novos projetos</option><option value="indisponivel">Indisponível no momento</option></select></Field><p className="text-sm leading-6 text-serv-900/60">Nome e apresentação aparecem no diretório público. E-mail, telefone e documentos não aparecem no perfil público.</p></>}<button disabled={busy} className={buttonClass}>{busy ? 'Salvando…' : 'Salvar perfil'}</button></form></Panel>
}

function ServiceEditor({ busy, onSave }) {
  async function submit(event) {
    event.preventDefault(); const form = event.currentTarget, values = Object.fromEntries(new FormData(form))
    if (await onSave({ ...values, preco: Number(values.preco) })) form.reset()
  }
  return <Panel title="Publique um serviço"><form onSubmit={submit} className="space-y-5"><Field label="Título do serviço"><input className={inputClass} name="titulo" required maxLength={160} placeholder="Ex.: desenvolvimento de site institucional" /></Field><Field label="Descrição"><textarea className={inputClass} name="descricao" rows={5} required maxLength={4000} /></Field><div className="grid gap-5 sm:grid-cols-2"><Field label="Categoria"><select className={inputClass} name="categoria">{categories.map(category => <option key={category}>{category}</option>)}</select></Field><Field label="Preço de referência (R$)"><input className={inputClass} type="number" name="preco" required min="0" max="1000000" step="0.01" /></Field></div><p className="text-sm leading-6 text-serv-900/60">O valor final e o prazo serão combinados no orçamento. A fotografia da categoria é ilustrativa.</p><button disabled={busy} className={buttonClass}>Publicar serviço</button></form></Panel>
}

function QuoteCard({ quote, professional, admin, busy, perform }) {
  function respond(event) {
    event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget))
    perform(`/orcamentos/${quote._id}/responder`, 'PATCH', { escopo: values.escopo, valor: Number(values.valor), prazo_dias: Number(values.prazo_dias) }, 'Proposta enviada ao cliente.')
  }
  return <article className="rounded-xl border border-serv-950/15 p-5"><div className="flex flex-wrap justify-between gap-3"><h3 className="text-lg font-bold">{quote.titulo_servico}</h3><span className="rounded-full bg-serv-100 px-3 py-1 text-xs font-semibold text-serv-700">{professional && quote.status === 'respondido' ? 'Proposta enviada' : statuses[quote.status]}</span></div><p className="mt-2 text-sm text-serv-900/60">{professional ? `Cliente: ${quote.cliente?.nome || 'Conta indisponível'}` : `Profissional: ${quote.profissional?.nome || 'Conta indisponível'}`} · {new Date(quote.createdAt).toLocaleDateString('pt-BR')}</p><p className="mt-4 whitespace-pre-wrap text-sm leading-7">{quote.descricao}</p>
    {quote.proposta?.escopo && <div className="mt-5 rounded-lg bg-serv-50 p-4"><p className="font-bold">{money(quote.proposta.valor)} · {quote.proposta.prazo_dias} dias após o aceite</p><p className="mt-2 whitespace-pre-wrap text-sm leading-7">{quote.proposta.escopo}</p></div>}
    {!admin && professional && quote.status === 'solicitado' && <form onSubmit={respond} className="mt-6 space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Valor da proposta (R$)"><input className={inputClass} name="valor" type="number" min="0.01" max="1000000" step="0.01" required /></Field><Field label="Prazo após o aceite (dias)"><input className={inputClass} name="prazo_dias" type="number" min="1" max="365" step="1" required /></Field></div><Field label="Escopo e entregas da proposta"><textarea className={inputClass} name="escopo" rows={4} required minLength={10} maxLength={4000} /></Field><button className={buttonClass} disabled={busy}>Enviar proposta</button></form>}
    {!admin && <div className="mt-5 flex flex-wrap gap-3">{!professional && quote.status === 'respondido' && <button className={buttonClass} disabled={busy} onClick={() => perform(`/orcamentos/${quote._id}/aceitar`, 'POST', undefined, 'Proposta aceita. O pedido está na aba Pedidos.')}>Aceitar proposta e criar pedido</button>}{((professional && quote.status === 'solicitado') || (!professional && ['solicitado', 'respondido'].includes(quote.status))) && <button className={secondaryClass} disabled={busy} onClick={() => perform(`/orcamentos/${quote._id}/recusar`, 'PATCH', undefined, 'Orçamento encerrado sem contratação.')}>{professional ? 'Recusar solicitação' : 'Encerrar sem contratar'}</button>}</div>}
  </article>
}

function OrderCard({ order, client, busy, perform }) {
  const [reviewed, setReviewed] = useState(false)
  function review(event) {
    event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget))
    perform('/avaliacoes', 'POST', { pedido_id: order._id, servico_id: order.itens[0].servico?._id || order.itens[0].servico, nota: Number(values.nota), comentario: values.comentario }, 'Avaliação registrada.').then(ok => { if (ok) setReviewed(true) })
  }
  return <article className="rounded-xl border border-serv-950/15 p-5"><div className="flex flex-wrap justify-between gap-3"><h3 className="text-lg font-bold">{order.itens.map(item => item.servico?.titulo || 'Serviço contratado').join(', ')}</h3><span className="text-sm font-bold text-serv-600">{statuses[order.status]}</span></div><p className="mt-3 font-semibold">{money(order.valor_total)}{order.prazo_dias ? ` · ${order.prazo_dias} dias a partir de ${new Date(order.data_pedido).toLocaleDateString('pt-BR')}` : ''}</p><p className="mt-2 text-sm text-serv-900/60">{client ? `Profissional: ${order.profissional?.nome || 'Consulte seu orçamento'}` : `Cliente: ${order.cliente?.nome || 'Conta indisponível'}`}</p>{order.escopo && <p className="mt-4 whitespace-pre-wrap text-sm leading-7">{order.escopo}</p>}
    {client && order.orcamento && order.status === 'em_andamento' && <form onSubmit={event => { event.preventDefault(); perform(`/pedidos/${order._id}/concluir`, 'PATCH', undefined, 'Entrega confirmada. Você já pode avaliar o serviço.') }} className="mt-5 space-y-4"><label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" required className="mt-1" />Recebi e conferi as entregas combinadas no orçamento.</label><button disabled={busy} className={buttonClass}>Confirmar entrega concluída</button></form>}
    {client && order.status === 'concluido' && !reviewed && !order.avaliado && <form className="mt-5 space-y-4" onSubmit={review}><Field label="Sua avaliação"><select className={inputClass} name="nota" defaultValue="5">{[5, 4, 3, 2, 1, 0].map(nota => <option key={nota} value={nota}>{nota} de 5</option>)}</select></Field><Field label="Comentário"><textarea className={inputClass} name="comentario" rows={3} maxLength={2000} /></Field><button className={secondaryClass} disabled={busy}>Enviar avaliação</button></form>}
    {(reviewed || order.avaliado) && <p className="mt-4 text-sm font-semibold text-serv-600">Obrigado! Sua avaliação foi registrada.</p>}
  </article>
}
