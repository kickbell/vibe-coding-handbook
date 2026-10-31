import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'motion/react'
import { Shell, EventLog, useEventLog, Slider, Segmented, Toggle } from '../components/kit'
import { C, PALETTE, ease, Icon } from '../demos/parts'

// 휴대폰 모양 틀
export const PgPhone = ({ children, className = '' }) => (
  <div className={'pg-phone-frame ' + className}>
    <span className="pg-phone-notch" />
    {children}
  </div>
)

/* ───────── Hero Section ───────── */

const HERO_BG = {
  plain: '#fff7f1',
  grad: 'linear-gradient(135deg, #ffe1cf, #ffd0e4 50%, #d7e8ff)',
  dark: 'linear-gradient(160deg, #1f1f24, #3a2c3c)',
}

function HeroSectionPG() {
  const [height, setHeight] = useState(80)
  const [align, setAlign] = useState('center')
  const [bg, setBg] = useState('grad')
  const [two, setTwo] = useState(true)
  const { logs, push, clear } = useEventLog()
  const dark = bg === 'dark'

  const bgKo = { plain: '연한 주황 단색', grad: '주황·분홍·하늘색이 섞인 그라데이션', dark: '어두운 그라데이션' }[bg]
  const prompt = `랜딩 페이지 맨 위에 히어로 섹션(Hero Section)을 만들어줘. 화면 높이의 ${height}%를 차지하고, 배경은 ${bgKo}. 큰 제목 "일을 더 가볍게", 한 줄 설명, ${two ? '주황색 "무료로 시작하기" 버튼과 테두리만 있는 "둘러보기" 버튼' : '주황색 "무료로 시작하기" 버튼 하나'}를 ${align === 'center' ? '가운데 정렬' : '왼쪽 정렬'}로 배치해줘. 모바일에서는 제목 크기를 줄여줘.`

  return (
    <Shell
      hint="버튼을 눌러보고 아래 값을 바꿔보세요"
      stage={
        <div className="pg-page">
          <div className="pg-page-nav">
            <b>Lighty</b>
            <span>기능</span>
            <span>요금</span>
          </div>
          <motion.div className={'pg-hero ' + align} style={{ background: HERO_BG[bg], color: dark ? '#fff' : C.ink }} animate={{ height: `${(height / 100) * 280}px` }} transition={{ duration: 0.4, ease }}>
            <span className="pg-hero-eye" style={{ color: dark ? '#ffb38f' : C.acc }}>
              NEW · 팀 협업 기능 출시
            </span>
            <b>일을 더 가볍게</b>
            <p style={{ color: dark ? 'rgba(255,255,255,.7)' : '#6e6a62' }}>흩어진 할 일을 한곳에 모으고, 팀과 바로 나눠요.</p>
            <div className="pg-hero-btns">
              <button className="btn" style={{ background: C.acc }} onClick={() => push('end', "'무료로 시작하기' 클릭 → 가입 페이지로")}>
                무료로 시작하기
              </button>
              {two && (
                <button className={'btn ghost' + (dark ? ' on-dark' : '')} onClick={() => push('move', "'둘러보기' 클릭 → 기능 소개로 스크롤")}>
                  둘러보기
                </button>
              )}
            </div>
          </motion.div>
        </div>
      }
      controls={
        <>
          <Slider label="화면 높이 중 차지하는 비율" value={height} min={50} max={100} step={5} unit="%" onChange={setHeight} />
          <Segmented label="정렬" value={align} onChange={setAlign} options={[{ value: 'center', label: '가운데' }, { value: 'left', label: '왼쪽' }]} />
          <Segmented label="배경" value={bg} onChange={setBg} options={[{ value: 'plain', label: '단색' }, { value: 'grad', label: '그라데이션' }, { value: 'dark', label: '어둡게' }]} />
          <Toggle label="보조 버튼도 넣기" value={two} onChange={setTwo} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Responsive Layout ───────── */

function ResponsivePG() {
  const [w, setW] = useState(100)
  const [tablet, setTablet] = useState(1024)
  const [mobile, setMobile] = useState(768)
  const [desk, setDesk] = useState(3)
  const box = useRef(null)
  const drag = useRef(false)
  const { logs, push, clear } = useEventLog()
  const px = Math.round(320 + (w / 100) * (1440 - 320))
  const cols = px >= tablet ? desk : px >= mobile ? 2 : 1
  const mode = px >= tablet ? '데스크톱' : px >= mobile ? '태블릿' : '모바일'
  const prev = useRef(mode)
  useEffect(() => {
    if (prev.current !== mode) push('move', `${px}px → ${mode} 화면, ${cols}열로 바뀜`)
    prev.current = mode
  }, [mode, px, cols, push])

  const onMove = (e) => {
    if (!drag.current) return
    const r = box.current.getBoundingClientRect()
    setW(Math.max(0, Math.min(100, ((e.clientX - r.left - 120) / (r.width - 120)) * 100)))
  }

  const prompt = `카드 목록을 반응형(Responsive Layout)으로 만들어줘. 화면 폭이 ${tablet}px 이상이면 ${desk}열, ${mobile}px 이상 ${tablet}px 미만이면 2열, ${mobile}px 미만(모바일)이면 1열. CSS Grid와 미디어 쿼리(@media) 사용, 카드 사이 간격은 화면이 좁을수록 조금씩 줄여줘.`

  return (
    <Shell
      hint="오른쪽 손잡이를 끌어 화면 폭을 바꿔보세요"
      stage={
        <div className="pg-resp" ref={box} onPointerMove={onMove} onPointerUp={() => (drag.current = false)} onPointerLeave={() => (drag.current = false)}>
          <div className="pg-resp-frame" style={{ width: `calc(120px + (100% - 120px) * ${w / 100})` }}>
            <div className="pg-resp-bar">
              <span className="mono">{px}px</span>
              <b>{mode}</b>
            </div>
            <div className="pg-resp-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {PALETTE.concat(C.sky).map((c, i) => (
                <motion.div key={i} layout transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                  <span style={{ background: c }} />
                  <i />
                </motion.div>
              ))}
            </div>
            <span className="pg-resp-handle" onPointerDown={(e) => ((drag.current = true), e.preventDefault())} />
          </div>
        </div>
      }
      controls={
        <>
          <div className="presets">
            {[
              ['모바일 390', 6],
              ['태블릿 820', 44],
              ['데스크톱 1280', 86],
            ].map(([l, v]) => (
              <button key={l} className="chip-btn" onClick={() => setW(v)}>
                {l}
              </button>
            ))}
          </div>
          <Slider label="데스크톱 기준 (이상)" value={tablet} min={900} max={1280} step={4} unit="px" onChange={setTablet} />
          <Slider label="모바일 기준 (미만)" value={mobile} min={480} max={880} step={4} unit="px" onChange={setMobile} />
          <Slider label="데스크톱 열 수" value={desk} min={3} max={4} step={1} unit="열" onChange={setDesk} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Card Layout ───────── */

const PRODUCTS = [
  ['린넨 셔츠', '29,000원'],
  ['여름 원피스', '39,000원'],
  ['스트랩 샌들', '45,000원'],
  ['캔버스 백', '19,000원'],
  ['버킷햇', '15,000원'],
  ['니트 조끼', '33,000원'],
]

function CardLayoutPG() {
  const [cols, setCols] = useState(3)
  const [radius, setRadius] = useState(16)
  const [shadow, setShadow] = useState(1)
  const [gap, setGap] = useState(12)
  const { logs, push, clear } = useEventLog()
  const sh = ['none', '0 2px 6px rgba(30,20,10,.06)', '0 10px 24px rgba(30,20,10,.12)'][shadow]

  const prompt = `상품을 카드 레이아웃(Card Layout)으로 보여줘. 한 줄에 ${cols}개씩, 카드 사이 간격 ${gap}px. 각 카드는 위에 정사각형 이미지, 아래에 이름과 가격. 모서리는 ${radius}px 둥글게${shadow ? `, ${shadow === 2 ? '진한' : '옅은'} 그림자` : ', 그림자 없이 얇은 테두리만'}. 카드 전체를 누르면 상세 페이지로 이동.`

  return (
    <Shell
      hint="카드를 눌러보세요"
      stage={
        <div className="pg-cards" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>
          {PRODUCTS.slice(0, cols * 2).map(([n, p], i) => (
            <motion.button layout key={n} className="pg-pcard" style={{ borderRadius: radius, boxShadow: sh }} whileTap={{ scale: 0.97 }} onClick={() => push('open', `'${n}' 카드 → 상세 페이지로`)}>
              <span style={{ background: PALETTE[i % 5], borderRadius: Math.max(0, radius - 6) }} />
              <b>{n}</b>
              <em>{p}</em>
            </motion.button>
          ))}
        </div>
      }
      controls={
        <>
          <Slider label="한 줄에 몇 개" value={cols} min={1} max={3} step={1} unit="개" onChange={setCols} />
          <Slider label="모서리 둥글기" value={radius} min={0} max={28} step={2} unit="px" onChange={setRadius} />
          <Slider label="카드 사이 간격" value={gap} min={4} max={28} step={2} unit="px" onChange={setGap} />
          <Segmented label="그림자" value={shadow} onChange={setShadow} options={[{ value: 0, label: '없음' }, { value: 1, label: '옅게' }, { value: 2, label: '진하게' }]} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Bento Grid ───────── */

const BENTO_SIZES = [
  [1, 1],
  [2, 1],
  [1, 2],
  [2, 2],
]
const BENTO_ITEMS = ['AI 요약', '팀 공유', '캘린더', '알림', '통계']

function BentoPG() {
  const [sizes, setSizes] = useState([3, 0, 2, 0, 1])
  const [gap, setGap] = useState(10)
  const [radius, setRadius] = useState(18)
  const { logs, push, clear } = useEventLog()

  const cycle = (i) => {
    const next = (sizes[i] + 1) % 4
    setSizes(sizes.map((s, j) => (j === i ? next : s)))
    push('move', `'${BENTO_ITEMS[i]}' 칸 크기 → ${BENTO_SIZES[next].join('x')}`)
  }
  const desc = BENTO_ITEMS.map((n, i) => `${n} ${BENTO_SIZES[sizes[i]].join('x')}`).join(', ')
  const prompt = `기능 소개를 벤토 그리드(Bento Grid)로 만들어줘. 4열 격자에 칸 크기를 다르게: ${desc} (가로x세로 칸 수). 칸 사이 간격 ${gap}px, 모서리 ${radius}px 둥글게, 빈 칸 없이 채우도록 grid-auto-flow: dense. 모바일에서는 2열로.`

  return (
    <Shell
      hint="칸을 누르면 크기가 바뀌어요"
      stage={
        <div className="pg-bento" style={{ gap }}>
          {BENTO_ITEMS.map((n, i) => {
            const [c, r] = BENTO_SIZES[sizes[i]]
            return (
              <motion.button layout key={n} className="pg-bento-cell" style={{ gridColumn: `span ${c}`, gridRow: `span ${r}`, borderRadius: radius }} transition={{ type: 'spring', stiffness: 260, damping: 28 }} onClick={() => cycle(i)}>
                <span style={{ background: PALETTE[i % 5] }} />
                <b>{n}</b>
                <em className="mono">
                  {c}x{r}
                </em>
              </motion.button>
            )
          })}
        </div>
      }
      controls={
        <>
          <Slider label="칸 사이 간격" value={gap} min={2} max={24} step={1} unit="px" onChange={setGap} />
          <Slider label="모서리 둥글기" value={radius} min={0} max={32} step={2} unit="px" onChange={setRadius} />
          <button
            className="btn"
            onClick={() => {
              setSizes([3, 0, 2, 0, 1])
              push('option', '처음 배치로')
            }}
          >
            처음 배치로
          </button>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Sidebar Layout ───────── */

const SIDE_MENU = [
  ['home', '대시보드'],
  ['box', '주문'],
  ['user', '고객'],
  ['gear', '설정'],
]

function SidebarPG() {
  const [active, setActive] = useState(0)
  const [width, setWidth] = useState(170)
  const [side, setSide] = useState('left')
  const [collapsed, setCollapsed] = useState(false)
  const { logs, push, clear } = useEventLog()
  const w = collapsed ? 56 : width

  const prompt = `관리자 대시보드를 사이드바 레이아웃(Sidebar Layout)으로 만들어줘. ${side === 'left' ? '왼쪽' : '오른쪽'}에 너비 ${width}px 고정 메뉴(대시보드/주문/고객/설정), 현재 메뉴는 주황 배경으로 강조. 위쪽 버튼을 누르면 아이콘만 남는 56px로 접히고 다시 펼쳐지게(너비가 부드럽게 변하게). 나머지 영역은 콘텐츠, 모바일에서는 사이드바를 숨기고 햄버거 메뉴로.`

  return (
    <Shell
      hint="메뉴를 누르고, ‹ 버튼으로 접어보세요"
      stage={
        <div className={'pg-side ' + side}>
          <motion.nav animate={{ width: w }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
            <button
              className="pg-side-fold"
              onClick={() => {
                setCollapsed(!collapsed)
                push(collapsed ? 'open' : 'close', collapsed ? '사이드바 펼침' : '사이드바 접힘 (아이콘만)')
              }}
            >
              {(side === 'left') !== collapsed ? '‹' : '›'}
            </button>
            {SIDE_MENU.map(([ic, t], i) => (
              <button
                key={t}
                className={i === active ? 'on' : ''}
                title={t}
                onClick={() => {
                  setActive(i)
                  push('move', `'${t}' 메뉴 → 오른쪽 내용 바뀜`)
                }}
              >
                {i === active && <motion.span layoutId="pg-side-ind" className="pg-side-ind" />}
                <Icon n={ic} size={17} style={{ position: 'relative', flexShrink: 0 }} />
                {!collapsed && <span style={{ position: 'relative' }}>{t}</span>}
              </button>
            ))}
          </motion.nav>
          <main>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <b>{SIDE_MENU[active][1]}</b>
                <div className="pg-side-stats">
                  {[0, 1, 2].map((j) => (
                    <span key={j} style={{ background: PALETTE[(active + j) % 5] }} />
                  ))}
                </div>
                <i />
                <i style={{ width: '70%' }} />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      }
      controls={
        <>
          <Slider label="사이드바 너비" value={width} min={130} max={240} step={10} unit="px" onChange={setWidth} />
          <Segmented label="위치" value={side} onChange={setSide} options={[{ value: 'left', label: '왼쪽' }, { value: 'right', label: '오른쪽' }]} />
          <Toggle label="접기 (아이콘만)" value={collapsed} onChange={setCollapsed} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Sticky Header ───────── */

function StickyHeaderPG() {
  const [sticky, setSticky] = useState(true)
  const [shadow, setShadow] = useState(true)
  const [hide, setHide] = useState(false)
  const [blur, setBlur] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const root = useRef(null)
  const { logs, push, clear } = useEventLog()
  const { scrollY } = useScroll({ container: root })

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    const s = y > 8
    if (s !== scrolled) {
      setScrolled(s)
      push(s ? 'start' : 'end', s ? '스크롤 시작 → 헤더 아래 그림자' : '맨 위 → 그림자 없앰')
    }
    const h = hide && y > 60 && y > prev
    if (h !== hidden && Math.abs(y - prev) > 2) {
      setHidden(h)
      push(h ? 'close' : 'open', h ? '아래로 스크롤 → 헤더 숨김' : '위로 스크롤 → 헤더 다시 보임')
    }
  })

  const prompt = `헤더를 ${sticky ? 'sticky로 만들어서 스크롤해도 화면 맨 위에 붙어 있게' : '일반 헤더로 (스크롤하면 같이 올라가게)'} 해줘.${sticky && shadow ? ' 스크롤이 시작되면 헤더 아래에 옅은 그림자가 생기게.' : ''}${sticky && blur ? ' 배경은 반투명 흰색 + backdrop-filter: blur(12px)로 뒤 내용이 흐리게 비치게.' : ''}${sticky && hide ? ' 아래로 스크롤할 땐 헤더를 위로 숨기고, 조금이라도 위로 스크롤하면 다시 내려오게.' : ''}`

  return (
    <Shell
      hint="안쪽 화면을 스크롤해 보세요"
      stage={
        <div className="pg-scroller" ref={root}>
          <motion.header
            className="pg-sticky-h"
            style={{ position: sticky ? 'sticky' : 'relative', background: sticky && blur ? 'rgba(255,255,255,.72)' : '#fff', backdropFilter: sticky && blur ? 'blur(12px)' : 'none', WebkitBackdropFilter: sticky && blur ? 'blur(12px)' : 'none' }}
            animate={{ y: sticky && hidden ? '-100%' : '0%', boxShadow: sticky && shadow && scrolled ? '0 6px 16px rgba(30,20,10,.12)' : '0 0 0 rgba(0,0,0,0)' }}
            transition={{ duration: 0.25 }}
          >
            <b>MyBlog</b>
            <span>글</span>
            <span>소개</span>
          </motion.header>
          <div className="pg-sticky-body">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="pg-sticky-row">
                <span style={{ background: PALETTE[i % 5] }} />
                <div>
                  <b>{['바이브코딩 첫날', '헤더 고정하기', '색 고르는 법', '카드 정렬', '모바일 대응', '배포 후기', '폰트 고르기', '애니메이션 팁', '마무리'][i]}</b>
                  <i />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      controls={
        <>
          <Toggle label="헤더 고정 (sticky)" value={sticky} onChange={setSticky} />
          <Toggle label="스크롤하면 그림자" value={shadow} onChange={setShadow} />
          <Toggle label="반투명 흐림 배경 (blur)" value={blur} onChange={setBlur} />
          <Toggle
            label="내릴 땐 숨기고 올릴 땐 보이기"
            value={hide}
            onChange={(v) => {
              setHide(v)
              setHidden(false)
            }}
          />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Split Layout ───────── */

function SplitPG() {
  const [ratio, setRatio] = useState(50)
  const [imgSide, setImgSide] = useState('right')
  const [narrow, setNarrow] = useState(false)
  const { logs, push, clear } = useEventLog()

  const prompt = `소개 섹션을 좌우 분할 레이아웃(Split Layout)으로 만들어줘. ${imgSide === 'right' ? '왼쪽' : '오른쪽'}은 제목·설명·버튼, ${imgSide === 'right' ? '오른쪽' : '왼쪽'}은 이미지로, 글 쪽이 ${ratio}%, 이미지 쪽이 ${100 - ratio}% 너비. 두 영역은 세로 가운데 정렬. 모바일(768px 미만)에서는 이미지가 위, 글이 아래로 쌓이게.`

  const text = (
    <motion.div layout key="t" className="pg-split-text" style={narrow ? {} : { flexBasis: `${ratio}%` }}>
      <b>팀의 모든 일을 한 화면에</b>
      <p>메시지, 파일, 일정이 흩어지지 않게 모아드려요.</p>
      <button className="btn small" onClick={() => push('end', "'더 알아보기' 클릭")}>
        더 알아보기
      </button>
    </motion.div>
  )
  const img = <motion.div layout key="i" className="pg-split-img" style={narrow ? {} : { flexBasis: `${100 - ratio}%` }} />

  return (
    <Shell
      hint="비율과 화면 크기를 바꿔보세요"
      stage={
        <motion.div layout className={'pg-split' + (narrow ? ' narrow' : '')} transition={{ duration: 0.4, ease }}>
          {narrow ? [img, text] : imgSide === 'right' ? [text, img] : [img, text]}
        </motion.div>
      }
      controls={
        <>
          <Slider label="글 영역 비율" value={ratio} min={30} max={70} step={5} unit="%" onChange={setRatio} />
          <Segmented label="이미지 위치" value={imgSide} onChange={setImgSide} options={[{ value: 'right', label: '오른쪽' }, { value: 'left', label: '왼쪽' }]} />
          <Segmented
            label="미리보기 화면"
            value={narrow}
            onChange={(v) => {
              setNarrow(v)
              push('move', v ? '모바일 → 위아래로 쌓임' : '데스크톱 → 좌우 분할')
            }}
            options={[{ value: false, label: '데스크톱' }, { value: true, label: '모바일' }]}
          />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Navigation Bar ───────── */

const NAV_ITEMS = ['홈', '소개', '작업', '문의']

function NavigationBarPG() {
  const [active, setActive] = useState(0)
  const [align, setAlign] = useState('center')
  const [mark, setMark] = useState('underline')
  const [cta, setCta] = useState(true)
  const { logs, push, clear } = useEventLog()

  const markKo = { underline: '아래에 주황 밑줄', pill: '연한 주황 알약 배경', color: '글자색만 주황' }[mark]
  const prompt = `상단 내비게이션 바(Navigation Bar)를 만들어줘. 왼쪽에 로고, ${align === 'center' ? '가운데' : '오른쪽'}에 ${NAV_ITEMS.join('/')} 메뉴${cta ? ', 맨 오른쪽에 주황색 "시작하기" 버튼' : ''}. 현재 페이지 메뉴는 ${markKo}으로 강조하고, 다른 메뉴를 누르면 강조 표시가 그 메뉴로 미끄러지듯 이동. 마우스를 올리면 글자색이 진해지게.`

  return (
    <Shell
      hint="메뉴를 눌러보세요"
      stage={
        <div className="pg-page">
          <nav className={'pg-nav ' + align + ' ' + mark}>
            <b>JISU</b>
            <div className="pg-nav-items">
              {NAV_ITEMS.map((t, i) => (
                <button
                  key={t}
                  className={i === active ? 'on' : ''}
                  onClick={() => {
                    setActive(i)
                    push('move', `'${t}' 페이지로 이동`)
                  }}
                >
                  {i === active && mark !== 'color' && <motion.span layoutId="pg-nav-ind" className="pg-nav-ind" transition={{ type: 'spring', stiffness: 450, damping: 36 }} />}
                  <span style={{ position: 'relative' }}>{t}</span>
                </button>
              ))}
            </div>
            {cta && (
              <button className="btn small" style={{ background: C.acc }} onClick={() => push('end', "'시작하기' 클릭")}>
                시작하기
              </button>
            )}
          </nav>
          <div className="pg-page-body">
            <AnimatePresence mode="wait">
              <motion.b key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} style={{ fontSize: 22 }}>
                {NAV_ITEMS[active]} 페이지
              </motion.b>
            </AnimatePresence>
            <i />
            <i style={{ width: '60%' }} />
          </div>
        </div>
      }
      controls={
        <>
          <Segmented label="메뉴 위치" value={align} onChange={setAlign} options={[{ value: 'center', label: '가운데' }, { value: 'right', label: '오른쪽' }]} />
          <Segmented label="현재 메뉴 강조" value={mark} onChange={setMark} options={[{ value: 'underline', label: '밑줄' }, { value: 'pill', label: '배경' }, { value: 'color', label: '글자색' }]} />
          <Toggle label="오른쪽 버튼 (CTA)" value={cta} onChange={setCta} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Hamburger Menu ───────── */

function HamburgerPG() {
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState('full')
  const [stagger, setStagger] = useState(true)
  const { logs, push, clear } = useEventLog()
  const sp = { type: 'spring', stiffness: 320, damping: 24 }

  const toggle = () => {
    setOpen(!open)
    push(open ? 'close' : 'open', open ? '메뉴 닫힘 (✕ → ☰)' : '메뉴 열림 (☰ → ✕)')
  }
  const panel = {
    full: { initial: { y: '-100%' }, animate: { y: 0 }, exit: { y: '-100%' }, cls: 'full' },
    side: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' }, cls: 'side' },
    drop: { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, cls: 'drop' },
  }[style]
  const styleKo = { full: '화면 전체를 덮으며 위에서 내려오고', side: '오른쪽에서 패널로 밀려 나오고', drop: '헤더 바로 아래에 작은 목록으로 펼쳐지고' }[style]
  const prompt = `모바일에서는 상단 메뉴를 햄버거 메뉴(Hamburger Menu, ☰)로 바꿔줘. 아이콘을 누르면 메뉴가 ${styleKo}, 세 줄 아이콘은 X로 부드럽게 변해. ${stagger ? '메뉴 항목은 0.05초 간격으로 하나씩 나타나게. ' : ''}메뉴를 고르거나 X를 누르면 닫히고, 열려 있는 동안 뒤 페이지는 스크롤되지 않게.`

  return (
    <Shell
      hint="☰ 아이콘을 눌러보세요"
      stage={
        <PgPhone>
          <div className="pg-hb-head">
            <b>MyShop</b>
            <button className="pg-hb-btn" onClick={toggle} aria-label="메뉴">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} style={{ top: 4 + i * 7 }} animate={open ? [{ y: 7, rotate: 45 }, { opacity: 0 }, { y: -7, rotate: -45 }][i] : { y: 0, rotate: 0, opacity: 1 }} transition={sp} />
              ))}
            </button>
          </div>
          <div className="pg-hb-body">
            <i />
            <i style={{ width: '60%' }} />
            <span className="pg-hb-img" />
            <i />
          </div>
          <AnimatePresence>
            {open && (
              <motion.div key={style} className={'pg-hb-menu ' + panel.cls} initial={panel.initial} animate={panel.animate} exit={panel.exit} transition={{ type: 'spring', stiffness: 300, damping: 32 }}>
                {['신상품', '베스트', '세일', '고객센터'].map((m, i) => (
                  <motion.button
                    key={m}
                    initial={stagger ? { opacity: 0, y: 10 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stagger ? 0.12 + i * 0.05 : 0 }}
                    onClick={() => {
                      setOpen(false)
                      push('end', `'${m}' 선택 → 메뉴 닫힘`)
                    }}
                  >
                    {m}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </PgPhone>
      }
      controls={
        <>
          <Segmented
            label="메뉴가 열리는 방식"
            value={style}
            onChange={(v) => {
              setStyle(v)
              setOpen(false)
            }}
            options={[{ value: 'full', label: '전체 화면' }, { value: 'side', label: '옆 패널' }, { value: 'drop', label: '드롭다운' }]}
          />
          <Toggle label="항목이 하나씩 나타나기" value={stagger} onChange={setStagger} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Bottom Navigation ───────── */

const BOTTOM_TABS = [
  ['home', '홈'],
  ['search', '검색'],
  ['heart', '찜'],
  ['user', 'MY'],
]

function BottomNavPG() {
  const [active, setActive] = useState(0)
  const [label, setLabel] = useState('always')
  const [mark, setMark] = useState('color')
  const [badge, setBadge] = useState(true)
  const { logs, push, clear } = useEventLog()

  const labelKo = { always: '아이콘 아래 이름을 항상 표시', active: '선택된 탭만 이름 표시', none: '이름 없이 아이콘만' }[label]
  const prompt = `모바일 화면 하단에 바텀 내비게이션(Bottom Navigation)을 만들어줘. 홈/검색/찜/MY 4개 탭을 화면 맨 아래에 고정하고, ${labelKo}. 선택된 탭은 ${mark === 'pill' ? '주황색 알약 모양 배경이 미끄러지듯 이동하며' : '주황색으로'} 강조.${badge ? ' 찜 탭 아이콘에는 빨간 숫자 배지.' : ''} 아이폰 아래 홈 바에 가리지 않게 safe-area 여백도 넣어줘.`

  return (
    <Shell
      hint="아래 탭을 눌러보세요"
      stage={
        <PgPhone>
          <div className="pg-hb-head">
            <b>{BOTTOM_TABS[active][1]}</b>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={active} className="pg-hb-body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <span className="pg-hb-img" style={{ background: PALETTE[active] }} />
              <i />
              <i style={{ width: '60%' }} />
            </motion.div>
          </AnimatePresence>
          <div className={'pg-bnav ' + mark}>
            {BOTTOM_TABS.map(([ic, t], i) => (
              <button
                key={t}
                className={i === active ? 'on' : ''}
                onClick={() => {
                  setActive(i)
                  push('move', `'${t}' 탭으로 전환`)
                }}
              >
                {i === active && mark === 'pill' && <motion.span layoutId="pg-bnav-pill" className="pg-bnav-pill" transition={{ type: 'spring', stiffness: 450, damping: 34 }} />}
                <span className="pg-bnav-ic">
                  <Icon n={ic} size={20} />
                  {badge && ic === 'heart' && <em>3</em>}
                </span>
                {(label === 'always' || (label === 'active' && i === active)) && <small>{t}</small>}
              </button>
            ))}
          </div>
        </PgPhone>
      }
      controls={
        <>
          <Segmented label="탭 이름 표시" value={label} onChange={setLabel} options={[{ value: 'always', label: '항상' }, { value: 'active', label: '선택만' }, { value: 'none', label: '없음' }]} />
          <Segmented label="선택 강조" value={mark} onChange={setMark} options={[{ value: 'color', label: '색만' }, { value: 'pill', label: '알약 배경' }]} />
          <Toggle label="찜 탭에 배지" value={badge} onChange={setBadge} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Breadcrumb ───────── */

const TREE = ['홈', '여성', '의류', '원피스', '여름 린넨 원피스']

function BreadcrumbPG() {
  const [depth, setDepth] = useState(5)
  const [sep, setSep] = useState('›')
  const [collapse, setCollapse] = useState(false)
  const [home, setHome] = useState(true)
  const { logs, push, clear } = useEventLog()
  const path = TREE.slice(0, depth)
  const shown = collapse && path.length > 3 ? [path[0], '…', ...path.slice(-2)] : path

  const prompt = `상품 상세 페이지 위에 브레드크럼(Breadcrumb)을 넣어줘. "${TREE.join(` ${sep} `)}" 형식, 구분자는 "${sep}". ${home ? '맨 앞 "홈"은 집 아이콘으로. ' : ''}각 단계를 누르면 그 페이지로 이동하고, 마지막(현재 페이지)은 굵게 표시하고 링크 없이.${collapse ? ' 경로가 길면 가운데를 "…"로 줄이고 누르면 펼쳐지게.' : ''}`

  return (
    <Shell
      hint="경로의 단계를 눌러 위로 올라가 보세요"
      stage={
        <div className="pg-page">
          <div className="pg-page-nav">
            <b>MyShop</b>
          </div>
          <div className="pg-page-body">
            <nav className="pg-bc" aria-label="breadcrumb">
              {shown.map((p, i) => {
                const last = i === shown.length - 1
                const real = TREE.indexOf(p)
                return (
                  <span key={p + i} className="pg-bc-item">
                    {i > 0 && <span className="pg-bc-sep">{sep}</span>}
                    {p === '…' ? (
                      <button
                        onClick={() => {
                          setCollapse(false)
                          push('open', '"…" 눌러서 전체 경로 펼침')
                        }}
                      >
                        …
                      </button>
                    ) : last ? (
                      <b>{p}</b>
                    ) : (
                      <button
                        onClick={() => {
                          setDepth(real + 1)
                          push('move', `'${p}'(으)로 이동`)
                        }}
                      >
                        {home && real === 0 ? <Icon n="home" size={15} /> : p}
                      </button>
                    )}
                  </span>
                )
              })}
            </nav>
            <AnimatePresence mode="wait">
              <motion.b key={depth} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ fontSize: 22, marginTop: 6 }}>
                {path[path.length - 1]}
              </motion.b>
            </AnimatePresence>
            {depth < TREE.length && (
              <div className="pg-bc-children">
                <span className="pg-label">하위 메뉴</span>
                <button
                  className="chip-btn"
                  onClick={() => {
                    setDepth(depth + 1)
                    push('child', `'${TREE[depth]}'(으)로 들어감`)
                  }}
                >
                  {TREE[depth]} →
                </button>
              </div>
            )}
          </div>
        </div>
      }
      controls={
        <>
          <Segmented label="구분 기호" value={sep} onChange={setSep} options={[{ value: '›', label: '›' }, { value: '/', label: '/' }, { value: '>', label: '>' }]} />
          <Toggle label="홈은 아이콘으로" value={home} onChange={setHome} />
          <Toggle label="길면 가운데 줄이기 (…)" value={collapse} onChange={setCollapse} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Pagination ───────── */

const TOTAL_POSTS = 237

function PaginationPG() {
  const [page, setPage] = useState(1)
  const [per, setPer] = useState(10)
  const [window_, setWindow] = useState(5)
  const [ends, setEnds] = useState(true)
  const { logs, push, clear } = useEventLog()
  const last = Math.ceil(TOTAL_POSTS / per)
  const p = Math.min(page, last)
  const half = Math.floor(window_ / 2)
  const start = Math.max(1, Math.min(p - half, last - window_ + 1))
  const nums = Array.from({ length: Math.min(window_, last) }, (_, i) => start + i)

  const go = (n, why) => {
    const v = Math.max(1, Math.min(last, n))
    if (v === p) return
    setPage(v)
    push('move', `${v}페이지로 (${why}) · ${(v - 1) * per + 1}~${Math.min(v * per, TOTAL_POSTS)}번째 글`)
  }

  const prompt = `게시글 목록에 페이지네이션(Pagination)을 넣어줘. 전체 ${TOTAL_POSTS}개를 한 페이지에 ${per}개씩, 아래에 페이지 번호를 한 번에 ${window_}개까지만 보여주고 현재 페이지가 가운데 오게. 현재 페이지는 검은 배경으로 강조, 이전/다음 화살표${ends ? ', 맨 처음/맨 끝으로 가는 « » 버튼' : ''}. 첫 페이지에서는 이전 버튼을 비활성화. 페이지를 바꾸면 목록 맨 위로 스크롤.`

  return (
    <Shell
      hint="페이지 번호를 눌러보세요"
      stage={
        <div className="pg-card pg-pgn">
          <ul>
            {Array.from({ length: 4 }).map((_, i) => {
              const n = (p - 1) * per + i + 1
              return n <= TOTAL_POSTS ? (
                <li key={n}>
                  <span className="mono">{TOTAL_POSTS - n + 1}</span>
                  <b>게시글 제목 #{TOTAL_POSTS - n + 1}</b>
                </li>
              ) : null
            })}
            <li className="pg-pgn-more">… 이 페이지에 {Math.min(per, TOTAL_POSTS - (p - 1) * per)}개</li>
          </ul>
          <div className="pg-pgn-bar">
            {ends && (
              <button disabled={p === 1} onClick={() => go(1, '맨 처음')}>
                «
              </button>
            )}
            <button disabled={p === 1} onClick={() => go(p - 1, '이전')}>
              ‹
            </button>
            {nums.map((n) => (
              <button key={n} className={n === p ? 'on' : ''} onClick={() => go(n, '번호 클릭')}>
                {n === p && <motion.span layoutId="pg-pgn-bg" className="pg-pgn-bg" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
                <span style={{ position: 'relative' }}>{n}</span>
              </button>
            ))}
            <button disabled={p === last} onClick={() => go(p + 1, '다음')}>
              ›
            </button>
            {ends && (
              <button disabled={p === last} onClick={() => go(last, '맨 끝')}>
                »
              </button>
            )}
          </div>
          <span className="pg-pgn-info mono">
            {p} / {last} 페이지
          </span>
        </div>
      }
      controls={
        <>
          <Segmented label="한 페이지에 글 수" value={per} onChange={setPer} options={[{ value: 10, label: '10개' }, { value: 20, label: '20개' }, { value: 50, label: '50개' }]} />
          <Slider label="한 번에 보이는 번호 수" value={window_} min={3} max={9} step={2} unit="개" onChange={setWindow} />
          <Toggle label="맨 처음/끝 버튼 (« »)" value={ends} onChange={setEnds} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Footer ───────── */

const FOOTER_COLS = [
  ['회사', ['소개', '채용', '블로그']],
  ['도움말', ['고객센터', '자주 묻는 질문', '문의하기']],
  ['서비스', ['요금제', '기능', '업데이트']],
  ['정책', ['이용약관', '개인정보처리방침', '쿠키 설정']],
]

function FooterPG() {
  const [cols, setCols] = useState(3)
  const [dark, setDark] = useState(true)
  const [sns, setSns] = useState(true)
  const [news, setNews] = useState(false)
  const { logs, push, clear } = useEventLog()

  const prompt = `사이트 맨 아래에 푸터(Footer)를 만들어줘. ${dark ? '어두운' : '밝은 회색'} 배경에 ${FOOTER_COLS.slice(0, cols)
    .map(([t, l]) => `${t}(${l.join('·')})`)
    .join(', ')} ${cols}열 링크 목록.${sns ? ' 오른쪽 위에 인스타그램·유튜브·X 아이콘 링크.' : ''}${news ? ' 맨 위에 이메일을 넣는 뉴스레터 구독 칸.' : ''} 맨 아래에 "© 2026 MyShop" 저작권 문구. 모바일에서는 열을 세로로 쌓아줘.`

  return (
    <Shell
      hint="아래 푸터의 링크를 눌러보세요"
      stage={
        <div className="pg-page pg-footer-page">
          <div className="pg-page-body" style={{ flex: 1 }}>
            <i style={{ width: '40%', height: 12, background: C.ink }} />
            <i />
            <i style={{ width: '60%' }} />
          </div>
          <motion.footer layout className={'pg-footer' + (dark ? ' dark' : '')}>
            {news && (
              <div className="pg-footer-news">
                <span>새 소식 받아보기</span>
                <input className="pg-input" placeholder="이메일 주소" />
                <button className="btn small" style={{ background: C.acc }} onClick={() => push('end', '뉴스레터 구독 신청')}>
                  구독
                </button>
              </div>
            )}
            <div className="pg-footer-cols" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)${sns ? ' auto' : ''}` }}>
              {FOOTER_COLS.slice(0, cols).map(([t, links]) => (
                <div key={t}>
                  <b>{t}</b>
                  {links.map((l) => (
                    <button key={l} onClick={() => push('move', `'${l}' 링크로 이동`)}>
                      {l}
                    </button>
                  ))}
                </div>
              ))}
              {sns && (
                <div className="pg-footer-sns">
                  {['IG', 'YT', 'X'].map((s) => (
                    <button key={s} onClick={() => push('open', `${s} 새 탭으로 열기`)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <small>© 2026 MyShop. All rights reserved.</small>
          </motion.footer>
        </div>
      }
      controls={
        <>
          <Slider label="링크 열 수" value={cols} min={2} max={4} step={1} unit="열" onChange={setCols} />
          <Toggle label="어두운 배경" value={dark} onChange={setDark} />
          <Toggle label="SNS 아이콘" value={sns} onChange={setSns} />
          <Toggle label="뉴스레터 구독 칸" value={news} onChange={setNews} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

export const UI_LAYOUT_PGS = {
  'hero-section': HeroSectionPG,
  'responsive-layout': ResponsivePG,
  'card-layout': CardLayoutPG,
  'bento-grid': BentoPG,
  'sidebar-layout': SidebarPG,
  'sticky-header': StickyHeaderPG,
  'split-layout': SplitPG,
  'navigation-bar': NavigationBarPG,
  'hamburger-menu': HamburgerPG,
  'bottom-navigation': BottomNavPG,
  breadcrumb: BreadcrumbPG,
  pagination: PaginationPG,
  footer: FooterPG,
}
