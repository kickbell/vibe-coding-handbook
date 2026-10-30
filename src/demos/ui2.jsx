import { useEffect } from 'react'
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'motion/react'
import { C, PALETTE, ease, useStep, useTick, useTypeLoop, L, Win, NavBar, Cursor, Icon, Phone } from './parts'

const spring = { type: 'spring', stiffness: 420, damping: 34 }

/* ───────── 내비게이션 ───────── */

export function NavigationBar() {
  const a = useStep(4, 1300)
  const items = ['홈', '소개', '작업', '문의']
  return (
    <Win style={{ inset: 18 }}>
      <div className="navbar">
        <span className="nav-dot" />
        <b style={{ fontSize: 10, marginRight: 'auto' }}>MyApp</b>
        {items.map((t, i) => (
          <span key={t} className={'nb-item' + (a === i ? ' on' : '')}>
            {a === i && <motion.span layoutId="nb" className="nb-bg" transition={spring} />}
            <span style={{ position: 'relative' }}>{t}</span>
          </span>
        ))}
      </div>
      <div style={{ padding: 12 }}>
        <AnimatePresence mode="wait">
          <motion.div key={a} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: 'grid', gap: 7 }}>
            <L w={[110, 80, 130, 90][a]} h={9} c={C.ink} />
            <L w="85%" h={4} />
            <L w="65%" h={4} />
            <div className="cell" style={{ height: 56, background: PALETTE[a] + '26', border: 'none' }} />
          </motion.div>
        </AnimatePresence>
      </div>
    </Win>
  )
}

export function HamburgerMenu() {
  const open = useStep(2, 1700) === 1
  const sp = { type: 'spring', stiffness: 400, damping: 28 }
  return (
    <Phone
      right={
        <div className="hb">
          <motion.span style={{ top: 0 }} initial={false} animate={{ y: open ? 6 : 0, rotate: open ? 45 : 0 }} transition={sp} />
          <motion.span style={{ top: 6 }} initial={false} animate={{ opacity: open ? 0 : 1 }} transition={sp} />
          <motion.span style={{ top: 12 }} initial={false} animate={{ y: open ? -6 : 0, rotate: open ? -45 : 0 }} transition={sp} />
        </div>
      }
    >
      <div style={{ padding: 10, display: 'grid', gap: 7 }}>
        <L w={80} h={8} c={C.ink} />
        <L w="90%" h={4} />
        <L w="70%" h={4} />
        <div className="cell" style={{ height: 60 }} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="ph-menu" initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 32 }}>
            {['홈', '소개', '작업', '문의'].map((t, i) => (
              <motion.div key={t} className="ph-menu-item" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.06 }}>
                {t}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Phone>
  )
}

export function BottomNavigation() {
  const a = useStep(4, 1300)
  const tabs = [
    ['home', '홈'],
    ['search', '검색'],
    ['heart', '찜'],
    ['user', 'MY'],
  ]
  return (
    <Phone>
      <div style={{ padding: 10 }}>
        <AnimatePresence mode="wait">
          <motion.div key={a} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} style={{ display: 'grid', gap: 7 }}>
            <L w={70} h={8} c={C.ink} />
            <div className="cell" style={{ height: 62, background: PALETTE[a] + '30', border: 'none' }} />
            <L w="80%" h={4} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="bnav">
        {tabs.map(([n, label], i) => (
          <div key={n} className={'bnav-it' + (a === i ? ' on' : '')}>
            {a === i && <motion.span layoutId="bnav" className="bnav-pill" transition={spring} />}
            <Icon n={n} size={13} style={{ position: 'relative' }} />
            <span style={{ position: 'relative' }}>{label}</span>
          </div>
        ))}
      </div>
    </Phone>
  )
}

