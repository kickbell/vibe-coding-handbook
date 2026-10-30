import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, animate, useMotionValue } from 'motion/react'
import { Shell, EventLog, useEventLog, Slider, Segmented, Toggle } from '../components/kit'
import { COMPONENT_PGS } from './components'
import { EFFECT_PGS } from './effects'
import { MOTION_PGS } from './motion'
import { TEXT_PGS } from './text'
import { SCREEN_PGS } from './screen'
import { UI_LAYOUT_PGS } from './ui-layout'
import { UI_INPUT_PGS } from './ui-input'

const EASE_OUT = [0.22, 1, 0.36, 1]
const PALETTE = ['#4D9CFF', '#FF7A59', '#2EC4A0', '#FFC43D', '#FF6FA5']

/* ───────── Accordion ───────── */

const FAQ = [
  { q: '바이브코딩이 뭔가요?', a: '코드를 한 줄씩 직접 쓰는 대신, AI에게 원하는 걸 말로 설명하면서 만들어 가는 방식이에요.' },
  { q: '코딩을 전혀 몰라도 되나요?', a: '시작은 할 수 있어요. 다만 화면 요소의 이름을 알면 AI와 훨씬 빨리 통해요.' },
  { q: '용어를 왜 알아야 하나요?', a: '"그 접히는 거"보다 "아코디언"이라고 말하면 AI가 한 번에 정확하게 만들어요.' },
  { q: '이 페이지는 뭘로 만들었나요?', a: 'React와 Motion(구 Framer Motion)으로 만들었어요. 가장 대중적인 조합이에요.' },
]

