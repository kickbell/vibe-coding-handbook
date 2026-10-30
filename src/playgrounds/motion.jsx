import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, animate, useAnimate, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react'
import { Shell, EventLog, useEventLog, Slider, Segmented, Toggle } from '../components/kit'
import { C, PALETTE, ease, Check, CartIcon, Icon } from '../demos/parts'

const EASES = { 'ease-out': ease, 'ease-in-out': 'easeInOut', linear: 'linear' }

// 체험용 알림 카드
const DemoCard = ({ style, ...p }) => (
  <motion.div className="pg-mcard" style={style} {...p}>
    <span className="pg-mcard-ic">
      <Icon n="bell" size={18} color="#fff" />
    </span>
    <div>
      <b>새 메시지가 도착했어요</b>
      <span>지민: 오늘 회의 몇 시였죠?</span>
    </div>
  </motion.div>
)

/* ───────── Fade ───────── */

function FadePG() {
  const [show, setShow] = useState(true)
  const [duration, setDuration] = useState(0.5)
  const [easing, setEasing] = useState('ease-out')
  const [rise, setRise] = useState(false)
  const o = useMotionValue(1)
  const y = useTransform(o, (v) => (rise ? (1 - v) * 24 : 0))
  const label = useTransform(o, (v) => `opacity: ${v.toFixed(2)}`)
  const { logs, push, clear } = useEventLog()

  const flip = () => {
    const v = !show
    setShow(v)
    push('start', v ? '페이드 인 시작 (0 → 1)' : '페이드 아웃 시작 (1 → 0)')
    animate(o, v ? 1 : 0, { duration, ease: EASES[easing], onComplete: () => push('end', v ? '완전히 보임' : '완전히 투명해짐') })
  }

  const prompt = `새 메시지 알림 카드가 나타날 때 페이드(Fade) 효과를 넣어줘. 투명도(opacity)가 0에서 1로 ${duration}초 동안 ${easing}로 바뀌게${rise ? ', 동시에 아래에서 24px 살짝 올라오게(fade-up)' : ''}. 사라질 때는 반대로 서서히 투명해지게.`

  return (
    <Shell
      hint="버튼으로 보였다 숨겨보세요"
      stage={
        <div className="pg-col">
          <DemoCard style={{ opacity: o, y }} />
          <motion.span className="pg-readout mono">{label}</motion.span>
          <button className="btn small" onClick={flip}>
            {show ? '숨기기 (fade out)' : '보이기 (fade in)'}
          </button>
        </div>
      }
      controls={
        <>
          <Slider label="걸리는 시간 (duration)" value={duration} min={0.1} max={2} step={0.05} unit="s" onChange={setDuration} />
          <Segmented label="속도 변화 (easing)" value={easing} onChange={setEasing} options={[{ value: 'ease-out', label: 'ease-out' }, { value: 'ease-in-out', label: 'ease-in-out' }, { value: 'linear', label: 'linear' }]} />
          <Toggle label="살짝 올라오며 (fade-up)" value={rise} onChange={setRise} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Slide ───────── */

const SLIDE_DIR = { left: { x: -1 }, right: { x: 1 }, up: { y: 1 }, down: { y: -1 } }

function SlidePG() {
  const [show, setShow] = useState(true)
  const [dir, setDir] = useState('right')
  const [dist, setDist] = useState(120)
  const [duration, setDuration] = useState(0.5)
  const [clip, setClip] = useState(true)
  const { logs, push, clear } = useEventLog()
  const off = { x: (SLIDE_DIR[dir].x ?? 0) * dist, y: (SLIDE_DIR[dir].y ?? 0) * dist, opacity: 0 }

  const dirKo = { left: '왼쪽', right: '오른쪽', up: '아래쪽', down: '위쪽' }[dir]
  const prompt = `알림 카드가 ${dirKo}에서 ${dist}px 떨어진 곳부터 미끄러져 들어오는 슬라이드(Slide) 애니메이션을 넣어줘. ${duration}초 동안 ease-out으로, 투명도도 함께 0 → 1. 사라질 때는 같은 방향으로 미끄러져 나가게${clip ? '. 카드 영역 밖으로 나간 부분은 잘려 보이게(overflow: hidden)' : ''}.`

  return (
    <Shell
      hint="버튼으로 들여보냈다 내보내보세요"
      stage={
        <div className="pg-col">
          <div className={'pg-slide-box' + (clip ? ' clip' : '')}>
            <AnimatePresence initial={false}>
              {show && (
                <DemoCard
                  key="c"
                  initial={off}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  exit={off}
                  transition={{ duration, ease }}
                  onAnimationComplete={(d) => push('end', d.opacity === 1 ? '도착 완료' : '나가기 완료')}
                />
              )}
            </AnimatePresence>
          </div>
          <button
            className="btn small"
            onClick={() => {
              setShow(!show)
              push('start', show ? `${dirKo}으로 나가는 중` : `${dirKo}에서 들어오는 중`)
            }}
          >
            {show ? '내보내기' : '들어오기'}
          </button>
        </div>
      }
      controls={
        <>
          <Segmented label="들어오는 방향" value={dir} onChange={setDir} options={[{ value: 'right', label: '오른쪽' }, { value: 'left', label: '왼쪽' }, { value: 'up', label: '아래' }, { value: 'down', label: '위' }]} />
          <Slider label="이동 거리" value={dist} min={20} max={300} step={10} unit="px" onChange={setDist} />
          <Slider label="걸리는 시간 (duration)" value={duration} min={0.1} max={1.5} step={0.05} unit="s" onChange={setDuration} />
          <Toggle label="영역 밖은 잘라내기 (overflow)" value={clip} onChange={setClip} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Scale ───────── */

function ScalePG() {
  const [n, setN] = useState(0)
  const [from, setFrom] = useState(0)
  const [bounce, setBounce] = useState(0.5)
  const [press, setPress] = useState(true)
  const { logs, push, clear } = useEventLog()

  const add = () => {
    setN(n + 1)
    push('start', `장바구니 ${n + 1}개 → 배지가 ${from} 크기에서 1로`)
  }
  const prompt = `"담기" 버튼을 누르면 장바구니 아이콘의 숫자 배지가 스케일(Scale) 애니메이션으로 톡 튀어나오게 해줘. 크기가 ${from}배에서 1배로, spring(bounce ${bounce})으로 ${bounce > 0.4 ? '통통 튀며' : bounce > 0.1 ? '살짝 튕기며' : '튕김 없이'} 커지게. ${press ? '버튼은 누르는 순간 0.94배로 살짝 작아졌다가 돌아오게(whileTap).' : ''}`

  return (
    <Shell
      hint="'담기'를 여러 번 눌러보세요"
      stage={
        <div className="pg-row" style={{ gap: 40 }}>
          <div className="pg-cart">
            <CartIcon size={42} />
            <AnimatePresence>
              {n > 0 && (
                <motion.span key={n} className="pg-cart-badge" initial={{ scale: from }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce, duration: 0.5 }} onAnimationComplete={() => push('end', '배지 커지기 완료')}>
                  {n}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="pg-col" style={{ gap: 10 }}>
            <motion.button className="btn" whileTap={press ? { scale: 0.94 } : undefined} onClick={add}>
              담기
            </motion.button>
            <button
              className="link"
              onClick={() => {
                setN(0)
                push('close', '비우기')
              }}
            >
              비우기
            </button>
          </div>
        </div>
      }
      controls={
        <>
          <Slider label="시작 크기 (scale)" value={from} min={0} max={0.9} step={0.05} unit="x" onChange={setFrom} />
          <Slider label="튕기는 정도 (bounce)" value={bounce} min={0} max={0.8} step={0.05} onChange={setBounce} />
          <Toggle label="누르는 순간 버튼 작아지기" value={press} onChange={setPress} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Easing ───────── */

const EASE_PRESETS = {
  linear: [0, 0, 1, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
  'back-out': [0.34, 1.56, 0.64, 1],
  'expo-out': [0.16, 1, 0.3, 1],
}
const EASE_KO = {
  linear: '처음부터 끝까지 같은 속도',
  'ease-in': '천천히 출발해서 점점 빠르게',
  'ease-out': '빠르게 출발해서 부드럽게 멈추게',
  'ease-in-out': '천천히 출발해서 가운데서 빠르고 끝에서 다시 천천히',
  'back-out': '목표를 살짝 지나쳤다가 돌아오게',
  'expo-out': '아주 빠르게 출발해서 길게 미끄러지듯 멈추게',
}

// 3차 베지어: 시간 t(0~1)에 대한 진행도
function bezier([x1, y1, x2, y2]) {
  const f = (a, b, s) => 3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3
  return (t) => {
    let lo = 0
    let hi = 1
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2
      if (f(x1, x2, mid) < t) lo = mid
      else hi = mid
    }
    return f(y1, y2, (lo + hi) / 2)
  }
}

function EasingPG() {
  const [name, setName] = useState('ease-out')
  const [duration, setDuration] = useState(1.2)
  const [compare, setCompare] = useState(true)
  const t = useMotionValue(0)
  const fn = useMemo(() => bezier(EASE_PRESETS[name]), [name])
  const eased = useTransform(t, (v) => fn(v))
  const left = useTransform(eased, (v) => `calc(${v * 100}% - ${v * 32}px)`)
  const leftLin = useTransform(t, (v) => `calc(${v * 100}% - ${v * 32}px)`)
  const cx = useTransform(t, (v) => 10 + v * 200)
  const cy = useTransform(eased, (v) => 150 - v * 110)
  const { logs, push, clear } = useEventLog()
  const ctrl = useRef()

  const play = () => {
    ctrl.current?.stop()
    t.set(0)
    push('start', `${name} 재생 (${duration}s)`)
    const t0 = performance.now()
    ctrl.current = animate(t, 1, { duration, ease: 'linear', onComplete: () => push('end', `도착 (${((performance.now() - t0) / 1000).toFixed(2)}s)`) })
  }
  useEffect(() => {
    play()
    return () => ctrl.current?.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, duration])

  const p = EASE_PRESETS[name]
  const path = Array.from({ length: 41 }, (_, i) => {
    const x = i / 40
    return `${i ? 'L' : 'M'}${(10 + x * 200).toFixed(1)} ${(150 - fn(x) * 110).toFixed(1)}`
  }).join(' ')

  const prompt = `메뉴 패널이 열릴 때 이징(Easing)을 ${name}로 해줘. ${EASE_KO[name]} 움직이도록 cubic-bezier(${p.join(', ')}), 전체 ${duration}초. CSS transition-timing-function 또는 Motion의 ease: [${p.join(', ')}] 사용.`

  return (
    <Shell
      hint="눌러서 다시 재생"
      stage={
        <div className="pg-ez" onClick={play}>
          <svg viewBox="0 0 220 170" className="pg-ez-graph">
            <rect x="10" y="40" width="200" height="110" fill="#faf8f4" rx="6" />
            <line x1="10" y1="150" x2="210" y2="40" stroke="#ddd8ce" strokeDasharray="4 4" />
            <line x1="10" y1="150" x2={10 + p[0] * 200} y2={150 - p[1] * 110} stroke="#c9c4b9" />
            <line x1="210" y1="40" x2={10 + p[2] * 200} y2={150 - p[3] * 110} stroke="#c9c4b9" />
            <circle cx={10 + p[0] * 200} cy={150 - p[1] * 110} r="4" fill="#fff" stroke="#9a958b" strokeWidth="1.5" />
            <circle cx={10 + p[2] * 200} cy={150 - p[3] * 110} r="4" fill="#fff" stroke="#9a958b" strokeWidth="1.5" />
            <path d={path} fill="none" stroke={C.acc} strokeWidth="3" strokeLinecap="round" />
            <motion.circle cx={cx} cy={cy} r="6" fill={C.acc} />
            <text x="10" y="166" fontSize="9" fill="#a8a398">
              시간 →
            </text>
            <text x="212" y="36" fontSize="9" fill="#a8a398" textAnchor="end">
              진행도 ↑
            </text>
          </svg>
          <div className="pg-ez-tracks">
            <div className="pg-ez-track">
              <span className="mono">{name}</span>
              <motion.i style={{ left, background: C.acc }} />
            </div>
            {compare && (
              <div className="pg-ez-track ghost">
                <span className="mono">linear</span>
                <motion.i style={{ left: leftLin }} />
              </div>
            )}
          </div>
        </div>
      }
      controls={
        <>
          <div className="ctl">
            <span className="ctl-top">
              <span>이징 종류</span>
            </span>
            <div className="presets">
              {Object.keys(EASE_PRESETS).map((k) => (
                <button key={k} className={'chip-btn' + (k === name ? ' on' : '')} onClick={() => setName(k)}>
                  {k}
                </button>
              ))}
            </div>
          </div>
          <p className="pg-note">{EASE_KO[name]}</p>
          <Slider label="걸리는 시간 (duration)" value={duration} min={0.3} max={3} step={0.1} unit="s" onChange={setDuration} />
          <Toggle label="linear와 나란히 비교" value={compare} onChange={setCompare} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Bounce ───────── */

// 떨어졌다 튀어오르기를 bounces번 반복하는 키프레임
function bounceFrames(h, r, bounces) {
  const ys = [-h]
  const segs = [Math.sqrt(h)]
  for (let i = 1; i <= bounces; i++) {
    const hi = h * r ** i
    ys.push(0, -hi)
    segs.push(Math.sqrt(hi), Math.sqrt(hi))
  }
  ys.push(0)
  segs.push(0)
  const total = segs.slice(0, -1).reduce((a, b) => a + b, 0)
  let acc = 0
  const times = ys.map((_, i) => {
    const v = acc / total
    acc += segs[i]
    return v
  })
  return { ys, times, total }
}

function BouncePG() {
  const [h, setH] = useState(160)
  const [r, setR] = useState(0.45)
  const [count, setCount] = useState(3)
  const [squash, setSquash] = useState(true)
  const [run, setRun] = useState(0)
  const { logs, push, clear } = useEventLog()
  const { ys, times, total } = bounceFrames(h, r, count)
  const duration = total * 0.05
  const ground = ys.map((y) => y === 0)

  useEffect(() => {
    if (!run) return
    clear()
    push('start', `${h}px 높이에서 떨어뜨림`)
    const ids = times.map((tm, i) => (ground[i] ? setTimeout(() => push(i === ys.length - 1 ? 'settle' : 'child', i === ys.length - 1 ? '바닥에 멈춤' : `바닥에 닿음 → ${Math.round(-ys[i + 1])}px 튀어오름`), tm * duration * 1000) : null))
    return () => ids.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  const prompt = `결제 완료 체크 아이콘이 위에서 떨어져 바닥에 ${count}번 통통 튀다 멈추는 바운스(Bounce) 애니메이션을 만들어줘. 튈 때마다 높이가 이전의 ${Math.round(r * 100)}%로 줄어들고, 떨어질 땐 점점 빠르게(ease-in) 올라갈 땐 점점 느리게(ease-out)${squash ? '. 바닥에 닿는 순간 공처럼 살짝 납작해졌다(squash) 돌아오게' : ''}.`

  return (
    <Shell
      hint="눌러서 떨어뜨리기"
      stage={
        <div className="pg-bn" onClick={() => setRun((x) => x + 1)}>
          <div className="pg-bn-area" style={{ height: h + 70 }}>
            <motion.span
              key={'s' + run}
              className="pg-bn-shadow"
              initial={{ scale: 0.3, opacity: 0.2 }}
              animate={run ? { scale: ys.map((y) => 1 - (-y / h) * 0.7), opacity: ys.map((y) => 1 - (-y / h) * 0.8) } : {}}
              transition={{ duration, times, ease: ys.slice(1).map((_, i) => (ys[i] === 0 ? 'easeOut' : 'easeIn')) }}
            />
            <motion.div
              key={'b' + run}
              className="pg-bn-ball"
              style={{ originY: 1 }}
              initial={{ y: -h }}
              animate={run ? { y: ys, scaleY: ground.map((g) => (g && squash ? 0.72 : 1)), scaleX: ground.map((g) => (g && squash ? 1.22 : 1)) } : {}}
              transition={{ duration, times, ease: ys.slice(1).map((_, i) => (ys[i] === 0 ? 'easeOut' : 'easeIn')) }}
            >
              <Check size={26} color="#fff" />
            </motion.div>
          </div>
          <button className="btn small">떨어뜨리기</button>
        </div>
      }
      controls={
        <>
          <Slider label="떨어지는 높이" value={h} min={60} max={220} step={10} unit="px" onChange={setH} />
          <Slider label="튀어오르는 정도" value={r} min={0.15} max={0.8} step={0.05} onChange={setR} />
          <Slider label="튀는 횟수" value={count} min={1} max={5} step={1} unit="번" onChange={setCount} />
          <Toggle label="닿을 때 납작해지기 (squash)" value={squash} onChange={setSquash} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Duration · Delay ───────── */

const DD_ITEMS = ['제목', '설명', '버튼']

function DurationDelayPG() {
  const [duration, setDuration] = useState(0.6)
  const [delays, setDelays] = useState([0, 0.2, 0.5])
  const [run, setRun] = useState(1)
  const { logs, push, clear } = useEventLog()
  const total = Math.max(...delays) + duration
  const setDelay = (i) => (v) => setDelays((d) => d.map((x, j) => (j === i ? v : x)))

  useEffect(() => setRun((r) => r + 1), [duration, delays])
  useEffect(() => {
    clear()
    const ids = []
    DD_ITEMS.forEach((name, i) => {
      ids.push(setTimeout(() => push('start', `${name} 시작 (delay ${delays[i]}s 기다린 뒤)`), delays[i] * 1000))
      ids.push(setTimeout(() => push('end', `${name} 끝 (${duration}s 동안 움직임)`), (delays[i] + duration) * 1000))
    })
    return () => ids.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  const prompt = `히어로 섹션이 나타날 때 순서를 정해줘. 모든 요소는 ${duration}초 동안(duration) 아래에서 올라오며 페이드인. 제목은 ${delays[0] ? `${delays[0]}초 뒤에` : '바로'}, 설명은 ${delays[1]}초 뒤에, 버튼은 ${delays[2]}초 뒤에 시작하게(delay). 전체가 ${total.toFixed(2)}초 안에 끝나게.`

  return (
    <Shell
      hint="눌러서 다시 재생"
      stage={
        <div className="pg-ddl" onClick={() => setRun((r) => r + 1)}>
          <div key={run} className="pg-ddl-hero">
            {[
              <b key="0">여름 세일 최대 50%</b>,
              <span key="1">지금 가입하면 무료 배송 쿠폰을 드려요.</span>,
              <i key="2" className="btn small">
                쿠폰 받기
              </i>,
            ].map((el, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delays[i], duration, ease }}>
                {el}
              </motion.div>
            ))}
          </div>
          <div className="pg-tl" key={'t' + run}>
            {DD_ITEMS.map((name, i) => (
              <div key={i} className="pg-tl-row wide">
                <span>{name}</span>
                <div>
                  <em className="pg-tl-wait" style={{ width: (delays[i] / total) * 100 + '%' }} />
                  <motion.i style={{ left: (delays[i] / total) * 100 + '%', width: (duration / total) * 100 + '%', background: PALETTE[i], originX: 0 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: delays[i], duration, ease: 'linear' }} />
                </div>
              </div>
            ))}
            <div className="pg-tl-lane wide">
              <motion.span className="pg-tl-head" initial={{ left: '0%' }} animate={{ left: '100%' }} transition={{ duration: total, ease: 'linear' }} />
            </div>
          </div>
        </div>
      }
      controls={
        <>
          <Slider label="움직이는 시간 (duration)" value={duration} min={0.1} max={1.5} step={0.05} unit="s" onChange={setDuration} />
          {DD_ITEMS.map((name, i) => (
            <Slider key={name} label={`${name} 기다림 (delay)`} value={delays[i]} min={0} max={1.5} step={0.05} unit="s" onChange={setDelay(i)} />
          ))}
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Loop ───────── */

function LoopPG() {
  const [period, setPeriod] = useState(2.4)
  const [dist, setDist] = useState(14)
  const [type, setType] = useState('reverse')
  const [playing, setPlaying] = useState(true)
  const { logs, push, clear } = useEventLog()

  useEffect(() => {
    if (!playing) return
    clear()
    push('start', `반복 시작 · ${period}s 주기`)
    let n = 0
    const id = setInterval(() => push('child', `${++n}번째 반복`), period * 1000)
    return () => clearInterval(id)
  }, [playing, period, type, dist, push, clear])

  const anim = playing ? { y: [0, -dist], rotate: [0, type === 'loop' ? 360 : 20] } : { y: 0, rotate: 0 }
  const tr = playing ? { duration: type === 'loop' ? period : period / 2, repeat: Infinity, repeatType: type, ease: type === 'loop' ? 'linear' : 'easeInOut' } : { duration: 0.4 }
  const typeKo = { reverse: '올라갔다 내려오는 왕복(reverse)', loop: '끝나면 처음 위치로 툭 돌아가 다시 시작(loop)', mirror: '거울처럼 되감기(mirror)' }[type]
  const prompt = `히어로의 장식 도형과 카드가 둥실둥실 무한 반복(Loop)으로 떠 있게 해줘. 위아래로 ${dist}px, 한 번에 ${period}초 주기로 ${typeKo}. Motion의 repeat: Infinity, repeatType: "${type}" 사용. 사용자가 '움직임 줄이기' 설정을 켰다면(prefers-reduced-motion) 멈춰줘.`

  return (
    <Shell
      hint="반복 방식을 바꿔보세요"
      stage={
        <div className="pg-col">
          <div className="pg-loop">
            <motion.span className="pg-loop-deco" style={{ background: C.sky, left: -24, top: -18 }} animate={anim} transition={tr} />
            <motion.span className="pg-loop-deco round" style={{ background: C.mint, right: -20, bottom: -14 }} animate={anim} transition={{ ...tr, delay: playing ? period / 4 : 0 }} />
            <DemoCard animate={{ y: playing ? [0, -dist] : 0 }} transition={tr} />
          </div>
          <span className="pg-readout mono">{playing ? `repeat: Infinity · repeatType: "${type}"` : '멈춤'}</span>
        </div>
      }
      controls={
        <>
          <Segmented label="반복 방식 (repeatType)" value={type} onChange={setType} options={[{ value: 'reverse', label: '왕복' }, { value: 'loop', label: '처음부터' }, { value: 'mirror', label: '거울' }]} />
          <Slider label="한 번 걸리는 시간 (주기)" value={period} min={0.6} max={6} step={0.2} unit="s" onChange={setPeriod} />
          <Slider label="움직이는 거리" value={dist} min={2} max={40} step={1} unit="px" onChange={setDist} />
          <Toggle label="재생" value={playing} onChange={setPlaying} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Ripple ───────── */

const RIPPLE_COLORS = { white: 'rgba(255,255,255,.55)', ink: 'rgba(31,31,36,.25)', acc: 'rgba(255,107,44,.45)' }

function RipplePG() {
  const [waves, setWaves] = useState([])
  const [duration, setDuration] = useState(0.7)
  const [color, setColor] = useState('white')
  const [center, setCenter] = useState(false)
  const seq = useRef(0)
  const { logs, push, clear } = useEventLog()

  const down = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = center ? r.width / 2 : e.clientX - r.left
    const y = center ? r.height / 2 : e.clientY - r.top
    const size = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) * 2
    const id = ++seq.current
    setWaves((w) => [...w, { id, x, y, size }])
    push('start', `물결 시작 (${Math.round(x)}, ${Math.round(y)})`)
  }

  const prompt = `버튼을 누르면 ${center ? '버튼 가운데' : '손가락(마우스)이 닿은 지점'}에서 물결이 퍼지는 리플(Ripple) 효과를 넣어줘. ${color === 'white' ? '반투명 흰색' : color === 'ink' ? '반투명 검은색' : '반투명 주황색'} 원이 ${duration}초 동안 버튼 전체를 덮을 만큼 커지면서 사라지게. 여러 번 빠르게 눌러도 물결이 겹쳐서 퍼지게 해줘. 버튼 밖으로는 넘치지 않게.`

  return (
    <Shell
      hint="버튼 아무 곳이나 눌러보세요"
      stage={
        <button className={'pg-ripple ' + color} onPointerDown={down}>
          <span>결제하기</span>
          {waves.map((w) => (
            <motion.i
              key={w.id}
              style={{ left: w.x - w.size / 2, top: w.y - w.size / 2, width: w.size, height: w.size, background: RIPPLE_COLORS[color] }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration, ease: 'easeOut' }}
              onAnimationComplete={() => {
                setWaves((ws) => ws.filter((x) => x.id !== w.id))
                push('end', '물결 사라짐')
              }}
            />
          ))}
        </button>
      }
      controls={
        <>
          <Slider label="퍼지는 시간 (duration)" value={duration} min={0.2} max={2} step={0.05} unit="s" onChange={setDuration} />
          <Segmented label="물결 색" value={color} onChange={setColor} options={[{ value: 'white', label: '흰색' }, { value: 'ink', label: '검정' }, { value: 'acc', label: '주황' }]} />
          <Toggle label="항상 가운데에서 시작" value={center} onChange={setCenter} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Shake ───────── */

function ShakePG() {
  const [pw, setPw] = useState('')
  const [state, setState] = useState('idle')
  const [amp, setAmp] = useState(10)
  const [times, setTimes] = useState(4)
  const [duration, setDuration] = useState(0.45)
  const [scope, run] = useAnimate()
  const { logs, push, clear } = useEventLog()

  const frames = useMemo(() => {
    const f = [0]
    for (let i = 0; i < times; i++) {
      const a = amp * (1 - i / times)
      f.push(-a, a)
    }
    return [...f, 0]
  }, [amp, times])

  const submit = (e) => {
    e.preventDefault()
    if (pw === '1234') {
      setState('ok')
      push('end', '비밀번호 맞음 → 로그인 성공')
      return
    }
    setState('err')
    push('close', `틀림 → 좌우 ${times}번 흔들기 (±${amp}px)`)
    run(scope.current, { x: frames }, { duration })
  }

  const prompt = `로그인할 때 비밀번호가 틀리면 입력 칸이 좌우로 흔들리는 쉐이크(Shake) 애니메이션을 넣어줘. ${duration}초 동안 ±${amp}px로 ${times}번, 점점 약해지게. 동시에 테두리를 빨간색으로 바꾸고 아래에 "비밀번호가 틀렸어요" 문구를 보여줘. 다시 입력을 시작하면 빨간 표시는 사라지게.`

  return (
    <Shell
      hint="아무 비밀번호나 넣고 로그인 (정답: 1234)"
      stage={
        <form className="pg-login" onSubmit={submit}>
          <span className="pg-label">비밀번호</span>
          <div ref={scope}>
            <input
              type="password"
              value={pw}
              placeholder="비밀번호 입력"
              className={'pg-input ' + state}
              onChange={(e) => {
                setPw(e.target.value)
                if (state !== 'idle') setState('idle')
              }}
            />
          </div>
          <AnimatePresence mode="wait">
            {state !== 'idle' && (
              <motion.span key={state} className={'pg-help ' + state} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {state === 'err' ? '비밀번호가 틀렸어요' : '로그인 성공!'}
              </motion.span>
            )}
          </AnimatePresence>
          <button className="btn" type="submit">
            로그인
          </button>
        </form>
      }
      controls={
        <>
          <Slider label="흔들리는 폭" value={amp} min={2} max={30} step={1} unit="px" onChange={setAmp} />
          <Slider label="흔들리는 횟수" value={times} min={1} max={8} step={1} unit="번" onChange={setTimes} />
          <Slider label="전체 시간 (duration)" value={duration} min={0.2} max={1.2} step={0.05} unit="s" onChange={setDuration} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Pulse ───────── */

function PulsePG() {
  const [on, setOn] = useState(true)
  const [period, setPeriod] = useState(1.8)
  const [rings, setRings] = useState(2)
  const [size, setSize] = useState(2.4)
  const { logs, push, clear } = useEventLog()

  const prompt = `새 알림이 있으면 종 아이콘 뒤에서 동그란 고리가 ${period}초마다 ${size}배까지 퍼지며 사라지는 펄스(Pulse) 효과를 넣어줘. 고리는 ${rings}개가 시간차를 두고 번갈아 퍼지게. 사용자가 종을 눌러 알림을 확인하면 펄스를 멈춰줘.`

  return (
    <Shell
      hint="종을 누르면 알림 확인 (펄스 멈춤)"
      stage={
        <div className="pg-col" style={{ gap: 28 }}>
          <button
            className="pg-pulse"
            onClick={() => {
              if (!on) return
              setOn(false)
              push('close', '알림 확인 → 펄스 멈춤')
            }}
          >
            {on &&
              Array.from({ length: rings }).map((_, i) => (
                <motion.span key={`${i}-${rings}-${period}-${size}`} className="pg-pulse-ring" initial={{ scale: 1, opacity: 0.55 }} animate={{ scale: size, opacity: 0 }} transition={{ duration: period, repeat: Infinity, delay: (i * period) / rings, ease: 'easeOut' }} />
              ))}
            <span className="pg-pulse-core">
              <Icon n="bell" size={26} color="#fff" />
            </span>
            {on && <span className="pg-pulse-dot">3</span>}
          </button>
          <button
            className="btn small"
            disabled={on}
            onClick={() => {
              setOn(true)
              push('start', '새 알림 도착 → 펄스 시작')
            }}
          >
            새 알림 오게 하기
          </button>
        </div>
      }
      controls={
        <>
          <Slider label="한 번 퍼지는 시간 (주기)" value={period} min={0.6} max={4} step={0.1} unit="s" onChange={setPeriod} />
          <Slider label="고리 개수" value={rings} min={1} max={3} step={1} unit="개" onChange={setRings} />
          <Slider label="퍼지는 크기" value={size} min={1.4} max={3.5} step={0.1} unit="x" onChange={setSize} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

export const MOTION_PGS = {
  fade: FadePG,
  slide: SlidePG,
  scale: ScalePG,
  easing: EasingPG,
  bounce: BouncePG,
  'duration-delay': DurationDelayPG,
  loop: LoopPG,
  ripple: RipplePG,
  shake: ShakePG,
  pulse: PulsePG,
}
