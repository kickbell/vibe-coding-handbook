import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'
import { Shell, EventLog, useEventLog, Slider, Segmented, Toggle } from '../components/kit'
import { C, PALETTE, ease, Check } from '../demos/parts'

/* ───────── Page Transition ───────── */

const PAGES = [
  { id: 'home', t: '홈', title: '작은 가게를 위한 디자인', c: C.sky },
  { id: 'work', t: '작업', title: '최근 작업 12개', c: C.mint },
  { id: 'about', t: '소개', title: '안녕하세요, 지수예요', c: C.pink },
]
const PAGE_ANIM = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  slide: { initial: (d) => ({ x: d * 60, opacity: 0 }), animate: { x: 0, opacity: 1 }, exit: (d) => ({ x: -d * 60, opacity: 0 }) },
  scale: { initial: { scale: 0.94, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 1.04, opacity: 0 } },
  wipe: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
}

function PageTransitionPG() {
  const [page, setPage] = useState(0)
  const [type, setType] = useState('slide')
  const [duration, setDuration] = useState(0.35)
  const dir = useRef(1)
  const { logs, push, clear } = useEventLog()
  const p = PAGES[page]

  const go = (i) => {
    if (i === page) return
    dir.current = i > page ? 1 : -1
    push('close', `'${PAGES[page].t}' 페이지 나감`)
    setPage(i)
  }
  const typeKo = { fade: '이전 페이지가 서서히 사라지고 새 페이지가 서서히 나타나게(fade)', slide: '메뉴 순서에 맞춰 옆으로 밀려나고 들어오게(slide)', scale: '살짝 작은 크기에서 커지며 나타나게(scale)', wipe: '주황색 막이 화면을 한 번 쓸고 지나가며 바뀌게(wipe)' }[type]
  const prompt = `메뉴를 눌러 페이지를 이동할 때 페이지 전환(Page Transition) 애니메이션을 넣어줘. ${typeKo}. 나가는 페이지가 끝난 뒤 들어오는 페이지가 시작되게 하고(mode="wait"), 각각 ${duration}초. React Router + Motion의 AnimatePresence 사용.`

  return (
    <Shell
      hint="위쪽 메뉴를 눌러 페이지를 바꿔보세요"
      stage={
        <div className="pg-page">
          <div className="pg-page-nav">
            <b>JISU</b>
            {PAGES.map((x, i) => (
              <button key={x.id} className={i === page ? 'on' : ''} onClick={() => go(i)}>
                {x.t}
              </button>
            ))}
          </div>
          <div className="pg-pt-body">
            <AnimatePresence mode="wait" custom={dir.current} initial={false}>
              <motion.div
                key={p.id}
                custom={dir.current}
                variants={PAGE_ANIM[type]}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration, ease }}
                onAnimationComplete={(d) => d === 'animate' && push('open', `'${p.t}' 페이지 도착`)}
                className="pg-pt-page"
              >
                <b>{p.title}</b>
                <div className="pg-pt-grid">
                  {[0, 1, 2].map((j) => (
                    <span key={j} style={{ background: PALETTE[(page * 2 + j) % 5] }} />
                  ))}
                </div>
                <i />
                <i style={{ width: '60%' }} />
              </motion.div>
            </AnimatePresence>
            {type === 'wipe' && <motion.div key={'w' + page} className="pg-wipe" initial={{ x: '-101%' }} animate={{ x: ['-101%', '0%', '0%', '101%'] }} transition={{ duration: duration * 2.4, times: [0, 0.4, 0.6, 1], ease: 'easeInOut' }} />}
          </div>
        </div>
      }
      controls={
        <>
          <Segmented label="전환 방식" value={type} onChange={setType} options={[{ value: 'slide', label: '밀기' }, { value: 'fade', label: '페이드' }, { value: 'scale', label: '확대' }, { value: 'wipe', label: '쓸기' }]} />
          <Slider label="나가고 들어오는 시간" value={duration} min={0.1} max={1} step={0.05} unit="s" onChange={setDuration} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Shared Element ───────── */

const PHOTOS = [
  { c: C.sky, t: '바다 여행', d: '제주 협재 해변에서 찍은 사진' },
  { c: C.butter, t: '노란 숲', d: '가을 은행나무 길' },
  { c: C.pink, t: '벚꽃', d: '경주 보문호 벚꽃길' },
  { c: C.mint, t: '초록 들판', d: '평창 양떼목장' },
]

function SharedElementPG() {
  const [sel, setSel] = useState(null)
  const [stiff, setStiff] = useState(300)
  const [dim, setDim] = useState(true)
  const { logs, push, clear } = useEventLog()
  const sp = { type: 'spring', stiffness: stiff, damping: 30 }

  const prompt = `사진 목록에서 썸네일을 누르면 그 썸네일이 그대로 커지면서 상세 화면이 되는 공유 요소 전환(Shared Element Transition)을 만들어줘. 썸네일과 상세 이미지에 같은 layoutId를 줘서 위치·크기가 이어지게, spring(stiffness ${stiff}, damping 30). 제목과 설명은 확대가 끝난 뒤 페이드인${dim ? ', 뒤의 목록은 어둡게' : ''}. 닫으면 다시 원래 썸네일 자리로 돌아가게.`

  return (
    <Shell
      hint="사진을 눌러보세요"
      stage={
        <div className="pg-se">
          <div className="pg-se-grid">
            {PHOTOS.map((ph, i) =>
              sel === i ? (
                <div key={i} className="pg-se-thumb ph" />
              ) : (
                <motion.button
                  key={i}
                  layoutId={'pg-se-' + i}
                  className="pg-se-thumb"
                  style={{ borderRadius: 14 }}
                  transition={sp}
                  onClick={() => {
                    setSel(i)
                    push('open', `'${ph.t}' 썸네일 → 상세 화면으로 커짐`)
                  }}
                >
                  <motion.span layoutId={'pg-se-img-' + i} style={{ background: ph.c, borderRadius: 10 }} transition={sp} />
                  <b>{ph.t}</b>
                </motion.button>
              ),
            )}
          </div>
          <AnimatePresence>
            {sel !== null && dim && <motion.div key="dim" className="pg-overlay" style={{ background: 'rgba(20,18,14,.35)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(null)} />}
            {sel !== null && (
              <motion.div key="d" layoutId={'pg-se-' + sel} className="pg-se-detail" style={{ borderRadius: 20 }} transition={sp} onLayoutAnimationComplete={() => push('end', '전환 완료')}>
                <motion.span layoutId={'pg-se-img-' + sel} className="pg-se-big" style={{ background: PHOTOS[sel].c, borderRadius: 14 }} transition={sp} />
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="pg-se-text">
                  <b>{PHOTOS[sel].t}</b>
                  <span>{PHOTOS[sel].d}</span>
                  <button
                    className="btn small"
                    onClick={() => {
                      setSel(null)
                      push('close', '닫기 → 썸네일 자리로 돌아감')
                    }}
                  >
                    닫기
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
      controls={
        <>
          <Slider label="탄성 (stiffness)" value={stiff} min={80} max={700} step={10} onChange={setStiff} />
          <Toggle label="뒤 목록 어둡게" value={dim} onChange={setDim} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Pin · Scrollytelling ───────── */

const STEPS = [
  { t: '사진을 찍으면', c: C.sky },
  { t: 'AI가 정리하고', c: C.mint },
  { t: '바로 공유해요', c: C.pink },
  { t: '팀과 함께 봐요', c: C.butter },
]

function PinPG() {
  const [count, setCount] = useState(3)
  const [pin, setPin] = useState(true)
  const [step, setStep] = useState(0)
  const root = useRef(null)
  const sec = useRef(null)
  const { logs, push, clear } = useEventLog()
  // 고정되는 섹션 구간(섹션 위 = 화면 위 → 섹션 끝 = 화면 끝)만 0~1로
  const { scrollYProgress } = useScroll({ container: root, target: sec, offset: ['start start', 'end end'] })
  const steps = STEPS.slice(0, count)
  useEffect(() => {
    root.current.scrollTop = 0
  }, [count])
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const s = Math.min(count - 1, Math.floor(p * count * 0.999))
    if (s !== step) {
      setStep(s)
      push('child', `${s + 1}단계 화면으로 바뀜`)
    }
  })

  const prompt = `기능 소개 섹션에 스크롤텔링(Pin·Scrollytelling)을 넣어줘. ${pin ? '왼쪽 휴대폰 화면은 섹션이 끝날 때까지 제자리에 고정(pin, position: sticky)되고' : '휴대폰 화면도 함께 스크롤되고'}, 오른쪽 설명 ${count}개가 스크롤될 때마다 휴대폰 속 화면이 ${steps.map((s) => `"${s.t}"`).join(' → ')} 순서로 바뀌게. 진행 막대로 현재 단계를 보여줘. GSAP ScrollTrigger 또는 Motion useScroll 사용.`

  return (
    <Shell
      hint="안쪽 화면을 스크롤해 보세요"
      stage={
        <div className="pg-scroller pg-pin" ref={root}>
          <div className="pg-pin-sec" ref={sec} style={{ height: `${count * 100}%` }}>
            <div className={'pg-pin-left' + (pin ? ' sticky' : '')}>
              <div className="pg-phone">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div key={step} className="pg-phone-screen" style={{ background: steps[step].c }} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
                    <b>{step + 1}</b>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="pg-pin-prog">
                <motion.span style={{ scaleY: scrollYProgress, originY: 0 }} />
              </div>
            </div>
            <div className="pg-pin-right">
              {steps.map((s, i) => (
                <div key={i} className={'pg-pin-step' + (i === step ? ' on' : '')}>
                  <span className="mono">STEP {i + 1}</span>
                  <b>{s.t}</b>
                </div>
              ))}
            </div>
          </div>
          <div className="pg-pin-after">섹션 끝 · 고정 풀림</div>
        </div>
      }
      controls={
        <>
          <Toggle label="휴대폰 고정 (pin)" value={pin} onChange={setPin} />
          <Slider label="단계 수" value={count} min={2} max={4} step={1} unit="개" onChange={setCount} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Horizontal Scroll ───────── */

function HorizontalScrollPG() {
  const [cards, setCards] = useState(6)
  const [length, setLength] = useState(3)
  const root = useRef(null)
  const track = useRef(null)
  const sec = useRef(null)
  const { logs, push, clear } = useEventLog()
  const { scrollYProgress } = useScroll({ container: root, target: sec, offset: ['start start', 'end end'] })
  useEffect(() => {
    root.current.scrollTop = 0
  }, [cards, length])
  const x = useTransform(scrollYProgress, (p) => {
    const t = track.current
    if (!t) return 0
    return -p * Math.max(0, t.scrollWidth - t.parentElement.clientWidth)
  })
  const last = useRef(-1)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const q = Math.round(p * (cards - 1))
    if (q !== last.current) {
      last.current = q
      push('move', `세로 스크롤 ${Math.round(p * 100)}% → 카드 ${q + 1} 보임`)
    }
  })

  const prompt = `포트폴리오 섹션에서 세로로 스크롤하면 카드 ${cards}장이 가로로 지나가는 가로 스크롤(Horizontal Scroll)을 만들어줘. 섹션은 화면에 고정(pin)하고, 스크롤 거리는 화면 높이의 ${length}배. 마지막 카드까지 보이면 고정이 풀리고 다음 섹션으로 이어지게. GSAP ScrollTrigger pin + scrub 사용.`

  return (
    <Shell
      hint="안쪽 화면을 위아래로 스크롤해 보세요"
      stage={
        <div className="pg-scroller" ref={root}>
          <div ref={sec} style={{ height: `${length * 100}%`, position: 'relative' }}>
            <div className="pg-hs-sticky">
              <span className="pg-hs-cap">세로로 스크롤 → 가로로 이동</span>
              <div className="pg-hs-view">
                <motion.div ref={track} className="pg-hs-track" style={{ x }}>
                  {Array.from({ length: cards }).map((_, i) => (
                    <div key={i} style={{ background: PALETTE[i % 5] }}>
                      <span className="mono">0{i + 1}</span>
                      <b>프로젝트 {i + 1}</b>
                    </div>
                  ))}
                </motion.div>
              </div>
              <div className="pg-hs-bar">
                <motion.i style={{ scaleX: scrollYProgress, originX: 0 }} />
              </div>
            </div>
          </div>
          <div className="pg-pin-after">다음 섹션</div>
        </div>
      }
      controls={
        <>
          <Slider label="카드 수" value={cards} min={3} max={10} step={1} unit="장" onChange={setCards} />
          <Slider label="스크롤 거리 (화면 몇 배)" value={length} min={2} max={6} step={1} unit="배" onChange={setLength} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Magnetic Button ───────── */

function MagneticPG() {
  const [strength, setStrength] = useState(0.4)
  const [radius, setRadius] = useState(110)
  const [inner, setInner] = useState(true)
  const [ring, setRing] = useState(true)
  const btn = useRef(null)
  const inside = useRef(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 200, damping: 15 })
  const y = useSpring(my, { stiffness: 200, damping: 15 })
  const tx = useTransform(x, (v) => (inner ? v * 0.4 : 0))
  const ty = useTransform(y, (v) => (inner ? v * 0.4 : 0))
  const { logs, push, clear } = useEventLog()

  const move = (e) => {
    const r = btn.current.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    const near = Math.hypot(dx, dy) < radius
    if (near !== inside.current) {
      inside.current = near
      push(near ? 'drag' : 'release', near ? '자석 범위 안 → 버튼이 끌려옴' : '범위 밖 → 제자리로')
    }
    mx.set(near ? dx * strength : 0)
    my.set(near ? dy * strength : 0)
  }
  const leave = () => {
    if (inside.current) push('release', '범위 밖 → 제자리로')
    inside.current = false
    mx.set(0)
    my.set(0)
  }

  const prompt = `"시작하기" 버튼을 마그네틱 버튼(Magnetic Button)으로 만들어줘. 마우스가 버튼 중심에서 ${radius}px 안으로 들어오면 버튼이 마우스 쪽으로 거리의 ${Math.round(strength * 100)}%만큼 끌려오고${inner ? ', 안쪽 글자는 그보다 조금 덜 따라와서 입체감이 생기게' : ''}. 범위를 벗어나면 spring으로 통 하고 제자리로. 터치 기기에서는 효과를 꺼줘.`

  return (
    <Shell
      hint="버튼 근처로 마우스를 천천히 가져가 보세요"
      stage={
        <div className="pg-mag" onMouseMove={move} onMouseLeave={leave}>
          {ring && <span className="pg-mag-ring" style={{ width: radius * 2, height: radius * 2 }} />}
          <motion.button ref={btn} className="btn pg-mag-btn" style={{ x, y }} onClick={() => push('end', '클릭!')}>
            <motion.span style={{ x: tx, y: ty, display: 'inline-block' }}>시작하기 →</motion.span>
          </motion.button>
        </div>
      }
      controls={
        <>
          <Slider label="끌려오는 힘" value={strength} min={0.1} max={1} step={0.05} onChange={setStrength} />
          <Slider label="자석 범위 (반지름)" value={radius} min={50} max={200} step={10} unit="px" onChange={setRadius} />
          <Toggle label="글자는 덜 따라오기 (입체감)" value={inner} onChange={setInner} />
          <Toggle label="범위 표시" value={ring} onChange={setRing} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Custom Cursor ───────── */

function CustomCursorPG() {
  const [size, setSize] = useState(16)
  const [lag, setLag] = useState(0.5)
  const [style, setStyle] = useState('dot')
  const [hover, setHover] = useState(null)
  const [inArea, setInArea] = useState(false)
  const area = useRef(null)
  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const spring = { stiffness: 900 - lag * 800, damping: 40 - lag * 15, mass: 0.6 }
  const x = useSpring(mx, spring)
  const y = useSpring(my, spring)
  const { logs, push, clear } = useEventLog()
  const big = hover !== null
  const s = big ? size * 4 : size

  const move = (e) => {
    const r = area.current.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }
  const styleKo = { dot: '주황색 꽉 찬 동그라미', ring: '테두리만 있는 동그라미', blend: '아래 색을 반전시키는(mix-blend-mode: difference) 흰 동그라미' }[style]
  const prompt = `포트폴리오 사이트에 커스텀 커서(Custom Cursor)를 만들어줘. 기본 화살표는 숨기고(cursor: none), 지름 ${size}px의 ${styleKo}가 마우스를 ${lag > 0.6 ? '느긋하게' : lag > 0.25 ? '살짝 늦게' : '바로'} 따라오게(spring). 작업 카드 위에 올라가면 커서가 ${size * 4}px로 커지면서 안에 "보기" 글자가 나타나게. 터치 기기에서는 기본 커서 그대로.`

  return (
    <Shell
      hint="이 안에서 마우스를 움직여 보세요"
      stage={
        <div
          ref={area}
          className="pg-cc"
          onMouseMove={move}
          onMouseEnter={() => {
            setInArea(true)
            push('start', '영역 들어옴 → 기본 커서 숨김')
          }}
          onMouseLeave={() => {
            setInArea(false)
            setHover(null)
            push('close', '영역 나감 → 기본 커서')
          }}
        >
          <div className="pg-cc-text">
            <b>Selected Works</b>
            <span>카드 위에 올려보세요</span>
          </div>
          <div className="pg-cc-cards">
            {['브랜딩', '앱 디자인'].map((t, i) => (
              <div
                key={t}
                className="pg-cc-card"
                style={{ background: [C.sky, C.pink][i] }}
                onMouseEnter={() => {
                  setHover(i)
                  push('open', `'${t}' 위 → 커서 커짐`)
                }}
                onMouseLeave={() => {
                  setHover(null)
                  push('end', '커서 원래 크기')
                }}
              >
                {t}
              </div>
            ))}
          </div>
          {inArea && (
            <motion.div className={'pg-cc-cursor ' + style} style={{ x, y }}>
              <motion.div animate={{ width: s, height: s }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}>
                <AnimatePresence>
                  {big && (
                    <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      보기
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </div>
      }
      controls={
        <>
          <Segmented label="커서 모양" value={style} onChange={setStyle} options={[{ value: 'dot', label: '꽉 찬 원' }, { value: 'ring', label: '테두리' }, { value: 'blend', label: '색 반전' }]} />
          <Slider label="커서 크기" value={size} min={8} max={40} step={2} unit="px" onChange={setSize} />
          <Slider label="따라오는 느림 (lag)" value={lag} min={0} max={1} step={0.05} onChange={setLag} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── 3D Tilt ───────── */

function TiltPG() {
  const [max, setMax] = useState(15)
  const [persp, setPersp] = useState(700)
  const [glare, setGlare] = useState(true)
  const [depth, setDepth] = useState(true)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 250, damping: 20 })
  const sy = useSpring(py, { stiffness: 250, damping: 20 })
  const rotateY = useTransform(sx, (v) => (v - 0.5) * 2 * max)
  const rotateX = useTransform(sy, (v) => -(v - 0.5) * 2 * max)
  const shine = useTransform([sx, sy], ([a, b]) => `radial-gradient(circle at ${a * 100}% ${b * 100}%, rgba(255,255,255,.55), rgba(255,255,255,0) 55%)`)
  const { logs, push, clear } = useEventLog()

  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }

  const prompt = `상품 카드에 3D 틸트(3D Tilt) 효과를 넣어줘. 마우스 위치에 따라 카드가 최대 ${max}도까지 기울어지고(perspective ${persp}px), spring으로 부드럽게 따라오게${glare ? '. 마우스가 있는 쪽에 빛이 반사되는 하이라이트' : ''}${depth ? '. 카드 안의 가격과 버튼은 translateZ로 앞으로 떠 보이게' : ''}. 마우스가 나가면 평평하게 돌아오게.`

  return (
    <Shell
      hint="카드 위에서 마우스를 움직여 보세요"
      stage={
        <div style={{ perspective: persp }}>
          <motion.div
            className="pg-tilt"
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            onMouseMove={move}
            onMouseEnter={() => push('start', '기울기 시작')}
            onMouseLeave={() => {
              px.set(0.5)
              py.set(0.5)
              push('settle', '평평하게 돌아옴')
            }}
          >
            {glare && <motion.div className="pg-tilt-shine" style={{ background: shine }} />}
            <span className="pg-tilt-tag" style={{ transform: depth ? 'translateZ(30px)' : 'none' }}>
              LIMITED
            </span>
            <b style={{ transform: depth ? 'translateZ(50px)' : 'none' }}>39,000원</b>
            <span className="pg-tilt-btn" style={{ transform: depth ? 'translateZ(40px)' : 'none' }}>
              구매하기
            </span>
          </motion.div>
        </div>
      }
      controls={
        <>
          <Slider label="최대 기울기" value={max} min={2} max={35} step={1} unit="°" onChange={setMax} />
          <Slider label="원근감 (perspective)" value={persp} min={250} max={1500} step={50} unit="px" onChange={setPersp} />
          <Toggle label="빛 반사 (glare)" value={glare} onChange={setGlare} />
          <Toggle label="안쪽 요소 띄우기 (depth)" value={depth} onChange={setDepth} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Confetti ───────── */

function Burst({ seed, count, spread, power }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // 위쪽(-90°)을 중심으로 spread 각도만큼 퍼진다
        const a = ((-90 + (Math.random() - 0.5) * spread) * Math.PI) / 180
        const v = power * (0.5 + Math.random() * 0.6)
        const big = Math.random() > 0.5
        return { x: Math.cos(a) * v, y: Math.sin(a) * v, rot: Math.random() * 720 - 360, c: PALETTE[i % 5], w: big ? 10 : 6, h: big ? 6 : 10 }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  )
  return parts.map((p, i) => (
    <motion.span
      key={i}
      className="pg-cf"
      style={{ background: p.c, width: p.w, height: p.h }}
      initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
      animate={{ x: p.x, y: [0, p.y, p.y + 220], opacity: [1, 1, 0], rotate: p.rot }}
      transition={{ duration: 1.8, ease: 'easeOut', y: { duration: 1.8, times: [0, 0.35, 1], ease: ['easeOut', 'easeIn'] }, opacity: { duration: 1.8, times: [0, 0.7, 1] } }}
    />
  ))
}

function ConfettiPG() {
  const [bursts, setBursts] = useState([])
  const [count, setCount] = useState(40)
  const [spread, setSpread] = useState(90)
  const [power, setPower] = useState(180)
  const [done, setDone] = useState(false)
  const seq = useRef(0)
  const { logs, push, clear } = useEventLog()

  const fire = () => {
    const id = ++seq.current
    setDone(true)
    setBursts((b) => [...b.slice(-3), id])
    push('start', `색종이 ${count}개 발사 · 퍼짐 ${spread}°`)
    setTimeout(() => {
      setBursts((b) => b.filter((x) => x !== id))
      push('end', '모두 떨어짐')
    }, 1900)
  }

  const prompt = `결제가 완료되면 버튼 위치에서 색종이(Confetti)가 터지게 해줘. 색종이 ${count}개가 위쪽으로 ${spread}도 범위 안에서 퍼지며 솟았다가 중력처럼 떨어지고, 각자 빙글빙글 돌며 사라지게. 브랜드 색 5가지 섞어서. canvas-confetti 라이브러리 써도 좋아.`

  return (
    <Shell
      hint="버튼을 눌러보세요 (여러 번도 돼요)"
      stage={
        <div className="pg-col" style={{ gap: 18 }}>
          <AnimatePresence mode="wait">
            <motion.span key={done ? 'y' : 'n'} className="pg-cf-msg" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {done ? (
                <>
                  <span className="pg-toast-ic" style={{ background: C.mint }}>
                    <Check size={11} color="#fff" />
                  </span>
                  결제 완료!
                </>
              ) : (
                '총 39,000원'
              )}
            </motion.span>
          </AnimatePresence>
          <div className="pg-cf-origin">
            {bursts.map((id) => (
              <Burst key={id} seed={id} count={count} spread={spread} power={power} />
            ))}
            <motion.button className="btn" whileTap={{ scale: 0.95 }} onClick={fire}>
              결제하기
            </motion.button>
          </div>
        </div>
      }
      controls={
        <>
          <Slider label="색종이 개수" value={count} min={10} max={120} step={5} unit="개" onChange={setCount} />
          <Slider label="퍼지는 각도" value={spread} min={20} max={360} step={10} unit="°" onChange={setSpread} />
          <Slider label="터지는 힘" value={power} min={80} max={320} step={10} onChange={setPower} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

export const SCREEN_PGS = {
  'page-transition': PageTransitionPG,
  'shared-element': SharedElementPG,
  'pin-scrollytelling': PinPG,
  'horizontal-scroll': HorizontalScrollPG,
  'magnetic-button': MagneticPG,
  'custom-cursor': CustomCursorPG,
  '3d-tilt': TiltPG,
  confetti: ConfettiPG,
}
