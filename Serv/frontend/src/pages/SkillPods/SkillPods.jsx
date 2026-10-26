import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header   from '../../components/Header/Header'
import Footer   from '../../components/Footer/Footer'
import PageHero from '../../components/PageHero/PageHero'
import PodCard  from '../../components/PodCard/PodCard'
import { catalogPods } from '../../data/skillPods'
import styles from './SkillPods.module.css'

export default function SkillPods() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const canvasRef = useRef(null)

  const visible = catalogPods.filter(p => filter === 'all' || p.category === filter)

  /* particles mini */
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, pts = [], raf
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    for (let i = 0; i < 40; i++) pts.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.5+.5, dx: (Math.random()-.5)*.35, dy: (Math.random()-.5)*.35, a: Math.random()*.4+.1 })
    const draw = () => { ctx.clearRect(0,0,W,H); pts.forEach(p => { ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(196,181,253,${p.a})`; ctx.fill(); p.x+=p.dx; p.y+=p.dy; if(p.x<0||p.x>W) p.dx*=-1; if(p.y<0||p.y>H) p.dy*=-1 }); raf=requestAnimationFrame(draw) }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <>
      <Header />
      <main>
        <PageHero
          tag="Catálogo completo"
          title="Conheça nossas"
          highlight="Skill Pods"
          subtitle="Equipes modulares pré-montadas com especialistas complementares. Cada Pod foi desenhada para entregar projetos completos."
        >
          <canvas ref={canvasRef} className={styles.particles} />
          <div className={styles.filterRow}>
            {[['all','Todas'],['digital','Digital'],['presencial','Presencial']].map(([val, label]) => (
              <button
                key={val}
                className={`${styles.filterBtn} ${filter === val ? styles.filterActive : ''}`}
                onClick={() => setFilter(val)}
              >{label}</button>
            ))}
          </div>
        </PageHero>

        <section className={styles.podsSection}>
          <div className="container">
            <div className={styles.grid}>
              {visible.map(pod => <PodCard key={pod.id} pod={pod} />)}
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaGlow} />
          <div className="container" style={{ textAlign:'center', position:'relative', zIndex:1 }}>
            <h2>Não encontrou a Pod<br /><span className={styles.gradientText}>ideal para você?</span></h2>
            <p>Monte uma Skill Pod personalizada com os especialistas que seu projeto precisa.</p>
            <button className={styles.ctaBtn} onClick={() => navigate('/contratar')}>
              Montar Pod Personalizada →
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
