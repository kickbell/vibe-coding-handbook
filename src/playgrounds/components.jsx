import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Shell, EventLog, useEventLog, Slider, Segmented, Toggle } from '../components/kit'
import { C, PALETTE, ease, Check } from '../demos/parts'

// 체험용 가짜 화면 (모달·드로어·토스트가 이 안에서만 뜬다)
const FakePage = ({ children }) => (
  <div className="pg-page">
    <div className="pg-page-nav">
      <b>MyShop</b>
      <span>상품</span>
      <span>이벤트</span>
      <span>고객센터</span>
    </div>
    <div className="pg-page-body">
      <i style={{ width: '46%', height: 14, background: C.ink }} />
      <i style={{ width: '72%' }} />
      <i style={{ width: '58%' }} />
      <div className="pg-page-cards">
        {[C.sky, C.mint, C.pink].map((c) => (
          <span key={c} style={{ background: c }} />
        ))}
      </div>
      {children}
    </div>
  </div>
)

/* ───────── Tabs ───────── */

const TAB_DATA = [
  { t: '상세정보', body: '부드러운 코튼 소재의 오버핏 셔츠예요. 사계절 내내 입기 좋아요.' },
  { t: '리뷰 128', body: '"핏이 정말 예뻐요" · "세탁해도 늘어나지 않아요" · "재구매 의사 있어요"' },
  { t: '문의', body: '사이즈 문의는 상품 페이지 하단 Q&A 게시판에 남겨주세요.' },
  { t: '배송', body: '오후 2시 이전 주문은 당일 출고, 보통 1~2일 안에 도착해요.' },
]

function TabsPG() {
  const [active, setActive] = useState(0)
  const [style, setStyle] = useState('underline')
  const [anim, setAnim] = useState('slide')
  const [duration, setDuration] = useState(0.25)
  const dir = useRef(1)
  const { logs, push, clear } = useEventLog()

  const select = (i) => {
    if (i === active) return
    dir.current = i > active ? 1 : -1
    push('open', `'${TAB_DATA[i].t}' 탭 선택 (${i > active ? '오른쪽' : '왼쪽'}으로 이동)`)
    setActive(i)
  }

  const off = anim === 'slide' ? 24 : 0
  const panel = {
    initial: (d) => ({ opacity: anim === 'none' ? 1 : 0, x: d * off }),
    animate: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: anim === 'none' ? 1 : 0, x: -d * off }),
  }
  const styleKo = { underline: '선택된 탭 아래 주황색 밑줄', pill: '선택된 탭 뒤에 둥근 알약 모양 배경' }[style]
  const animKo = { slide: `옆으로 밀리며 ${duration}초 동안 바뀌고`, fade: `${duration}초 동안 페이드로 바뀌고`, none: '애니메이션 없이 바로 바뀌고' }[anim]
  const prompt = `상품 상세 페이지에 탭(Tabs)을 만들어줘. ${TAB_DATA.map((d) => d.t.replace(/ \d+/, '')).join('/')} ${TAB_DATA.length}개 탭, ${styleKo}가 클릭한 탭으로 미끄러지듯 이동하게. 아래 내용은 ${animKo}, 키보드 좌우 화살표로도 탭을 옮길 수 있게 해줘.`

  return (
    <Shell
      hint="탭을 눌러보세요 (좌우 화살표 키도 돼요)"
      stage={
        <div className="pg-card pg-tabs" onKeyDown={(e) => (e.key === 'ArrowRight' ? select(Math.min(active + 1, 3)) : e.key === 'ArrowLeft' ? select(Math.max(active - 1, 0)) : null)}>
          <div className={'pg-tabs-row ' + style} role="tablist">
            {TAB_DATA.map((d, i) => (
              <button key={d.t} role="tab" aria-selected={active === i} className={active === i ? 'on' : ''} onClick={() => select(i)}>
                {active === i && <motion.span layoutId="pg-tab-ind" className="pg-tab-ind" transition={{ type: 'spring', stiffness: 480, damping: 38 }} />}
                <span style={{ position: 'relative' }}>{d.t}</span>
              </button>
            ))}
          </div>
          <div className="pg-tabs-panel">
            <AnimatePresence mode="wait" custom={dir.current} initial={false}>
              <motion.p key={active} custom={dir.current} variants={panel} initial="initial" animate="animate" exit="exit" transition={{ duration: anim === 'none' ? 0 : duration, ease }}>
                {TAB_DATA[active].body}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      }
      controls={
        <>
          <Segmented label="선택 표시 모양" value={style} onChange={setStyle} options={[{ value: 'underline', label: '밑줄' }, { value: 'pill', label: '알약 배경' }]} />
          <Segmented label="내용이 바뀌는 방식" value={anim} onChange={setAnim} options={[{ value: 'slide', label: '옆으로' }, { value: 'fade', label: '페이드' }, { value: 'none', label: '바로' }]} />
          <Slider label="바뀌는 시간 (duration)" value={duration} min={0.1} max={0.8} step={0.05} unit="s" onChange={setDuration} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Modal ───────── */

const MODAL_ANIM = {
  scale: { initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.92 } },
  up: { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40 } },
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
}

