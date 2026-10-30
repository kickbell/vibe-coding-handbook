import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, animate } from 'motion/react'
import { C, PALETTE, ease, useStep, useTick, L, Win, NavBar, Cursor, Chev, Check } from './parts'

/* ───────── 레이아웃 ───────── */

export function HeroSection() {
  const k = useTick(3400)
  return (
    <Win style={{ inset: '16px 18px' }}>
      <NavBar />
      <div key={k} className="hero-mini">
        <L w={150} h={14} c={C.ink} style={{ originX: 0 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, ease }} />
        <L w={100} h={14} c={C.acc} style={{ originX: 0 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.15, duration: 0.7, ease }} />
        <L w={176} h={5} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} />
        <L w={130} h={5} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} />
        <motion.span className="btn-mini acc" style={{ justifySelf: 'start', marginTop: 4 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, type: 'spring', stiffness: 400, damping: 22 }}>
          시작하기
        </motion.span>
      </div>
    </Win>
  )
}

// 넓을 때 3열, 좁을 때 1열. 셀 위치를 직접 계산해서 옮긴다.
const RESP = {
  wide: [0, 1, 2].map((i) => ({ x: i * 74, y: 0, width: 68, height: 112 })),
  narrow: [0, 1, 2].map((i) => ({ x: 0, y: i * 42, width: 84, height: 36 })),
}
export function ResponsiveLayout() {
  const narrow = useStep(2, 2200) === 1
  const t = { duration: 0.7, ease: [0.65, 0, 0.35, 1] }
  return (
    <div className="center">
      <motion.div className="win" style={{ position: 'relative', height: 172, padding: 10 }} initial={false} animate={{ width: narrow ? 104 : 236 }} transition={t}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <L w={26} h={5} c={C.ink} />
          <span className="chip">{narrow ? '390px' : '1280px'}</span>
        </div>
        <div style={{ position: 'relative' }}>
          {[C.sky, C.mint, C.pink].map((c, i) => (
            <motion.div key={i} className="cell" style={{ position: 'absolute', left: 0, top: 0 }} initial={false} animate={RESP[narrow ? 'narrow' : 'wide'][i]} transition={t}>
              <span className="sq" style={{ background: c }} />
              <L w="40%" h={4} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export function CardLayout() {
  return (
    <div className="center row" style={{ gap: 10 }}>
      {[C.sky, C.mint, C.pink].map((c, i) => (
        <motion.div key={i} className="card-mini" animate={{ y: [0, -7, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}>
          <span className="card-img" style={{ background: c }} />
          <L w="80%" h={5} c={C.ink} />
          <L w="60%" h={4} />
          <L w="40%" h={4} />
        </motion.div>
      ))}
    </div>
  )
}

const BENTO = [
  ['1/1/3/3', '1/3/2/4', '2/3/3/4', '3/1/4/4'],
  ['1/1/2/2', '1/2/3/4', '2/1/4/2', '3/2/4/4'],
  ['1/1/2/4', '2/1/4/2', '2/2/4/3', '2/3/4/4'],
]
export function BentoGrid() {
  const s = useStep(3, 2000)
  return (
    <div style={{ position: 'absolute', inset: 18, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: 8 }}>
      {[C.sky, C.coral, C.mint, C.butter].map((c, i) => (
        <motion.div key={i} layout transition={{ type: 'spring', stiffness: 260, damping: 28 }} className="cell" style={{ gridArea: BENTO[s][i] }}>
          <span className="sq" style={{ background: c }} />
          <L w={30} h={4} />
        </motion.div>
      ))}
    </div>
  )
}

export function SidebarLayout() {
  const a = useStep(4, 1300)
  return (
    <Win style={{ inset: '16px 18px', display: 'flex' }}>
      <div className="side">
        <span className="nav-dot" style={{ margin: '2px 0 8px 6px' }} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="side-item">
            {a === i && <motion.div layoutId="sb" className="side-ind" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <L w={32} h={4} c={a === i ? C.acc : undefined} style={{ position: 'relative' }} />
          </div>
        ))}
      </div>
      <div className="side-main">
        <AnimatePresence mode="wait">
          <motion.div key={a} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }} style={{ display: 'grid', gap: 7 }}>
            <L w={[80, 60, 96, 70][a]} h={9} c={C.ink} />
            {[0, 1, 2].map((j) => (
              <div key={j} className="cell" style={{ height: 30, alignItems: 'center' }}>
                <span className="sq" style={{ background: PALETTE[(a + j) % 5] }} />
                <L w={[70, 50, 60][j]} h={4} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </Win>
  )
}

export function StickyHeader() {
  const loop = { duration: 5, repeat: Infinity, ease: 'easeInOut' }
  return (
    <Win style={{ inset: '16px 18px' }}>
      <motion.div className="sticky-bar" animate={{ boxShadow: ['0 0 0 rgba(0,0,0,0)', '0 6px 14px rgba(0,0,0,.18)', '0 6px 14px rgba(0,0,0,.18)', '0 0 0 rgba(0,0,0,0)'] }} transition={{ ...loop, times: [0, 0.2, 0.75, 1] }}>
        <span className="nav-dot" style={{ background: '#fff' }} />
        <span style={{ flex: 1 }} />
        <L w={18} h={4} c="rgba(255,255,255,.75)" />
        <L w={18} h={4} c="rgba(255,255,255,.75)" />
        <L w={18} h={4} c="rgba(255,255,255,.75)" />
      </motion.div>
      <motion.div style={{ padding: '38px 12px 12px', display: 'grid', gap: 8 }} animate={{ y: [0, -170, -170, 0] }} transition={{ ...loop, times: [0, 0.45, 0.6, 1] }}>
        <L w={120} h={10} c={C.ink} />
        <L w="90%" h={4} />
        <L w="70%" h={4} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="cell" style={{ height: 44 }}>
            <span className="sq" style={{ background: PALETTE[i] }} />
            <div style={{ display: 'grid', gap: 5 }}>
              <L w={90} h={4} c="#bdb8ad" />
              <L w={60} h={4} />
            </div>
          </div>
        ))}
      </motion.div>
    </Win>
  )
}

export function SplitLayout() {
  const k = useTick(3200)
  return (
    <Win style={{ inset: '16px 18px', display: 'flex' }}>
      <motion.div key={'l' + k} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, ease }} style={{ flex: 1, padding: 14, display: 'grid', alignContent: 'center', gap: 7 }}>
        <L w={84} h={10} c={C.ink} />
        <L w={64} h={10} c={C.ink} />
        <L w={90} h={4} />
        <L w={70} h={4} />
        <span className="btn-mini acc" style={{ justifySelf: 'start', marginTop: 4 }}>
          더 보기
        </span>
      </motion.div>
      <motion.div key={'r' + k} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, ease, delay: 0.1 }} style={{ flex: 1, padding: 8 }}>
        <div className="img-grad" />
      </motion.div>
    </Win>
  )
}

