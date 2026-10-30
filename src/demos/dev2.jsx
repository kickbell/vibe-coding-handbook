import { motion, AnimatePresence } from 'motion/react'
import { C, PALETTE, useStep, useTick, L, Win, Icon, Check } from './parts'
import { Pkt, Node, fadeIn } from './dev'

const sp = { type: 'spring', stiffness: 320, damping: 26 }
const pop = (delay) => ({ initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay, type: 'spring', stiffness: 500, damping: 16 } })
const Ok = ({ delay = 0, size = 16 }) => (
  <motion.span className="ag-ok" style={{ width: size, height: size }} {...pop(delay)}>
    <Check size={size * 0.56} color="#fff" width={4} />
  </motion.span>
)
// 왼쪽에서 오른쪽으로 날아가는 파일 조각
const Fly = ({ path, delay, children }) => (
  <motion.span className="fly-chip mono" style={{ offsetPath: `path('${path}')` }} initial={{ offsetDistance: '0%', opacity: 0 }} animate={{ offsetDistance: ['0%', '100%'], opacity: [1, 1, 0] }} transition={{ delay, duration: 0.8, ease: 'easeInOut' }}>
    {children}
  </motion.span>
)

/* ───────── GitHub ───────── */

export function GithubRepo() {
  const k = useTick(3600)
  return (
    <Win style={{ inset: '14px 18px' }}>
      <div className="repo-head">
        <Icon n="folder" size={11} />
        <b>me / my-app</b>
        <motion.span key={k} className="gh-star" initial={{ scale: 1 }} animate={{ scale: [1, 1.25, 1] }} transition={{ delay: 1.4, duration: 0.4 }}>
          ★ {12 + (k % 5)}
        </motion.span>
      </div>
      <div className="gh-tabs">
        <span className="on">Code</span>
        <span>Issues</span>
        <span>Pull requests</span>
      </div>
      <div key={'f' + k}>
        {['src/', 'package.json', 'README.md'].map((f, i) => (
          <motion.div key={f} className="repo-row" {...fadeIn(0.2 + i * 0.2)}>
            <Icon n={f.endsWith('/') ? 'folder' : 'file'} size={10} color="#8a857b" />
            {f}
            <span style={{ marginLeft: 'auto', fontSize: 8, color: '#a8a398' }}>{['2시간 전', '어제', '3일 전'][i]}</span>
          </motion.div>
        ))}
      </div>
      <div className="gh-note">Git = 저장 기록 · GitHub = 그 기록을 올려두는 온라인 보관소</div>
    </Win>
  )
}

const CLONE_PATH = 'M 110 62 C 150 62, 150 132, 180 138'
export function Clone() {
  const k = useTick(3600)
  const files = ['src/', 'README', 'package']
  return (
    <div key={k}>
      <svg viewBox="0 0 280 210" style={{ position: 'absolute', inset: 0 }}>
        <path d={CLONE_PATH} fill="none" stroke="#cfcac0" strokeWidth="2" strokeDasharray="5 6" />
      </svg>
      <div className="push-box dark" style={{ left: 18, top: 22 }}>
        <Icon n="cloud" size={16} color="#fff" />
        <b>GitHub 저장소</b>
        {files.map((f) => (
          <span key={f} className="mono cl-file dark">{f}</span>
        ))}
      </div>
      {files.map((f, i) => (
        <Fly key={f} path={CLONE_PATH} delay={0.4 + i * 0.35}>
          {f}
        </Fly>
      ))}
      <div className="push-box" style={{ left: 172, top: 92 }}>
        <Icon n="laptop" size={16} />
        <b>내 컴퓨터</b>
        {files.map((f, i) => (
          <motion.span key={f} className="mono cl-file" {...fadeIn(1.1 + i * 0.35)}>
            {f}
          </motion.span>
        ))}
      </div>
      <span className="chip mono" style={{ position: 'absolute', left: 116, top: 84 }}>
        git clone
      </span>
    </div>
  )
}

