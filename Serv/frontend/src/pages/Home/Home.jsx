import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header    from '../../components/Header/Header'
import Footer    from '../../components/Footer/Footer'
import SectionTag from '../../components/SectionTag/SectionTag'
import PodCard   from '../../components/PodCard/PodCard'
import { catalogPods } from '../../data/skillPods'
import styles from './Home.module.css'

/* ── Contador animado ───────────── */
function useCounter(target, started) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!started) return
    let cur = 0
    const step = target / 60
    const id = setInterval(() => {
      cur += step
      if (cur >= target) { setVal(target); clearInterval(id) }
      else setVal(Math.floor(cur))
    }, 20)
    return () => clearInterval(id)
  }, [started, target])
  return val
}

export default function Home() {
  const navigate = useNavigate()
  const canvasRef   = useRef(null)
  const statsRef    = useRef(null)
  const [statsOn, setStatsOn] = useState(false)

  const c1 = useCounter(100, statsOn)
  const c2 = useCounter(500, statsOn)
  const c3 = useCounter(98,  statsOn)

  /* particles */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, pts = [], raf

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)
    for (let i = 0; i < 60; i++) pts.push({
      x: Math.random()*1200, y: Math.random()*700,
      r: Math.random()*2+.5, dx: (Math.random()-.5)*.4, dy: (Math.random()-.5)*.4,
      a: Math.random()*.5+.1
    })
    const draw = () => {
      ctx.clearRect(0,0,W,H)
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(180,140,255,${p.a})`; ctx.fill()
        p.x+=p.dx; p.y+=p.dy
        if(p.x<0||p.x>W) p.dx*=-1
        if(p.y<0||p.y>H) p.dy*=-1
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  /* stats intersection */
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsOn(true); obs.disconnect() }
    }, { threshold: .5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Header />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <canvas ref={canvasRef} className={styles.particles} />
        <div className={styles.gridLines} />

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <div className={styles.badge}>
              <span className={styles.dot} />
              Skill Pods — O futuro da contratação
            </div>
            <h1 className={styles.heroTitle}>
              Monte sua<br />
              <span className={styles.highlight}>equipe ideal</span><br />
              em minutos
            </h1>
            <p className={styles.heroDesc}>
              Conectamos você a Skill Pods — equipes modulares de 2–4 especialistas com habilidades complementares, prontas para entregar projetos completos do início ao fim.
            </p>
            <div className={styles.heroBtns}>
              <button className={styles.btnPrimary} onClick={() => navigate('/contratar')}>
                Montar minha equipe <span>→</span>
              </button>
              <button className={styles.btnGhost} onClick={() => navigate('/skillpods')}>
                Ver Skill Pods
              </button>
            </div>
            <div className={styles.stats} ref={statsRef}>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{c1}<span className={styles.statPlus}>+</span></span>
                <span className={styles.statLabel}>Skill Pods</span>
              </div>
              <div className={styles.statDiv} />
              <div className={styles.statItem}>
                <span className={styles.statNum}>{c2}<span className={styles.statPlus}>+</span></span>
                <span className={styles.statLabel}>Especialistas</span>
              </div>
              <div className={styles.statDiv} />
              <div className={styles.statItem}>
                <span className={styles.statNum}>{c3}<span className={styles.statPlus}>%</span></span>
                <span className={styles.statLabel}>Satisfação</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.scene}>
              <div className={`${styles.ring} ${styles.ring1}`} />
              <div className={`${styles.ring} ${styles.ring2}`} />
              {[
                { cls: styles.fc1, emoji: '💻', name: 'Web Excellence',  sub: 'Front-end · Back-end · UI/UX' },
                { cls: styles.fc2, emoji: '📱', name: 'Mobile Rockets',  sub: 'Mobile · Back-end · DevOps' },
                { cls: styles.fc3, emoji: '🧠', name: 'Data Insights',   sub: 'Scientist · Engineer · BI' },
              ].map(c => (
                <div key={c.name} className={`${styles.floatCard} ${c.cls}`}>
                  <div className={styles.fcIcon}>{c.emoji}</div>
                  <div className={styles.fcName}>{c.name}</div>
                  <div className={styles.fcSub}>{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <div className={styles.mouse}><div className={styles.wheel} /></div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className={styles.howSection}>
        <div className="container" style={{ textAlign: 'center' }}>
          <SectionTag>Como funciona</SectionTag>
          <h2 className={styles.sectionTitle}>
            Do briefing à entrega<br />
            <span className={styles.gradientText}>em 3 passos</span>
          </h2>
          <div className={styles.stepsGrid}>
            {[
              { n:'01', icon:'🎯', title:'Escolha sua Pod',   desc:'Selecione uma Skill Pod pré-montada com as habilidades que seu projeto precisa.' },
              { n:'02', icon:'🤝', title:'Alinhe o escopo',   desc:'A equipe já se conhece. Você apresenta o projeto e eles definem o plano.' },
              { n:'03', icon:'🚀', title:'Receba o resultado', desc:'Acompanhe em tempo real. Prazo definido, gestão simplificada, entrega garantida.' },
            ].map((s, i) => (
              <div key={s.n} className={styles.stepsRow}>
                <div className={styles.stepCard}>
                  <span className={styles.stepNum}>{s.n}</span>
                  <div className={styles.stepIcon}>{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                {i < 2 && <div className={styles.connector} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PODS SHOWCASE ── */}
      <section className={styles.podsSection}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <SectionTag>Skill Pods em destaque</SectionTag>
            <h2 className={styles.sectionTitle}>
              Equipes prontas para<br />
              <span className={styles.gradientText}>qualquer desafio</span>
            </h2>
          </div>
          <div className={styles.podsGrid}>
            {catalogPods.slice(0, 6).map(pod => (
              <PodCard key={pod.id} pod={pod} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button className={styles.btnPrimary} onClick={() => navigate('/skillpods')}>
              Ver todas as Skill Pods <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── COMPARATIVO ── */}
      <section className={styles.compareSection}>
        <div className="container" style={{ textAlign: 'center' }}>
          <SectionTag>Por que Skill Pods?</SectionTag>
          <h2 className={styles.sectionTitle}>
            Uma nova forma de<br />
            <span className={styles.gradientText}>contratar talentos</span>
          </h2>
          <div className={styles.compareGrid}>
            <div className={`${styles.compareCard} ${styles.compareOld}`}>
              <div className={styles.compareLabel}>Modelo tradicional</div>
              <h3>Freelancers avulsos</h3>
              <ul>{['Você gerencia cada profissional','Habilidades fragmentadas','Prazo incerto','Comunicação descoordenada','Escopo de tarefas isoladas'].map(t => <li key={t} className={styles.liBAD}>{t}</li>)}</ul>
            </div>
            <div className={styles.vs}>VS</div>
            <div className={`${styles.compareCard} ${styles.compareNew}`}>
              <div className={styles.compareLabel}>SERV+</div>
              <h3>Skill Pods</h3>
              <ul>{['Equipe auto-gerida','Habilidades complementares','Prazo definido e garantido','Comunicação integrada','Projetos completos do início ao fim'].map(t => <li key={t} className={styles.liGOOD}>{t}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className={styles.testimSection}>
        <div className="container" style={{ textAlign: 'center' }}>
          <SectionTag>Depoimentos</SectionTag>
          <h2 className={styles.sectionTitle}>
            O que dizem nossos<br />
            <span className={styles.gradientText}>clientes</span>
          </h2>
          <div className={styles.testimGrid}>
            {[
              { init:'M', name:'Marcos Henrique', role:'CEO, Loja Moderna', text:'"Contratei a Web Excellence Pod para refazer meu e-commerce. Em 3 semanas tinha tudo pronto, funcionando e lindo."', feat: false },
              { init:'A', name:'Ana Beatriz',     role:'Head of Data, FinTech SP', text:'"A Data Insights Pod transformou como tomamos decisões. Entregaram um dashboard completo com análises preditivas em menos de um mês."', feat: true },
              { init:'R', name:'Rafael Torres',   role:'Founder, DeliveryNow', text:'"Meu app de delivery saiu do papel em 6 semanas com a Mobile Rockets. A equipe é incrível — entregam com qualidade."', feat: false },
            ].map(t => (
              <div key={t.name} className={`${styles.testim} ${t.feat ? styles.testimFeat : ''}`}>
                <div className={styles.stars}>★★★★★</div>
                <p>{t.text}</p>
                <div className={styles.author}>
                  <div className={styles.avatar}>{t.init}</div>
                  <div><strong>{t.name}</strong><span>{t.role}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection} id="cadastro">
        <div className={styles.ctaGlow} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 className={styles.ctaTitle}>
            Pronto para montar<br />
            <span className={styles.gradientText}>sua equipe ideal?</span>
          </h2>
          <p className={styles.ctaSub}>Comece hoje. Sem mensalidades, sem burocracia — só talento e resultado.</p>
          <div className={styles.ctaBtns}>
            <button className={styles.btnPrimary} onClick={() => navigate('/contratar')}>Montar minha Skill Pod <span>→</span></button>
            <button className={styles.btnGhost}   onClick={() => navigate('/freelancers')}>Explorar Freelancers</button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Relógio */}
      <Clock />
    </>
  )
}

function Clock() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false }))
      setDate(now.toLocaleDateString('pt-BR', { weekday:'short', day:'2-digit', month:'short' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:500, background:'rgba(26,15,46,.9)', backdropFilter:'blur(20px)', border:'1px solid rgba(107,70,193,.3)', borderRadius:'var(--radius-md)', padding:'14px 20px', textAlign:'center' }}>
      <div style={{ fontSize:'1.3rem', fontWeight:800, background:'linear-gradient(135deg,#fff,#c4b5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:2 }}>{time}</div>
      <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.5)', textTransform:'capitalize' }}>{date}</div>
    </div>
  )
}
