import { useEffect, useRef, useState } from 'react'
import { motion, animate, useAnimationFrame, useMotionValue, useTransform } from 'motion/react'
import { Shell, EventLog, useEventLog, Slider, Segmented, Toggle } from '../components/kit'
import { C, PALETTE, ease, rand, CartIcon } from '../demos/parts'

const TextInput = ({ label, value, onChange, max = 24 }) => (
  <label className="ctl">
    <span className="ctl-top">
      <span>{label}</span>
    </span>
    <input className="pg-input" value={value} maxLength={max} onChange={(e) => onChange(e.target.value)} />
  </label>
)

/* ───────── Typewriter ───────── */

function TypewriterPG() {
  const [text, setText] = useState('안녕하세요, 바이브코더!')
  const [speed, setSpeed] = useState(110)
  const [caret, setCaret] = useState(true)
  const [erase, setErase] = useState(true)
  const [out, setOut] = useState('')
  const [run, setRun] = useState(0)
  const { logs, push, clear } = useEventLog()

  useEffect(() => {
    const chars = [...text]
    let i = 0
    let del = false
    let t
    clear()
    push('start', `타이핑 시작 · 글자당 ${speed}ms`)
    const tick = () => {
      if (!del) {
        i++
        setOut(chars.slice(0, i).join(''))
        if (i >= chars.length) {
          push('end', `다 씀 (${chars.length}글자, ${((chars.length * speed) / 1000).toFixed(1)}s)`)
          if (!erase) return
          del = true
          return (t = setTimeout(tick, 1400))
        }
        t = setTimeout(tick, speed)
      } else {
        i--
        setOut(chars.slice(0, i).join(''))
        if (i <= 0) {
          del = false
          push('child', '다 지움 → 다시 타이핑')
          return (t = setTimeout(tick, 500))
        }
        t = setTimeout(tick, speed / 2.5)
      }
    }
    setOut('')
    t = setTimeout(tick, 400)
    return () => clearTimeout(t)
  }, [text, speed, erase, run, push, clear])

  const prompt = `히어로 제목에 타자기 효과(Typewriter)를 넣어줘. "${text}"가 한 글자씩 ${speed / 1000}초 간격으로 써지게${caret ? ', 글자 끝에는 깜빡이는 세로 커서(|)' : ''}. ${erase ? '다 쓰고 1.4초 쉰 뒤 빠르게 지우고 다시 쓰기를 반복해줘.' : '한 번 다 쓰면 그대로 멈춰줘.'}`

  return (
    <Shell
      hint="오른쪽에서 문장을 바꿔보세요"
      stage={
        <div className="pg-col" onClick={() => setRun((r) => r + 1)}>
          <span className="pg-big">
            {out}
            {caret && <span className="pg-caret" />}
          </span>
          <button className="btn small">처음부터</button>
        </div>
      }
      controls={
        <>
          <TextInput label="쓸 문장" value={text} onChange={(v) => v.trim() && setText(v)} />
          <Slider label="글자 간격 (속도)" value={speed} min={30} max={400} step={10} unit="ms" onChange={setSpeed} />
          <Toggle label="깜빡이는 커서" value={caret} onChange={setCaret} />
          <Toggle label="지우고 다시 쓰기 반복" value={erase} onChange={setErase} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Text Scramble ───────── */

const SCR_SETS = { mix: '가나다라마바사아자차카타파하ABCDEFGHJKLMNPQRSTUVXYZ0123456789', alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', symbol: '!<>-_\\/[]{}=+*^?#%&@$' }

function TextScramblePG() {
  const [text, setText] = useState('PORTFOLIO 2026')
  const [speed, setSpeed] = useState(45)
  const [set, setSet] = useState('mix')
  const [order, setOrder] = useState('ltr')
  const [out, setOut] = useState([])
  const [run, setRun] = useState(0)
  const { logs, push, clear } = useEventLog()

  useEffect(() => {
    const chars = [...text]
    const pool = SCR_SETS[set]
    // 글자마다 확정되는 프레임 (왼쪽부터 / 무작위)
    const at = chars.map((_, i) => (order === 'ltr' ? 6 + i * 3 : 6 + Math.floor(Math.random() * chars.length * 3)))
    let f = 0
    let t
    push('start', '뒤섞기 시작')
    const frame = () => {
      const next = chars.map((c, i) => (f >= at[i] || c === ' ' ? { c, done: true } : { c: pool[Math.floor(Math.random() * pool.length)], done: false }))
      setOut(next)
      f++
      if (next.every((x) => x.done)) return push('end', `원래 글자로 확정 (${((f * speed) / 1000).toFixed(2)}s)`)
      t = setTimeout(frame, speed)
    }
    frame()
    return () => clearTimeout(t)
  }, [text, speed, set, order, run, push])

  const setKo = { mix: '한글·영문·숫자', alpha: '영문 대문자', symbol: '기호' }[set]
  const prompt = `제목 "${text}"에 텍스트 스크램블(Text Scramble) 효과를 넣어줘. 처음엔 ${setKo} 랜덤 글자가 ${speed}ms마다 바뀌다가 ${order === 'ltr' ? '왼쪽부터 순서대로' : '무작위 순서로'} 한 글자씩 원래 글자로 확정되게. 아직 확정 안 된 글자는 주황색. 마우스를 올릴 때마다 다시 재생해줘.`

  return (
    <Shell
      hint="글자 위에 마우스를 올리면 다시 재생"
      stage={
        <div className="pg-col">
          <span className="pg-big mono-ish" onMouseEnter={() => setRun((r) => r + 1)}>
            {out.map((o, i) => (
              <span key={i} style={{ color: o.done ? C.ink : C.acc }}>
                {o.c}
              </span>
            ))}
          </span>
        </div>
      }
      controls={
        <>
          <TextInput label="보여줄 글자" value={text} onChange={(v) => v.trim() && setText(v)} max={18} />
          <Slider label="바뀌는 간격 (속도)" value={speed} min={15} max={150} step={5} unit="ms" onChange={setSpeed} />
          <Segmented label="섞이는 글자" value={set} onChange={setSet} options={[{ value: 'mix', label: '한글·영문' }, { value: 'alpha', label: '영문' }, { value: 'symbol', label: '기호' }]} />
          <Segmented label="확정 순서" value={order} onChange={setOrder} options={[{ value: 'ltr', label: '왼쪽부터' }, { value: 'random', label: '무작위' }]} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Split Text ───────── */

const SPLIT_FROM = {
  scatter: (i) => ({ opacity: 0, x: rand(i) * 160 - 80, y: rand(i + 7) * 120 - 60, rotate: rand(i + 3) * 160 - 80 }),
  up: () => ({ opacity: 0, y: 40 }),
  flip: () => ({ opacity: 0, rotateX: -90, y: 10 }),
}

function SplitTextPG() {
  const [text, setText] = useState('흩어진 일을 한곳에')
  const [unit, setUnit] = useState('char')
  const [from, setFrom] = useState('scatter')
  const [gap, setGap] = useState(0.06)
  const [run, setRun] = useState(0)
  const { logs, push, clear } = useEventLog()
  const parts = unit === 'char' ? [...text] : text.split(/(\s+)/).filter(Boolean)
  const visible = parts.filter((p) => p.trim()).length

  useEffect(() => {
    clear()
    push('start', `${visible}조각으로 나눠서 ${gap}s 간격으로 등장`)
    const id = setTimeout(() => push('end', '모든 조각 제자리'), (visible * gap + 0.8) * 1000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, unit, from, gap, run])

  const fromKo = { scatter: '화면 여기저기 흩어져 있다가 제자리로 모이며', up: '아래에서 하나씩 솟아오르며', flip: '카드 뒤집히듯 회전하며' }[from]
  const prompt = `제목 "${text}"을 ${unit === 'char' ? '글자' : '단어'} 단위로 쪼개서(Split Text) ${fromKo} ${gap}초 간격으로 나타나게 해줘. 각 조각은 spring으로 자연스럽게 멈추고, 화면에 처음 보일 때 한 번 재생. 스크린리더용으로 원래 문장은 aria-label로 남겨줘.`

  let n = -1
  return (
    <Shell
      hint="눌러서 다시 재생"
      stage={
        <div className="pg-col" onClick={() => setRun((r) => r + 1)}>
          <span key={run + unit + from + text} className="pg-big" aria-label={text} style={{ perspective: 400 }}>
            {parts.map((p, i) => {
              if (!p.trim()) return <span key={i}>{p.replace(/ /g, ' ')}</span>
              n++
              return (
                <motion.span key={i} aria-hidden style={{ display: 'inline-block', whiteSpace: 'pre' }} initial={SPLIT_FROM[from](i)} animate={{ opacity: 1, x: 0, y: 0, rotate: 0, rotateX: 0 }} transition={{ delay: 0.15 + n * gap, type: 'spring', stiffness: 220, damping: 18 }}>
                  {p}
                </motion.span>
              )
            })}
          </span>
        </div>
      }
      controls={
        <>
          <TextInput label="문장" value={text} onChange={(v) => v.trim() && setText(v)} />
          <Segmented label="쪼개는 단위" value={unit} onChange={setUnit} options={[{ value: 'char', label: '글자' }, { value: 'word', label: '단어' }]} />
          <Segmented label="등장 방식" value={from} onChange={setFrom} options={[{ value: 'scatter', label: '흩어졌다 모임' }, { value: 'up', label: '솟아오름' }, { value: 'flip', label: '뒤집기' }]} />
          <Slider label="조각 사이 간격" value={gap} min={0} max={0.25} step={0.01} unit="s" onChange={setGap} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Count Up ───────── */

function CountUpPG() {
  const [target, setTarget] = useState(10475)
  const [duration, setDuration] = useState(1.8)
  const [comma, setComma] = useState(true)
  const [easeOut, setEaseOut] = useState(true)
  const [run, setRun] = useState(0)
  const v = useMotionValue(0)
  const txt = useTransform(v, (x) => (comma ? Math.round(x).toLocaleString('ko-KR') : String(Math.round(x))) + '+')
  const { logs, push, clear } = useEventLog()

  useEffect(() => {
    v.set(0)
    push('start', `0 → ${target.toLocaleString('ko-KR')} 세기 시작`)
    let half = false
    const c = animate(v, target, {
      duration,
      ease: easeOut ? [0.16, 1, 0.3, 1] : 'linear',
      onUpdate: (x) => {
        if (!half && x >= target / 2) {
          half = true
          push('child', `절반 도달 (${Math.round(x).toLocaleString('ko-KR')})`)
        }
      },
      onComplete: () => push('end', '목표 숫자 도착'),
    })
    return () => c.stop()
  }, [target, duration, comma, easeOut, run, v, push])

  const prompt = `"함께 쓰는 팀" 숫자가 화면에 보이면 0부터 ${target.toLocaleString('ko-KR')}까지 ${duration}초 동안 올라가는 카운트업(Count Up)을 넣어줘. ${easeOut ? '처음엔 빠르게 올라가다 끝에서 천천히 멈추게(ease-out)' : '일정한 속도로 올라가게'}${comma ? ', 천 단위마다 쉼표' : ''}, 끝에 "+" 표시. 숫자 폭이 흔들리지 않게 tabular-nums 글꼴 설정도.`

  return (
    <Shell
      hint="눌러서 다시 세기"
      stage={
        <div className="pg-col" style={{ gap: 6 }} onClick={() => setRun((r) => r + 1)}>
          <span className="pg-cu-l">함께 쓰는 팀</span>
          <motion.span className="pg-cu-n">{txt}</motion.span>
          <button className="btn small" style={{ marginTop: 16 }}>
            다시 세기
          </button>
        </div>
      }
      controls={
        <>
          <Slider label="목표 숫자" value={target} min={100} max={100000} step={25} onChange={setTarget} />
          <Slider label="세는 시간 (duration)" value={duration} min={0.3} max={5} step={0.1} unit="s" onChange={setDuration} />
          <Toggle label="끝에서 천천히 (ease-out)" value={easeOut} onChange={setEaseOut} />
          <Toggle label="천 단위 쉼표" value={comma} onChange={setComma} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Line Drawing ───────── */

const LINES = {
  chart: { d: 'M20 150 C 50 70, 90 60, 110 110 S 160 170, 190 100 S 250 30, 290 70', label: '그래프' },
  check: { d: 'M60 100 L130 160 L250 40', label: '체크' },
  sign: { d: 'M30 130 C 50 40, 80 40, 70 120 C 65 160, 110 60, 130 90 S 150 140, 170 100 S 200 60, 210 110 C 220 140, 250 80, 290 100', label: '서명' },
}

function LineDrawingPG() {
  const [shape, setShape] = useState('chart')
  const [duration, setDuration] = useState(1.5)
  const [width, setWidth] = useState(6)
  const [drawn, setDrawn] = useState(true)
  const [run, setRun] = useState(0)
  const len = useMotionValue(0)
  const pct = useTransform(len, (v) => `pathLength: ${v.toFixed(2)}`)
  const { logs, push, clear } = useEventLog()

  useEffect(() => {
    push('start', drawn ? `'${LINES[shape].label}' 그리기 시작` : '지우기 시작')
    if (drawn) len.set(0)
    const c = animate(len, drawn ? 1 : 0, { duration, ease: 'easeInOut', onComplete: () => push('end', drawn ? '다 그림' : '다 지움') })
    return () => c.stop()
  }, [shape, duration, drawn, run, len, push])

  const prompt = `${LINES[shape].label} 모양 SVG 선이 펜으로 그리듯 처음부터 끝까지 그려지는 라인 드로잉(Line Drawing)을 넣어줘. 선 두께 ${width}px, 끝은 둥글게, ${duration}초 동안 ease-in-out. 화면에 보일 때 한 번 재생. Motion의 pathLength 0 → 1 (또는 stroke-dasharray/dashoffset) 사용.`

  return (
    <Shell
      hint="눌러서 다시 그리기"
      stage={
        <div className="pg-col" onClick={() => setRun((r) => r + 1)}>
          <svg viewBox="0 0 310 190" className="pg-ld">
            <path d={LINES[shape].d} fill="none" stroke="#e7e3da" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
            <motion.path d={LINES[shape].d} fill="none" stroke={C.acc} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: len }} />
          </svg>
          <motion.span className="pg-readout mono">{pct}</motion.span>
        </div>
      }
      controls={
        <>
          <Segmented label="그릴 모양" value={shape} onChange={setShape} options={Object.entries(LINES).map(([k, v]) => ({ value: k, label: v.label }))} />
          <Slider label="그리는 시간 (duration)" value={duration} min={0.3} max={4} step={0.1} unit="s" onChange={setDuration} />
          <Slider label="선 두께" value={width} min={1} max={16} step={1} unit="px" onChange={setWidth} />
          <Toggle label="그리기 (끄면 거꾸로 지우기)" value={drawn} onChange={setDrawn} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Morphing ───────── */

// 같은 개수의 점을 가진 모양끼리만 자연스럽게 모핑된다
const MORPHS = {
  menu: { a: ['M4 6 L20 6', 'M4 12 L20 12', 'M4 18 L20 18'], b: ['M5 5 L19 19', 'M12 12 L12 12', 'M5 19 L19 5'], la: '메뉴', lb: '닫기', stroke: true },
  play: { a: ['M7 4 L12 7 L12 17 L7 20 Z', 'M12 7 L19 12 L19 12 L12 17 Z'], b: ['M6 4 L10 4 L10 20 L6 20 Z', 'M14 4 L18 4 L18 20 L14 20 Z'], la: '재생', lb: '일시정지' },
  plus: { a: ['M5 12 L19 12', 'M12 5 L12 19'], b: ['M5 12 L19 12', 'M5 12 L19 12'], la: '펼치기', lb: '접기', stroke: true },
}

function MorphingPG() {
  const [kind, setKind] = useState('menu')
  const [on, setOn] = useState(false)
  const [duration, setDuration] = useState(0.4)
  const [spring, setSpring] = useState(true)
  const { logs, push, clear } = useEventLog()
  const m = MORPHS[kind]
  const tr = spring ? { type: 'spring', bounce: 0.35, duration } : { duration, ease }

  const prompt = `${m.la} 아이콘을 누르면 ${m.lb} 아이콘으로 모양이 스르르 바뀌는 모핑(Morphing)을 넣어줘. 아이콘을 갈아끼우지 말고 SVG path의 점 위치가 ${duration}초 동안 ${spring ? '살짝 탄성 있게(spring)' : '부드럽게'} 이동하며 변하게. 다시 누르면 원래 모양으로. 옆의 상자도 네모↔동그라미로 함께 변하게.`

  return (
    <Shell
      hint="아이콘을 눌러보세요"
      stage={
        <div className="pg-row" style={{ gap: 48 }}>
          <button
            className="pg-morph-btn"
            onClick={() => {
              setOn(!on)
              push(on ? 'close' : 'open', `${on ? m.lb : m.la} → ${on ? m.la : m.lb} 모양으로`)
            }}
            aria-label={on ? m.lb : m.la}
          >
            <svg width="64" height="64" viewBox="0 0 24 24">
              {m.a.map((d, i) => (
                <motion.path key={kind + i} initial={false} animate={{ d: on ? m.b[i] : d, rotate: kind === 'plus' && on ? 180 : 0 }} transition={tr} fill={m.stroke ? 'none' : '#fff'} stroke={m.stroke ? '#fff' : 'none'} strokeWidth="2.4" strokeLinecap="round" />
              ))}
            </svg>
          </button>
          <motion.div className="pg-morph-shape" initial={false} animate={{ borderRadius: on ? '50%' : '18%', rotate: on ? 90 : 0, background: on ? C.coral : C.sky }} transition={tr} />
        </div>
      }
      controls={
        <>
          <Segmented
            label="아이콘 짝"
            value={kind}
            onChange={(v) => {
              setKind(v)
              setOn(false)
            }}
            options={[{ value: 'menu', label: '☰ ↔ ✕' }, { value: 'play', label: '▶ ↔ ❚❚' }, { value: 'plus', label: '+ ↔ −' }]}
          />
          <Slider label="바뀌는 시간 (duration)" value={duration} min={0.1} max={1.5} step={0.05} unit="s" onChange={setDuration} />
          <Toggle label="살짝 탄성 (spring)" value={spring} onChange={setSpring} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Marquee ───────── */

const BRANDS = ['mokri', 'ondolab', 'pixelnut', 'dalbit', 'nurilab', 'seed&co', 'haneul']

function MarqueePG() {
  const [speed, setSpeed] = useState(60)
  const [dir, setDir] = useState(-1)
  const [pause, setPause] = useState(true)
  const [hover, setHover] = useState(false)
  const x = useMotionValue(0)
  const track = useRef(null)
  const { logs, push, clear } = useEventLog()

  // 같은 목록을 두 번 이어 붙이고, 절반만큼 가면 처음으로 되감아 끊김 없이 흐르게
  useAnimationFrame((_, dt) => {
    if (pause && hover) return
    const half = track.current ? track.current.scrollWidth / 2 : 600
    let v = x.get() + (dir * speed * dt) / 1000
    if (v <= -half) v += half
    if (v > 0) v -= half
    x.set(v)
  })

  const prompt = `제휴사 로고들이 ${dir < 0 ? '왼쪽' : '오른쪽'}으로 끝없이 흐르는 마키(Marquee) 띠를 만들어줘. 초당 ${speed}px 속도로 일정하게, 로고 목록을 두 번 이어 붙여서 끊김 없이 반복${pause ? ', 마우스를 올리면 잠시 멈추게' : ''}. 양 끝은 배경색으로 서서히 흐려지게(fade mask).`

  return (
    <Shell
      hint={pause ? '마우스를 올리면 멈춰요' : '흐르는 속도를 바꿔보세요'}
      stage={
        <div
          className="pg-mq"
          onMouseEnter={() => {
            setHover(true)
            pause && push('close', '마우스 올림 → 멈춤')
          }}
          onMouseLeave={() => {
            setHover(false)
            pause && push('start', '마우스 벗어남 → 다시 흐름')
          }}
        >
          <motion.div ref={track} className="pg-mq-track" style={{ x }}>
            {[...BRANDS, ...BRANDS].map((n, i) => (
              <span key={i}>
                <i style={{ background: PALETTE[i % 5] }} />
                {n}
              </span>
            ))}
          </motion.div>
        </div>
      }
      controls={
        <>
          <Slider label="흐르는 속도" value={speed} min={10} max={300} step={10} unit="px/s" onChange={setSpeed} />
          <Segmented label="방향" value={dir} onChange={setDir} options={[{ value: -1, label: '← 왼쪽' }, { value: 1, label: '오른쪽 →' }]} />
          <Toggle label="마우스 올리면 멈춤" value={pause} onChange={setPause} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Motion Path ───────── */

// 모든 경로는 장바구니 위치(270, 60)에서 끝난다. 좌표는 300x200 상자의 px
const PATHS = {
  arc: { d: 'M 30 170 C 60 30, 220 10, 270 60', label: '포물선' },
  wave: { d: 'M 20 100 C 60 20, 100 180, 150 100 S 240 20, 270 60', label: '물결' },
  loop: { d: 'M 30 160 C 110 160, 180 30, 125 40 C 70 50, 120 150, 270 60', label: '고리' },
}

function MotionPathPG() {
  const [path, setPath] = useState('arc')
  const [duration, setDuration] = useState(1.4)
  const [rotate, setRotate] = useState(true)
  const [run, setRun] = useState(0)
  const { logs, push, clear } = useEventLog()
  const d = PATHS[path].d

  useEffect(() => {
    if (!run) return
    push('start', `'${PATHS[path].label}' 경로 따라 출발`)
    const id = setTimeout(() => push('end', '장바구니 도착'), duration * 1000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  const prompt = `"담기" 버튼을 누르면 상품 썸네일이 ${PATHS[path].label} 모양 곡선을 따라 장바구니 아이콘까지 날아가는 모션 패스(Motion Path)를 넣어줘. ${duration}초 동안 ease-in-out, 날아가며 점점 작아지고${rotate ? ', 진행 방향을 바라보도록 회전' : ''}. 도착하면 장바구니가 살짝 커졌다 돌아오게. CSS offset-path 사용.`

  return (
    <Shell
      hint="'담기'를 눌러보세요"
      stage={
        <div className="pg-mp">
          <svg viewBox="0 0 300 200" className="pg-mp-svg">
            <path d={d} fill="none" stroke="#cfcac0" strokeWidth="2" strokeDasharray="5 6" />
          </svg>
          <div className="pg-mp-layer">
            <motion.div key={'c' + run} className="pg-mp-cart" initial={false} animate={run ? { scale: [1, 1, 1.3, 1] } : {}} transition={{ duration: duration + 0.3, times: [0, duration / (duration + 0.3), (duration + 0.12) / (duration + 0.3), 1] }}>
              <CartIcon size={30} />
            </motion.div>
            {run > 0 && (
              <motion.div
                key={run}
                className="pg-mp-box"
                style={{ offsetPath: `path('${d}')`, offsetRotate: rotate ? 'auto' : '0deg' }}
                initial={{ offsetDistance: '0%', scale: 1, opacity: 1 }}
                animate={{ offsetDistance: '100%', scale: 0.4, opacity: [1, 1, 0] }}
                transition={{ duration, ease: 'easeInOut', opacity: { duration: duration + 0.1, times: [0, 0.9, 1] } }}
              />
            )}
          </div>
          <button className="btn small pg-mp-btn" onClick={() => setRun((r) => r + 1)}>
            담기
          </button>
        </div>
      }
      controls={
        <>
          <Segmented label="날아가는 경로" value={path} onChange={setPath} options={Object.entries(PATHS).map(([k, v]) => ({ value: k, label: v.label }))} />
          <Slider label="날아가는 시간 (duration)" value={duration} min={0.4} max={3} step={0.1} unit="s" onChange={setDuration} />
          <Toggle label="진행 방향으로 회전 (offset-rotate)" value={rotate} onChange={setRotate} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

export const TEXT_PGS = {
  typewriter: TypewriterPG,
  'text-scramble': TextScramblePG,
  'split-text': SplitTextPG,
  'count-up': CountUpPG,
  'line-drawing': LineDrawingPG,
  morphing: MorphingPG,
  marquee: MarqueePG,
  'motion-path': MotionPathPG,
}
