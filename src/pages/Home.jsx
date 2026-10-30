import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { GROUPS, searchTerms } from '../terms'
import { Stage, Icon, Check } from '../demos/parts'

export function TermCard({ term, alias }) {
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
          {term.adv && <span className="lv">알면 좋음</span>}
        </div>
        <p>{term.ko}</p>
        {alias && <p className="card-alias">'{alias}'(으)로도 불려요</p>}
      </div>
      <span className="card-no mono">{term.no}</span>
    </Link>
  )
}

const visible = (items, basicOnly) => items.filter((t) => !basicOnly || !t.adv)
const count = (g, basicOnly) => g.sections.reduce((m, s) => m + visible(s.items, basicOnly).length, 0)

function useActiveGroup() {
  const [active, setActive] = useState(GROUPS[0].id)
  useEffect(() => {
    const onScroll = () => {
      let cur = GROUPS[0].id
      for (const g of GROUPS) {
        const el = document.getElementById(g.id)
        if (el && el.getBoundingClientRect().top < 170) cur = g.id
      }
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return active
}

const PREF = 'basicOnly'
function readPref() {
  try {
    return localStorage.getItem(PREF) === '1'
  } catch {
    return false
  }
}
function writePref(v) {
  try {
    localStorage.setItem(PREF, v ? '1' : '0')
  } catch {
    /* 저장 못 해도 동작에는 문제없음 */
  }
}

export default function Home() {
  const active = useActiveGroup()
  const activeGroup = GROUPS.find((g) => g.id === active)
  const [q, setQ] = useState('')
  const [basicOnly, setBasicOnly] = useState(readPref)
  const hits = q.trim() ? searchTerms(q) : null

  const go = (id) => (e) => {
    e.preventDefault()
    setQ('')
    requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 124, behavior: 'smooth' })
    })
  }
  const toggleBasic = () => {
    writePref(!basicOnly)
    setBasicOnly(!basicOnly)
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <Link to="/" className="logo">
            VIBE CODING HANDBOOK
          </Link>
          <nav className="group-tabs">
            {GROUPS.map((g) => {
              const on = !hits && active === g.id
              return (
                <a key={g.id} href={'#' + g.id} onClick={go(g.id)} className={on ? 'on' : ''}>
                  {on && <motion.span layoutId="gt" className="group-tab-bg" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                  <span style={{ position: 'relative' }}>
                    {g.short} <b className="mono">{count(g, basicOnly)}</b>
                  </span>
                </a>
              )
            })}
          </nav>
          <label className="search">
            <Icon n="search" size={15} color="#8a857b" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="검색 (예: 팝업, 배포)" />
            {q && (
              <button className="search-x" onClick={() => setQ('')} aria-label="검색어 지우기">
                <Icon n="x" size={12} w={2.6} />
              </button>
            )}
          </label>
        </div>
        <div className="sub-tabs">
          {!hits &&
            activeGroup.sections.map((s) => {
              const n = visible(s.items, basicOnly).length
              if (!n) return null
              return (
                <a key={s.id} href={'#' + s.id} onClick={go(s.id)}>
                  {s.title}
                  <span className="mono">{n}</span>
                </a>
              )
            })}
          <button className={'basic-toggle' + (basicOnly ? ' on' : '')} onClick={toggleBasic}>
            <span className="bt-box">{basicOnly && <Check size={10} color="#fff" width={3.6} />}</span>
            기본만 보기
          </button>
        </div>
      </header>

      <main className="wrap">
        {hits ? (
          <section className="group">
            <div className="group-head">
              <h2>
                '{q.trim()}' 검색 결과 <span className="mono">{hits.length}</span>
              </h2>
            </div>
            {hits.length ? (
              <div className="grid">
                {hits.map(({ term, alias }) => (
                  <TermCard key={term.id} term={term} alias={alias} />
                ))}
              </div>
            ) : (
              <p className="no-hit">찾는 용어가 없어요. 영어 이름이나 비슷한 한글 표현으로도 찾아보세요.</p>
            )}
          </section>
        ) : (
          GROUPS.map((g) => (
            <section key={g.id} id={g.id} className="group">
              <div className="group-head">
                <h2>
                  {g.title} <span className="mono">{count(g, basicOnly)}</span>
                </h2>
                <p>{g.intro}</p>
              </div>
              {g.sections.map((s) => {
                const items = visible(s.items, basicOnly)
                if (!items.length) return null
                return (
                  <div key={s.id} id={s.id} className="section">
                    <div className="section-head">
                      <h3>
                        {s.title} <span className="mono">{items.length}</span>
                      </h3>
                      <span className="section-en mono">{s.en.toUpperCase()}</span>
                    </div>
                    <div className="grid">
                      {items.map((t) => (
                        <TermCard key={t.id} term={t} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </section>
          ))
        )}
      </main>
    </>
  )
}