export function PullRequest() {
  const s = useStep(4, 1200)
  const merged = s === 3
  return (
    <Win style={{ inset: '22px 24px', padding: 14, display: 'grid', gap: 8, alignContent: 'start' }}>
      <div className="row" style={{ gap: 6 }}>
        <motion.span className="pr-state" initial={false} animate={{ background: merged ? C.ink : '#2ec4a0' }}>
          {merged ? 'Merged' : 'Open'}
        </motion.span>
        <b style={{ fontSize: 11.5 }}>버튼 색 변경 #12</b>
      </div>
      <span className="mono" style={{ fontSize: 8.5, color: '#8a857b' }}>
        feature/button → main
      </span>
      <div className="row" style={{ gap: 6, fontSize: 9.5, fontWeight: 600 }}>
        <span className="avatar" style={{ background: C.sky, width: 18, height: 18 }} />
        <AnimatePresence mode="wait">
          <motion.span key={s >= 1 ? 'y' : 'n'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: s >= 1 ? '#158a6c' : '#8a857b' }}>
            {s >= 1 ? '리뷰어가 승인했어요' : '리뷰 기다리는 중…'}
          </motion.span>
        </AnimatePresence>
      </div>
      <motion.span className={'bh ' + (merged ? 'secondary' : 'primary')} style={{ justifySelf: 'start', width: 110, marginTop: 4 }} animate={{ scale: s === 2 ? [1, 0.92, 1] : 1 }} transition={{ duration: 0.3 }}>
        {merged ? '합쳐졌어요 ✓' : 'Merge 하기'}
      </motion.span>
    </Win>
  )
}

