import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useMotionValueEvent } from 'motion/react'
import { Shell, EventLog, useEventLog, Slider, Segmented, Toggle } from '../components/kit'
import { C, PALETTE, ease } from '../demos/parts'

/* ───────── Hover Effect ───────── */

const HOVER_CARDS = [
  { c: C.sky, t: '여름 원피스', p: '39,000원' },
  { c: C.mint, t: '린넨 셔츠', p: '29,000원' },
  { c: C.pink, t: '스트랩 샌들', p: '45,000원' },
]

function HoverEffectPG() {
  const [lift, setLift] = useState(8)
  const [zoom, setZoom] = useState(true)
  const [border, setBorder] = useState(true)
  const [duration, setDuration] = useState(0.25)
  const { logs, push, clear } = useEventLog()
  const t = { duration, ease }

  const prompt = `상품 카드에 호버 효과(Hover Effect)를 넣어줘. 마우스를 올리면 카드가 ${lift}px 위로 떠오르고 그림자가 진해지게${zoom ? ', 안쪽 이미지는 1.1배로 살짝 확대' : ''}${border ? ', 테두리는 상품 색으로 바뀌게' : ''}. 모든 변화는 ${duration}초 동안 부드럽게, 마우스가 벗어나면 원래대로. 모바일에는 호버가 없으니 터치할 때는 효과 없이 바로 이동하게 해줘.`

  return (
    <Shell
      hint="카드 위에 마우스를 올려보세요"
      stage={
        <div className="pg-hv">
          {HOVER_CARDS.map((card, i) => (
            <motion.div
              key={i}
              className="pg-hv-card"
              initial="rest"
              animate="rest"
              whileHover="hover"
              variants={{
                rest: { y: 0, boxShadow: '0 1px 3px rgba(30,30,20,.06)', borderColor: '#ece8e0' },
                hover: { y: -lift, boxShadow: `0 ${lift * 2}px ${lift * 3}px rgba(30,30,20,.14)`, borderColor: border ? card.c : '#ece8e0' },
              }}
              transition={t}
              onHoverStart={() => push('move', `'${card.t}' 호버 시작`)}
              onHoverEnd={() => push('release', `'${card.t}' 호버 끝 → 원래대로`)}
            >
              <div className="pg-hv-img">
                <motion.div style={{ background: card.c }} variants={{ rest: { scale: 1 }, hover: { scale: zoom ? 1.1 : 1 } }} transition={t} />
              </div>
              <b>{card.t}</b>
              <span>{card.p}</span>
            </motion.div>
          ))}
        </div>
      }
      controls={
        <>
          <Slider label="떠오르는 높이" value={lift} min={0} max={20} step={1} unit="px" onChange={setLift} />
          <Slider label="바뀌는 시간 (duration)" value={duration} min={0.05} max={1} step={0.05} unit="s" onChange={setDuration} />
          <Toggle label="이미지 확대" value={zoom} onChange={setZoom} />
          <Toggle label="테두리 색 바꾸기" value={border} onChange={setBorder} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Scroll Reveal ───────── */

const REVEAL_FROM = { up: { y: 50 }, left: { x: -60 }, scale: { scale: 0.8 } }

function ScrollRevealPG() {
  const [from, setFrom] = useState('up')
  const [amount, setAmount] = useState(0.5)
  const [once, setOnce] = useState(true)
  const [duration, setDuration] = useState(0.6)
  const root = useRef(null)
  const { logs, push, clear } = useEventLog()
  const key = `${from}-${amount}-${once}-${duration}`

  useEffect(() => {
    if (root.current) root.current.scrollTop = 0
  }, [key])

  const fromKo = { up: '아래에서 위로 올라오며', left: '왼쪽에서 들어오며', scale: '작은 크기에서 커지며' }[from]
  const prompt = `랜딩 페이지 섹션들에 스크롤 리빌(Scroll Reveal)을 넣어줘. 각 요소가 화면에 ${Math.round(amount * 100)}% 이상 보이면 ${duration}초 동안 ${fromKo} 페이드인 되게. ${once ? '한 번 나타난 뒤에는 다시 숨기지 마.' : '화면 밖으로 나가면 다시 숨었다가 들어올 때마다 다시 나타나게.'} Motion의 whileInView 또는 IntersectionObserver 사용.`

  return (
    <Shell
      hint="안쪽 화면을 스크롤해 보세요"
      stage={
        <div className="pg-scroller" ref={root} key={key}>
          <div className="pg-scroll-hero">
            <b>스크롤해 보세요</b>
            <span>↓</span>
          </div>
          {PALETTE.concat(PALETTE.slice(0, 2)).map((c, i) => (
            <motion.div
              key={i}
              className="pg-sr-item"
              initial={{ opacity: 0, ...REVEAL_FROM[from] }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ root, amount, once }}
              transition={{ duration, ease }}
              onViewportEnter={() => push('open', `섹션 ${i + 1} 화면에 들어옴 → 나타남`)}
              onViewportLeave={() => !once && push('close', `섹션 ${i + 1} 화면 밖 → 다시 숨김`)}
            >
              <span style={{ background: c }} />
              <div>
                <b>섹션 {i + 1}</b>
                <i />
                <i style={{ width: '60%' }} />
              </div>
            </motion.div>
          ))}
        </div>
      }
      controls={
        <>
          <Segmented label="나타나는 방향" value={from} onChange={setFrom} options={[{ value: 'up', label: '아래에서' }, { value: 'left', label: '왼쪽에서' }, { value: 'scale', label: '확대' }]} />
          <Slider label="얼마나 보이면 시작할지 (amount)" value={amount} min={0.1} max={1} step={0.05} onChange={setAmount} />
          <Slider label="나타나는 시간 (duration)" value={duration} min={0.1} max={1.5} step={0.05} unit="s" onChange={setDuration} />
          <Toggle label="한 번만 나타나기 (once)" value={once} onChange={setOnce} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Smooth Transition ───────── */

const CSS_EASE = { ease: 'ease', 'ease-out': 'cubic-bezier(.22,1,.36,1)', linear: 'linear' }

function SmoothTransitionPG() {
  const [on, setOn] = useState(false)
  const [duration, setDuration] = useState(0.3)
  const [easing, setEasing] = useState('ease-out')
  const [compare, setCompare] = useState(true)
  const { logs, push, clear } = useEventLog()
  const tr = `all ${duration}s ${CSS_EASE[easing]}`

  const flip = () => {
    setOn(!on)
    push(on ? 'close' : 'open', on ? '끔 → 원래 상태로 전환' : '켬 → 바뀐 상태로 전환')
  }

  // 컴포넌트로 만들면 렌더마다 새로 마운트돼 transition이 안 보이므로 함수로 그린다
  const box = (smooth) => (
    <div className="pg-st-col" key={smooth ? 's' : 'n'}>
      <span className="pg-st-tag">{smooth ? `transition ${duration}s` : 'transition 없음'}</span>
      <div className="pg-st-sw" style={{ background: on ? C.acc : '#d6d2c8', transition: smooth ? tr : 'none' }}>
        <span style={{ transform: `translateX(${on ? 26 : 0}px)`, transition: smooth ? tr : 'none' }} />
      </div>
      <div
        className="pg-st-box"
        style={{ width: on ? 170 : 110, borderRadius: on ? 28 : 12, background: on ? '#ffe6d8' : '#fff', color: on ? C.acc : '#9a958b', transition: smooth ? tr : 'none' }}
      >
        {on ? '알림 켜짐' : '알림 꺼짐'}
      </div>
    </div>
  )

  const prompt = `알림 설정 토글을 켜고 끌 때 상태 변화를 부드럽게(Smooth Transition) 해줘. 스위치 동그라미 이동, 배경색, 아래 상자의 크기·모서리·색이 모두 ${duration}초 동안 ${easing}로 자연스럽게 바뀌게. CSS transition: all ${duration}s ${CSS_EASE[easing]} 사용.`

  return (
    <Shell
      hint="버튼을 눌러 상태를 바꿔보세요"
      stage={
        <div className="pg-st" onClick={flip}>
          <div className="pg-st-row">
            {box(true)}
            {compare && box(false)}
          </div>
          <button className="btn small">{on ? '끄기' : '켜기'}</button>
        </div>
      }
      controls={
        <>
          <Slider label="전환 시간 (duration)" value={duration} min={0} max={1.5} step={0.05} unit="s" onChange={setDuration} />
          <Segmented label="속도 변화 (easing)" value={easing} onChange={setEasing} options={[{ value: 'ease-out', label: 'ease-out' }, { value: 'ease', label: 'ease' }, { value: 'linear', label: 'linear' }]} />
          <Toggle label="transition 없는 것과 비교" value={compare} onChange={setCompare} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Glassmorphism ───────── */

function GlassmorphismPG() {
  const [blur, setBlur] = useState(16)
  const [alpha, setAlpha] = useState(0.25)
  const [border, setBorder] = useState(true)
  const area = useRef(null)
  const { logs, push, clear } = useEventLog()

  const prompt = `카드를 글래스모피즘(Glassmorphism) 스타일로 만들어줘. 배경은 흰색 ${Math.round(alpha * 100)}% 투명도, backdrop-filter: blur(${blur}px)로 뒤에 있는 색 도형이 뿌옇게 비쳐 보이게${border ? ', 1px 반투명 흰 테두리' : ''}, 모서리 20px 둥글게. 뒤에는 분홍·파랑·노랑 원이 천천히 떠다니게 해줘.`

  return (
    <Shell
      hint="뒤의 색 도형을 끌어서 카드 밑으로 넣어보세요"
      stage={
        <div className="pg-glass" ref={area}>
          {[
            [C.pink, 130, '12%', '10%'],
            [C.sky, 110, '58%', '48%'],
            [C.butter, 80, '70%', '8%'],
          ].map(([c, s, l, t], i) => (
            <motion.div
              key={i}
              className="pg-blob"
              style={{ background: c, width: s, height: s, left: l, top: t }}
              drag
              dragConstraints={area}
              dragMomentum={false}
              whileDrag={{ scale: 1.08 }}
              onDragEnd={() => push('drag', `${['분홍', '파랑', '노랑'][i]} 도형 옮김`)}
            />
          ))}
          <div className="pg-glass-card" style={{ background: `rgba(255,255,255,${alpha})`, backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, border: border ? '1px solid rgba(255,255,255,.6)' : '1px solid transparent' }}>
            <span>MEMBERSHIP</span>
            <b>VIBE CARD</b>
            <i>1234 •••• •••• 5678</i>
          </div>
        </div>
      }
      controls={
        <>
          <Slider label="흐림 정도 (blur)" value={blur} min={0} max={40} step={1} unit="px" onChange={setBlur} />
          <Slider label="흰색 농도 (투명도)" value={alpha} min={0} max={0.8} step={0.05} onChange={setAlpha} />
          <Toggle label="얇은 흰 테두리" value={border} onChange={setBorder} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Parallax ───────── */

const MOUNT = 'M0 80 L40 50 L80 72 L130 26 L180 64 L230 34 L280 58 L280 140 L0 140Z'

function ParallaxPG() {
  const [depth, setDepth] = useState(1)
  const [on, setOn] = useState(true)
  const root = useRef(null)
  const { logs, push, clear } = useEventLog()
  const { scrollYProgress } = useScroll({ container: root })
  const k = useMotionValue(depth)
  useEffect(() => k.set(on ? depth : 0), [k, on, depth])
  // 뒤쪽 레이어일수록 덜 움직인다 (스크롤 방향으로 같이 밀어 '느리게' 보이게)
  const layer = (amp) => ([p, kk]) => p * amp * kk
  const ySun = useTransform([scrollYProgress, k], layer(260))
  const yBack = useTransform([scrollYProgress, k], layer(180))
  const yMid = useTransform([scrollYProgress, k], layer(90))
  const yTitle = useTransform([scrollYProgress, k], layer(140))
  const last = useRef(-1)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const q = Math.floor(p * 4)
    if (q !== last.current) {
      last.current = q
      push('move', `스크롤 ${Math.min(q * 25, 100)}% 지점`)
    }
  })

  const prompt = `히어로 배경에 패럴랙스 스크롤(Parallax)을 넣어줘. 해·먼 산·가까운 산·제목을 레이어로 나누고, 스크롤할 때 뒤쪽 레이어일수록 느리게 움직여서 깊이감이 생기게 (가장 앞 레이어 기준 ${depth}배 강도). Motion의 useScroll + useTransform 사용, 모바일에서는 효과를 약하게.`

  return (
    <Shell
      hint="안쪽 화면을 스크롤해 보세요"
      stage={
        <div className="pg-scroller pg-px" ref={root}>
          <div className="pg-px-hero">
            <motion.div className="pg-px-sun" style={{ y: ySun }} />
            <motion.svg className="pg-px-layer" viewBox="0 0 280 140" preserveAspectRatio="none" style={{ y: yBack, bottom: 60 }}>
              <path d={MOUNT} fill="#F8CDB3" />
            </motion.svg>
            <motion.svg className="pg-px-layer" viewBox="0 0 280 140" preserveAspectRatio="none" style={{ y: yMid, bottom: 20, scaleX: -1 }}>
              <path d={MOUNT} fill="#EFA07E" />
            </motion.svg>
            <motion.b className="pg-px-title" style={{ y: yTitle }}>
              MOUNTAIN
            </motion.b>
            <svg className="pg-px-layer" viewBox="0 0 280 140" preserveAspectRatio="none" style={{ bottom: -2 }}>
              <path d="M0 70 C60 40, 110 50, 150 66 S240 40, 280 54 L280 140 L0 140Z" fill="#C4654A" />
            </svg>
          </div>
          <div className="pg-px-body">
            <b>여기부터 본문</b>
            <i />
            <i style={{ width: '70%' }} />
            <i style={{ width: '85%' }} />
            <i style={{ width: '50%' }} />
          </div>
        </div>
      }
      controls={
        <>
          <Toggle label="패럴랙스 켜기 (끄면 비교)" value={on} onChange={setOn} />
          <Slider label="깊이감 강도" value={depth} min={0.2} max={2} step={0.1} unit="x" onChange={setDepth} />
          <div className="pg-legend">
            <span><i style={{ background: '#FFB36B' }} />해 · 가장 느림</span>
            <span><i style={{ background: '#F8CDB3' }} />먼 산</span>
            <span><i style={{ background: '#EFA07E' }} />가까운 산</span>
            <span><i style={{ background: '#C4654A' }} />땅 · 스크롤 그대로</span>
          </div>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Scroll Snap ───────── */

const SNAP_SECS = [C.sky, C.coral, C.mint, C.pink]

function ScrollSnapPG() {
  const [mode, setMode] = useState('mandatory')
  const [axis, setAxis] = useState('y')
  const [cur, setCur] = useState(0)
  const root = useRef(null)
  const { logs, push, clear } = useEventLog()

  useEffect(() => {
    const el = root.current
    el.scrollTo({ top: 0, left: 0 })
    setCur(0)
    let t
    const onScroll = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        const size = axis === 'y' ? el.clientHeight : el.clientWidth
        const pos = axis === 'y' ? el.scrollTop : el.scrollLeft
        const i = Math.round(pos / size)
        const aligned = Math.abs(pos - i * size) < 2
        setCur(i)
        push(aligned ? 'settle' : 'move', aligned ? `섹션 ${i + 1}에 딱 맞춰 멈춤` : `섹션 사이 어중간한 곳에서 멈춤`)
      }, 140)
    }
    el.addEventListener('scroll', onScroll)
    return () => {
      el.removeEventListener('scroll', onScroll)
      clearTimeout(t)
    }
  }, [axis, mode, push])

  const modeKo = { mandatory: '항상 가장 가까운 섹션에 딱 맞춰 멈추게 (mandatory)', proximity: '섹션 경계 근처에서만 달라붙게 (proximity)', none: '스냅 없이 자유롭게' }[mode]
  const prompt = `${axis === 'y' ? '전체 페이지를 세로' : '추천 카드 목록을 가로'} 스크롤 스냅(Scroll Snap)으로 만들어줘. 섹션마다 화면을 꽉 채우고, 스크롤을 놓으면 ${modeKo}. CSS scroll-snap-type: ${axis} ${mode === 'none' ? 'none' : mode}, 각 섹션에 scroll-snap-align: start. 옆에 현재 섹션을 알려주는 점 표시도.`

  return (
    <Shell
      hint={axis === 'y' ? '안쪽을 위아래로 스크롤해 보세요' : '안쪽을 옆으로 스크롤해 보세요'}
      stage={
        <div className="pg-snap">
          <div ref={root} className={'pg-snap-win ' + axis} style={{ scrollSnapType: mode === 'none' ? 'none' : `${axis} ${mode}` }}>
            {SNAP_SECS.map((c, i) => (
              <section key={i} style={{ background: c }}>
                <span>0{i + 1}</span>
                <b>섹션 {i + 1}</b>
              </section>
            ))}
          </div>
          <div className={'pg-snap-dots ' + axis}>
            {SNAP_SECS.map((_, i) => (
              <motion.span key={i} animate={{ [axis === 'y' ? 'height' : 'width']: i === cur ? 18 : 7, background: i === cur ? C.ink : '#cfcac0' }} />
            ))}
          </div>
        </div>
      }
      controls={
        <>
          <Segmented label="달라붙는 정도" value={mode} onChange={setMode} options={[{ value: 'mandatory', label: '항상' }, { value: 'proximity', label: '가까울 때만' }, { value: 'none', label: '끄기' }]} />
          <Segmented label="스크롤 방향" value={axis} onChange={setAxis} options={[{ value: 'y', label: '세로' }, { value: 'x', label: '가로' }]} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Micro-interaction ───────── */

function MicroInteractionPG() {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(128)
  const [pop, setPop] = useState(1.35)
  const [burst, setBurst] = useState(true)
  const [roll, setRoll] = useState(true)
  const [k, setK] = useState(0)
  const { logs, push, clear } = useEventLog()

  const tap = () => {
    const v = !liked
    setLiked(v)
    setCount((c) => c + (v ? 1 : -1))
    setK((x) => x + 1)
    push(v ? 'open' : 'close', v ? `좋아요 → ${count + 1}` : `좋아요 취소 → ${count - 1}`)
  }

  const prompt = `좋아요 버튼에 마이크로 인터랙션(Micro-interaction)을 넣어줘. 누르면 하트가 분홍색으로 채워지면서 ${pop}배까지 통 튀었다 돌아오고${burst ? ', 주변에 작은 색 입자 8개가 터지듯 퍼지게' : ''}. ${roll ? '숫자는 위로 굴러 올라가며 바뀌게(취소하면 아래로). ' : ''}다시 누르면 빈 하트로 돌아가. 전체 0.5초 이내로 짧게.`

  return (
    <Shell
      hint="하트를 눌러보세요"
      stage={
        <div className="pg-like-stage">
          <motion.button className={'pg-like' + (liked ? ' on' : '')} onClick={tap} whileTap={{ scale: 0.92 }}>
            <span className="pg-like-ic">
              <motion.svg key={k} width="34" height="34" viewBox="0 0 24 24" strokeWidth="2" initial={false} animate={{ scale: liked && k ? [1, pop, 1] : 1 }} transition={{ duration: 0.45 }}>
                <motion.path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" initial={false} animate={{ fill: liked ? C.pink : 'rgba(255,111,165,0)', stroke: liked ? C.pink : C.ink }} strokeLinejoin="round" />
              </motion.svg>
              <AnimatePresence>
                {liked &&
                  burst &&
                  Array.from({ length: 8 }).map((_, j) => {
                    const a = (j / 8) * Math.PI * 2
                    return <motion.i key={k + '-' + j} className="pg-burst" style={{ background: PALETTE[j % 5] }} initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: Math.cos(a) * 40, y: Math.sin(a) * 40, opacity: 0, scale: 0.3 }} transition={{ duration: 0.6, ease: 'easeOut' }} />
                  })}
              </AnimatePresence>
            </span>
            <span className="pg-like-n">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={count} initial={roll ? { y: liked ? 18 : -18, opacity: 0 } : false} animate={{ y: 0, opacity: 1 }} exit={roll ? { y: liked ? -18 : 18, opacity: 0 } : { opacity: 0, transition: { duration: 0 } }} transition={{ duration: 0.25 }}>
                  {count}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.button>
        </div>
      }
      controls={
        <>
          <Slider label="통 튀는 크기 (scale)" value={pop} min={1} max={2} step={0.05} unit="x" onChange={setPop} />
          <Toggle label="입자 터뜨리기" value={burst} onChange={setBurst} />
          <Toggle label="숫자 굴러가기" value={roll} onChange={setRoll} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

export const EFFECT_PGS = {
  'hover-effect': HoverEffectPG,
  'scroll-reveal': ScrollRevealPG,
  'smooth-transition': SmoothTransitionPG,
  glassmorphism: GlassmorphismPG,
  parallax: ParallaxPG,
  'scroll-snap': ScrollSnapPG,
  'micro-interaction': MicroInteractionPG,
}
