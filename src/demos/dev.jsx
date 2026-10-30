import { motion, AnimatePresence } from 'motion/react'
import { C, ease, useStep, useTick, L, Win, Icon, Check } from './parts'

const sp = { type: 'spring', stiffness: 320, damping: 26 }

// 움직이는 작은 라벨 (요청/응답 등)
const Pkt = ({ children, color = C.sky, style, ...p }) => (
  <motion.span className="pkt" style={{ background: color, ...style }} {...p}>
    {children}
  </motion.span>
)

// 아이콘 상자 + 이름
const Node = ({ icon, label, x, y, dark, color, children }) => (
  <div className="node" style={{ left: x - 40, top: y }}>
    <div className={'node-box' + (dark ? ' dark' : '')} style={color ? { background: color, borderColor: color, color: '#fff' } : undefined}>
      {icon && <Icon n={icon} size={20} />}
      {children}
    </div>
    <span>{label}</span>
  </div>
)

const fadeIn = (delay) => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.3 } })

/* ───────── 파일·형식 ───────── */

const MD = [
  [<><i>#</i> 할 일 목록</>, <b className="md-h">할 일 목록</b>],
  [<><i>-</i> 장보기</>, <span className="md-li">장보기</span>],
  [<><i>-</i> <i>**</i>운동<i>**</i>하기</>, <span className="md-li"><b>운동</b>하기</span>],
  [<><i>&gt;</i> 물 많이 마시기</>, <span className="md-q">물 많이 마시기</span>],
]
export function Markdown() {
  const n = Math.min(useStep(6, 800), 4)
  return (
    <div className="md-wrap">
      <div className="md-src mono">
        <span className="md-tab">notes.md</span>
        {MD.slice(0, n).map(([src], i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}>
            {src}
          </motion.div>
        ))}
      </div>
      <span className="md-arrow">→</span>
      <div className="md-out">
        <span className="md-tab dark">미리보기</span>
        {MD.slice(0, n).map(([, out], i) => (
          <motion.div key={i} {...fadeIn(0.15)}>
            {out}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const FILES = ['src/', 'public/', 'package.json', 'README.md']
export function Readme() {
  const s = useStep(3, 1500)
  return (
    <Win style={{ inset: '14px 20px' }}>
      <div className="repo-head">
        <Icon n="folder" size={11} />
        <b>my-app</b>
      </div>
      {FILES.map((f) => (
        <motion.div key={f} className="repo-row" initial={false} animate={{ background: f === 'README.md' && s >= 1 ? '#FFEDE3' : 'rgba(255,237,227,0)' }}>
          <Icon n={f.endsWith('/') ? 'folder' : 'file'} size={10} color="#8a857b" />
          {f}
        </motion.div>
      ))}
      <AnimatePresence>
        {s === 2 && (
          <motion.div className="repo-readme" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <span className="mono" style={{ fontSize: 7.5, color: '#9a958b' }}>README.md</span>
            <b style={{ fontSize: 13 }}>my-app</b>
            <span style={{ fontSize: 9, color: '#57534b' }}>할 일을 정리하는 웹앱이에요.</span>
            <b style={{ fontSize: 9.5, marginTop: 3 }}>실행 방법</b>
            <span className="code-mini mono">npm install && npm run dev</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Win>
  )
}

export function Json() {
  const n = Math.min(useStep(5, 800), 3)
  const lines = [
    ['"name"', '"바이브"'],
    ['"likes"', '42'],
    ['"done"', 'true'],
  ]
  return (
    <>
      <div className="json-code mono">
        {'{'}
        {lines.map(([k, v], i) => (
          <motion.div key={i} initial={false} animate={{ opacity: i < n ? 1 : 0.25 }} style={{ paddingLeft: 10 }}>
            <span className="jk">{k}</span>: <span className={'jv' + (i ? ' n' : '')}>{v}</span>
            {i < 2 ? ',' : ''}
          </motion.div>
        ))}
        {'}'}
      </div>
      <span className="json-arrow">→</span>
      <div className="json-card">
        <motion.div className="row" style={{ gap: 6 }} initial={false} animate={{ opacity: n >= 1 ? 1 : 0.15 }}>
          <span className="avatar" style={{ background: C.coral, width: 18, height: 18 }} />
          <b style={{ fontSize: 11 }}>바이브</b>
        </motion.div>
        <motion.div className="row" style={{ gap: 5, fontSize: 10, fontWeight: 700 }} initial={false} animate={{ opacity: n >= 2 ? 1 : 0.15 }}>
          <Icon n="heart" size={12} color={C.pink} /> 42
        </motion.div>
        <motion.div className="row" style={{ gap: 5, fontSize: 10, fontWeight: 700, color: '#158a6c' }} initial={false} animate={{ opacity: n >= 3 ? 1 : 0.15 }}>
          <Check size={12} color="#158a6c" /> 완료
        </motion.div>
      </div>
    </>
  )
}

export function Env() {
  const show = useStep(2, 1600) === 1
  return (
    <>
      <div className="env-file mono">
        <span className="md-tab">.env</span>
        <div>
          <span className="jk">API_KEY</span>=<span style={{ color: show ? '#ffc43d' : '#8a857b' }}>{show ? 'abc123xyz' : '•••••••••'}</span>
        </div>
        <div>
          <span className="jk">DB_PASS</span>=<span style={{ color: '#8a857b' }}>•••••</span>
        </div>
        <span className="env-lock">
          <Icon n="lock" size={12} color="#ffc43d" />
        </span>
      </div>
      <svg viewBox="0 0 280 210" style={{ position: 'absolute', inset: 0 }}>
        <motion.path d="M 150 92 C 170 92, 170 126, 190 126" fill="none" stroke="#bdb8ad" strokeWidth="2" strokeDasharray="4 4" animate={{ strokeDashoffset: [0, -16] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
      </svg>
      <div className="env-code mono">
        process.env.<b>API_KEY</b>
      </div>
      <div className="env-git">
        <Icon n="x" size={10} color="#e5484d" w={3} />
        .gitignore에 넣어서 GitHub에는 안 올려요
      </div>
    </>
  )
}

export function PackageJson() {
  const s = useStep(4, 1000)
  const notes = [
    ['프로젝트 이름', 62],
    ['실행 명령어', 77],
    ['필요한 부품 목록', 100],
  ]
  return (
    <>
      <div className="pj mono">
        <span className="md-tab">package.json</span>
        <div>{'{'}</div>
        <div className={'pj-l' + (s >= 1 ? ' on' : '')}>"name": "my-app",</div>
        <div className={'pj-l' + (s >= 2 ? ' on' : '')}>"scripts": {'{ "dev": "vite" }'},</div>
        <div className={'pj-l' + (s >= 3 ? ' on' : '')}>
          "dependencies": {'{'}
          <br />
          &nbsp;&nbsp;"react": "^19",
          <br />
          &nbsp;&nbsp;"motion": "^14"
          <br />
          {'}'}
        </div>
        <div>{'}'}</div>
      </div>
      <AnimatePresence>
        {notes.slice(0, s).map(([t, y]) => (
          <motion.span key={t} className="pj-note" style={{ top: y }} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            ← {t}
          </motion.span>
        ))}
      </AnimatePresence>
    </>
  )
}

/* ───────── 개념 ───────── */

export function FrontendBackend() {
  const k = useTick(2800)
  const o = (delay) => ({ delay, duration: 0.7, opacity: { delay, duration: 0.7, times: [0, 0.1, 0.85, 1] } })
  return (
    <>
      <div className="fb-col" style={{ left: 14 }}>
        <span className="fb-tag">Frontend</span>
        <div className="fb-box">
          <L w={50} h={6} c={C.ink} />
          <L w={64} h={4} />
          <div key={k} style={{ display: 'grid', gap: 4, marginTop: 4 }}>
            {[C.sky, C.mint, C.butter].map((c, i) => (
              <motion.div key={i} className="row" style={{ gap: 4 }} {...fadeIn(1.5 + i * 0.1)}>
                <span className="sq" style={{ width: 10, height: 10, background: c }} />
                <L w={40} h={4} />
              </motion.div>
            ))}
          </div>
        </div>
        <span className="fb-cap">눈에 보이는 화면</span>
      </div>
      <div className="fb-col" style={{ right: 14 }}>
        <span className="fb-tag dark">Backend</span>
        <div className="fb-box dark">
          <Icon n="server" size={22} color="#fff" />
          <Icon n="db" size={22} color="#fff" />
        </div>
        <span className="fb-cap">보이지 않는 서버</span>
      </div>
      <Pkt key={'q' + k} style={{ top: 86 }} initial={{ x: 112, opacity: 0 }} animate={{ x: [112, 142], opacity: [0, 1, 1, 0] }} transition={o(0)}>
        요청
      </Pkt>
      <Pkt key={'r' + k} color={C.mint} style={{ top: 116 }} initial={{ x: 142, opacity: 0 }} animate={{ x: [142, 112], opacity: [0, 1, 1, 0] }} transition={o(0.8)}>
        응답
      </Pkt>
    </>
  )
}

export function Api() {
  const k = useTick(3400)
  const o = (delay) => ({ delay, duration: 1.2, ease: 'easeInOut', opacity: { delay, duration: 1.2, times: [0, 0.08, 0.92, 1] } })
  return (
    <>
      <Node icon="laptop" label="내 앱" x={46} y={52} />
      <Node label="API · 주문 창구" x={140} y={52} color={C.acc}>
        <span className="mono" style={{ fontSize: 9, fontWeight: 800 }}>/weather</span>
      </Node>
      <Node icon="server" label="날씨 서버" x={234} y={52} dark />
      <Pkt key={'q' + k} style={{ top: 132 }} initial={{ x: 20, opacity: 0 }} animate={{ x: [20, 114, 198], opacity: [0, 1, 1, 0] }} transition={o(0)}>
        날씨 알려줘
      </Pkt>
      <Pkt key={'r' + k} color={C.mint} style={{ top: 156 }} initial={{ x: 204, opacity: 0 }} animate={{ x: [204, 116, 26], opacity: [0, 1, 1, 0] }} transition={o(1.5)}>
        맑음 23°
      </Pkt>
    </>
  )
}

const DB_ROWS = [
  [1, '민지', 92],
  [2, '도윤', 78],
  [3, '서연', 85],
  [4, '하준', 64],
  [5, '지우', 99],
]
export function Database() {
  const k = useTick(1100)
  const rows = DB_ROWS.slice(0, 2 + (k % 4))
  return (
    <>
      <div className="db-head">
        <Icon n="db" size={14} color={C.acc} /> users 테이블
      </div>
      <div className="db-table">
        <div className="db-tr th">
          <span>id</span>
          <span>이름</span>
          <span>점수</span>
        </div>
        {rows.map((r) => (
          <motion.div key={r[0]} className="db-tr" initial={{ opacity: 0, background: '#FFE3D5' }} animate={{ opacity: 1, background: '#FFFFFF' }} transition={{ duration: 0.9 }}>
            <span className="mono">{r[0]}</span>
            <span>{r[1]}</span>
            <span className="mono">{r[2]}</span>
          </motion.div>
        ))}
      </div>
    </>
  )
}

const SLOTS = [
  ['저장', 40],
  ['취소', 88],
  ['다음', 136],
]
export function Component() {
  const k = useTick(3400)
  return (
    <>
      <div className="cmp-tpl">
        <span className="mono">{'<Button>'}</span>
        <span className="cmp-btn">버튼</span>
        <span style={{ fontSize: 8, color: '#8a857b' }}>한 번 만든 부품</span>
      </div>
      <Win style={{ left: 140, top: 18, width: 122, height: 174, padding: 10 }}>
        <L w={60} h={6} c={C.ink} />
        {SLOTS.map(([, y]) => (
          <span key={y} className="cmp-slot" style={{ top: y }} />
        ))}
      </Win>
      <div key={k}>
        {SLOTS.map(([label, y], i) => (
          <motion.span key={label} className="cmp-btn fly" initial={{ x: 38, y: 100, opacity: 0, scale: 0.8 }} animate={{ x: 166, y: 18 + y, opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.45, ...sp }}>
            {label}
          </motion.span>
        ))}
      </div>
    </>
  )
}

export function State() {
  const k = useTick(1100)
  const count = k % 6
  return (
    <div className="center row" style={{ gap: 8 }}>
      <motion.span key={'b' + k} className="st-plus" animate={{ scale: [1, 0.86, 1] }} transition={{ duration: 0.25 }}>
        +1
      </motion.span>
      <span className="st-arr">→</span>
      <div className="st-box mono">
        <span className="mini-cap">state</span>
        <motion.b key={'s' + k} initial={{ color: C.acc }} animate={{ color: C.ink }} transition={{ duration: 0.8 }}>
          count: {count}
        </motion.b>
      </div>
      <span className="st-arr">→</span>
      <div className="st-box screen">
        <span className="mini-cap">화면</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.b key={count} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
            {count}
          </motion.b>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ───────── 도구·작업 ───────── */

const PORTS = [
  [3000, 'React 앱'],
  [4000, '이 사이트'],
  [5173, 'Vite 앱'],
]
export function LocalhostPort() {
  const s = useStep(3, 1400)
  return (
    <>
      <div className="lp-bar">
        <Icon n="globe" size={11} color="#8a857b" />
        <span>
          localhost:
          <AnimatePresence mode="popLayout">
            <motion.b key={s} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} style={{ color: C.acc, display: 'inline-block' }}>
              {PORTS[s][0]}
            </motion.b>
          </AnimatePresence>
        </span>
      </div>
      <div className="lp-pc">
        <span className="lp-pc-l">
          <Icon n="laptop" size={12} /> 내 컴퓨터 = localhost
        </span>
        <div className="row" style={{ gap: 10 }}>
          {PORTS.map(([p, t], i) => (
            <motion.div key={p} className="lp-door" initial={false} animate={{ background: i === s ? C.acc : '#ffffff', color: i === s ? '#ffffff' : '#8a857b', borderColor: i === s ? C.acc : '#e2ded5', y: i === s ? -4 : 0 }}>
              <b className="mono">{p}</b>
              <span>{t}</span>
            </motion.div>
          ))}
        </div>
        <span style={{ fontSize: 8.5, color: '#8a857b' }}>포트 = 컴퓨터 안의 문 번호</span>
      </div>
    </>
  )
}

const TERM_OUT = [
  ['> vite', '#9a958b'],
  ['VITE ready in 157 ms', '#2EC4A0'],
  ['➜ Local: http://localhost:4000/', '#8fc1ff'],
]
export function Terminal() {
  const k = useTick(4600)
  const cmd = 'npm run dev'
  return (
    <div className="term">
      <div className="term-top">
        <i style={{ background: '#ff5f57' }} />
        <i style={{ background: '#febc2e' }} />
        <i style={{ background: '#28c840' }} />
      </div>
      <div key={k} className="term-body mono">
        <div>
          <span style={{ color: '#2EC4A0' }}>~/my-app $</span>{' '}
          {[...cmd].map((c, i) => (
            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.07, duration: 0 }}>
              {c}
            </motion.span>
          ))}
        </div>
        {TERM_OUT.map(([t, color], i) => (
          <motion.div key={i} style={{ color }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 + i * 0.3, duration: 0 }}>
            {t}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const COMMITS = ['첫 화면', '로그인 추가', '버튼 수정', '배포 준비']
export function Commit() {
  const k = useTick(4200)
  return (
    <>
      <span className="chip mono" style={{ position: 'absolute', left: 18, top: 18 }}>
        git commit -m "버튼 수정"
      </span>
      <div key={k}>
        <svg viewBox="0 0 280 210" style={{ position: 'absolute', inset: 0 }}>
          <motion.line x1="36" y1="112" x2="244" y2="112" stroke="#d6d2c8" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, ease: 'linear' }} />
        </svg>
        {COMMITS.map((m, i) => {
          const x = 44 + i * 64
          const d = (2.4 * (x - 36)) / 208
          return (
            <div key={i}>
              <motion.span className="cm-ring" style={{ left: x - 8, top: 104 }} initial={{ scale: 1, opacity: 0 }} animate={{ scale: [1, 2.6], opacity: [0.6, 0] }} transition={{ delay: d, duration: 0.6 }} />
              <motion.span className="cm-dot" style={{ left: x - 8, top: 104 }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: d, type: 'spring', stiffness: 500, damping: 15 }} />
              <motion.div className="cm" style={{ left: x - 36, top: i % 2 ? 128 : 66 }} initial={{ opacity: 0, y: i % 2 ? -6 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d + 0.1 }}>
                <span className="mono">{['a1f3c2', '7b9e04', 'c4d8a1', 'e02f6b'][i]}</span>
                {m}
              </motion.div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export function Branch() {
  const k = useTick(4800)
  const dot = (cx, cy, delay, color) => (
    <motion.circle cx={cx} cy={cy} r="6" fill="#fff" stroke={color} strokeWidth="3" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay, type: 'spring', stiffness: 500, damping: 15 }} />
  )
  const mainAt = (x) => (3.2 * (x - 20)) / 240
  return (
    <svg key={k} viewBox="0 0 280 210" style={{ position: 'absolute', inset: 0 }}>
      <motion.path d="M20 132 H260" stroke={C.ink} strokeWidth="3" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3.2, ease: 'linear' }} />
      <motion.path d="M80 132 C 102 132, 100 80, 126 80 H 176 C 202 80, 200 132, 222 132" stroke={C.acc} strokeWidth="3" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: mainAt(80), duration: mainAt(222) - mainAt(80), ease: 'linear' }} />
      {dot(40, 132, mainAt(40), C.ink)}
      {dot(80, 132, mainAt(80), C.ink)}
      {dot(140, 80, 1.5, C.acc)}
      {dot(170, 80, 1.85, C.acc)}
      {dot(222, 132, mainAt(222), C.ink)}
      {dot(252, 132, mainAt(252), C.ink)}
      <text x="22" y="156" fontSize="10" fontWeight="800" fill={C.ink}>main</text>
      <motion.text x="118" y="66" fontSize="10" fontWeight="800" fill={C.acc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        feature/login
      </motion.text>
      <motion.text x="200" y="156" fontSize="9.5" fontWeight="700" fill="#8a857b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: mainAt(222) }}>
        merge (합치기)
      </motion.text>
    </svg>
  )
}

const PUSH_PATH = 'M 108 138 C 140 138, 150 74, 184 70'
export function Push() {
  const k = useTick(3600)
  return (
    <div key={k}>
      <svg viewBox="0 0 280 210" style={{ position: 'absolute', inset: 0 }}>
        <path d={PUSH_PATH} fill="none" stroke="#cfcac0" strokeWidth="2" strokeDasharray="5 6" />
      </svg>
      <div className="push-box" style={{ left: 18, top: 112 }}>
        <Icon n="laptop" size={16} />
        <b>내 컴퓨터</b>
        <div className="row" style={{ gap: 4 }}>
          {[0, 1, 2].map((i) => (
            <motion.span key={i} className="push-dot" initial={{ opacity: 1 }} animate={{ opacity: 0.25 }} transition={{ delay: 0.3 + i * 0.35 }} />
          ))}
        </div>
      </div>
      <div className="push-box dark" style={{ left: 172, top: 36 }}>
        <Icon n="cloud" size={16} color="#fff" />
        <b>원격 저장소</b>
        <div className="row" style={{ gap: 4 }}>
          {[0, 1, 2].map((i) => (
            <motion.span key={i} className="push-dot" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.1 + i * 0.35, type: 'spring', stiffness: 500, damping: 16 }} />
          ))}
        </div>
      </div>
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="push-dot fly" style={{ offsetPath: `path('${PUSH_PATH}')` }} initial={{ offsetDistance: '0%', opacity: 0 }} animate={{ offsetDistance: ['0%', '100%'], opacity: [1, 1, 0] }} transition={{ delay: 0.3 + i * 0.35, duration: 0.8, ease: 'easeInOut' }} />
      ))}
      <span className="chip mono" style={{ position: 'absolute', left: 118, top: 150 }}>
        git push
      </span>
    </div>
  )
}

export function NpmInstall() {
  const k = useTick(3800)
  return (
    <div key={k}>
      <div className="ni-term mono">
        <div>
          <span style={{ color: '#2EC4A0' }}>$</span> npm install
        </div>
        <div className="ni-bar">
          <motion.span initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2, ease: 'easeInOut' }} />
        </div>
        <motion.div style={{ color: '#2EC4A0' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 0 }}>
          added 128 packages
        </motion.div>
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span key={i} className="ni-pkg" style={{ left: 104 + i * 14 }} initial={{ y: 84, opacity: 0 }} animate={{ y: [84, 150], opacity: [0, 1, 1, 0] }} transition={{ delay: 0.2 + i * 0.35, duration: 0.7, ease: 'easeIn' }}>
          <Icon n="box" size={12} color="#fff" />
        </motion.span>
      ))}
      <div className="ni-folder">
        <Icon n="folder" size={22} color={C.acc} />
        <span className="mono">node_modules</span>
      </div>
    </div>
  )
}

