import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'motion/react'
import { C, PALETTE, ease, rand, useStep, useTick, L, Win, NavBar, Cursor, Check, CartIcon } from './parts'

const MiniCard = ({ children, style, ...p }) => (
  <motion.div className="m-card" style={style} {...p}>
    {children ?? (
      <>
        <L w={90} h={7} c={C.ink} />
        <L w={120} h={4} />
        <L w={100} h={4} />
        <span className="btn-mini acc" style={{ justifySelf: 'end', marginTop: 4 }}>확인</span>
      </>
    )}
  </motion.div>
)

/* ───────── 기본 ───────── */

export function Fade() {
  const o = useMotionValue(0)
  const label = useTransform(o, (v) => `opacity ${v.toFixed(2)}`)
  useEffect(() => {
    const c = animate(o, [0, 1, 1, 0], { duration: 2.8, times: [0, 0.3, 0.75, 1], repeat: Infinity, ease: 'easeInOut' })
    return () => c.stop()
  }, [o])
  return (
    <div className="center col" style={{ gap: 14 }}>
      <MiniCard style={{ opacity: o }} />
      <motion.span className="chip mono">{label}</motion.span>
    </div>
  )
}

export function Slide() {
  return (
    <div className="center">
      <MiniCard animate={{ x: [150, 0, 0, -150], opacity: [0, 1, 1, 0] }} transition={{ duration: 2.8, times: [0, 0.3, 0.7, 1], repeat: Infinity, ease: 'easeInOut' }}>
        <div className="row" style={{ gap: 8 }}>
          <span className="avatar" style={{ background: C.coral }} />
          <div style={{ display: 'grid', gap: 5 }}>
            <L w={80} h={5} c={C.ink} />
            <L w={110} h={4} />
          </div>
        </div>
      </MiniCard>
    </div>
  )
}

export function Scale() {
  const k = useTick(1300)
  const n = (k % 9) + 1
  return (
    <div className="center">
      <motion.div key={k} className="cart-box" animate={{ rotate: [0, -8, 6, 0] }} transition={{ duration: 0.4 }}>
        <CartIcon size={30} />
        <motion.span className="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 14 }}>
          {n}
        </motion.span>
      </motion.div>
    </div>
  )
}