const CRUMBS = ['홈', '상품', '신발', '운동화']
export function Breadcrumb() {
  const s = useStep(5, 900)
  const n = s === 4 ? 2 : s + 1
  return (
    <Win style={{ inset: 18, padding: 12 }}>
      <div className="row" style={{ gap: 3, height: 22 }}>
        <AnimatePresence initial={false}>
          {CRUMBS.slice(0, n).map((c, i) => (
            <motion.span key={c} className="row" style={{ gap: 3 }} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }} transition={{ duration: 0.2 }}>
              {i > 0 && <span style={{ color: '#bdb8ad', fontSize: 11 }}>›</span>}
              <span className={'bc' + (i === n - 1 ? ' cur' : '')}>{c}</span>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <div style={{ display: 'grid', gap: 7, marginTop: 12 }}>
        <L w={100} h={9} c={C.ink} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="cell" style={{ height: 70, flexDirection: 'column' }}>
              <span style={{ width: '100%', height: 36, borderRadius: 6, background: PALETTE[(i + n) % 5] }} />
              <L w="70%" h={4} />
            </div>
          ))}
        </div>
      </div>
    </Win>
  )
}

export function Pagination() {
  const p = useStep(5, 1100)
  return (
    <Win style={{ inset: 18, padding: 12 }}>
      <AnimatePresence mode="wait">
        <motion.div key={p} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ display: 'grid', gap: 6 }}>
          {[0, 1, 2].map((j) => (
            <div key={j} className="cell" style={{ alignItems: 'center' }}>
              <span className="sq" style={{ background: PALETTE[(p + j) % 5] }} />
              <L w={[90, 70, 80][(p + j) % 3]} h={4} />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="pgn">
        <span>‹</span>
        {[1, 2, 3, 4, 5].map((n, i) => (
          <span key={n} className={i === p ? 'on' : ''}>
            {i === p && <motion.i layoutId="pgn" className="pgn-bg" transition={spring} />}
            <b>{n}</b>
          </span>
        ))}
        <span>›</span>
      </div>
    </Win>
  )
}

export function Footer() {
  return (
    <Win style={{ inset: '16px 18px' }}>
      <motion.div animate={{ y: [0, 0, -100, -100, 0] }} transition={{ duration: 5, times: [0, 0.15, 0.45, 0.8, 1], repeat: Infinity, ease: 'easeInOut' }}>
        <div style={{ height: 176, padding: 12, display: 'grid', gap: 8, alignContent: 'start' }}>
          <L w={110} h={9} c={C.ink} />
          <L w="85%" h={4} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <div className="cell" style={{ height: 50 }} />
            <div className="cell" style={{ height: 50 }} />
          </div>
          <L w="60%" h={4} />
          <L w="75%" h={4} />
        </div>
        <div className="foot-mini">
          <div className="foot-cols">
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: 'grid', gap: 5 }}>
                <L w={34} h={5} c="rgba(255,255,255,.9)" />
                <L w={44} h={3} c="rgba(255,255,255,.35)" />
                <L w={30} h={3} c="rgba(255,255,255,.35)" />
              </div>
            ))}
          </div>
          <span>© 2026 MyApp · 이용약관 · 개인정보처리방침</span>
        </div>
      </motion.div>
    </Win>
  )
}

/* ───────── 입력 ───────── */

export function ToggleSwitch() {
  const s = useStep(4, 1100)
  const notif = s === 1 || s === 2
  const dark = s === 2 || s === 3
  return (
    <motion.div className="win" style={{ inset: '34px 44px', padding: 16, display: 'grid', gap: 14, alignContent: 'center' }} initial={false} animate={{ background: dark ? '#1f1f24' : '#ffffff', borderColor: dark ? '#1f1f24' : '#e7e3da' }} transition={{ duration: 0.4 }}>
      {[
        ['알림 받기', notif],
        ['다크 모드', dark],
      ].map(([t, v]) => (
        <div key={t} className="row" style={{ justifyContent: 'space-between' }}>
          <motion.span initial={false} animate={{ color: dark ? '#ffffff' : C.ink }} style={{ fontSize: 12, fontWeight: 700 }}>
            {t}
          </motion.span>
          <motion.span className="sw" style={{ width: 44, height: 24 }} initial={false} animate={{ background: v ? C.acc : dark ? '#45454d' : '#D6D2C8' }}>
            <motion.span className="sw-knob" style={{ width: 18, height: 18 }} initial={false} animate={{ x: v ? 20 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }} />
          </motion.span>
        </div>
      ))}
    </motion.div>
  )
}