const SRC = ['App.jsx', 'Card.jsx', 'style.css', 'utils.js']
export function Build() {
  const k = useTick(3800)
  return (
    <div key={k}>
      {SRC.map((f, i) => (
        <motion.span key={f} className="bd-file mono" style={{ top: 42 + i * 32 }} initial={{ x: 0, opacity: 1 }} animate={{ x: 104, y: 92 - (42 + i * 32), opacity: 0, scale: 0.5 }} transition={{ delay: 0.3 + i * 0.25, duration: 0.6, ease: 'easeIn' }}>
          {f}
        </motion.span>
      ))}
      <div className="bd-machine">
        <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ display: 'grid' }}>
          <Icon n="gear" size={24} color="#fff" />
        </motion.span>
        <span className="mono">build</span>
      </div>
      <motion.div className="bd-out" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.7, ...sp }}>
        <span className="row mono" style={{ gap: 4, fontWeight: 800 }}>
          <Icon n="folder" size={12} color={C.acc} /> dist/
        </span>
        <span className="mono">index.html</span>
        <span className="mono">app.js</span>
        <b>128KB → 46KB</b>
      </motion.div>
    </div>
  )
}

export function Deploy() {
  const k = useTick(4000)
  return (
    <div key={k}>
      <Node icon="laptop" label="내 컴퓨터" x={52} y={62} />
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="dp-dot" initial={{ x: 96, opacity: 0 }} animate={{ x: [96, 176], opacity: [0, 1, 0] }} transition={{ delay: i * 0.25, duration: 0.8, repeat: 1, ease: 'linear' }} />
      ))}
      <div className="node" style={{ left: 182, top: 50 }}>
        <motion.div className="node-box globe" initial={{ background: '#ffffff' }} animate={{ background: C.mint, borderColor: C.mint, color: '#ffffff' }} transition={{ delay: 1.6 }}>
          <Icon n="globe" size={28} />
        </motion.div>
        <span>인터넷</span>
      </div>
      <motion.div className="dp-done" {...fadeIn(1.8)}>
        <Check size={11} color="#158a6c" />
        <span className="mono">myapp.site</span> 배포 완료
      </motion.div>
      {[
        [196, 40],
        [262, 64],
        [256, 120],
      ].map(([x, y], i) => (
        <motion.span key={i} className="dp-user" style={{ left: x, top: y }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.2 + i * 0.15, type: 'spring', stiffness: 500, damping: 16 }}>
          <Icon n="user" size={10} color="#fff" w={2.6} />
        </motion.span>
      ))}
    </div>
  )
}

