import { useEffect } from 'react'
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'motion/react'
import { C, PALETTE, ease, useStep, useTick, L, Win, Icon, Check } from './parts'
import { fadeIn } from './dev'

const sp = { type: 'spring', stiffness: 320, damping: 26 }

const Bub = ({ me, sm, children, style, ...p }) => (
  <motion.div className={'bub' + (me ? ' me' : '') + (sm ? ' sm' : '')} style={style} {...p}>
    {children}
  </motion.div>
)

// 마운트될 때 0에서 to까지 올라가는 숫자
function CountTo({ to, duration, delay = 0 }) {
  const v = useMotionValue(0)
  const txt = useTransform(v, (x) => Math.round(x))
  useEffect(() => {
    const c = animate(v, to, { duration, delay, ease: 'linear' })
    return () => c.stop()
  }, [v, to, duration, delay])
  return <motion.span>{txt}</motion.span>
}

/* ───────── AI 기초 ───────── */

const LLM_CANDS = [
  [
    ['맑고', 0.62],
    ['흐리고', 0.25],
    ['추워서', 0.13],
  ],
  [
    ['따뜻해요', 0.55],
    ['좋아요', 0.3],
    ['덥네요', 0.15],
  ],
]
export function Llm() {
  const s = useStep(4, 1300)
  const filled = Math.min(s, 2)
  return (
    <div style={{ position: 'absolute', left: 22, right: 22, top: 30 }}>
      <span className="mini-cap">LLM · 다음에 올 단어를 고르는 중</span>
      <div className="llm-sent">
        오늘 날씨는{' '}
        {filled >= 1 && (
          <motion.b initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            맑고{' '}
          </motion.b>
        )}
        {filled >= 2 && (
          <motion.b initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            따뜻해요
          </motion.b>
        )}
        {filled < 2 && <span className="caret sm" style={{ height: 16 }} />}
      </div>
      <AnimatePresence mode="wait">
        {filled < 2 && (
          <motion.div key={filled} className="llm-cands" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {LLM_CANDS[filled].map(([w, p], i) => (
              <div key={w} className={'llm-c' + (i === 0 ? ' top' : '')}>
                <span>{w}</span>
                <div className="llm-bar">
                  <motion.i initial={{ width: 0 }} animate={{ width: p * 100 + '%' }} transition={{ duration: 0.5, delay: i * 0.05 }} />
                </div>
                <span className="mono">{Math.round(p * 100)}%</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const MODELS = [
  ['Mini', '빠르고 저렴', 92, 40],
  ['Pro', '균형형', 66, 70],
  ['Max', '가장 똑똑함', 38, 96],
]
export function Model() {
  const a = useStep(3, 1400)
  return (
    <div className="center row" style={{ gap: 8 }}>
      {MODELS.map(([n, d, speed, smart], i) => (
        <motion.div key={n} className="mdl" initial={false} animate={{ y: a === i ? -6 : 0, borderColor: a === i ? C.acc : '#e7e3da', boxShadow: a === i ? '0 10px 20px rgba(255,107,44,.18)' : '0 1px 2px rgba(0,0,0,.04)' }}>
          <b>{n}</b>
          <span>{d}</span>
          {[
            ['속도', speed],
            ['똑똑함', smart],
          ].map(([l, v]) => (
            <div key={l} className="mdl-row">
              <em>{l}</em>
              <div className="llm-bar">
                <motion.i initial={false} animate={{ width: v + '%', background: a === i ? C.acc : '#cfcac0' }} />
              </div>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

export function Prompt() {
  const good = useStep(2, 2200) === 1
  return (
    <div style={{ position: 'absolute', left: 18, right: 18, top: 18, display: 'grid', gap: 8 }}>
      <AnimatePresence mode="wait">
        <Bub key={good ? 'g' : 'b'} me style={{ maxWidth: '100%' }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {good ? '주황색 둥근 "시작하기" 버튼, 누르면 살짝 작아지게' : '버튼 만들어줘'}
        </Bub>
      </AnimatePresence>
      <span className="mini-cap">{good ? '구체적으로 말하면 → 원하는 결과' : '애매하게 말하면 → 애매한 결과'}</span>
      <div className="pr-out">
        <AnimatePresence mode="wait">
          {good ? (
            <motion.span key="g" className="btn-mini acc" style={{ padding: '9px 18px', fontSize: 12 }} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: [0.6, 1, 1, 0.9, 1], opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.6, times: [0, 0.25, 0.6, 0.7, 0.85] }}>
              시작하기
            </motion.span>
          ) : (
            <motion.span key="b" className="pr-plain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Button
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const TOKENS = ['바이', '브', '코딩', ' 정말', ' 재', '밌다', '!']
export function Token() {
  const k = useTick(3600)
  const step = 0.25
  return (
    <div key={k} className="center col" style={{ gap: 18 }}>
      <div className="row" style={{ gap: 3, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 236 }}>
        {TOKENS.map((t, i) => (
          <motion.span key={i} className="tok" style={{ background: PALETTE[i % 5] + '30', borderColor: PALETTE[i % 5] }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * step }}>
            {t.replace(' ', '␣')}
          </motion.span>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700 }}>
        토큰 <b className="mono" style={{ color: C.acc, fontSize: 14 }}><CountTo to={TOKENS.length} duration={TOKENS.length * step} delay={0.2} /></b>개
      </div>
      <span className="chip">글자를 잘게 쪼갠 조각 · 요금과 길이의 단위</span>
    </div>
  )
}

const CTX = ['로그인 만들어줘', '완료했어요', '버튼은 주황색으로', '바꿨어요', '글씨 키워줘', '키웠어요', '아까 버튼 색 뭐였지?', '음… 기억이 안 나요', '대화를 새로 시작해요']
export function ContextWindow() {
  const k = useTick(1100)
  const n = (k % CTX.length) + 1
  const forgot = (i) => i < n - 4
  return (
    <>
      <div className="ctx-frame">
        <span>AI가 기억하는 범위</span>
      </div>
      <motion.div className="ctx-list" animate={{ y: -Math.max(0, n - 4) * 32 }} transition={{ duration: 0.4, ease }}>
        {CTX.slice(0, n).map((m, i) => (
          <Bub key={i} sm me={i % 2 === 0} initial={{ opacity: 0, y: 8 }} animate={{ opacity: forgot(i) ? 0.25 : 1, y: 0 }}>
            {m}
          </Bub>
        ))}
      </motion.div>
    </>
  )
}

export function Hallucination() {
  const s = useStep(3, 1400)
  return (
    <div style={{ position: 'absolute', left: 20, right: 20, top: 24, display: 'grid', gap: 10 }}>
      <Bub me>세종대왕이 만든 앱 알려줘</Bub>
      <AnimatePresence>
        {s >= 1 && (
          <Bub key="a" style={{ position: 'relative', maxWidth: 190 }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            물론이죠! 1443년에 만든 '훈민정음 앱'이 유명해요. <b style={{ color: '#158a6c' }}>확실해요!</b>
            {s >= 2 && (
              <motion.span className="hal-stamp" initial={{ scale: 2, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: -12 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
                지어낸 말
              </motion.span>
            )}
          </Bub>
        )}
      </AnimatePresence>
      {s >= 2 && (
        <motion.span className="chip" style={{ justifySelf: 'start', marginTop: 6 }} {...fadeIn(0.3)}>
          그럴듯해도 사실인지 꼭 확인해요
        </motion.span>
      )}
    </div>
  )
}

/* ───────── AI 도구 ───────── */

export function VibeCoding() {
  const k = useTick(4400)
  return (
    <div key={k}>
      <Bub me style={{ position: 'absolute', left: 18, top: 18 }} {...fadeIn(0)}>
        할 일 앱 만들어줘
      </Bub>
      <motion.div className="vc-code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <motion.div initial={{ y: 0 }} animate={{ y: -70 }} transition={{ delay: 0.6, duration: 1.3, ease: 'linear' }} style={{ display: 'grid', gap: 6 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <L key={i} w={[60, 40, 70, 30, 54][i % 5]} h={4} c={[C.sky, C.pink, '#8a857b', C.mint, C.butter][i % 5]} style={{ marginLeft: (i % 3) * 8 }} />
          ))}
        </motion.div>
      </motion.div>
      <motion.span className="st-arr" style={{ position: 'absolute', left: 134, top: 116 }} {...fadeIn(1.8)}>
        →
      </motion.span>
      <motion.div className="win" style={{ left: 150, top: 60, width: 112, height: 126, padding: 10, display: 'grid', gap: 7, alignContent: 'start' }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2, ...sp }}>
        <b style={{ fontSize: 11 }}>할 일</b>
        {['장보기', '운동하기', '책 읽기'].map((t, i) => (
          <div key={t} className="row" style={{ gap: 6, fontSize: 9.5, fontWeight: 600 }}>
            <motion.span className="cb" style={{ width: 13, height: 13, borderRadius: 4 }} initial={{ background: '#ffffff', borderColor: '#cfcac0' }} animate={{ background: i < 2 ? C.acc : '#ffffff', borderColor: i < 2 ? C.acc : '#cfcac0' }} transition={{ delay: 2.5 + i * 0.3 }}>
              {i < 2 && <Check size={9} color="#fff" width={4} />}
            </motion.span>
            {t}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

const AGENT_TASKS = [
  ['file', '파일 찾아 열기'],
  ['pen', '코드 고치기'],
  ['gear', '테스트 실행'],
  ['mail', '결과 보고'],
]
export function AiAgent() {
  const k = useTick(4600)
  return (
    <div key={k}>
      <span className="chip" style={{ position: 'absolute', left: 18, top: 16 }}>
        "로그인 버그 고쳐줘" 한마디면
      </span>
      <div className="ag-ai">
        <motion.span className="ag-ring" animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
        AI
      </div>
      <div className="ag-list">
        {AGENT_TASKS.map(([icon, t], i) => (
          <motion.div key={t} className="ag-row" initial={{ opacity: 0.35 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.8 }}>
            <Icon n={icon} size={12} color="#6b665d" />
            <span>{t}</span>
            <motion.span className="ag-ok" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.8, type: 'spring', stiffness: 500, damping: 16 }}>
              <Check size={9} color="#fff" width={4} />
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function AiCodingTool() {
  const s = useStep(3, 1500)
  return (
    <Win style={{ inset: '16px 14px', display: 'flex' }}>
      <div className="act-tree">
        {['src', 'App', 'Button', 'style'].map((f, i) => (
          <div key={f} className={'act-f' + (i === 2 ? ' on' : '')}>
            <Icon n={i ? 'file' : 'folder'} size={8} />
            {f}
          </div>
        ))}
      </div>
      <div className="act-code mono">
        <div>{'<button'}</div>
        <AnimatePresence initial={false}>
          {s >= 1 && (
            <motion.div key="del" className="act-del" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              - color: gray
            </motion.div>
          )}
          {s >= 2 && (
            <motion.div key="add" className="act-add" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              + color: orange
            </motion.div>
          )}
        </AnimatePresence>
        {s === 0 && <div>&nbsp;&nbsp;color: gray</div>}
        <div>{'/>'}</div>
      </div>
      <div className="act-chat">
        <Bub sm me>
          버튼 주황색으로
        </Bub>
        {s >= 1 && (
          <Bub sm {...fadeIn(0)}>
            수정할게요
          </Bub>
        )}
      </div>
    </Win>
  )
}

const MCP_TOOLS = [
  ['file', '문서', 40, 60],
  ['mail', '메일', 240, 60],
  ['globe', '브라우저', 140, 176],
]
export function Mcp() {
  const k = useTick(4400)
  const cx = 140
  const cy = 92
  return (
    <div key={k}>
      <svg viewBox="0 0 280 210" style={{ position: 'absolute', inset: 0 }}>
        {MCP_TOOLS.map(([, , x, y], i) => (
          <g key={i}>
            <motion.line x1={cx} y1={cy} x2={x} y2={y} stroke="#cfcac0" strokeWidth="2" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 + i * 0.5, duration: 0.5 }} />
            <motion.circle r="4" fill={C.acc} initial={{ cx: x, cy: y, opacity: 0 }} animate={{ cx: [x, cx], cy: [y, cy], opacity: [0, 1, 1, 0] }} transition={{ delay: 1.0 + i * 0.5, duration: 0.8, repeat: Infinity, repeatDelay: 0.8 }} />
          </g>
        ))}
      </svg>
      <div className="mcp-ai">
        AI
        <span className="mono">MCP</span>
      </div>
      {MCP_TOOLS.map(([icon, label, x, y], i) => (
        <motion.div key={label} className="mcp-tool" style={{ left: x - 26, top: y - 22 }} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 + i * 0.5, ...sp }}>
          <Icon n={icon} size={14} />
          <span>{label}</span>
        </motion.div>
      ))}
    </div>
  )
}

const RULES = [
  ['한국어로 답하기', '한국어로 답변'],
  ['커밋 전에 테스트', '테스트 후 커밋'],
  ['색은 주황색만', '주황 버튼 사용'],
]
export function RulesFile() {
  const s = useStep(4, 1100)
  return (
    <>
      <div className="rules-file mono">
        <span className="md-tab">CLAUDE.md</span>
        {RULES.map(([r], i) => (
          <div key={r} className={'pj-l' + (i < s ? ' on' : '')}>
            - {r}
          </div>
        ))}
      </div>
      <span className="st-arr" style={{ position: 'absolute', left: 150, top: 94 }}>
        →
      </span>
      <div className="rules-out">
        <span className="mini-cap">AI가 알아서 지킴</span>
        <AnimatePresence>
          {RULES.slice(0, s).map(([, o]) => (
            <motion.div key={o} className="rules-ok" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <Check size={10} color="#158a6c" width={3.4} /> {o}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
