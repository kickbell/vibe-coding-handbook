import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView, LayoutGroup } from 'motion/react'

export const C = {
  coral: '#FF7A59',
  mint: '#2EC4A0',
  sky: '#4D9CFF',
  butter: '#FFC43D',
  pink: '#FF6FA5',
  ink: '#1F1F24',
  acc: '#FF6B2C',
}
export const PALETTE = [C.sky, C.coral, C.mint, C.butter, C.pink]
export const ease = [0.22, 1, 0.36, 1]

// 결정적인 의사 난수 (렌더마다 같은 값)
export const rand = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

// count개 상태를 ms마다 순환
export function useStep(count, ms) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % count), ms)
    return () => clearInterval(t)
  }, [count, ms])
  return i
}

// ms마다 1씩 증가 (key로 애니메이션 재시작할 때)
export function useTick(ms) {
  const [k, setK] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setK((v) => v + 1), ms)
    return () => clearInterval(t)
  }, [ms])
  return k
}

// 280x210 고정 무대를 카드 폭에 맞춰 확대/축소. 화면 밖이면 데모를 내려서 멈춘다.
export function Stage({ children, className = '' }) {
  const ref = useRef(null)
  const [scale, setScale] = useState(1)
  const inView = useInView(ref, { margin: '120px 0px' })
  const id = useId()

  useLayoutEffect(() => {
    const el = ref.current
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / 280))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={ref} className={'stage ' + className}>
      <div className="stage-inner" style={{ transform: `scale(${scale})` }}>
        {inView && <LayoutGroup id={id}>{children}</LayoutGroup>}
      </div>
    </div>
  )
}

export const L = ({ w, h = 6, c, style, ...p }) => (
  <motion.div className="ln" style={{ width: w, height: h, background: c, ...style }} {...p} />
)

export const Win = ({ children, style, className = '', ...p }) => (
  <motion.div className={'win ' + className} style={style} {...p}>
    {children}
  </motion.div>
)

export const NavBar = () => (
  <div className="win-nav">
    <span className="nav-dot" />
    <L w={20} h={4} />
    <L w={20} h={4} />
    <L w={20} h={4} />
    <span style={{ flex: 1 }} />
    <L w={30} h={9} c={C.acc} />
  </div>
)

export const Cursor = (props) => (
  <motion.svg className="cursor" width="20" height="20" viewBox="0 0 24 24" initial={false} {...props}>
    <path d="M3 2l17 9.5-7.2 1.8L9.5 21z" fill={C.ink} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
  </motion.svg>
)

export const Chev = (p) => (
  <motion.svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M6 9l6 6 6-6" />
  </motion.svg>
)

export const Check = ({ size = 12, color = 'currentColor', width = 3.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)

export const CartIcon = ({ size = 26, color = C.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2" />
    <circle cx="9.5" cy="19.5" r="1.3" />
    <circle cx="17" cy="19.5" r="1.3" />
  </svg>
)

// 0 → len 까지 한 글자씩 늘었다가 잠시 멈추고 처음으로
export function useTypeLoop(len, { speed = 120, hold = 1500, start = 600 } = {}) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let t
    let i = 0
    const step = () => {
      if (i < len) {
        i++
        setN(i)
        t = setTimeout(step, speed)
      } else {
        t = setTimeout(() => {
          i = 0
          setN(0)
          t = setTimeout(step, start)
        }, hold)
      }
    }
    t = setTimeout(step, start)
    return () => clearTimeout(t)
  }, [len, speed, hold, start])
  return n
}

const ICONS = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-3.5-3.5',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  bell: 'M6 16v-5a6 6 0 1 1 12 0v5l2 2H4zM10 21a2 2 0 0 0 4 0',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  plus: 'M12 5v14M5 12h14',
  box: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
  folder: 'M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z',
  file: 'M6 3h8l4 4v14H6zM14 3v4h4',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  cloud: 'M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z',
  globe: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18',
  server: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01',
  laptop: 'M5 5h14v10H5zM2 19h20',
  db: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  gear: 'M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
  pen: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9h.01',
  x: 'M6 6l12 12M18 6L6 18',
  updown: 'M8 9l4-4 4 4M8 15l4 4 4-4',
}
export const Icon = ({ n, size = 16, color = 'currentColor', w = 2, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={ICONS[n]} />
  </svg>
)

export const Phone = ({ children, title = 'MyApp', right }) => (
  <div className="phone">
    <div className="ph-top">
      <b>{title}</b>
      {right}
    </div>
    {children}
  </div>
)