const DOMAIN = 'myapp.site'
export function Domain() {
  const k = useTick(4200)
  return (
    <div key={k}>
      <div className="lp-bar" style={{ top: 18 }}>
        <Icon n="globe" size={11} color="#8a857b" />
        <span>
          {[...DOMAIN].map((c, i) => (
            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.06, duration: 0 }}>
              {c}
            </motion.span>
          ))}
        </span>
      </div>
      <motion.span className="dm-arrow" style={{ top: 54 }} {...fadeIn(1)}>↓</motion.span>
      <motion.div className="dm-dns" {...fadeIn(1.1)}>
        <span className="mini-cap">DNS · 인터넷 전화번호부</span>
        <span className="mono">
          myapp.site → <b style={{ color: C.acc }}>76.76.21.21</b>
        </span>
      </motion.div>
      <motion.span className="dm-arrow" style={{ top: 126 }} {...fadeIn(1.9)}>↓</motion.span>
      <motion.div className="dm-server" initial={{ background: '#ffffff', color: C.ink }} animate={{ background: C.ink, color: '#ffffff' }} transition={{ delay: 2.1 }}>
        <Icon n="server" size={14} /> 서버에 도착
      </motion.div>
    </div>
  )
}

/* ───────── 문제 상황 ───────── */

export function ConsoleError() {
  const k = useTick(3400)
  return (
    <Win style={{ inset: '14px 18px' }}>
      <div style={{ padding: 10, display: 'grid', gap: 6 }}>
        <L w={90} h={7} c={C.ink} />
        <L w="70%" h={4} />
        <div className="cell" style={{ height: 26, borderStyle: 'dashed' }} />
      </div>
      <div key={k} className="ce-dev mono">
        <div className="ce-tabs">
          <span>Elements</span>
          <span className="on">Console</span>
          <motion.i className="ce-badge" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4, type: 'spring', stiffness: 500, damping: 14 }}>
            1
          </motion.i>
        </div>
        <motion.div className="ce-line" {...fadeIn(0.3)}>
          &gt; 페이지 로드 완료
        </motion.div>
        <motion.div className="ce-line warn" {...fadeIn(0.8)}>
          ⚠ 이미지 크기가 커요
        </motion.div>
        <motion.div className="ce-line err" initial={{ opacity: 0 }} animate={{ opacity: 1, x: [0, -5, 5, -3, 3, 0] }} transition={{ delay: 1.4, duration: 0.4 }}>
          ✕ TypeError: user is undefined
        </motion.div>
      </div>
    </Win>
  )
}