function ModalPG() {
  const [open, setOpen] = useState(false)
  const [anim, setAnim] = useState('scale')
  const [dim, setDim] = useState(0.45)
  const [outside, setOutside] = useState(true)
  const [deleted, setDeleted] = useState(false)
  const { logs, push, clear } = useEventLog()

  const show = () => {
    setOpen(true)
    push('open', '모달 열림 · 뒤 화면은 클릭할 수 없어요')
  }
  const close = (why) => {
    setOpen(false)
    push('close', `모달 닫힘 (${why})`)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close('ESC 키')
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const animKo = { scale: '살짝 작은 크기에서 커지며', up: '아래에서 위로 올라오며', fade: '제자리에서 서서히' }[anim]
  const prompt = `"계정 삭제" 버튼을 누르면 확인용 모달(Modal)을 띄워줘. 뒤 배경은 검은색 ${Math.round(dim * 100)}% 투명도로 어둡게 덮고, 모달은 화면 가운데에 ${animKo} 나타나게. "취소"와 빨간색 "삭제" 버튼, ESC 키로 닫기${outside ? ', 바깥 어두운 영역을 클릭해도 닫히게' : '. 바깥을 클릭해도 닫히지 않게 해서 실수로 닫는 걸 막아줘'}.`

  return (
    <Shell
      hint="'계정 삭제'를 눌러보세요"
      stage={
        <FakePage>
          <button className="pg-danger-btn" onClick={show}>
            {deleted ? '삭제 완료됨 · 다시 열기' : '계정 삭제'}
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                key="ov"
                className="pg-overlay"
                style={{ background: `rgba(20,18,14,${dim})` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => (outside ? close('바깥 클릭') : push('option', '바깥 클릭 무시됨 (설정에서 꺼둠)'))}
              >
                <motion.div className="pg-dialog" role="dialog" aria-modal="true" {...MODAL_ANIM[anim]} transition={{ type: 'spring', stiffness: 380, damping: 28 }} onClick={(e) => e.stopPropagation()}>
                  <b>정말 삭제할까요?</b>
                  <p>삭제한 계정은 되돌릴 수 없어요. 모든 주문 내역이 사라져요.</p>
                  <div className="pg-dialog-btns">
                    <button className="btn ghost" onClick={() => close('취소 버튼')}>
                      취소
                    </button>
                    <button
                      className="btn red"
                      onClick={() => {
                        setDeleted(true)
                        close('삭제 버튼 → 실행')
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </FakePage>
      }
      controls={
        <>
          <Segmented label="나타나는 방식" value={anim} onChange={setAnim} options={[{ value: 'scale', label: '커지며' }, { value: 'up', label: '아래에서' }, { value: 'fade', label: '페이드' }]} />
          <Slider label="배경 어둡기 (overlay)" value={dim} min={0} max={0.8} step={0.05} onChange={setDim} />
          <Toggle label="바깥 클릭하면 닫기" value={outside} onChange={setOutside} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Drawer ───────── */

const DRAWER_FROM = {
  right: { pos: { top: 0, bottom: 0, right: 0 }, hidden: { x: '100%' }, axis: 'x', sign: 1 },
  left: { pos: { top: 0, bottom: 0, left: 0 }, hidden: { x: '-100%' }, axis: 'x', sign: -1 },
  bottom: { pos: { left: 0, right: 0, bottom: 0 }, hidden: { y: '100%' }, axis: 'y', sign: 1 },
}

function DrawerPG() {
  const [open, setOpen] = useState(false)
  const [from, setFrom] = useState('right')
  const [size, setSize] = useState(60)
  const [swipe, setSwipe] = useState(true)
  const { logs, push, clear } = useEventLog()
  const d = DRAWER_FROM[from]

  const close = (why) => {
    setOpen(false)
    push('close', `드로어 닫힘 (${why})`)
  }
  const fromKo = { right: '오른쪽', left: '왼쪽', bottom: '아래쪽' }[from]
  const prompt = `헤더의 메뉴 버튼을 누르면 ${fromKo}에서 드로어(Drawer)가 미끄러져 나오게 해줘. ${from === 'bottom' ? '높이' : '너비'}는 화면의 ${size}%, 뒤는 반투명 검은 배경으로 덮고 배경을 누르면 닫혀. ${swipe ? `드로어를 ${fromKo} 방향으로 끌어서(스와이프) 닫을 수도 있게. ` : ''}Motion의 spring 애니메이션 사용.`

  return (
    <Shell
      hint="메뉴(☰)를 열어보세요"
      stage={
        <FakePage>
          <button
            className="pg-menu-btn"
            onClick={() => {
              setOpen(true)
              push('open', `${fromKo}에서 드로어 열림`)
            }}
          >
            ☰ 메뉴
          </button>
          <AnimatePresence>
            {open && (
              <>
                <motion.div key="ov" className="pg-overlay" style={{ background: 'rgba(20,18,14,.4)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => close('배경 클릭')} />
                <motion.div
                  key={'dr' + from}
                  className={'pg-drawer ' + from}
                  style={{ ...d.pos, [from === 'bottom' ? 'height' : 'width']: size + '%' }}
                  initial={d.hidden}
                  animate={{ x: 0, y: 0 }}
                  exit={d.hidden}
                  transition={{ type: 'spring', stiffness: 340, damping: 34 }}
                  drag={swipe ? d.axis : false}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={from === 'left' ? { left: 1, right: 0 } : from === 'right' ? { left: 0, right: 1 } : { top: 0, bottom: 1 }}
                  onDragEnd={(_, info) => (info.offset[d.axis] * d.sign > 60 ? close('스와이프') : push('release', '조금만 끌어서 제자리로'))}
                >
                  {from === 'bottom' && <span className="pg-grab" />}
                  <b>메뉴</b>
                  {['홈', '주문 내역', '찜한 상품', '설정'].map((m, i) => (
                    <button key={m} onClick={() => close(`'${m}' 선택`)}>
                      <span style={{ background: PALETTE[i] }} />
                      {m}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </FakePage>
      }
      controls={
        <>
          <Segmented
            label="나오는 방향"
            value={from}
            onChange={(v) => {
              setFrom(v)
              setOpen(false)
            }}
            options={[{ value: 'right', label: '오른쪽' }, { value: 'left', label: '왼쪽' }, { value: 'bottom', label: '아래(바텀시트)' }]}
          />
          <Slider label="크기" value={size} min={30} max={90} step={5} unit="%" onChange={setSize} />
          <Toggle label="끌어서 닫기 (swipe)" value={swipe} onChange={setSwipe} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Dropdown ───────── */

const OPTIONS = ['개발', '디자인', '기획', '마케팅', '영상']

function DropdownPG() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null)
  const [hl, setHl] = useState(0)
  const [anim, setAnim] = useState('down')
  const [duration, setDuration] = useState(0.18)
  const [check, setCheck] = useState(true)
  const ref = useRef(null)
  const { logs, push, clear } = useEventLog()

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        push('close', '바깥을 눌러서 닫힘')
      }
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open, push])

  const toggle = () => {
    setOpen(!open)
    push(open ? 'close' : 'open', open ? '목록 닫힘' : '목록 펼침')
  }
  const pick = (o) => {
    setValue(o)
    setOpen(false)
    push('end', `'${o}' 선택 → 목록 닫힘`)
  }
  const onKey = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) return (e.preventDefault(), toggle())
    if (!open) return
    if (e.key === 'ArrowDown') setHl((h) => Math.min(h + 1, OPTIONS.length - 1))
    if (e.key === 'ArrowUp') setHl((h) => Math.max(h - 1, 0))
    if (e.key === 'Enter') pick(OPTIONS[hl])
    if (e.key === 'Escape') toggle()
    e.preventDefault()
  }

  const menu = {
    down: { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 } },
    scale: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
    height: { initial: { opacity: 0, clipPath: 'inset(0 0 100% 0 round 14px)' }, animate: { opacity: 1, clipPath: 'inset(0 0 0% 0 round 14px)' } },
  }[anim]
  const animKo = { down: '살짝 위에서 내려오며', scale: '작은 크기에서 커지며', height: '위에서 아래로 펼쳐지며' }[anim]
  const prompt = `카테고리를 고르는 드롭다운(Dropdown)을 만들어줘. 버튼을 누르면 ${OPTIONS.join('/')} 목록이 ${duration}초 동안 ${animKo} 나타나고, 마우스를 올린 항목은 배경색으로 강조. ${check ? '선택된 항목 오른쪽엔 체크 표시를 붙여줘. ' : ''}항목을 고르거나 바깥을 누르면 닫히고, 키보드 위/아래 화살표와 Enter로도 고를 수 있게.`

  return (
    <Shell
      hint="눌러서 펼친 뒤 골라보세요"
      stage={
        <div className="pg-dd" ref={ref}>
          <span className="pg-label">관심 분야</span>
          <button className={'pg-dd-field' + (open ? ' focus' : '')} onClick={toggle} onKeyDown={onKey} aria-expanded={open}>
            <span style={{ color: value ? C.ink : '#9a958b' }}>{value ?? '카테고리 선택'}</span>
            <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" animate={{ rotate: open ? 180 : 0 }}>
              <path d="M6 9l6 6 6-6" />
            </motion.svg>
          </button>
          <AnimatePresence>
            {open && (
              <motion.ul className="pg-dd-menu" style={{ originY: 0 }} {...menu} exit={menu.initial} transition={{ duration, ease }}>
                {OPTIONS.map((o, i) => (
                  <li key={o} className={hl === i ? 'hl' : ''} onMouseEnter={() => setHl(i)} onClick={() => pick(o)}>
                    {o}
                    {check && value === o && <Check size={14} color={C.acc} />}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      }
      controls={
        <>
          <Segmented label="펼쳐지는 방식" value={anim} onChange={setAnim} options={[{ value: 'down', label: '내려오기' }, { value: 'scale', label: '커지기' }, { value: 'height', label: '펼치기' }]} />
          <Slider label="펼치는 시간 (duration)" value={duration} min={0.05} max={0.6} step={0.01} unit="s" onChange={setDuration} />
          <Toggle label="선택한 항목에 체크 표시" value={check} onChange={setCheck} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Tooltip ───────── */

const TIP_POS = {
  top: { box: { bottom: 'calc(100% + 10px)', left: '50%', x: '-50%' }, from: { y: 6 } },
  bottom: { box: { top: 'calc(100% + 10px)', left: '50%', x: '-50%' }, from: { y: -6 } },
  left: { box: { right: 'calc(100% + 10px)', top: '50%', y: '-50%' }, from: { x: 6 } },
  right: { box: { left: 'calc(100% + 10px)', top: '50%', y: '-50%' }, from: { x: -6 } },
}
const TIP_TARGETS = [
  { id: 'q', label: '?', tip: '비밀번호는 8자 이상이에요', cls: 'pg-tip-q' },
  { id: 'share', label: '공유', tip: '링크를 복사해요', cls: 'pg-tip-btn' },
  { id: 'trash', label: '삭제', tip: '휴지통으로 옮겨요', cls: 'pg-tip-btn' },
]

function TooltipPG() {
  const [show, setShow] = useState(null)
  const [pos, setPos] = useState('top')
  const [delay, setDelay] = useState(0.3)
  const [arrow, setArrow] = useState(true)
  const timer = useRef()
  const { logs, push, clear } = useEventLog()

  const enter = (t) => {
    clearTimeout(timer.current)
    push('move', `'${t.label}'에 마우스 올림 → ${delay}s 기다림`)
    timer.current = setTimeout(() => {
      setShow(t.id)
      push('open', `툴팁 표시: "${t.tip}"`)
    }, delay * 1000)
  }
  const leave = (t) => {
    clearTimeout(timer.current)
    if (show === t.id) push('close', '마우스가 벗어나서 툴팁 숨김')
    setShow(null)
  }
  useEffect(() => () => clearTimeout(timer.current), [])

  const posKo = { top: '위쪽', bottom: '아래쪽', left: '왼쪽', right: '오른쪽' }[pos]
  const prompt = `아이콘 버튼에 마우스를 올리면 툴팁(Tooltip)이 ${delay}초 뒤에 버튼 ${posKo}에 나타나게 해줘. 검은 배경에 흰 글씨, 작은 둥근 말풍선${arrow ? ', 버튼을 가리키는 작은 삼각형 꼬리' : ''}. 살짝 움직이며 페이드인, 마우스가 벗어나면 바로 사라지게. 키보드 포커스(Tab)를 받을 때도 똑같이 보이게 해줘.`

  return (
    <Shell
      hint="버튼 위에 마우스를 올려보세요"
      stage={
        <div className="pg-tip-stage">
          {TIP_TARGETS.map((t) => (
            <span key={t.id} className="pg-tip-wrap">
              <button className={t.cls} onMouseEnter={() => enter(t)} onMouseLeave={() => leave(t)} onFocus={() => enter(t)} onBlur={() => leave(t)}>
                {t.label}
              </button>
              <AnimatePresence>
                {show === t.id && (
                  <motion.span
                    key={pos}
                    role="tooltip"
                    className={'pg-tip ' + pos + (arrow ? ' arrow' : '')}
                    style={TIP_POS[pos].box}
                    initial={{ opacity: 0, ...TIP_POS[pos].from }}
                    animate={{ opacity: 1, x: TIP_POS[pos].box.x ?? 0, y: TIP_POS[pos].box.y ?? 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.18 }}
                  >
                    {t.tip}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          ))}
        </div>
      }
      controls={
        <>
          <Segmented label="나타나는 위치" value={pos} onChange={setPos} options={[{ value: 'top', label: '위' }, { value: 'bottom', label: '아래' }, { value: 'left', label: '왼쪽' }, { value: 'right', label: '오른쪽' }]} />
          <Slider label="나타나기 전 기다림 (delay)" value={delay} min={0} max={1.5} step={0.05} unit="s" onChange={setDelay} />
          <Toggle label="말풍선 꼬리 (arrow)" value={arrow} onChange={setArrow} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Toast ───────── */

const TOAST_KIND = {
  ok: { label: '저장하기', msg: '저장되었어요', color: C.mint },
  info: { label: '링크 복사', msg: '링크를 복사했어요', color: C.sky },
  err: { label: '오류 내기', msg: '네트워크 연결을 확인해주세요', color: '#e5484d' },
}

function ToastItem({ t, duration, onClose }) {
  useEffect(() => {
    const id = setTimeout(() => onClose(t.id, '시간 지나서 자동'), duration * 1000)
    return () => clearTimeout(id)
  }, [t.id, duration, onClose])
  const k = TOAST_KIND[t.kind]
  return (
    <motion.div layout className="pg-toast" initial={{ opacity: 0, y: t.top ? -30 : 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }} transition={{ type: 'spring', stiffness: 420, damping: 32 }}>
      <span className="pg-toast-ic" style={{ background: k.color }}>
        {t.kind === 'err' ? '!' : <Check size={11} color="#fff" />}
      </span>
      <span style={{ flex: 1 }}>{k.msg}</span>
      <button onClick={() => onClose(t.id, 'X 버튼')}>×</button>
      <motion.i style={{ background: k.color, originX: 0 }} initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration, ease: 'linear' }} />
    </motion.div>
  )
}

function ToastPG() {
  const [toasts, setToasts] = useState([])
  const [pos, setPos] = useState('bottom')
  const [duration, setDuration] = useState(3)
  const [max, setMax] = useState(3)
  const seq = useRef(0)
  const { logs, push, clear } = useEventLog()

  const fire = (kind) => {
    const id = ++seq.current
    setToasts((ts) => {
      const next = [...ts, { id, kind, top: pos === 'top' }]
      if (next.length > max) push('close', `최대 ${max}개 넘어서 가장 오래된 토스트 제거`)
      return next.slice(-max)
    })
    push('open', `토스트 #${id}: ${TOAST_KIND[kind].msg}`)
  }
  // ToastItem 타이머가 의존하므로 매 렌더 새로 만들지 않는다
  const close = useCallback(
    (id, why) => {
      setToasts((ts) => ts.filter((t) => t.id !== id))
      push('end', `토스트 #${id} 사라짐 (${why})`)
    },
    [push],
  )

  const prompt = `저장 버튼을 누르면 화면 ${pos === 'top' ? '위쪽' : '아래쪽'} 가운데에 토스트(Toast) 알림 "저장되었어요"를 띄워줘. ${duration}초 뒤 자동으로 사라지고, 남은 시간을 보여주는 얇은 막대가 줄어들게. 여러 개가 뜨면 차곡차곡 쌓이고 최대 ${max}개까지만 보여줘. 성공은 초록, 오류는 빨간 아이콘, X 버튼으로 바로 닫을 수도 있게.`

  return (
    <Shell
      hint="버튼을 여러 번 눌러보세요"
      stage={
        <FakePage>
          <div className="pg-toast-btns">
            {Object.entries(TOAST_KIND).map(([k, v]) => (
              <button key={k} className="btn small" style={{ background: k === 'err' ? '#e5484d' : undefined }} onClick={() => fire(k)}>
                {v.label}
              </button>
            ))}
          </div>
          <div className={'pg-toast-wrap ' + pos}>
            <AnimatePresence initial={false}>
              {(pos === 'top' ? [...toasts].reverse() : toasts).map((t) => (
                <ToastItem key={t.id} t={t} duration={duration} onClose={close} />
              ))}
            </AnimatePresence>
          </div>
        </FakePage>
      }
      controls={
        <>
          <Segmented label="뜨는 위치" value={pos} onChange={setPos} options={[{ value: 'top', label: '위' }, { value: 'bottom', label: '아래' }]} />
          <Slider label="보여주는 시간" value={duration} min={1} max={8} step={0.5} unit="s" onChange={setDuration} />
          <Slider label="동시에 최대 몇 개" value={max} min={1} max={5} step={1} unit="개" onChange={setMax} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Carousel ───────── */

const SLIDES = [
  { c: C.pink, t: '봄 신상 20% 할인' },
  { c: C.sky, t: '무료 배송 이벤트' },
  { c: C.mint, t: '첫 구매 쿠폰' },
  { c: C.butter, t: '친구 초대하고 적립금' },
  { c: C.coral, t: '오늘만 특가' },
]

function CarouselPG() {
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(true)
  const [interval, setIntervalSec] = useState(3)
  const [loop, setLoop] = useState(true)
  const [hover, setHover] = useState(false)
  const { logs, push, clear } = useEventLog()
  const n = SLIDES.length

  const go = (next, why) => {
    let j = next
    if (j < 0 || j >= n) {
      if (!loop) return push('option', '끝이라서 더 넘어가지 않음 (반복 꺼짐)')
      j = (j + n) % n
    }
    setI(j)
    push('move', `${j + 1}번 슬라이드로 (${why})`)
  }
  const goRef = useRef(go)
  goRef.current = go

  useEffect(() => {
    if (!auto || hover) return
    const id = setInterval(() => goRef.current(i + 1, '자동 넘김'), interval * 1000)
    return () => clearInterval(id)
  }, [auto, hover, interval, i])

  const prompt = `메인 배너를 캐러셀(Carousel)로 만들어줘. 슬라이드 ${n}장, 좌우 화살표 버튼과 아래 점(인디케이터)으로 이동, 손가락이나 마우스로 끌어서(스와이프) 넘길 수도 있게. ${auto ? `${interval}초마다 자동으로 넘어가고, 마우스를 올리면 자동 넘김을 잠깐 멈춰줘. ` : ''}${loop ? '마지막 다음엔 처음으로 돌아가게.' : '처음과 끝에서는 더 넘어가지 않게.'} 넘어갈 때는 spring 애니메이션.`

  return (
    <Shell
      hint="화살표·점을 누르거나 끌어서 넘겨보세요"
      stage={
        <div className="pg-car" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <div className="pg-car-view">
            <motion.div className="pg-car-track" animate={{ x: `${-i * 100}%` }} transition={{ type: 'spring', stiffness: 260, damping: 32 }}>
              <motion.div
                className="pg-car-drag"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragStart={() => push('drag', '끌기 시작')}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50 || info.velocity.x < -400) go(i + 1, '왼쪽으로 스와이프')
                  else if (info.offset.x > 50 || info.velocity.x > 400) go(i - 1, '오른쪽으로 스와이프')
                  else push('release', '조금만 끌어서 제자리')
                }}
              >
                {SLIDES.map((s, j) => (
                  <div key={j} className="pg-car-slide" style={{ background: s.c }}>
                    <span>0{j + 1}</span>
                    <b>{s.t}</b>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <button className="pg-car-arrow l" onClick={() => go(i - 1, '이전 버튼')} disabled={!loop && i === 0}>
              ‹
            </button>
            <button className="pg-car-arrow r" onClick={() => go(i + 1, '다음 버튼')} disabled={!loop && i === n - 1}>
              ›
            </button>
            {auto && <span className="pg-car-state">{hover ? '⏸ 멈춤 (마우스 올림)' : `▶ ${interval}s 자동`}</span>}
          </div>
          <div className="pg-car-dots">
            {SLIDES.map((_, j) => (
              <motion.button key={j} aria-label={`${j + 1}번`} onClick={() => go(j, '점 클릭')} animate={{ width: j === i ? 24 : 8, background: j === i ? C.ink : '#cfcac0' }} />
            ))}
          </div>
        </div>
      }
      controls={
        <>
          <Toggle label="자동으로 넘기기 (autoplay)" value={auto} onChange={setAuto} />
          <Slider label="자동 넘김 간격" value={interval} min={1} max={6} step={0.5} unit="s" onChange={setIntervalSec} />
          <Toggle label="끝에서 처음으로 (loop)" value={loop} onChange={setLoop} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Skeleton Loading ───────── */

function SkeletonPG() {
  const [loading, setLoading] = useState(true)
  const [wait, setWait] = useState(2)
  const [effect, setEffect] = useState('shimmer')
  const [count, setCount] = useState(3)
  const [run, setRun] = useState(0)
  const { logs, push, clear } = useEventLog()

  useEffect(() => {
    setLoading(true)
    push('start', `불러오는 중… 스켈레톤 표시 (${wait}s)`)
    const id = setTimeout(() => {
      setLoading(false)
      push('end', '데이터 도착 → 실제 내용으로 교체')
    }, wait * 1000)
    return () => clearTimeout(id)
  }, [run, wait, push])

  const sk = 'pg-sk ' + effect
  const effectKo = { shimmer: '왼쪽에서 오른쪽으로 빛이 지나가는 shimmer 효과', pulse: '밝아졌다 어두워지는 pulse 효과', none: '움직임 없이 회색 상자만' }[effect]
  const prompt = `게시글 목록을 불러오는 동안 스켈레톤 로딩(Skeleton)을 보여줘. 실제 카드와 같은 모양(동그란 프로필, 제목 줄, 이미지, 본문 두 줄)의 회색 상자 ${count}개, ${effectKo}. 데이터가 오면 0.3초 페이드로 실제 내용으로 바뀌게. 로딩 스피너 대신 써줘.`

  return (
    <Shell
      hint="'새로고침'으로 다시 불러와 보세요"
      stage={
        <div className="pg-sk-stage">
          <div className="pg-sk-list">
            {Array.from({ length: count }).map((_, i) => (
              <AnimatePresence key={i} mode="wait" initial={false}>
                {loading ? (
                  <motion.div key="s" className="pg-sk-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <span className={sk + ' av'} />
                    <div>
                      <span className={sk} style={{ width: '45%', height: 12 }} />
                      <span className={sk} style={{ width: '90%' }} />
                      <span className={sk} style={{ width: '70%' }} />
                    </div>
                    <span className={sk + ' img'} />
                  </motion.div>
                ) : (
                  <motion.div key="r" className="pg-sk-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                    <span className="av" style={{ background: PALETTE[i % 5] }} />
                    <div>
                      <b>{['오늘의 점심 메뉴 추천', '주말에 다녀온 카페', '바이브코딩 후기'][i % 3]}</b>
                      <p>{['회사 근처 맛집 세 곳을 정리했어요.', '창가 자리 햇살이 정말 좋았어요.', 'AI랑 하루 만에 앱을 만들었어요.'][i % 3]}</p>
                    </div>
                    <span className="img" style={{ background: `linear-gradient(135deg, ${PALETTE[(i + 1) % 5]}, ${PALETTE[(i + 3) % 5]})` }} />
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
          <button className="btn small" onClick={() => setRun((r) => r + 1)}>
            새로고침
          </button>
        </div>
      }
      controls={
        <>
          <Segmented label="스켈레톤 움직임" value={effect} onChange={setEffect} options={[{ value: 'shimmer', label: 'shimmer' }, { value: 'pulse', label: 'pulse' }, { value: 'none', label: '없음' }]} />
          <Slider label="불러오는 시간 (가짜)" value={wait} min={0.5} max={5} step={0.5} unit="s" onChange={setWait} />
          <Slider label="카드 개수" value={count} min={1} max={4} step={1} unit="개" onChange={setCount} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

export const COMPONENT_PGS = {
  tabs: TabsPG,
  modal: ModalPG,
  drawer: DrawerPG,
  dropdown: DropdownPG,
  tooltip: TooltipPG,
  toast: ToastPG,
  carousel: CarouselPG,
  'skeleton-loading': SkeletonPG,
}
