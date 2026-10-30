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