export function MergeConflict() {
  const s = useStep(3, 1600)
  return (
    <>
      <motion.div className="mc-card" style={{ left: 16 }} initial={false} animate={{ x: s === 1 ? 26 : 0, opacity: s === 2 ? 0.35 : 1 }} transition={sp}>
        <span className="mini-cap">내 수정</span>
        <span className="mono">color: <b style={{ color: C.acc }}>orange</b></span>
      </motion.div>
      <motion.div className="mc-card" style={{ right: 16 }} initial={false} animate={{ x: s === 1 ? -26 : 0, opacity: s === 2 ? 0.35 : 1 }} transition={sp}>
        <span className="mini-cap">동료 수정</span>
        <span className="mono">color: <b style={{ color: C.sky }}>blue</b></span>
      </motion.div>
      <AnimatePresence mode="wait">
        {s === 1 && (
          <motion.div key="c" className="mc-boom" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1, x: [0, -4, 4, -2, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            같은 줄 충돌!
          </motion.div>
        )}
        {s === 2 && (
          <motion.div key="r" className="mc-result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Check size={11} color="#158a6c" width={3.4} />
            <span className="mono">color: orange</span> 하나를 골라 해결
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const FORK_PATH = 'M 110 74 C 140 30, 160 30, 172 74'
export function Fork() {
  const k = useTick(3600)
  const files = ['src/', 'README']
  return (
    <div key={k}>
      <svg viewBox="0 0 280 210" style={{ position: 'absolute', inset: 0 }}>
        <path d={FORK_PATH} fill="none" stroke="#cfcac0" strokeWidth="2" strokeDasharray="5 6" />
      </svg>
      <div className="push-box dark" style={{ left: 18, top: 64 }}>
        <Icon n="cloud" size={16} color="#fff" />
        <b>회사 / app</b>
        {files.map((f) => (
          <span key={f} className="mono cl-file dark">{f}</span>
        ))}
      </div>
      {files.map((f, i) => (
        <Fly key={f} path={FORK_PATH} delay={0.4 + i * 0.35}>
          {f}
        </Fly>
      ))}
      <motion.div className="push-box" style={{ left: 172, top: 64, borderColor: C.acc }} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <Icon n="cloud" size={16} color={C.acc} />
        <b>me / app</b>
        {files.map((f, i) => (
          <motion.span key={f} className="mono cl-file" {...fadeIn(1.1 + i * 0.35)}>
            {f}
          </motion.span>
        ))}
      </motion.div>
      <motion.span className="chip" style={{ position: 'absolute', left: 50, right: 50, top: 164, textAlign: 'center' }} {...fadeIn(1.8)}>
        남의 저장소를 내 계정으로 통째로 복사
      </motion.span>
    </div>
  )
}

const GI_ITEMS = [
  ['src/', 112, true],
  ['.env', 160, false],
  ['node_modules', 198, false],
]
export function Gitignore() {
  const k = useTick(3800)
  return (
    <div key={k}>
      <div className="gi-cloud">
        <Icon n="cloud" size={14} color="#fff" /> GitHub에 올라감
      </div>
      <div className="gi-file mono">
        <span className="md-tab">.gitignore</span>
        <div>.env</div>
        <div>node_modules/</div>
      </div>
      {GI_ITEMS.map(([t, x, ok], i) => (
        <motion.span
          key={t}
          className="gi-chip mono"
          style={{ left: x, top: 0 }}
          initial={{ y: 168 }}
          animate={ok ? { y: [168, 62] } : { y: [168, 110, 128], borderColor: ['#e7e3da', '#e7e3da', '#ff4d4f'], color: ['#1f1f24', '#1f1f24', '#e5484d'] }}
          transition={{ delay: 0.4 + i * 0.4, duration: 0.8, ease: 'easeInOut' }}
        >
          {t}
        </motion.span>
      ))}
      {GI_ITEMS.filter(([, , ok]) => !ok).map(([t, x], i) => (
        <motion.span key={t} className="gi-x" style={{ left: x + 8, top: 92 }} {...pop(1.6 + i * 0.4)}>
          <Icon n="x" size={9} color="#fff" w={3.4} />
        </motion.span>
      ))}
    </div>
  )
}

const STEPS = ['테스트', '빌드', '배포']
export function GithubActions() {
  const k = useTick(4400)
  return (
    <div key={k}>
      <div className="row" style={{ position: 'absolute', left: 18, right: 18, top: 22, gap: 8 }}>
        <span className="chip mono">git push</span>
        <motion.span className="st-arr" {...fadeIn(0.3)}>→</motion.span>
        <motion.span className="ga-box" {...fadeIn(0.5)}>
          <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ display: 'grid' }}>
            <Icon n="gear" size={13} color="#fff" />
          </motion.span>
          Actions 자동 실행
        </motion.span>
      </div>
      <div className="ga-steps">
        {STEPS.map((t, i) => (
          <motion.div key={t} className="ag-row" initial={{ opacity: 0.35 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.8 }}>
            <span style={{ width: 16, fontSize: 9, color: '#a8a398' }} className="mono">
              {i + 1}
            </span>
            <span>{t}</span>
            <Ok delay={1.2 + i * 0.8} />
          </motion.div>
        ))}
      </div>
      <motion.span className="chip" style={{ position: 'absolute', left: 60, right: 60, top: 176, textAlign: 'center', color: '#158a6c' }} {...fadeIn(3.4)}>
        사람이 손대지 않아도 끝!
      </motion.span>
    </div>
  )
}

/* ───────── 기술 이름 ───────── */

const LAYERS = [
  ['HTML', '뼈대'],
  ['CSS', '옷'],
  ['JS', '움직임'],
]
export function HtmlCssJs() {
  const s = useStep(3, 1600)
  const styled = s >= 1
  return (
    <>
      <div className="row" style={{ position: 'absolute', left: 0, right: 0, top: 16, justifyContent: 'center', gap: 6 }}>
        {LAYERS.map(([n, d], i) => (
          <motion.span key={n} className="hcj-tag" initial={false} animate={{ background: s === i ? C.ink : '#ffffff', color: s === i ? '#ffffff' : '#6b665d' }}>
            <b>{n}</b> {d}
          </motion.span>
        ))}
      </div>
      <motion.div className="hcj-page" initial={false} animate={{ background: styled ? '#FFF3EA' : '#ffffff', borderStyle: styled ? 'solid' : 'dashed' }}>
        <motion.div initial={false} animate={{ height: 10, width: 110, background: styled ? C.ink : '#e2ded5', borderRadius: styled ? 99 : 2 }} />
        <motion.div initial={false} animate={{ height: 5, width: 150, background: styled ? '#bdb8ad' : '#e2ded5', borderRadius: styled ? 99 : 2 }} />
        <motion.div className="hcj-btn" initial={false} animate={{ background: styled ? C.acc : '#ffffff', color: styled ? '#ffffff' : '#6b665d', borderRadius: styled ? 99 : 2, scale: s === 2 ? [1, 0.9, 1] : 1 }} transition={{ scale: { duration: 0.3, delay: 0.4 } }}>
          버튼
        </motion.div>
        <AnimatePresence>
          {s === 2 && (
            <motion.span className="hcj-toast" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.6 }}>
              눌렸어요!
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

export function LibraryFramework() {
  const fw = useStep(2, 2800) === 1
  return (
    <>
      <div className="row" style={{ position: 'absolute', left: 0, right: 0, top: 14, justifyContent: 'center', gap: 6 }}>
        {['Library', 'Framework'].map((t, i) => (
          <motion.span key={t} className="hcj-tag" initial={false} animate={{ background: fw === !!i ? C.ink : '#ffffff', color: fw === !!i ? '#ffffff' : '#6b665d' }}>
            <b>{t}</b>
          </motion.span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {fw ? (
          <motion.div key="fw" className="lf-box" style={{ borderStyle: 'solid', borderColor: C.ink }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="mini-cap">정해진 틀 (예: Next.js)</span>
            <div className="lf-rooms">
              {['페이지', '주소 규칙', '서버'].map((r, i) => (
                <div key={r} className="lf-room">
                  <span>{r}</span>
                  <motion.i style={{ background: PALETTE[i] }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4 + i * 0.3 }} />
                </div>
              ))}
            </div>
            <span className="lf-cap">틀은 이미 있고, 빈칸에 내용만 채워요</span>
          </motion.div>
        ) : (
          <motion.div key="lib" className="lf-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="mini-cap">내가 짓는 집</span>
            <div className="lf-free">
              {['React', '날짜', '차트'].map((t, i) => (
                <motion.span key={t} className="lf-tool mono" style={{ background: PALETTE[i] }} initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.3, ...sp }}>
                  {t}
                </motion.span>
              ))}
            </div>
            <span className="lf-cap">필요한 도구만 골라 내 방식대로 써요</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function TypeScript() {
  const s = useStep(3, 1500)
  return (
    <div style={{ position: 'absolute', left: 22, right: 22, top: 44, display: 'grid', gap: 10 }}>
      <div className="ts-code mono">
        <span style={{ color: '#8fc1ff' }}>let</span> age<span style={{ color: '#7ee0c3' }}>: number</span> ={' '}
        <AnimatePresence mode="wait">
          <motion.span key={s === 2 ? 'ok' : 'bad'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={s === 1 ? 'ts-err' : ''} style={{ color: s === 2 ? '#7ee0c3' : '#ffc43d' }}>
            {s === 2 ? '20' : '"스물"'}
          </motion.span>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        {s === 1 && (
          <motion.div key="e" className="ts-tip" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            ✕ 숫자 자리에 글자를 넣었어요 (실행 전에 미리 알려줌)
          </motion.div>
        )}
        {s === 2 && (
          <motion.div key="o" className="ts-tip ok" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Check size={10} color="#158a6c" width={3.4} /> 종류(타입)가 맞아요
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const TW = ['bg-orange-500', 'text-white', 'rounded-full', 'px-6 py-2', 'shadow-lg']
export function Tailwind() {
  const n = Math.min(useStep(7, 800), 5)
  return (
    <>
      <div className="tw-code mono">
        className="
        {TW.slice(0, n).map((c, i) => (
          <motion.span key={c} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ color: i === n - 1 ? C.acc : '#ffc43d' }}>
            {(i ? ' ' : '') + c}
          </motion.span>
        ))}
        "
      </div>
      <div className="center" style={{ top: 50 }}>
        <motion.span
          className="tw-btn"
          initial={false}
          animate={{
            background: n >= 1 ? C.acc : '#eeeeee',
            color: n >= 2 ? '#ffffff' : '#333333',
            borderRadius: n >= 3 ? 99 : 3,
            paddingLeft: n >= 4 ? 26 : 8,
            paddingRight: n >= 4 ? 26 : 8,
            paddingTop: n >= 4 ? 9 : 4,
            paddingBottom: n >= 4 ? 9 : 4,
            boxShadow: n >= 5 ? '0 10px 22px rgba(255,107,44,.4)' : '0 0 0 rgba(0,0,0,0)',
          }}
          transition={{ duration: 0.35 }}
        >
          시작하기
        </motion.span>
      </div>
    </>
  )
}

export function NodeJs() {
  const k = useTick(4200)
  return (
    <div key={k}>
      <motion.span className="chip mono" style={{ position: 'absolute', left: 22, top: 30 }} initial={{ x: 0 }} animate={{ x: [0, 74, 74], opacity: [1, 1, 0] }} transition={{ delay: 0.3, duration: 0.9, times: [0, 0.7, 1] }}>
        server.js
      </motion.span>
      <div className="node-hex">
        <motion.span animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} style={{ display: 'grid' }}>
          <Icon n="gear" size={18} color="#fff" />
        </motion.span>
        <b>Node.js</b>
      </div>
      <span className="mini-cap" style={{ position: 'absolute', left: 168, top: 34, width: 96 }}>
        브라우저 밖, 내 컴퓨터에서 JS를 실행하는 엔진
      </span>
      <div className="term" style={{ inset: 'auto 22px 18px', height: 76 }}>
        <div className="term-body mono" style={{ paddingTop: 8 }}>
          <motion.div {...fadeIn(1.2)}>
            <span style={{ color: '#2EC4A0' }}>$</span> node server.js
          </motion.div>
          <motion.div style={{ color: '#8fc1ff' }} {...fadeIn(1.8)}>
            서버 실행 중 → localhost:4000
          </motion.div>
          <motion.div style={{ color: '#9a958b' }} {...fadeIn(2.3)}>
            npm도 Node.js와 함께 설치돼요
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export function LoginAuth() {
  const s = useStep(4, 1100)
  const done = s === 3
  return (
    <>
      <Win style={{ left: 16, top: 30, width: 128, height: 150, padding: 12, display: 'grid', gap: 7, alignContent: 'center' }}>
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="d" style={{ display: 'grid', gap: 6, justifyItems: 'center' }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <span className="av big" style={{ background: C.coral, width: 38, height: 38 }}>B</span>
              <b style={{ fontSize: 10.5 }}>안녕하세요, 바이브님</b>
            </motion.div>
          ) : (
            <motion.div key="f" style={{ display: 'grid', gap: 7 }} exit={{ opacity: 0 }}>
              <b style={{ fontSize: 11 }}>로그인</b>
              <div className="tf" style={{ height: 26, fontSize: 9 }}>
                vibe@mail.com
              </div>
              <motion.span className="btn-mini acc" style={{ justifyContent: 'center' }} animate={{ scale: s === 1 ? [1, 0.9, 1] : 1 }} transition={{ duration: 0.3 }}>
                로그인
              </motion.span>
              <span className="btn-mini ghost" style={{ justifyContent: 'center' }}>
                소셜 계정으로 계속
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </Win>
      <Node icon="lock" label={done ? '확인 완료' : '본인 확인'} x={222} y={66} dark />
      {s === 2 && (
        <Pkt initial={{ x: 148, opacity: 0 }} animate={{ x: [148, 186], opacity: [0, 1, 1, 0] }} transition={{ duration: 0.9 }} style={{ top: 82 }}>
          비밀번호
        </Pkt>
      )}
    </>
  )
}

export function DevProd() {
  const k = useTick(4200)
  return (
    <div key={k}>
      <div className="env-box" style={{ left: 14 }}>
        <span className="env-tag" style={{ background: '#fff3d1', color: '#a87a00' }}>개발</span>
        <span className="mono" style={{ fontSize: 8 }}>localhost:4000</span>
        <L w="80%" h={4} />
        <L w="60%" h={4} />
        <span style={{ fontSize: 8.5, color: '#8a857b' }}>테스트 데이터 · 나만 봄</span>
      </div>
      <div className="env-box" style={{ right: 14 }}>
        <span className="env-tag" style={{ background: '#dff6ee', color: '#158a6c' }}>운영</span>
        <span className="mono" style={{ fontSize: 8 }}>myapp.site</span>
        <L w="80%" h={4} />
        <L w="60%" h={4} />
        <span style={{ fontSize: 8.5, color: '#8a857b' }}>실제 사용자 1,204명</span>
        <motion.span className="env-new" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6, type: 'spring', stiffness: 500, damping: 16 }}>
          새 버전
        </motion.span>
      </div>
      <Pkt color={C.acc} initial={{ x: 120, opacity: 0 }} animate={{ x: [120, 136], opacity: [0, 1, 1, 0] }} transition={{ delay: 0.6, duration: 0.9 }} style={{ top: 96 }}>
        배포
      </Pkt>
      <motion.span className="chip" style={{ position: 'absolute', left: 30, right: 30, top: 172, textAlign: 'center' }} {...fadeIn(2)}>
        내 컴퓨터에선 되는데 배포하면 안 되는 이유가 여기서 생겨요
      </motion.span>
    </div>
  )
}

/* ───────── 문제 상황 (추가) ───────── */

const BugIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" strokeWidth="2" strokeLinecap="round">
    <ellipse cx="12" cy="13" rx="5" ry="6" fill="#ff4d4f" />
    <path d="M12 7V5M7 10L4 8M17 10l3-2M7 14H4M17 14h3M7 18l-3 2M17 18l3 2" />
  </svg>
)
export function BugDebugging() {
  const k = useTick(4200)
  return (
    <div key={k} className="term" style={{ inset: 22 }}>
      <div className="term-top">
        <i style={{ background: '#ff5f57' }} />
        <i style={{ background: '#febc2e' }} />
        <i style={{ background: '#28c840' }} />
      </div>
      <div style={{ position: 'relative', padding: '14px 14px', display: 'grid', gap: 10 }}>
        {[90, 130, 110, 70, 120].map((w, i) => (
          <motion.span key={i} style={{ display: 'block', height: 5, borderRadius: 99, width: w, marginLeft: (i % 2) * 12 }} initial={{ background: '#3a3a42' }} animate={{ background: i === 2 ? ['#3a3a42', '#3a3a42', '#ff4d4f', '#2ec4a0'] : '#3a3a42' }} transition={{ duration: 2.8, times: [0, 0.3, 0.55, 0.9] }} />
        ))}
        <motion.span style={{ position: 'absolute', top: 40 }} initial={{ x: 10 }} animate={{ x: [10, 90, 90], scale: [1, 1, 0], rotate: [0, 0, 90] }} transition={{ duration: 2.6, times: [0, 0.55, 0.85] }}>
          <BugIcon />
        </motion.span>
        <motion.span className="dbg-glass" initial={{ x: 190, y: 90, opacity: 0 }} animate={{ x: [190, 96], y: [90, 32], opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}>
          <Icon n="search" size={22} color="#ffc43d" w={2.6} />
        </motion.span>
      </div>
      <motion.span className="chip" style={{ position: 'absolute', right: 12, bottom: 10, color: '#158a6c' }} {...fadeIn(2.6)}>
        버그 잡음!
      </motion.span>
    </div>
  )
}

const MESSY = [
  [10, 6, 70],
  [40, 26, 46],
  [4, 50, 90],
  [28, 74, 34],
  [16, 96, 60],
]
const TIDY = [
  [6, 6, 80],
  [6, 26, 80],
  [6, 46, 80],
  [6, 66, 80],
  [6, 86, 80],
]
export function Refactoring() {
  const tidy = useStep(2, 1800) === 1
  return (
    <>
      <div className="rf-code">
        <span className="mini-cap" style={{ position: 'absolute', top: -16, left: 0 }}>
          {tidy ? '정리된 코드' : '뒤죽박죽 코드'}
        </span>
        {MESSY.map((m, i) => {
          const [x, y, w] = tidy ? TIDY[i] : m
          return <motion.span key={i} className="rf-line" style={{ background: PALETTE[i] }} initial={false} animate={{ x, y, width: w }} transition={sp} />
        })}
      </div>
      <span className="st-arr" style={{ position: 'absolute', left: 140, top: 100 }}>
        →
      </span>
      <div className="rf-out">
        <span className="mini-cap">화면 결과</span>
        <span className="btn-mini acc">시작하기</span>
        <span style={{ fontSize: 8.5, color: '#158a6c', fontWeight: 700 }}>똑같아요 ✓</span>
      </div>
    </>
  )
}

export function DependencyConflict() {
  const s = useStep(3, 1600)
  const bad = s === 1
  const lineColor = s === 0 ? '#cfcac0' : bad ? '#ff4d4f' : '#2ec4a0'
  return (
    <>
      <svg viewBox="0 0 280 210" style={{ position: 'absolute', inset: 0 }}>
        <motion.line x1="78" y1="150" x2="140" y2="78" strokeWidth="2.5" initial={false} animate={{ stroke: lineColor }} />
        <motion.line x1="202" y1="150" x2="140" y2="78" strokeWidth="2.5" initial={false} animate={{ stroke: lineColor }} />
      </svg>
      <motion.div className="dep-core" animate={{ x: bad ? [0, -5, 5, -3, 3, 0] : 0 }} transition={{ duration: 0.5 }}>
        <b>React</b>
        <span className="mono">{s === 2 ? 'v19' : 'v18 ? v19 ?'}</span>
      </motion.div>
      <div className="dep-pkg" style={{ left: 30 }}>
        <b>A 라이브러리</b>
        <AnimatePresence mode="wait">
          <motion.span key={s === 2 ? 'n' : 'o'} className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: s === 2 ? '#158a6c' : undefined }}>
            {s === 2 ? 'React 19 ✓ (업데이트)' : 'React 18 필요'}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="dep-pkg" style={{ right: 30 }}>
        <b>B 라이브러리</b>
        <span className="mono">React 19 필요</span>
      </div>
      <AnimatePresence>
        {bad && (
          <motion.span className="cors-msg" style={{ top: 22, left: 70, right: 70 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            버전 충돌!
          </motion.span>
        )}
      </AnimatePresence>
    </>
  )
}

export function ErrorPages() {
  const s = useStep(2, 2000)
  return (
    <Win style={{ inset: '16px 22px' }}>
      <div className="navbar" style={{ height: 26 }}>
        <span className="mono" style={{ fontSize: 8.5, color: '#8a857b' }}>
          {s === 0 ? 'myapp.site/abuot' : 'myapp.site/orders'}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={s} className="err-page" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <b className="err-code" style={{ color: s === 0 ? C.sky : '#e5484d' }}>
            {s === 0 ? '404' : '500'}
          </b>
          <span style={{ fontSize: 11, fontWeight: 700 }}>{s === 0 ? '페이지를 찾을 수 없어요' : '서버에 문제가 생겼어요'}</span>
          <span className="chip">{s === 0 ? '주소가 없음 · 오타나 지워진 페이지' : '서버가 고장 · 코드나 설정 문제'}</span>
        </motion.div>
      </AnimatePresence>
    </Win>
  )
}