/* ───────── 컴포넌트 ───────── */

export function Tabs() {
  const a = useStep(3, 1600)
  const panels = [
    <div key="0" style={{ display: 'grid', gap: 7 }}>
      <L w={120} h={7} c={C.ink} />
      <L w="90%" h={4} />
      <L w="70%" h={4} />
      <div className="cell" style={{ height: 52, background: '#F3F1EC', border: 'none' }} />
    </div>,
    <div key="1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="cell" style={{ height: 46 }}>
          <span className="sq" style={{ background: PALETTE[i + 1] }} />
        </div>
      ))}
    </div>,
    <div key="2" style={{ display: 'grid', gap: 8 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="row" style={{ gap: 8 }}>
          <span className="avatar" style={{ background: PALETTE[i + 2] }} />
          <div style={{ display: 'grid', gap: 4 }}>
            <L w={70} h={4} c="#bdb8ad" />
            <L w={110} h={4} />
          </div>
        </div>
      ))}
    </div>,
  ]
  return (
    <Win style={{ inset: '16px 18px' }}>
      <div className="tabs-row">
        {['상세', '리뷰', '문의'].map((t, i) => (
          <div key={t} className={'tab-l' + (a === i ? ' on' : '')}>
            {t}
            {a === i && <motion.div layoutId="tab" className="tab-ind" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          </div>
        ))}
      </div>
      <div style={{ padding: 12 }}>
        <AnimatePresence mode="wait">
          <motion.div key={a} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22 }}>
            {panels[a]}
          </motion.div>
        </AnimatePresence>
      </div>
    </Win>
  )
}

