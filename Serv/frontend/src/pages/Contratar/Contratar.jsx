import { useNavigate } from 'react-router-dom'
import Header   from '../../components/Header/Header'
import Footer   from '../../components/Footer/Footer'
import PageHero from '../../components/PageHero/PageHero'
import Carousel from '../../components/Carousel/Carousel'
import { carouselPods } from '../../data/skillPods'
import styles from './Contratar.module.css'

const digitalCombos = [
  'Front-end + Back-end + DevOps',
  'UI/UX + Front-end + Back-end',
  'Full-Stack + DevOps + QA',
  'Mobile + Back-end + DevOps',
  'UI/UX + Front-end + Copywriting',
  'Data Engineer + Data Scientist + DevOps',
  'Front-end + Back-end + Mobile',
  'DevOps + Security + Back-end',
]
const presencialCombos = [
  'Pintor + Ajudante + Limpeza',
  'Pedreiro + Ajudante + Eletricista',
  'Encanador + Eletricista + Pedreiro',
  'Jardineiro + Ajudante + Limpeza',
  'Faxineiro + Ajudante + Organizador',
  'Garçom + Cozinheiro + Auxiliar',
  'Manobrista + Porteiro + Segurança',
  'Pedreiro + Encanador + Eletricista',
]
const compareRows = [
  ['Nº de profissionais', '1', '2–4'],
  ['Gestão', 'Você gerencia', 'Auto-gerida'],
  ['Escopo', 'Tarefas isoladas', 'Projeto completo'],
  ['Prazo', 'Variável', 'Definido'],
  ['Investimento', 'Por hora', 'Por projeto'],
]

export default function Contratar() {
  const navigate = useNavigate()
  return (
    <>
      <Header />
      <main className={styles.main}>
        <PageHero
          tag="Contratação"
          title="Monte sua"
          highlight="Skill Pod"
          subtitle="Escolha a equipe certa para o seu projeto. Cada Pod é pré-montada com especialistas que se complementam."
        />

        {/* Carrossel */}
        <Carousel pods={carouselPods} />

        {/* Categorias */}
        <section className={styles.catSection}>
          <div className="container">
            <span className={styles.tagDark}>Todas as combinações</span>
            <h2 className={styles.titleDark}>Encontre a combinação<br /><span className={styles.gradientDark}>certa para você</span></h2>
            <div className={styles.catGrid}>
              <CatCard title="Skill Pods Digitais"   badge="Remoto"     badgeAlt={false} icon="/Assets/pessoa1.svg" combos={digitalCombos} />
              <CatCard title="Skill Pods Presenciais" badge="Presencial" badgeAlt={true}  icon="/Assets/pessoa2.svg" combos={presencialCombos} />
            </div>
          </div>
        </section>

        {/* Freelancer vs Pod */}
        <section className={styles.proSection}>
          <div className="container">
            <span className={styles.tagDark}>Escolha seu modelo</span>
            <h2 className={styles.titleDark}>Como prefere<br /><span className={styles.gradientDark}>contratar?</span></h2>
            <div className={styles.proGrid}>
              <div className={styles.proCard}>
                <div className={styles.proIcon}>👤</div>
                <h3>Freelancer Individual</h3>
                <p>Ideal para tarefas pontuais e específicas. Você escolhe um profissional e gerencia o trabalho.</p>
                <ul className={styles.featuresList}>
                  {['Profissional especializado','Contratação flexível','Pagamento por hora ou projeto','Perfeito para escopo reduzido'].map(f=><li key={f}>✓ {f}</li>)}
                </ul>
                <button className={styles.btnOutline} onClick={() => navigate('/freelancers')}>Explorar Freelancers →</button>
              </div>
              <div className={`${styles.proCard} ${styles.proCardFeat}`}>
                <span className={styles.proBadge}>Recomendado</span>
                <div className={styles.proIcon}>👥</div>
                <h3>Skill Pod</h3>
                <p>Equipe completa, auto-gerida, com habilidades complementares. Do início ao fim, sem complicação.</p>
                <ul className={styles.featuresList}>
                  {['Equipe pré-selecionada','Habilidades complementares','Gestão simplificada','Ideal para projetos completos'].map(f=><li key={f}>✓ {f}</li>)}
                </ul>
                <button className={styles.btnFill} onClick={() => navigate('/skillpods')}>Explorar Skill Pods →</button>
              </div>
            </div>

            {/* Tabela */}
            <div className={styles.tableCard}>
              <h3>Comparativo rápido</h3>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>Característica</th>
                      <th>Freelancer</th>
                      <th className={styles.thHL}>Skill Pod</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareRows.map(([feat, fl, sp]) => (
                      <tr key={feat}>
                        <td>{feat}</td>
                        <td>{fl}</td>
                        <td className={styles.tdHL}>{sp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function CatCard({ title, badge, badgeAlt, icon, combos }) {
  return (
    <div className={styles.catCard}>
      <div className={styles.catCardHead}>
        <img src={icon} alt={title} className={styles.catIcon} />
        <div>
          <h3>{title}</h3>
          <span className={`${styles.catBadge} ${badgeAlt ? styles.catBadgeAlt : ''}`}>{badge}</span>
        </div>
      </div>
      <ul className={styles.comboList}>
        {combos.map(c => <li key={c}>{c}</li>)}
      </ul>
    </div>
  )
}
