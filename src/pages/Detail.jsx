import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { TERMS, getTerm } from '../terms'
import { Stage } from '../demos/parts'
import { PromptBox } from '../components/kit'
import { PLAYGROUNDS } from '../playgrounds'
import { TermCard } from './Home'

export default function Detail() {
  const { id } = useParams()
  const term = getTerm(id)

  if (!term) {
    return (
      <main className="wrap detail">
        <p>용어를 찾을 수 없어요.</p>
        <Link to="/" className="btn">
          전체 용어로
        </Link>
      </main>
    )
  }

  const { Demo } = term
  const Playground = term.playground && PLAYGROUNDS[term.playground]
  const idx = TERMS.indexOf(term)
  const prev = TERMS[idx - 1]
  const next = TERMS[idx + 1]
  const related = term.section.items.filter((x) => x !== term).slice(0, 4)

  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <Link to="/" className="logo">
            <span className="logo-mark" />
            바이브코딩 용어 도감
          </Link>
          <Link to={`/#${term.section.id}`} className="back">
            ← 전체 용어
          </Link>
        </div>
      </header>

      <main className="wrap detail" key={term.id}>
        <motion.div className="detail-head" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <span className="crumb">
            {term.group.title} · {term.section.title} <span className="mono">{term.no}</span>
          </span>
          <h1>{term.en}</h1>
          <p className="detail-ko">{term.ko}</p>
          <p className="detail-desc">{term.desc}</p>
        </motion.div>

        {Playground ? (
          <section className="detail-block">
            <h2>직접 해보기</h2>
            <Playground />
          </section>
        ) : (
          <section className="detail-block">
            <div className="detail-demo">
              <Stage className="big">
                <Demo />
              </Stage>
            </div>
            <p className="soon">이 용어의 직접 조작 화면은 준비 중이에요. 지금은 움직임을 보고 프롬프트를 복사해 쓸 수 있어요.</p>
            <PromptBox text={term.prompt} />
          </section>
        )}

        <nav className="pn">
          {prev ? (
            <Link to={`/term/${prev.id}`}>
              <span>← 이전</span>
              <b>{prev.en}</b>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/term/${next.id}`} className="pn-next">
              <span>다음 →</span>
              <b>{next.en}</b>
            </Link>
          )}
        </nav>

        <section className="detail-block">
          <h2>같은 분류의 다른 용어</h2>
          <div className="grid">
            {related.map((t) => (
              <TermCard key={t.id} term={t} />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