export function Accordion() {
  const a = useStep(3, 1700)
  return (
    <div style={{ position: 'absolute', inset: '20px 24px', display: 'grid', gap: 6, alignContent: 'start' }}>
      {[90, 110, 76].map((w, i) => {
        const open = a === i
        return (
          <div key={i} className={'acc-row' + (open ? ' open' : '')}>
            <div className="acc-head">
              <L w={w} h={5} c={C.ink} />
              <Chev animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} />
            </div>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} style={{ overflow: 'hidden' }}>
                  <div className="acc-body">
                    <L w="92%" h={4} />
                    <L w="74%" h={4} />
                    <L w="84%" h={4} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

const BgPage = () => (
  <div style={{ padding: 12, display: 'grid', gap: 8 }}>
    <L w={100} h={8} c={C.ink} />
    <L w="80%" h={4} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
      <div className="cell" style={{ height: 60 }} />
      <div className="cell" style={{ height: 60 }} />
    </div>
    <L w="60%" h={4} />
  </div>
)

export function Modal() {
  const open = useStep(2, 1800) === 1
  return (
    <Win style={{ inset: '16px 18px' }}>
      <BgPage />
      <AnimatePresence>{open && <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}</AnimatePresence>
      <div className="center" style={{ pointerEvents: 'none' }}>
        <AnimatePresence>
          {open && (
            <motion.div className="dialog" initial={{ opacity: 0, scale: 0.85, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ type: 'spring', stiffness: 380, damping: 26 }}>
              <L w={80} h={7} c={C.ink} />
              <L w={124} h={4} />
              <L w={100} h={4} />
              <div className="row" style={{ justifyContent: 'flex-end', gap: 6, marginTop: 6 }}>
                <span className="btn-mini ghost">취소</span>
                <span className="btn-mini acc">삭제</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Win>
  )
}

export function Drawer() {
  const open = useStep(2, 1800) === 1
  return (
    <Win style={{ inset: '16px 18px' }}>
      <BgPage />
      <AnimatePresence>
        {open && (
          <>
            <motion.div key="o" className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div key="d" className="drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }}>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                <L w={40} h={6} c={C.ink} />
                <span className="x-mini">×</span>
              </div>
              {[60, 46, 54, 40].map((w, i) => (
                <div key={i} className="row" style={{ gap: 6, padding: '6px 0' }}>
                  <span className="sq" style={{ width: 10, height: 10, background: PALETTE[i] }} />
                  <L w={w} h={4} />
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Win>
  )
}

export function Dropdown() {
  const s = useStep(4, 1000)
  const open = s === 1 || s === 2
  return (
    <div style={{ position: 'absolute', left: 54, right: 54, top: 34 }}>
      <div className={'dd-field' + (open ? ' focus' : '')}>
        <span style={{ color: s === 3 ? C.ink : '#9a958b' }}>{s === 3 ? '디자인' : '카테고리 선택'}</span>
        <Chev animate={{ rotate: open ? 180 : 0 }} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="dd-menu" style={{ originY: 0 }} initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.18 }}>
            {['개발', '디자인', '기획', '마케팅'].map((o, i) => (
              <div key={o} className={'dd-item' + (s === 2 && i === 1 ? ' hl' : '')}>
                {o}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Tooltip() {
  const show = useStep(2, 1600) === 1
  return (
    <>
      <div className="tt-field">
        <L w={90} h={5} />
        <span className="tt-q">?</span>
      </div>
      <AnimatePresence>
        {show && (
          <motion.div className="tt-bubble" style={{ originX: 0.85, originY: 1 }} initial={{ opacity: 0, y: 6, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.95 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
            비밀번호는 8자 이상
          </motion.div>
        )}
      </AnimatePresence>
      <Cursor animate={{ x: show ? 214 : 160, y: show ? 120 : 172 }} transition={{ duration: 0.5, ease }} />
    </>
  )
}

export function Toast() {
  const show = useStep(2, 1800) === 1
  return (
    <Win style={{ inset: '16px 18px' }}>
      <BgPage />
      <div className="toast-wrap">
        <AnimatePresence>
          {show && (
            <motion.div className="toast" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0, scale: 0.95 }} transition={{ type: 'spring', stiffness: 420, damping: 30 }}>
              <span className="toast-ic">
                <Check size={10} color="#fff" />
              </span>
              저장되었어요
              <motion.span className="toast-bar" style={{ originX: 0 }} initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 1.7, ease: 'linear' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Win>
  )
}

export function Carousel() {
  const i = useStep(4, 1500)
  const cols = [C.pink, C.sky, C.mint, C.butter]
  return (
    <>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 30, height: 124, overflow: 'hidden' }}>
        <motion.div className="car-track" animate={{ x: 65 - i * 160 }} transition={{ type: 'spring', stiffness: 200, damping: 26 }}>
          {cols.map((c, j) => (
            <motion.div key={j} className="car-slide" animate={{ scale: j === i ? 1 : 0.86, opacity: j === i ? 1 : 0.5 }} style={{ background: c }}>
              <L w={70} h={7} c="rgba(255,255,255,.95)" />
              <L w={46} h={4} c="rgba(255,255,255,.75)" />
            </motion.div>
          ))}
        </motion.div>
      </div>
      <span className="car-arrow" style={{ left: 14 }}>‹</span>
      <span className="car-arrow" style={{ right: 14 }}>›</span>
      <div className="dots">
        {cols.map((_, j) => (
          <motion.span key={j} animate={{ width: j === i ? 18 : 6, background: j === i ? C.ink : '#cfcac0' }} />
        ))}
      </div>
    </>
  )
}

export function SkeletonLoading() {
  const loaded = useStep(2, 2000) === 1
  const shape = (real) => (
    <>
      <div className="row" style={{ gap: 8 }}>
        <span className={'avatar' + (real ? '' : ' sk')} style={{ width: 28, height: 28, background: real ? C.coral : undefined }} />
        <div style={{ display: 'grid', gap: 5 }}>
          <div className={'ln' + (real ? '' : ' sk')} style={{ width: 80, height: 6, background: real ? C.ink : undefined }} />
          <div className={'ln' + (real ? '' : ' sk')} style={{ width: 50, height: 4 }} />
        </div>
      </div>
      <div className={real ? 'img-grad' : 'sk'} style={{ height: 62, borderRadius: 8, margin: '10px 0' }} />
      <div className={'ln' + (real ? '' : ' sk')} style={{ width: '90%', height: 5, marginBottom: 6, background: real ? '#bdb8ad' : undefined }} />
      <div className={'ln' + (real ? '' : ' sk')} style={{ width: '65%', height: 5 }} />
    </>
  )
  return (
    <Win style={{ inset: '18px 26px', padding: 14 }}>
      <AnimatePresence mode="wait">
        <motion.div key={loaded ? 'c' : 's'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {shape(loaded)}
        </motion.div>
      </AnimatePresence>
    </Win>
  )
}

/* ───────── 효과 ───────── */

export function HoverEffect() {
  const a = useStep(2, 1400)
  return (
    <>
      <div className="center row" style={{ gap: 14 }}>
        {[C.sky, C.mint].map((c, i) => (
          <motion.div
            key={i}
            className="hv-card"
            animate={a === i ? { y: -8, boxShadow: '0 16px 26px rgba(30,30,20,.13)', borderColor: c } : { y: 0, boxShadow: '0 1px 2px rgba(30,30,20,.05)', borderColor: '#E7E3DA' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="hv-img">
              <motion.div style={{ background: c, width: '100%', height: '100%' }} animate={{ scale: a === i ? 1.12 : 1 }} transition={{ duration: 0.4 }} />
            </div>
            <L w={60} h={5} c={C.ink} />
            <L w={44} h={4} />
          </motion.div>
        ))}
      </div>
      <Cursor animate={{ x: a === 0 ? 96 : 206, y: 122 }} transition={{ duration: 0.55, ease }} />
    </>
  )
}

export function ScrollReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    let ctrl, timer
    let alive = true
    const run = () => {
      if (!alive) return
      el.scrollTop = 0
      timer = setTimeout(() => {
        ctrl = animate(0, el.scrollHeight - el.clientHeight, {
          duration: 3.4,
          ease: 'easeInOut',
          onUpdate: (v) => (el.scrollTop = v),
          onComplete: () => (timer = setTimeout(run, 900)),
        })
      }, 700)
    }
    run()
    return () => {
      alive = false
      clearTimeout(timer)
      ctrl?.stop()
    }
  }, [])
  return (
    <Win style={{ inset: '16px 18px' }}>
      <div ref={ref} className="sr-scroll">
        <div style={{ display: 'grid', gap: 6, padding: '6px 0 14px' }}>
          <L w={110} h={9} c={C.ink} />
          <L w={150} h={4} />
        </div>
        {PALETTE.map((c, i) => (
          <motion.div key={i} className="sr-item" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ root: ref, amount: 0.6 }} transition={{ duration: 0.5, ease }}>
            <span className="sq" style={{ background: c, width: 28, height: 28 }} />
            <div style={{ display: 'grid', gap: 5 }}>
              <L w={80} h={5} c={C.ink} />
              <L w={110} h={4} />
            </div>
          </motion.div>
        ))}
      </div>
    </Win>
  )
}

export function StaggerAnimation() {
  const k = useTick(2600)
  return (
    <div key={k}>
      <div className="center row" style={{ gap: 8, top: -16 }}>
        {PALETTE.map((c, i) => (
          <motion.div key={i} className="stg-tile" initial={{ opacity: 0, y: 24, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.14, type: 'spring', stiffness: 380, damping: 22 }}>
            <span style={{ background: c, width: '100%', height: 26, borderRadius: 6 }} />
            <L w="80%" h={4} />
            <L w="55%" h={4} />
          </motion.div>
        ))}
      </div>
      <div className="stg-time">
        {PALETTE.map((c, i) => (
          <motion.span key={i} initial={{ scale: 0.6, background: '#d6d2c8' }} animate={{ scale: 1, background: c }} transition={{ delay: i * 0.14 }} />
        ))}
      </div>
    </div>
  )
}

export function SmoothTransition() {
  const on = useStep(2, 1500) === 1
  return (
    <div className="center col" style={{ gap: 18 }}>
      <motion.div className="sw" initial={false} animate={{ background: on ? C.acc : '#D6D2C8' }} transition={{ duration: 0.35 }}>
        <motion.div className="sw-knob" initial={false} animate={{ x: on ? 26 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }} />
      </motion.div>
      <motion.div className="st-box" initial={false} animate={{ width: on ? 160 : 96, borderRadius: on ? 24 : 10, background: on ? '#FFE6D8' : '#FFFFFF' }} transition={{ duration: 0.6, ease }}>
        <L w={on ? 90 : 50} h={5} c={on ? C.acc : '#bdb8ad'} style={{ transition: 'all .6s cubic-bezier(.22,1,.36,1)' }} />
      </motion.div>
    </div>
  )
}

export function Glassmorphism() {
  const loop = (d) => ({ duration: d, repeat: Infinity, ease: 'easeInOut' })
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F1ECE3' }}>
      <motion.div className="blob" style={{ background: C.pink, width: 110, height: 110, left: 40, top: 20 }} animate={{ x: [0, 70, 0], y: [0, 40, 0] }} transition={loop(6)} />
      <motion.div className="blob" style={{ background: C.sky, width: 90, height: 90, left: 160, top: 100 }} animate={{ x: [0, -60, 0], y: [0, -50, 0] }} transition={loop(7)} />
      <motion.div className="blob" style={{ background: C.butter, width: 60, height: 60, left: 190, top: 20 }} animate={{ x: [0, -40, 0], y: [0, 60, 0] }} transition={loop(5)} />
      <div className="center">
        <div className="glass">
          <L w={80} h={7} c="rgba(255,255,255,.95)" />
          <L w={110} h={4} c="rgba(255,255,255,.75)" />
          <L w={90} h={4} c="rgba(255,255,255,.75)" />
        </div>
      </div>
    </div>
  )
}

const MOUNT = 'M0 80 L40 50 L80 72 L130 26 L180 64 L230 34 L280 58 L280 140 L0 140Z'
export function ParallaxScrolling() {
  const tr = (amp) => ({ animate: { y: [0, -amp, 0] }, transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } })
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#FFE6D2, #FFF7EE)' }}>
      <motion.div className="sun" {...tr(5)} />
      <motion.svg className="layer" viewBox="0 0 280 140" style={{ bottom: -30 }} {...tr(10)}>
        <path d={MOUNT} fill="#F8CDB3" />
      </motion.svg>
      <motion.svg className="layer" viewBox="0 0 280 140" style={{ bottom: -55, transform: 'scaleX(-1)' }} {...tr(26)}>
        <path d={MOUNT} fill="#EFA07E" />
      </motion.svg>
      <motion.svg className="layer" viewBox="0 0 280 140" style={{ bottom: -86 }} {...tr(52)}>
        <path d="M0 70 C60 40, 110 50, 150 66 S240 40, 280 54 L280 140 L0 140Z" fill="#C4654A" />
      </motion.svg>
      <div className="px-legend">
        <span><i style={{ background: '#F8CDB3' }} />느리게</span>
        <span><i style={{ background: '#C4654A' }} />빠르게</span>
      </div>
    </div>
  )
}

export function ScrollSnap() {
  const i = useStep(4, 1400)
  const cols = [C.sky, C.coral, C.mint, C.pink]
  return (
    <>
      <div className="snap-win">
        <motion.div animate={{ y: -i * 178 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
          {cols.map((c, j) => (
            <div key={j} className="snap-sec" style={{ background: c }}>
              <span className="snap-n">0{j + 1}</span>
              <L w={70} h={8} c="rgba(255,255,255,.95)" />
              <L w={50} h={4} c="rgba(255,255,255,.75)" />
            </div>
          ))}
        </motion.div>
      </div>
      <div className="snap-dots">
        {cols.map((_, j) => (
          <motion.span key={j} animate={{ height: j === i ? 16 : 6, background: j === i ? C.ink : '#cfcac0' }} />
        ))}
      </div>
    </>
  )
}

export function MicroInteraction() {
  const liked = useStep(2, 1500) === 1
  return (
    <>
      <div className="center">
        <motion.div className="like" animate={{ scale: liked ? [1, 0.88, 1.12, 1] : 1 }} transition={{ duration: 0.45 }}>
          <span style={{ position: 'relative', display: 'grid' }}>
            <motion.svg width="26" height="26" viewBox="0 0 24 24" strokeWidth="2" animate={{ scale: liked ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.45 }}>
              <motion.path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" initial={false} animate={{ fill: liked ? C.pink : 'rgba(255,111,165,0)', stroke: liked ? C.pink : C.ink }} strokeLinejoin="round" />
            </motion.svg>
            {liked &&
              [0, 1, 2, 3, 4, 5].map((j) => {
                const a = (j / 6) * Math.PI * 2
                return <motion.i key={j} className="burst" style={{ background: PALETTE[j % 5] }} initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: Math.cos(a) * 26, y: Math.sin(a) * 26, opacity: 0, scale: 0.4 }} transition={{ duration: 0.6, ease: 'easeOut' }} />
              })}
          </span>
          <span className="like-n">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={liked ? 'b' : 'a'} initial={{ y: liked ? 12 : -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: liked ? -12 : 12, opacity: 0 }} transition={{ duration: 0.25 }}>
                {liked ? 13 : 12}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>
      </div>
      <Cursor animate={{ x: 126, y: liked ? 114 : 124, scale: liked ? 0.9 : 1 }} transition={{ duration: 0.2 }} />
    </>
  )
}