function AccordionPG() {
  const [open, setOpen] = useState(() => new Set([0]))
  const [duration, setDuration] = useState(0.35)
  const [easing, setEasing] = useState('ease-out')
  const [single, setSingle] = useState(true)
  const { logs, push, clear } = useEventLog()

  const transition = easing === 'spring' ? { type: 'spring', bounce: 0.3, duration } : { duration, ease: easing === 'linear' ? 'linear' : EASE_OUT }

  const toggle = (i) => {
    const next = new Set(open)
    if (next.has(i)) {
      next.delete(i)
      push('close', `질문 ${i + 1} 접힘`)
    } else {
      if (single) {
        next.forEach((j) => push('close', `질문 ${j + 1} 자동으로 접힘 (하나만 열기)`))
        next.clear()
      }
      next.add(i)
      push('open', `질문 ${i + 1} 펼침 시작`)
    }
    setOpen(next)
  }

  const easeKo = { 'ease-out': '처음엔 빠르고 끝은 부드럽게(ease-out)', spring: '살짝 탄성 있게(spring)', linear: '일정한 속도로(linear)' }[easing]
  const prompt = `FAQ 영역을 아코디언(Accordion)으로 만들어줘. 질문을 클릭하면 답변이 ${duration}초 동안 ${easeKo} 펼쳐지고, ${single ? '한 번에 하나만 열리게 해줘 (다른 항목은 자동으로 접힘)' : '여러 개를 동시에 열 수 있게 해줘'}. 오른쪽 화살표 아이콘은 열릴 때 180도 회전. Motion(framer-motion)의 AnimatePresence와 height: auto 애니메이션 사용.`

  return (
    <Shell
      hint="질문을 눌러보세요"
      stage={
        <div className="pg-acc">
          {FAQ.map((f, i) => {
            const isOpen = open.has(i)
            return (
              <div key={i} className={'pg-acc-row' + (isOpen ? ' open' : '')}>
                <button className="pg-acc-head" onClick={() => toggle(i)}>
                  <span>{f.q}</span>
                  <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" animate={{ rotate: isOpen ? 180 : 0 }} transition={transition}>
                    <path d="M6 9l6 6 6-6" />
                  </motion.svg>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      variants={{ open: { height: 'auto', opacity: 1 }, collapsed: { height: 0, opacity: 0 } }}
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      transition={transition}
                      style={{ overflow: 'hidden' }}
                      onAnimationComplete={(def) => def === 'open' && push('end', `질문 ${i + 1} 펼침 완료`)}
                    >
                      <p className="pg-acc-body">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      }
      controls={
        <>
          <Slider label="펼치는 시간 (duration)" value={duration} min={0.1} max={1.5} step={0.05} unit="s" onChange={setDuration} />
          <Segmented label="움직임 느낌 (easing)" value={easing} onChange={setEasing} options={[{ value: 'ease-out', label: 'ease-out' }, { value: 'spring', label: 'spring' }, { value: 'linear', label: 'linear' }]} />
          <Toggle
            label="한 번에 하나만 열기"
            value={single}
            onChange={(v) => {
              setSingle(v)
              push('option', v ? '하나만 열기 켬' : '하나만 열기 끔')
            }}
          />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Stagger ───────── */

const N = 8
function StaggerPG() {
  const [gap, setGap] = useState(0.08)
  const [duration, setDuration] = useState(0.5)
  const [from, setFrom] = useState('up')
  const [order, setOrder] = useState('normal')
  const [run, setRun] = useState(0)
  const { logs, push, clear } = useEventLog()
  const timers = useRef([])

  const delays = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        if (order === 'reverse') return (N - 1 - i) * gap
        if (order === 'center') return Math.abs(i - (N - 1) / 2) * gap
        return i * gap
      }),
    [gap, order],
  )
  const total = Math.max(...delays) + duration

  // 값이 바뀌면 자동으로 다시 재생
  useEffect(() => setRun((r) => r + 1), [gap, duration, from, order])

  useEffect(() => {
    if (run === 0) return
    timers.current.forEach(clearTimeout)
    clear()
    push('start', `재생 · ${N}개, 간격 ${gap}s`)
    const sorted = delays.map((d, i) => [d, i]).sort((a, b) => a[0] - b[0])
    timers.current = sorted.map(([d, i]) => setTimeout(() => push('child', `카드 ${i + 1} 등장 (${d.toFixed(2)}s)`), d * 1000))
    timers.current.push(setTimeout(() => push('end', `전체 완료 (${total.toFixed(2)}s)`), total * 1000))
    return () => timers.current.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  const initial = { up: { opacity: 0, y: 28 }, left: { opacity: 0, x: -36 }, scale: { opacity: 0, scale: 0.6 } }[from]
  const fromKo = { up: '아래에서 위로 올라오며', left: '왼쪽에서 미끄러져 들어오며', scale: '작은 크기에서 커지며' }[from]
  const orderKo = { normal: '왼쪽 위부터 순서대로', reverse: '마지막 카드부터 거꾸로', center: '가운데부터 바깥쪽으로' }[order]
  const prompt = `카드 목록이 나타날 때 스태거(Stagger) 애니메이션을 넣어줘. 카드들이 ${orderKo} ${gap}초 간격으로 하나씩, 각각 ${duration}초 동안 ${fromKo} 페이드인 되게. Motion(framer-motion)의 staggerChildren 사용.`

  return (
    <Shell
      hint="눌러서 다시 재생"
      stage={
        <div className="pg-stg" onClick={() => setRun((r) => r + 1)}>
          <div key={run} className="pg-stg-grid">
            {delays.map((d, i) => (
              <motion.div key={i} className="pg-stg-card" initial={initial} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} transition={{ delay: d, duration, ease: EASE_OUT }}>
                <span style={{ background: PALETTE[i % 5] }} />
                <i />
                <i style={{ width: '50%' }} />
                <b>{i + 1}</b>
              </motion.div>
            ))}
          </div>
          <div className="pg-tl" key={'t' + run}>
            {delays.map((d, i) => (
              <div key={i} className="pg-tl-row">
                <span className="mono">{i + 1}</span>
                <div>
                  <motion.i style={{ left: (d / total) * 100 + '%', width: (duration / total) * 100 + '%', background: PALETTE[i % 5], originX: 0 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: d, duration, ease: 'linear' }} />
                </div>
              </div>
            ))}
            <div className="pg-tl-lane">
              <motion.span className="pg-tl-head" initial={{ left: '0%' }} animate={{ left: '100%' }} transition={{ duration: total, ease: 'linear' }} />
            </div>
          </div>
        </div>
      }
      controls={
        <>
          <Slider label="간격 (stagger)" value={gap} min={0} max={0.4} step={0.01} unit="s" onChange={setGap} />
          <Slider label="각자 걸리는 시간 (duration)" value={duration} min={0.1} max={1.2} step={0.05} unit="s" onChange={setDuration} />
          <Segmented label="등장 방향" value={from} onChange={setFrom} options={[{ value: 'up', label: '아래에서' }, { value: 'left', label: '왼쪽에서' }, { value: 'scale', label: '확대' }]} />
          <Segmented label="순서" value={order} onChange={setOrder} options={[{ value: 'normal', label: '순서대로' }, { value: 'reverse', label: '역순' }, { value: 'center', label: '가운데부터' }]} />
          <button className="btn" onClick={() => setRun((r) => r + 1)}>
            다시 재생
          </button>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Spring ───────── */

// 감쇠 진동 수치 시뮬레이션 (0 → 1로 이동)
function simulate(k, c, m, T = 2, dt = 1 / 240) {
  let x = 0
  let v = 0
  const pts = []
  let max = 0
  for (let t = 0; t <= T; t += dt) {
    const a = (-k * (x - 1) - c * v) / m
    v += a * dt
    x += v * dt
    max = Math.max(max, x)
    pts.push([t, x])
  }
  return { pts, overshoot: Math.max(0, max - 1) }
}

const PRESETS = [
  { label: '부드럽게', k: 120, c: 20, m: 1 },
  { label: '통통', k: 300, c: 10, m: 1 },
  { label: '뻣뻣하게', k: 600, c: 40, m: 1 },
  { label: '느릿하고 무겁게', k: 150, c: 14, m: 3 },
]

function SpringPG() {
  const [k, setK] = useState(300)
  const [c, setC] = useState(10)
  const [m, setM] = useState(1)
  const [compare, setCompare] = useState(true)
  const [side, setSide] = useState(false)
  const { logs, push, clear } = useEventLog()
  const track = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const gx = useMotionValue(0)
  const spring = { type: 'spring', stiffness: k, damping: c, mass: m }

  const amp = () => (track.current ? track.current.offsetWidth / 2 - 34 : 120)
  const target = (s) => (s ? amp() : -amp())

  useEffect(() => {
    x.set(-amp())
    gx.set(-amp())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const move = () => {
    const s = !side
    setSide(s)
    const t0 = performance.now()
    push('move', `${s ? '오른쪽' : '왼쪽'}으로 이동`)
    animate(x, target(s), { ...spring, onComplete: () => push('settle', `멈춤 (${((performance.now() - t0) / 1000).toFixed(2)}s 걸림)`) })
    animate(y, 0, spring)
    animate(gx, target(s), { duration: 0.5, ease: 'easeInOut' })
  }

  const release = () => {
    push('release', '놓음 → 스프링으로 제자리')
    animate(x, target(side), spring)
    animate(y, 0, spring)
  }

  const { pts, overshoot } = useMemo(() => simulate(k, c, m), [k, c, m])
  const W = 260
  const H = 110
  const yMax = 1.6
  const path = pts.map(([t, v], i) => `${i ? 'L' : 'M'}${((t / 2) * W).toFixed(1)} ${(H - (v / yMax) * H).toFixed(1)}`).join(' ')

  const feel = overshoot > 0.3 ? '많이 통통 튀게' : overshoot > 0.08 ? '살짝 튕기듯' : '튕김 없이 부드럽게'
  const prompt = `버튼을 누르면 공이 스프링(Spring) 애니메이션으로 반대편까지 이동하게 해줘. ${feel} 멈추도록 stiffness ${k}, damping ${c}, mass ${m}로 설정. 공은 드래그할 수 있고, 놓으면 같은 스프링으로 제자리에 돌아가게. Motion(framer-motion)의 type: "spring" 사용.`

  return (
    <Shell
      hint="공을 잡아 당겼다 놓아보세요"
      stage={
        <div className="pg-spr">
          <div className="pg-spr-track" ref={track}>
            <span className="pg-spr-label">spring</span>
            <motion.div
              className="pg-spr-ball"
              style={{ x, y }}
              drag
              dragMomentum={false}
              onDragStart={() => push('drag', '드래그 시작')}
              onDragEnd={release}
              whileDrag={{ scale: 1.12 }}
            />
          </div>
          <AnimatePresence>
            {compare && (
              <motion.div className="pg-spr-track ghost" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 64 }} exit={{ opacity: 0, height: 0 }}>
                <span className="pg-spr-label">ease-in-out 0.5s</span>
                <motion.div className="pg-spr-ball ghost" style={{ x: gx }} />
              </motion.div>
            )}
          </AnimatePresence>
          <button className="btn" onClick={move}>
            {side ? '← 왼쪽으로' : '오른쪽으로 →'}
          </button>
        </div>
      }
      controls={
        <>
          <div className="presets">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                className={'chip-btn' + (p.k === k && p.c === c && p.m === m ? ' on' : '')}
                onClick={() => {
                  setK(p.k)
                  setC(p.c)
                  setM(p.m)
                  push('option', `프리셋: ${p.label}`)
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Slider label="탄성 (stiffness)" value={k} min={20} max={800} step={10} onChange={setK} />
          <Slider label="감쇠 (damping)" value={c} min={1} max={60} step={1} onChange={setC} />
          <Slider label="무게 (mass)" value={m} min={0.2} max={5} step={0.1} onChange={setM} />
          <div className="curve">
            <div className="ctl-top">
              <span>움직임 그래프</span>
              <span className="mono">튕김 {Math.round(overshoot * 100)}%</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
              <line x1="0" x2={W} y1={H - H / yMax} y2={H - H / yMax} stroke="#D6D2C8" strokeDasharray="4 4" />
              <path d={path} fill="none" stroke="#FF6B2C" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="curve-axis">
              <span>0s</span>
              <span>목표 위치 ─ ─</span>
              <span>2s</span>
            </div>
          </div>
          <Toggle label="일반 ease와 비교" value={compare} onChange={setCompare} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

// 용어 id → 체험 화면
export const PLAYGROUNDS = {
  accordion: AccordionPG,
  stagger: StaggerPG,
  spring: SpringPG,
  ...COMPONENT_PGS,
  ...EFFECT_PGS,
  ...MOTION_PGS,
  ...TEXT_PGS,
  ...SCREEN_PGS,
  ...UI_LAYOUT_PGS,
  ...UI_INPUT_PGS,
}
