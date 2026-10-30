import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { GROUPS } from '../terms'
import { Stage } from '../demos/parts'

export function TermCard({ term }) {
  const { Demo } = term
  return (
    <Link to={`/term/${term.id}`} className="card">
      <Stage>
        <Demo />
      </Stage>
      <div className="card-body">
        <div className="card-title">
          <h4>{term.en}</h4>
          {term.playground && <span className="tag">체험</span>}
        </div>
        <p>{term.ko}</p>
      </div>
      <span className="card-no mono">{term.no}</span>
    </Link>
  )
}

function useActiveGroup() {
  const [active, setActive] = useState(GROUPS[0].id)
  useEffect(() => {
    const onScroll = () => {
      let cur = GROUPS[0].id
      for (const g of GROUPS) {
        const el = document.getElementById(g.id)
        if (el && el.getBoundingClientRect().top < 160) cur = g.id
      }
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return active
}

const go = (id) => (e) => {
  e.preventDefault()
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' })
}

export default function Home() {
  const active = useActiveGroup()
  const activeGroup = GROUPS.find((g) => g.id === active)
  const total = GROUPS.reduce((n, g) => n + g.sections.reduce((m, s) => m + s.items.length, 0), 0)

  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <Link to="/" className="logo">
            <span className="logo-mark" />
            바이브코딩 용어 도감
          </Link>
          <nav className="group-tabs">
            {GROUPS.map((g) => (
              <a key={g.id} href={'#' + g.id} onClick={go(g.id)} className={active === g.id ? 'on' : ''}>
                {active === g.id && <motion.span layoutId="gt" className="group-tab-bg" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                <span style={{ position: 'relative' }}>
                  {g.title.replace(' 필수 용어', '')} <b className="mono">{g.sections.reduce((m, s) => m + s.items.length, 0)}</b>
                </span>
              </a>
            ))}
          </nav>
        </div>
        <div className="sub-tabs">
          {activeGroup.sections.map((s) => (
            <a key={s.id} href={'#' + s.id} onClick={go(s.id)}>
              {s.title}
              <span className="mono">{s.items.length}</span>
            </a>
          ))}
        </div>
      </header>

      <main className="wrap">
        <section className="intro">
          <span className="eyebrow">VIBE CODING HANDBOOK</span>
          <h1>
            보면 아는데,
            <br />
            이름을 몰랐던 것들.
          </h1>
          <p>
            AI에게 정확히 말하려면 이름을 알아야 해요. 움직이는 카드를 훑어보다가 <br className="br-pc" />
            "아, 이거!" 싶은 게 보이면 눌러보세요. 직접 만져보고, AI에게 할 말까지 복사할 수 있어요.
          </p>
          <div className="intro-stats">
            <span>
              <b>{total}</b>개 용어
            </span>
            <span>
              <b>{GROUPS.length}</b>개 분류
            </span>
            <span>
              <b className="tag">체험</b> 직접 조작 가능
            </span>
          </div>
        </section>

        {GROUPS.map((g) => (
          <section key={g.id} id={g.id} className="group">
            <div className="group-head">
              <h2>
                {g.title} <span className="mono">{g.sections.reduce((m, s) => m + s.items.length, 0)}</span>
              </h2>
              <p>{g.intro}</p>
            </div>
            {g.sections.map((s) => (
              <div key={s.id} id={s.id} className="section">
                <div className="section-head">
                  <h3>
                    {s.title} <span className="mono">{s.items.length}</span>
                  </h3>
                  <span className="section-en mono">{s.en.toUpperCase()}</span>
                </div>
                <div className="grid">
                  {s.items.map((t) => (
                    <TermCard key={t.id} term={t} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}

        <footer className="foot">바이브코딩 용어 도감 · React + Motion으로 만들었어요</footer>
      </main>
    </>
  )
}