export function CheckboxRadio() {
  const s = useStep(4, 900)
  return (
    <div className="center row" style={{ gap: 28, alignItems: 'flex-start' }}>
      <div style={{ display: 'grid', gap: 10 }}>
        <span className="mini-cap">Checkbox · 여러 개</span>
        {['사과', '바나나', '포도'].map((t, i) => {
          const on = i < s
          return (
            <div key={t} className="row" style={{ gap: 7 }}>
              <motion.span className="cb" initial={false} animate={{ background: on ? C.acc : '#ffffff', borderColor: on ? C.acc : '#cfcac0' }}>
                <svg viewBox="0 0 24 24" width="12" height="12">
                  <motion.path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: on ? 1 : 0 }} />
                </svg>
              </motion.span>
              <span className="opt">{t}</span>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        <span className="mini-cap">Radio · 하나만</span>
        {['작게', '보통', '크게'].map((t, i) => (
          <div key={t} className="row" style={{ gap: 7 }}>
            <span className={'rd' + (s % 3 === i ? ' on' : '')}>{s % 3 === i && <motion.i layoutId="rd" className="rd-dot" transition={spring} />}</span>
            <span className="opt">{t}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const EMAIL = 'hello@vibe.dev'
export function TextField() {
  const n = useTypeLoop(EMAIL.length, { speed: 90, start: 900 })
  const focus = n > 0
  return (
    <div className="tf-demo">
      <div style={{ display: 'grid', gap: 6 }}>
        <span className="fl-label">이메일</span>
        <motion.div className="tf" initial={false} animate={{ borderColor: focus ? C.acc : '#e2ded5', boxShadow: focus ? '0 0 0 3px #FFE3D5' : '0 0 0 0px #FFE3D5' }}>
          {n === 0 ? <span className="ph">you@example.com</span> : EMAIL.slice(0, n)}
          {focus && <span className="caret sm" />}
        </motion.div>
        <span className="tf-help" style={{ color: n === EMAIL.length ? '#158a6c' : undefined }}>
          {n === EMAIL.length ? '사용할 수 있는 이메일이에요' : '로그인할 때 쓰는 이메일'}
        </span>
      </div>
      <div className="tf-tags">
        <span>Label</span>
        <span>Input</span>
        <span>Helper</span>
      </div>
    </div>
  )
}

const NAME = '김바이브'
export function Placeholder() {
  const n = useTypeLoop(NAME.length, { speed: 260, hold: 1400, start: 1500 })
  return (
    <div style={{ position: 'absolute', left: 40, right: 40, top: 62, display: 'grid', gap: 10 }}>
      <AnimatePresence mode="wait">
        <motion.span key={n === 0 ? 'p' : 'v'} className={'ph-note' + (n === 0 ? '' : ' val')} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {n === 0 ? 'placeholder · 비어 있을 때 보이는 안내 문구' : 'value · 실제로 입력한 값'}
        </motion.span>
      </AnimatePresence>
      <div className="tf" style={{ borderColor: n ? C.ink : '#e2ded5' }}>
        {n === 0 ? <span className="ph">이름을 입력하세요</span> : NAME.slice(0, n)}
        {n > 0 && <span className="caret sm" />}
      </div>
    </div>
  )
}

export function Select() {
  const s = useStep(4, 1000)
  const open = s === 1 || s === 2
  return (
    <div style={{ position: 'absolute', left: 50, right: 50, top: 26, display: 'grid', gap: 5 }}>
      <span className="fl-label">이름</span>
      <div className="tf">김바이브</div>
      <span className="fl-label" style={{ marginTop: 6 }}>지역</span>
      <div className="tf" style={{ justifyContent: 'space-between', borderColor: open ? C.ink : undefined }}>
        <span style={{ color: s === 3 ? C.ink : '#9a958b' }}>{s === 3 ? '서울' : '선택해주세요'}</span>
        <Icon n="updown" size={12} color="#6b665d" />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="sel-pop" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
            {['서울', '부산', '대구'].map((o, i) => (
              <div key={o} className={'sel-it' + (s === 2 && i === 0 ? ' hl' : '')}>
                {o}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Q = '토스트'
const SUGGEST = ['토스트 알림', '토스트 / 스낵바', '토글 스위치']
export function SearchBar() {
  const n = useTypeLoop(Q.length, { speed: 380, hold: 1800, start: 700 })
  const q = Q.slice(0, n)
  const hits = SUGGEST.filter((s) => s.startsWith(q))
  return (
    <div style={{ position: 'absolute', left: 36, right: 36, top: 36 }}>
      <motion.div className="sb" initial={false} animate={{ borderColor: n ? C.ink : '#e2ded5' }}>
        <Icon n="search" size={14} color="#9a958b" />
        {n ? q : <span className="ph">용어 검색</span>}
        {n > 0 && <span className="caret sm" />}
      </motion.div>
      <AnimatePresence>
        {n > 0 && (
          <motion.div className="sb-res" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
            {hits.map((h) => (
              <motion.div key={h} layout className="sb-row">
                <Icon n="search" size={10} color="#bdb8ad" />
                <span>
                  <b>{q}</b>
                  {h.slice(q.length)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────── 표시 ───────── */

export function Badge() {
  const k = useTick(1400)
  return (
    <div className="center row" style={{ gap: 22 }}>
      <div className="bd-ic">
        <Icon n="bell" size={22} />
        <motion.span key={k} className="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 14 }}>
          {(k % 5) + 1}
        </motion.span>
      </div>
      <div className="bd-ic">
        <Icon n="mail" size={22} />
        <motion.span className="bd-dot" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
      </div>
      <div className="bd-menu">
        이벤트
        <motion.span className="bd-new" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
          NEW
        </motion.span>
      </div>
    </div>
  )
}

export function Avatar() {
  const k = useTick(3000)
  return (
    <div className="center col" style={{ gap: 20 }}>
      <div className="row" style={{ gap: 16 }}>
        <span className="av big" style={{ background: 'linear-gradient(135deg,#FFB088,#FF6FA5)' }}>
          <motion.i className="av-on" animate={{ boxShadow: ['0 0 0 0 rgba(46,196,160,.6)', '0 0 0 6px rgba(46,196,160,0)'] }} transition={{ duration: 1.4, repeat: Infinity }} />
        </span>
        <span className="av big" style={{ background: C.sky }}>
          JY
        </span>
        <span className="av big" style={{ background: '#E7E3DA', color: '#8a857b' }}>
          <Icon n="user" size={20} />
        </span>
      </div>
      <div key={k} className="av-stack">
        {[C.sky, C.coral, C.mint, C.butter].map((c, i) => (
          <motion.span key={i} className="av" style={{ background: c, zIndex: 5 - i }} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
            {'ABCD'[i]}
          </motion.span>
        ))}
        <motion.span className="av more" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 500, damping: 18 }}>
          +3
        </motion.span>
      </div>
    </div>
  )
}

export function ChipTag() {
  const s = useStep(5, 900)
  const sel = [s, (s + 2) % 5]
  return (
    <div className="center col" style={{ gap: 18, padding: '0 22px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        {['디자인', '개발', '기획', '마케팅', '영상'].map((t, i) => (
          <motion.span key={t} className="chip-d" initial={false} animate={{ background: sel.includes(i) ? C.ink : '#ffffff', color: sel.includes(i) ? '#ffffff' : '#6b665d', borderColor: sel.includes(i) ? C.ink : '#e2ded5' }} transition={{ duration: 0.2 }}>
            {t}
          </motion.span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <AnimatePresence mode="popLayout" initial={false}>
          {['#React', '#Motion', '#바이브'].filter((t, i) => !(i === 2 && s >= 3)).map((t) => (
            <motion.span key={t} layout className="tag-d" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
              {t}
              <Icon n="x" size={9} w={3} />
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function ProgressBar() {
  const v = useMotionValue(0)
  const width = useTransform(v, (x) => x + '%')
  const label = useTransform(v, (x) => Math.round(x) + '%')
  const ring = useTransform(v, (x) => x / 100)
  useEffect(() => {
    const c = animate(v, [0, 100, 100], { duration: 3.2, times: [0, 0.75, 1], ease: 'easeInOut', repeat: Infinity })
    return () => c.stop()
  }, [v])
  return (
    <div className="center col" style={{ gap: 22 }}>
      <div style={{ width: 190, display: 'grid', gap: 6 }}>
        <div className="row" style={{ justifyContent: 'space-between', fontSize: 10.5, fontWeight: 700 }}>
          <span>업로드 중</span>
          <motion.span className="mono">{label}</motion.span>
        </div>
        <div className="pb-track">
          <motion.span style={{ width }} />
        </div>
      </div>
      <svg width="54" height="54" viewBox="0 0 54 54">
        <circle cx="27" cy="27" r="22" fill="none" stroke="#e7e3da" strokeWidth="6" />
        <motion.circle cx="27" cy="27" r="22" fill="none" stroke={C.acc} strokeWidth="6" strokeLinecap="round" style={{ pathLength: ring, rotate: -90 }} />
      </svg>
    </div>
  )
}

const spin = { rotate: 360 }
const spinT = { duration: 0.9, repeat: Infinity, ease: 'linear' }
export function Spinner() {
  return (
    <div className="center row" style={{ gap: 26 }}>
      <motion.span className="spn-ring" animate={spin} transition={spinT} />
      <div className="row" style={{ gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="spn-dot" animate={{ y: [0, -7, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }} />
        ))}
      </div>
      <span className="btn-mini acc" style={{ gap: 6, padding: '8px 12px' }}>
        <motion.span className="spn-ring sm" animate={spin} transition={spinT} />
        저장 중
      </span>
    </div>
  )
}

export function EmptyState() {
  return (
    <div className="center col" style={{ gap: 7 }}>
      <motion.div className="es-ic" animate={{ y: [0, -5, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
        <Icon n="box" size={28} color="#bdb8ad" w={1.6} />
      </motion.div>
      <b style={{ fontSize: 13, marginTop: 4 }}>아직 찜한 상품이 없어요</b>
      <span style={{ fontSize: 10, color: '#8a857b' }}>마음에 드는 상품에 하트를 눌러보세요</span>
      <motion.span className="btn-mini acc" style={{ marginTop: 4 }} animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
        둘러보기
      </motion.span>
    </div>
  )
}

/* ───────── 버튼·행동 ───────── */

export function CTAButton() {
  const k = useTick(2600)
  return (
    <Win style={{ inset: '16px 18px' }}>
      <NavBar />
      <div style={{ padding: '16px 14px', display: 'grid', gap: 7, justifyItems: 'center' }}>
        <L w={150} h={11} c={C.ink} />
        <L w={110} h={11} c={C.ink} />
        <L w={170} h={4} />
        <div style={{ position: 'relative', marginTop: 8 }}>
          <motion.span className="cta-ring" animate={{ scale: [1, 1.35], opacity: [0.5, 0] }} transition={{ duration: 1.4, repeat: Infinity }} />
          <motion.span key={k} className="cta" animate={{ scale: [1, 1, 0.93, 1.04, 1] }} transition={{ duration: 1.4, times: [0, 0.5, 0.6, 0.75, 1] }}>
            무료로 시작하기 →
          </motion.span>
        </div>
        <span style={{ fontSize: 9, color: '#9a958b' }}>더 알아보기</span>
      </div>
      <Cursor key={'c' + k} initial={{ x: 220, y: 175 }} animate={{ x: 150, y: 142 }} transition={{ duration: 0.7, ease }} />
    </Win>
  )
}

export function ButtonHierarchy() {
  const h = useStep(3, 1100)
  const rows = [
    ['Primary', 'primary', '가장 중요한 행동 1개'],
    ['Secondary', 'secondary', '보조 행동'],
    ['Text', 'text', '덜 중요한 행동'],
  ]
  return (
    <div className="center col" style={{ gap: 12 }}>
      {rows.map(([name, cls, desc], i) => (
        <div key={name} className="row" style={{ gap: 12, width: 196 }}>
          <motion.span className={'bh ' + cls} animate={{ scale: h === i ? 1.06 : 1, y: h === i ? -2 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            저장하기
          </motion.span>
          <div style={{ display: 'grid', gap: 1 }}>
            <b style={{ fontSize: 10.5 }}>{name}</b>
            <span style={{ fontSize: 9, color: '#8a857b' }}>{desc}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function FAB() {
  const open = useStep(2, 1600) === 1
  return (
    <Phone>
      <div style={{ padding: 8, display: 'grid', gap: 6 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="cell" style={{ height: 30, alignItems: 'center' }}>
            <span className="sq" style={{ background: PALETTE[i] }} />
            <L w={[60, 48, 70, 52][i]} h={4} />
          </div>
        ))}
      </div>
      <AnimatePresence>{open && <motion.div className="overlay" style={{ background: 'rgba(20,20,24,.22)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}</AnimatePresence>
      <div className="fab-acts">
        <AnimatePresence>
          {open &&
            [
              ['pen', '글쓰기'],
              ['image', '사진'],
            ].map(([n, t], i) => (
              <motion.div key={n} className="row" style={{ gap: 6 }} initial={{ opacity: 0, y: 12, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: (1 - i) * 0.06 } }} exit={{ opacity: 0, y: 8, scale: 0.8 }}>
                <span className="fab-label">{t}</span>
                <span className="fab-mini">
                  <Icon n={n} size={13} />
                </span>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
      <motion.div className="fab" initial={false} animate={{ rotate: open ? 45 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
        <Icon n="plus" size={18} color="#fff" w={2.6} />
      </motion.div>
    </Phone>
  )
}

export function PullToRefresh() {
  const s = useStep(4, 900)
  const pulled = s === 1 || s === 2
  return (
    <Phone>
      <div style={{ position: 'relative', height: 154, overflow: 'hidden', background: '#f6f4ef' }}>
        <div className="ptr-spin">
          <motion.span className="spn-ring" style={{ width: 18, height: 18, borderWidth: 2 }} animate={{ rotate: s === 2 ? [0, 360] : s === 1 ? 160 : 0 }} transition={s === 2 ? { duration: 0.7, repeat: Infinity, ease: 'linear' } : { duration: 0.5 }} />
        </div>
        <motion.div animate={{ y: pulled ? 42 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} style={{ position: 'relative', padding: 8, display: 'grid', gap: 6, background: '#fff', minHeight: '100%' }}>
          <AnimatePresence initial={false}>
            {s === 3 && (
              <motion.div key="new" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 30 }} exit={{ opacity: 0, height: 0 }} className="cell" style={{ alignItems: 'center', background: '#FFF3EA', borderColor: '#FFD3BC', overflow: 'hidden', padding: '0 7px' }}>
                <span className="sq" style={{ background: C.acc }} />
                <b style={{ fontSize: 9 }}>새 글 1개</b>
              </motion.div>
            )}
          </AnimatePresence>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="cell" style={{ height: 30, alignItems: 'center' }}>
              <span className="sq" style={{ background: PALETTE[i + 1] }} />
              <L w={[60, 48, 70, 52][i]} h={4} />
            </div>
          ))}
        </motion.div>
      </div>
      <Cursor animate={{ x: 60, y: pulled ? 110 : 68 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} />
    </Phone>
  )
}

export function InfiniteScroll() {
  const k = useTick(1500)
  const count = 4 + (k % 5) * 2
  const y = -Math.max(0, count * 36 + 30 - 154)
  return (
    <Phone>
      <div style={{ position: 'relative', height: 154, overflow: 'hidden' }}>
        <motion.div animate={{ y }} transition={{ duration: 0.8, ease }} style={{ padding: 8, display: 'grid', gap: 6 }}>
          {Array.from({ length: count }).map((_, i) => (
            <motion.div key={i} className="cell" style={{ height: 30, alignItems: 'center' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <span className="sq" style={{ background: PALETTE[i % 5] }} />
              <L w={50 + ((i * 13) % 40)} h={4} />
            </motion.div>
          ))}
          <div className="row" style={{ justifyContent: 'center', height: 24 }}>
            <motion.span className="spn-ring" style={{ width: 14, height: 14, borderWidth: 2 }} animate={spin} transition={spinT} />
          </div>
        </motion.div>
      </div>
    </Phone>
  )
}
