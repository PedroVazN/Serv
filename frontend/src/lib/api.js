export async function api(path, { method = 'GET', data, auth = true, signal } = {}) {
  const token = auth ? localStorage.getItem('serv_token') : null
  let response
  try {
    response = await fetch(`/api${path}`, {
      method, signal,
      headers: { ...(data !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Não foi possível conectar ao servidor. Tente novamente.')
  }
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    if (response.status === 401 && token && localStorage.getItem('serv_token') === token) window.dispatchEvent(new Event('serv:unauthorized'))
    const error = new Error(body?.erro || (response.status === 429 ? 'Muitas tentativas. Aguarde antes de tentar novamente.' : 'Não foi possível completar esta ação.'))
    error.status = response.status
    throw error
  }
  return body
}

export const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)
export const categories = ['Web', 'Design', 'Marketing', 'Consultoria', 'Construção', 'Reformas', 'Mobile', 'Data', 'Outro']
export const serviceImage = category => `/Assets/editorial/${({ Web: 'web', Mobile: 'web', Design: 'design', Marketing: 'marketing', Consultoria: 'consultoria', Data: 'consultoria', Construção: 'pintura', Reformas: 'reformas' })[category] || 'web'}.webp`