export function Easing() {
  const rows = [
    ['linear', 'linear'],
    ['ease-in-out', 'easeInOut'],
    ['back-out', 'backOut'],
  ]
  return (
    <div className="center col" style={{ gap: 14, alignItems: 'stretch', padding: '0 28px' }}>
      {rows.map(([label, e]) => (
        <div key={label} className="ez-row">
          <span className="ez-l mono">{label}</span>
          <div className="ez-track">
            <motion.span className="ez-dot" animate={{ x: [0, 118] }} transition={{ duration: 1.4, ease: e, repeat: Infinity, repeatType: 'reverse', repeatDelay: 0.5 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function Spring() {
  const on = useStep(2, 1400) === 1
  return (
    <>
      <div className="spr-line" />
      <span className="spr-end" style={{ left: 34 }} />
      <span className="spr-end" style={{ right: 34 }} />
      <motion.div className="spr-btn" initial={false} animate={{ x: on ? 150 : 0 }} transition={{ type: 'spring', stiffness: 320, damping: 10 }}>
        <motion.svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ rotate: on ? 180 : 0 }}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </motion.svg>
      </motion.div>
    </>
  )
}

export function Bounce() {
  const t = { duration: 2.2, times: [0, 0.28, 0.46, 0.6, 0.72, 0.82, 1], ease: ['easeIn', 'easeOut', 'easeIn', 'easeOut', 'easeIn', 'easeOut'], repeat: Infinity, repeatDelay: 0.3 }
  return (
    <>
      <motion.span className="bn-shadow" animate={{ scale: [0.4, 1, 0.6, 1, 0.85, 1, 1], opacity: [0.3, 1, 0.5, 1, 0.8, 1, 1] }} transition={t} />
      <div className="bn-ground" />
      <motion.div className="bn-ball" style={{ originY: 1 }} animate={{ y: [-86, 0, -36, 0, -12, 0, 0], scaleY: [1, 0.8, 1, 0.9, 1, 0.96, 1], scaleX: [1, 1.15, 1, 1.08, 1, 1.03, 1] }} transition={t}>
        <Check size={22} color="#fff" />
      </motion.div>
    </>
  )
}

export function DurationDelay() {
  const k = useTick(2800)
  const lin = (delay) => ({ duration: 1, delay, ease: 'linear' })
  return (
    <div key={k} className="dd-wrap">
      <div className="dd-row">
        <span className="mono">A</span>
        <div className="dd-track">
          <motion.span className="dd-fill" style={{ width: 112, background: C.sky, originX: 0 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={lin(0)} />
        </div>
      </div>
      <div className="dd-cap mono">duration 1.0s</div>
      <div className="dd-row">
        <span className="mono">B</span>
        <div className="dd-track">
          <span className="dd-wait">delay</span>
          <motion.span className="dd-fill" style={{ left: 68, width: 112, background: C.coral, originX: 0 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={lin(0.6)} />
        </div>
      </div>
      <div className="dd-cap mono">delay 0.6s → duration 1.0s</div>
      <motion.span className="dd-head" initial={{ x: 0 }} animate={{ x: 180 }} transition={{ duration: 1.6, ease: 'linear' }} />
    </div>
  )
}

export function Loop() {
  return (
    <div className="center col" style={{ gap: 16 }}>
      <motion.div style={{ position: 'relative' }} animate={{ y: [0, -9, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
        <MiniCard />
        <motion.span className="loop-sq" style={{ background: C.sky, left: -12, top: -12 }} animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
        <motion.span className="loop-sq" style={{ background: C.mint, right: -10, bottom: -10, borderRadius: 99 }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>
      <span className="chip mono">repeat: Infinity</span>
    </div>
  )
}

/* ───────── 글자와 그림 ───────── */

const TYPE_WORDS = ['할 일 정리', '바이브 코딩', 'Hello, AI']
export function Typewriter() {
  const [text, setText] = useState('')
  useEffect(() => {
    let w = 0
    let i = 0
    let del = false
    let t
    const tick = () => {
      const word = TYPE_WORDS[w]
      if (!del) {
        i++
        setText(word.slice(0, i))
        if (i === word.length) {
          del = true
          return (t = setTimeout(tick, 1300))
        }
        t = setTimeout(tick, 150)
      } else {
        i--
        setText(word.slice(0, i))
        if (i === 0) {
          del = false
          w = (w + 1) % TYPE_WORDS.length
          return (t = setTimeout(tick, 400))
        }
        t = setTimeout(tick, 60)
      }
    }
    t = setTimeout(tick, 400)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="center">
      <span className="big-text">
        {text}
        <span className="caret" />
      </span>
    </div>
  )
}

const SCR_CHARS = '가나다라마바사아자차카타파하ABCDEFGHJKLMNPQRSTUVXYZ0123456789#%&*+'
const SCR_WORDS = ['포트폴리오', 'SCRAMBLE', '바이브코딩']
export function TextScramble() {
  const [out, setOut] = useState([])
  useEffect(() => {
    let w = 0
    let f = 0
    let t
    const frame = () => {
      const word = SCR_WORDS[w]
      const chars = [...word].map((c, i) => {
        const done = f >= 6 + i * 3
        return { c: done ? c : SCR_CHARS[Math.floor(Math.random() * SCR_CHARS.length)], done }
      })
      setOut(chars)
      f++
      if (chars.every((c) => c.done)) {
        f = 0
        w = (w + 1) % SCR_WORDS.length
        return (t = setTimeout(frame, 1400))
      }
      t = setTimeout(frame, 45)
    }
    frame()
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="center">
      <span className="big-text scr">
        {out.map((o, i) => (
          <span key={i} style={{ color: o.done ? C.ink : C.acc }}>
            {o.c}
          </span>
        ))}
      </span>
    </div>
  )
}

const SPLIT = '흩어진 일을'
export function SplitText() {
  const k = useTick(3200)
  return (
    <div className="center">
      <span key={k} className="big-text">
        {[...SPLIT].map((ch, i) => (
          <motion.span
            key={i}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
            initial={{ opacity: 0, x: rand(i) * 80 - 40, y: rand(i + 7) * 80 - 40, rotate: rand(i + 3) * 120 - 60 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
            transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 220, damping: 16 }}
          >
            {ch}
          </motion.span>
        ))}
      </span>
    </div>
  )
}

export function CountUp() {
  const v = useMotionValue(0)
  const txt = useTransform(v, (x) => Math.round(x).toLocaleString('ko-KR') + '+')
  useEffect(() => {
    let c, t
    let alive = true
    const run = () => {
      v.set(0)
      c = animate(v, 10475, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onComplete: () => (t = setTimeout(() => alive && run(), 1500)) })
    }
    run()
    return () => {
      alive = false
      c?.stop()
      clearTimeout(t)
    }
  }, [v])
  return (
    <div className="center col" style={{ gap: 4 }}>
      <span style={{ fontSize: 12, color: '#7a756c', fontWeight: 600 }}>함께 쓰는 팀</span>
      <motion.span className="cu-n">{txt}</motion.span>
    </div>
  )
}

export function LineDrawing() {
  return (
    <svg viewBox="0 0 280 210" style={{ position: 'absolute', inset: 0 }}>
      <line x1="30" y1="160" x2="250" y2="160" stroke="#E2DED5" strokeWidth="1.5" />
      <motion.path
        d="M40 150 C 60 70, 100 60, 112 112 S 150 168, 172 112 S 214 46, 244 86"
        fill="none"
        stroke={C.acc}
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 1], opacity: [1, 1, 1, 0] }}
        transition={{ duration: 3, times: [0, 0.55, 0.85, 1], repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}

export function Morphing() {
  const x = useStep(2, 1400) === 1
  const sp = { type: 'spring', stiffness: 300, damping: 22 }
  return (
    <div className="center row" style={{ gap: 44 }}>
      <div className="burger">
        <motion.span initial={false} style={{ top: 0 }} animate={{ y: x ? 16 : 0, rotate: x ? 45 : 0 }} transition={sp} />
        <motion.span initial={false} style={{ top: 16 }} animate={{ opacity: x ? 0 : 1, scaleX: x ? 0 : 1 }} transition={sp} />
        <motion.span initial={false} style={{ top: 32 }} animate={{ y: x ? -16 : 0, rotate: x ? -45 : 0 }} transition={sp} />
      </div>
      <motion.div className="morph-shape" initial={false} animate={{ borderRadius: x ? '50%' : '12px', rotate: x ? 90 : 0, background: x ? C.coral : C.sky }} transition={{ duration: 0.6, ease }} />
    </div>
  )
}

const BRANDS = ['mokri', 'ondolab', 'pixelnut', 'dalbit', 'nurilab', 'seed&co']
export function Marquee() {
  const row = (dir, offset) => (
    <motion.div className="mq-track" animate={{ x: dir > 0 ? ['0%', '-50%'] : ['-50%', '0%'] }} transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}>
      {[...BRANDS, ...BRANDS].map((n, i) => (
        <span key={i} className="mq-item">
          <i style={{ background: PALETTE[(i + offset) % 5] }} />
          {n}
        </span>
      ))}
    </motion.div>
  )
  return (
    <div className="mq">
      {row(1, 0)}
      {row(-1, 2)}
    </div>
  )
}

const MP = 'M 40 168 C 66 50, 176 28, 226 64'
export function MotionPath() {
  const t = { duration: 2.6, repeat: Infinity }
  return (
    <>
      <svg viewBox="0 0 280 210" style={{ position: 'absolute', inset: 0 }}>
        <path d={MP} fill="none" stroke="#CFCAC0" strokeWidth="2" strokeDasharray="5 6" />
      </svg>
      <motion.div className="mp-cart" animate={{ scale: [1, 1, 1.28, 1, 1] }} transition={{ ...t, times: [0, 0.74, 0.8, 0.9, 1] }}>
        <CartIcon size={26} />
      </motion.div>
      <motion.div className="mp-box" style={{ offsetPath: `path('${MP}')`, offsetRotate: '0deg' }} animate={{ offsetDistance: ['0%', '100%', '100%'], opacity: [1, 1, 0], scale: [1, 0.55, 0.3] }} transition={{ ...t, times: [0, 0.75, 1], ease: 'easeInOut' }} />
    </>
  )
}

/* ───────── 화면과 마우스 ───────── */

export function PageTransition() {
  const p = useStep(2, 2400)
  return (
    <Win style={{ inset: '16px 18px' }}>
      <NavBar />
      <AnimatePresence mode="wait">
        <motion.div key={p} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.15 } }} style={{ padding: 12 }}>
          {p === 0 ? (
            <div style={{ display: 'grid', gap: 8 }}>
              <L w={130} h={12} c={C.ink} />
              <L w="80%" h={4} />
              <L w="60%" h={4} />
              <div className="cell" style={{ height: 50, marginTop: 4 }} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
              {PALETTE.slice(0, 3).map((c, i) => (
                <div key={i} className="cell" style={{ height: 104, flexDirection: 'column' }}>
                  <span style={{ background: c, width: '100%', height: 46, borderRadius: 6 }} />
                  <L w="70%" h={4} />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <motion.div key={'w' + p} className="wipe" initial={{ x: '-101%' }} animate={{ x: ['-101%', '0%', '0%', '101%'] }} transition={{ duration: 0.9, times: [0, 0.4, 0.55, 1], ease: 'easeInOut' }} />
    </Win>
  )
}

export function SharedElement() {
  const s = useStep(4, 1500)
  const sel = s === 1 ? 0 : s === 3 ? 2 : null
  const cols = [C.sky, C.butter, C.pink]
  const sp = { type: 'spring', stiffness: 300, damping: 30 }
  return (
    <Win style={{ inset: '16px 18px', padding: 10 }}>
      <div className="se-grid">
        {cols.map((c, i) =>
          sel === i ? (
            <div key={i} className="se-thumb ph" />
          ) : (
            <motion.div key={i} layoutId={'se' + i} className="se-thumb" style={{ borderRadius: 10 }} transition={sp}>
              <motion.div layoutId={'si' + i} className="se-img" style={{ background: c, borderRadius: 6 }} transition={sp} />
              <L w="70%" h={4} />
            </motion.div>
          ),
        )}
      </div>
      <AnimatePresence>
        {sel !== null && (
          <motion.div layoutId={'se' + sel} className="se-detail" style={{ borderRadius: 12 }} transition={sp}>
            <motion.div layoutId={'si' + sel} className="se-img big" style={{ background: cols[sel], borderRadius: 8 }} transition={sp} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }} style={{ display: 'grid', gap: 6, alignContent: 'start' }}>
              <L w={70} h={7} c={C.ink} />
              <L w={80} h={4} />
              <L w={60} h={4} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Win>
  )
}

export function PinScrollytelling() {
  const st = useStep(3, 1400)
  return (
    <>
      <motion.div className="pin-bg" animate={{ y: [0, -120] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'linear' }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <L key={i} w={[120, 90, 140, 70][i % 4]} h={4} />
        ))}
      </motion.div>
      <div className="center">
        <div className="pin-card">
          <AnimatePresence mode="popLayout">
            <motion.span key={st} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}>
              {st + 1}
            </motion.span>
          </AnimatePresence>
          <span className="pin-tag">PIN</span>
        </div>
      </div>
      <div className="pin-prog">
        <motion.span style={{ originY: 0 }} animate={{ scaleY: (st + 1) / 3 }} transition={{ duration: 0.5, ease }} />
      </div>
    </>
  )
}

export function HorizontalScroll() {
  return (
    <>
      <div className="mouse">
        <motion.i animate={{ y: [0, 9, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
      </div>
      <motion.span className="mouse-arrow" animate={{ y: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
        ↓
      </motion.span>
      <div className="hs-view">
        <motion.div className="hs-track" animate={{ x: [0, -230] }} transition={{ duration: 3.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}>
          {[C.sky, C.pink, C.butter, C.mint, C.coral, C.sky].map((c, i) => (
            <span key={i} style={{ background: c }} />
          ))}
        </motion.div>
      </div>
    </>
  )
}

const MAG = [
  [-110, -60],
  [-62, -22],
  [-30, 14],
  [12, 28],
  [44, 4],
  [30, -28],
  [-8, -36],
  [-110, -60],
]
const MAG_BTN = MAG.map(([x, y]) => (Math.hypot(x, y) < 72 ? [x * 0.35, y * 0.35] : [0, 0]))
export function MagneticButton() {
  const t = { duration: 4.6, repeat: Infinity, ease: 'easeInOut' }
  return (
    <>
      <div className="mag-ring" />
      <div className="center">
        <motion.span className="btn-mini acc" style={{ padding: '8px 16px', fontSize: 12 }} animate={{ x: MAG_BTN.map((p) => p[0]), y: MAG_BTN.map((p) => p[1]) }} transition={t}>
          시작하기
        </motion.span>
      </div>
      <Cursor animate={{ x: MAG.map((p) => 140 + p[0]), y: MAG.map((p) => 105 + p[1]) }} transition={t} />
    </>
  )
}

const CC = [
  [40, 50],
  [100, 92],
  [176, 96],
  [206, 122],
  [180, 142],
  [110, 160],
  [40, 50],
]
const CC_IN = [false, false, true, true, true, false, false]
export function CustomCursor() {
  const t = { duration: 5, repeat: Infinity, ease: 'easeInOut' }
  return (
    <>
      <div style={{ position: 'absolute', left: 24, top: 40, display: 'grid', gap: 8 }}>
        <L w={90} h={8} c={C.ink} />
        <L w={110} h={4} />
        <L w={80} h={4} />
      </div>
      <div className="cc-card" />
      <motion.div className="cc-pos" animate={{ x: CC.map((p) => p[0]), y: CC.map((p) => p[1]) }} transition={t}>
        <motion.div className="cc-dot" animate={{ width: CC_IN.map((v) => (v ? 50 : 14)), height: CC_IN.map((v) => (v ? 50 : 14)) }} transition={t}>
          <motion.span animate={{ opacity: CC_IN.map((v) => (v ? 1 : 0)) }} transition={t}>
            보기
          </motion.span>
        </motion.div>
      </motion.div>
    </>
  )
}

export function Tilt3D() {
  const t = { duration: 5, repeat: Infinity, ease: 'easeInOut' }
  return (
    <div className="center" style={{ perspective: 600 }}>
      <motion.div className="tilt" style={{ transformStyle: 'preserve-3d' }} animate={{ rotateX: [0, 14, -8, -12, 10, 0], rotateY: [0, -16, -18, 14, 16, 0] }} transition={t}>
        <motion.div className="tilt-shine" animate={{ backgroundPosition: ['50% 50%', '100% 0%', '100% 100%', '0% 100%', '0% 0%', '50% 50%'] }} transition={t} />
        <L w={40} h={5} c="rgba(255,255,255,.7)" style={{ transform: 'translateZ(20px)' }} />
        <span className="tilt-price" style={{ transform: 'translateZ(36px)' }}>9,900원</span>
        <span className="tilt-btn" style={{ transform: 'translateZ(26px)' }} />
      </motion.div>
    </div>
  )
}

export function Confetti() {
  const k = useTick(2600)
  const parts = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const a = rand(i) * Math.PI * 2
        const d = 50 + rand(i + 50) * 80
        const big = rand(i + 3) > 0.5
        return { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.75 - 24, rot: rand(i + 9) * 600 - 300, c: PALETTE[i % 5], w: big ? 9 : 5, h: big ? 5 : 9 }
      }),
    [],
  )
  return (
    <div key={k} className="center">
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="cf"
          style={{ background: p.c, width: p.w, height: p.h }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 70], opacity: [1, 1, 0], rotate: p.rot }}
          transition={{ duration: 1.7, ease: 'easeOut', y: { duration: 1.7, times: [0, 0.4, 1], ease: ['easeOut', 'easeIn'] }, opacity: { duration: 1.7, times: [0, 0.65, 1] } }}
        />
      ))}
      <motion.div className="cf-chip" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
        <span className="toast-ic" style={{ background: C.mint }}>
          <Check size={10} color="#fff" />
        </span>
        결제 완료
      </motion.div>
    </div>
  )
}