export function Cache() {
  const k = useTick(3800)
  return (
    <div key={k}>
      <span className="mini-cap" style={{ position: 'absolute', left: 20, top: 18 }}>처음 방문</span>
      <div className="ca-node" style={{ left: 20, top: 34 }}>
        <Icon n="laptop" size={16} />
      </div>
      <div className="ca-node dark" style={{ left: 220, top: 34 }}>
        <Icon n="server" size={16} color="#fff" />
      </div>
      <Pkt initial={{ x: 66, opacity: 0 }} animate={{ x: [66, 190, 66], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.2, ease: 'easeInOut', opacity: { duration: 1.2, times: [0, 0.05, 0.95, 1] } }} style={{ top: 46 }}>
        이미지
      </Pkt>
      <motion.span className="ca-time" style={{ top: 82 }} {...fadeIn(1.2)}>1.2초 걸림</motion.span>

      <motion.div className="ca-cache" initial={{ background: '#ffffff' }} animate={{ background: '#FFEDE3', borderColor: C.acc }} transition={{ delay: 1.2 }}>
        <span className="mini-cap" style={{ color: C.acc }}>캐시</span>
        <span style={{ fontSize: 8.5 }}>이미지 저장됨</span>
      </motion.div>

      <span className="mini-cap" style={{ position: 'absolute', left: 20, top: 118 }}>다시 방문</span>
      <div className="ca-node" style={{ left: 20, top: 134 }}>
        <Icon n="laptop" size={16} />
      </div>
      <Pkt color={C.mint} initial={{ x: 66, opacity: 0 }} animate={{ x: [66, 86, 66], opacity: [0, 1, 1, 0] }} transition={{ delay: 1.8, duration: 0.3, opacity: { delay: 1.8, duration: 0.3 } }} style={{ top: 146 }}>
        이미지
      </Pkt>
      <motion.span className="ca-time fast" style={{ top: 182 }} {...fadeIn(2.1)}>0.01초 · 바로 꺼내 씀</motion.span>
    </div>
  )
}

export function Cors() {
  const ok = useStep(2, 2400) === 1
  return (
    <>
      <Node icon="laptop" label="myapp.site" x={46} y={60} />
      <Node icon="server" label="api.other.com" x={236} y={60} dark />
      <motion.div className="cors-wall" initial={false} animate={{ background: ok ? C.mint : '#ff4d4f' }}>
        <Icon n={ok ? 'globe' : 'lock'} size={12} color="#fff" />
      </motion.div>
      <Pkt key={'p' + ok} style={{ top: 72 }} initial={{ x: 70, opacity: 0 }} animate={ok ? { x: [70, 186], opacity: [0, 1, 1, 0] } : { x: [70, 116, 96], opacity: [0, 1, 1, 0.6] }} transition={{ duration: 0.9, ease: 'easeInOut' }}>
        요청
      </Pkt>
      <AnimatePresence mode="wait">
        <motion.div key={ok ? 'ok' : 'no'} className={'cors-msg' + (ok ? ' ok' : '')} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.8 }}>
          {ok ? '서버가 myapp.site를 허용함 → 통과' : 'CORS 오류 · 허락 안 된 주소라 막힘'}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
