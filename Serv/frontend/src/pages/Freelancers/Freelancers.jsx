import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header   from '../../components/Header/Header'
import Footer   from '../../components/Footer/Footer'
import PageHero from '../../components/PageHero/PageHero'
import { freelancers } from '../../data/skillPods'
import styles from './Freelancers.module.css'

function FreelancerCard({ f }) {
  const ref = useRef(null)
  const onMove = e => {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - .5
    const y = (e.clientY - r.top)  / r.height - .5
    ref.current.style.transform = `perspective(700px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateZ(10px)`
  }
  const onLeave = () => { ref.current.style.transform = '' }

  return (
    <div ref={ref} className={styles.card} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className={styles.avatarWrap}>
        <img src={f.image} alt={f.name} className={styles.avatar} />
        <div className={styles.ring} />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{f.name}</h3>
        <p  className={styles.role}>{f.role}</p>
        <ul className={styles.skills}>
          {f.skills.map(s => <li key={s}>{s}</li>)}
        </ul>
      </div>
      <button className={styles.btn}>Ver perfil →</button>
    </div>
  )
}

export default function Freelancers() {
  const navigate = useNavigate()
  return (
    <>
      <Header />
      <main>
        <PageHero
          tag="Talentos individuais"
          title="Freelancers"
          highlight="disponíveis"
          subtitle="Profissionais especializados prontos para colaborar no seu projeto. Contrate individualmente ou combine em uma Skill Pod."
        />

        <section className={styles.section}>
          <div className="container">
            <div className={styles.grid}>
              {freelancers.map(f => <FreelancerCard key={f.id} f={f} />)}
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaGlow} />
          <div className="container" style={{ textAlign:'center', position:'relative', zIndex:1 }}>
            <h2>Prefere uma equipe<br /><span className={styles.gradientText}>completa?</span></h2>
            <p>Monte uma Skill Pod e tenha um time auto-gerido entregando do início ao fim.</p>
            <button className={styles.ctaBtn} onClick={() => navigate('/skillpods')}>Ver Skill Pods →</button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
