import { Link } from 'react-router-dom'

const platformLinks = [
  ['Início', '/'],
  ['Skill Pods', '/contratar'],
  ['Catálogo', '/skillpods'],
  ['Freelancers', '/freelancers'],
]

export default function Footer() {
  return (
    <footer className="bg-serv-950 text-white">
      <div className="container grid gap-12 py-14 sm:grid-cols-[1.3fr_.7fr] sm:py-16 lg:grid-cols-[1.5fr_.65fr_.85fr] lg:gap-20 lg:py-20">
        <div className="max-w-lg">
          <Link to="/" className="inline-block text-3xl font-black leading-none tracking-[-.07em]">SERV<span className="text-serv-200">+</span></Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/60 sm:text-base">
            Pessoas certas, trabalhando juntas. Encontre profissionais e equipes para fazer seu projeto avançar.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-bold text-serv-200">Explore</h2>
          <ul className="flex flex-col gap-3">
            {platformLinks.map(([label, to]) => <li key={to}><Link to={to} className="text-sm text-white/65 transition-colors hover:text-white">{label}</Link></li>)}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-bold text-serv-200">Fale com a SERV</h2>
          <ul className="flex flex-col gap-3 text-sm text-white/65">
            <li><a className="transition-colors hover:text-white" href="mailto:servmais@gmail.com">servmais@gmail.com</a></li>
            <li><a className="transition-colors hover:text-white" href="tel:+5511934932343">(11) 93493-2343</a></li>
            <li>São Paulo, SP — Brasil</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>© {new Date().getFullYear()} SERV+. Todos os direitos reservados.</p>
          <a className="w-fit transition-colors hover:text-white" href="https://github.com/PedroVazN" target="_blank" rel="noreferrer">Desenvolvido por Pedro Vaz Nascimento</a>
        </div>
      </div>
    </footer>
  )
}
