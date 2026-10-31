import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Shell, EventLog, useEventLog, Segmented, Toggle } from '../components/kit'

/* ───────── Inspect Element ───────── */

// 가짜 페이지를 데이터로 들고 있다가, 화면과 Elements 패널 양쪽에 같은 걸 그린다
const el = (tag, attrs, ...children) => ({ tag, ...attrs, children })
const PAGE = el(
  'body',
  {},
  el('header', { cls: 'nav' }, el('b', { cls: 'logo', text: 'MyShop' }), el('nav', {}, el('a', { text: '소개' }), el('a', { text: '요금제' }))),
  el('section', { cls: 'hero' }, el('h1', { cls: 'title', text: '나에게 맞는 요금제' }), el('p', { cls: 'sub', text: '언제든 바꿀 수 있어요' })),
  el(
    'section',
    { id: 'pricing', cls: 'plans' },
    el('div', { cls: 'card' }, el('h3', { text: '베이직' }), el('p', { cls: 'price', text: '₩9,000' }), el('button', { cls: 'btn', text: '시작하기' })),
    el('div', { cls: 'card best' }, el('h3', { text: '프로' }), el('p', { cls: 'price', text: '₩19,000' }), el('button', { cls: 'btn', text: '시작하기' })),
  ),
)

// 번호·부모·깊이를 붙이고 위에서부터 한 줄로 편다
const NODES = []
;(function walk(x, parent, depth) {
  Object.assign(x, { key: NODES.length, parent, depth })
  NODES.push(x)
  x.children.forEach((c) => walk(c, x, depth + 1))
})(PAGE, null, 0)

const nameOf = (x) => x.tag + (x.id ? '#' + x.id : '') + (x.cls ? '.' + x.cls.split(' ').join('.') : '')
const textOf = (x) => x.text ?? x.children.map(textOf).join(' ')
const pathOf = (x) => (x.parent ? [...pathOf(x.parent), x] : [x])

// 크롬의 "선택자 복사"와 비슷하게: id가 있으면 거기서 멈추고, 같은 태그 형제가 있으면 클래스나 nth-child로 구분
function selectorOf(x) {
  const parts = []
  for (; x.parent; x = x.parent) {
    if (x.id) {
      parts.unshift('#' + x.id)
      return parts.join(' > ')
    }
    const sib = x.parent.children
    const first = x.cls?.split(' ')[0]
    if (sib.filter((s) => s.tag === x.tag).length < 2) parts.unshift(x.tag)
    else if (first && sib.filter((s) => s.cls?.split(' ')[0] === first).length === 1) parts.unshift(`${x.tag}.${first}`)
    else parts.unshift(`${x.tag}:nth-child(${sib.indexOf(x) + 1})`)
  }
  return ['body', ...parts].join(' > ')
}

const openTag = (x) => `<${x.tag}${x.id ? ` id="${x.id}"` : ''}${x.cls ? ` class="${x.cls}"` : ''}>`
const htmlOf = (x, pad = '') => (x.children.length ? [pad + openTag(x), ...x.children.map((c) => htmlOf(c, pad + '  ')), `${pad}</${x.tag}>`].join('\n') : `${pad}${openTag(x)}${x.text ?? ''}</${x.tag}>`)

const COPY = {
  element: { label: '요소 복사', of: htmlOf, tip: 'HTML 통째로 복사. 클래스 이름과 글자가 들어 있어서 AI가 코드에서 찾기 쉬워요' },
  selector: { label: '선택자 복사', of: selectorOf, tip: '화면 속 위치를 가리키는 주소. nth-child(2)처럼 "몇 번째"가 들어가면 코드에서 찾기 어려워요' },
  jspath: { label: 'JS 경로 복사', of: (x) => `document.querySelector("${selectorOf(x)}")`, tip: '콘솔에 바로 붙여 쓸 수 있는 형태예요. "Console로 값 바꾸기"에서 써요' },
}
const ASK = {
  size: (t) => `${t}를 지금보다 더 크고 굵게 바꿔줘.`,
  color: (t) => `${t}의 색을 주황색(#FF6B2C)으로 바꿔줘.`,
  hide: (t) => `${t}를 화면에서 숨겨줘.`,
}

function PageNode({ x, refs }) {
  const Tag = x.tag === 'body' ? 'div' : x.tag
  const className = ['ie-' + x.tag, ...(x.cls ? x.cls.split(' ').map((c) => 'ie-' + c) : [])].join(' ')
  return (
    <Tag ref={(n) => (refs.current[x.key] = n)} data-ie={x.key} className={className}>
      {x.text}
      {x.children.map((c) => (
        <PageNode key={c.key} x={c} refs={refs} />
      ))}
    </Tag>
  )
}

function InspectElementPG() {
  const [pick, setPick] = useState(false)
  const [hover, setHover] = useState(null)
  const [sel, setSel] = useState(null)
  const [mode, setMode] = useState('element')
  const [ask, setAsk] = useState('size')
  const [withText, setWithText] = useState(true)
  const [menu, setMenu] = useState(null)
  const [copied, setCopied] = useState(null)
  const refs = useRef({})
  const rows = useRef({})
  const pageRef = useRef(null)
  const treeRef = useRef(null)
  const wrapRef = useRef(null)
  const { logs, push, clear } = useEventLog()

  // 화면 속 요소의 위치를 무대 기준 좌표로 재서 파란 상자를 그린다
  const boxOf = (key) => {
    const a = refs.current[key]?.getBoundingClientRect()
    const b = pageRef.current?.getBoundingClientRect()
    return a && b ? { key, x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height } : null
  }
  // 화면에서 고른 요소의 코드 줄이 Elements 패널에 보이도록 스크롤
  const reveal = (key) => {
    const r = rows.current[key]
    const t = treeRef.current
    if (r && t && (r.offsetTop < t.scrollTop || r.offsetTop + r.offsetHeight > t.scrollTop + t.clientHeight)) t.scrollTop = r.offsetTop - t.clientHeight / 2
  }
  const showHover = (key) => setHover(key == null ? null : boxOf(key))
  const select = (key, how) => {
    reveal(key)
    setSel(boxOf(key))
    push('open', `${how}: ${nameOf(NODES[key])}${textOf(NODES[key]) ? ` ("${textOf(NODES[key]).slice(0, 18)}")` : ''}`)
  }
  const togglePick = (v) => {
    setPick(v)
    push('option', v ? '요소 선택 모드 켬 → 화면 위에 마우스를 올려보세요' : '요소 선택 모드 끔')
  }
  const changeMode = (v) => {
    setMode(v)
    push('option', `${COPY[v].label}: ${COPY[v].tip}`)
  }
  const copy = (key, how) => {
    const text = COPY[how].of(NODES[key])
    // 클립보드 권한이 없거나 응답이 늦어도 화면은 바로 바뀌게
    navigator.clipboard?.writeText(text).catch(() => {})
    reveal(key)
    setMode(how)
    setSel(boxOf(key))
    setCopied(text)
    setMenu(null)
    push('end', `${COPY[how].label} → 클립보드에 담김`)
  }

  const node = sel && NODES[sel.key]
  const out = node && COPY[mode].of(node)
  const seen = node && textOf(node)
  const seenNote = withText && seen ? `화면에 보이는 "${seen}" 부분` : ''
  const prompt = !node
    ? '브라우저 개발자 도구로 화면의 특정 부분을 골라서 너에게 알려주고 싶어. 요소 선택(Cmd+Shift+C)으로 고른 다음 "요소 복사"와 "선택자 복사" 중 무엇을 보내는 게 좋은지, 왜 그런지 알려줘.'
    : mode === 'element'
      ? `${ASK[ask](`개발자 도구에서 복사한 아래 요소${seenNote ? `(${seenNote})` : ''}`)} ${out}`
      : ASK[ask](`개발자 도구에서 고른 요소(${mode === 'selector' ? '선택자' : 'JS 경로'}: ${out}${seenNote ? `, ${seenNote}` : ''})`)

  return (
    <Shell
      hint="↖ 버튼을 켜고 화면 위에 마우스를 올려보세요"
      stage={
        <div className="pg-ie" ref={wrapRef} onClick={() => setMenu(null)}>
          <div
            ref={pageRef}
            className={'pg-ie-page' + (pick ? ' picking' : '')}
            onMouseMove={(e) => {
              if (!pick) return
              const t = e.target.closest('[data-ie]')
              if (t && Number(t.dataset.ie) !== hover?.key) {
                showHover(Number(t.dataset.ie))
                reveal(Number(t.dataset.ie))
              }
            }}
            onMouseLeave={() => pick && showHover(null)}
            onClickCapture={(e) => {
              if (!pick) return
              e.preventDefault()
              e.stopPropagation()
              const t = e.target.closest('[data-ie]')
              if (t) select(Number(t.dataset.ie), '화면에서 선택')
              setPick(false)
              setHover(null)
            }}
          >
            <PageNode x={PAGE} refs={refs} />
            {sel && !hover && <div className="pg-ie-box sel" style={{ left: sel.x, top: sel.y, width: sel.w, height: sel.h }} />}
            {hover && (
              <div className="pg-ie-box" style={{ left: hover.x, top: hover.y, width: hover.w, height: hover.h }}>
                <span className={'pg-ie-tip mono' + (hover.y < 26 ? ' below' : '')}>
                  <b>{nameOf(NODES[hover.key])}</b> {Math.round(hover.w)} × {Math.round(hover.h)}
                </span>
              </div>
            )}
          </div>

          <div className="pg-ie-tools mono">
            <div className="pg-con-tabs pg-ie-tabs">
              <button className={'pg-ie-pick' + (pick ? ' on' : '')} title="요소 선택 (Cmd+Shift+C)" onClick={() => togglePick(!pick)}>
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2.5H3.5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3" strokeDasharray="2 1.6" />
                  <path d="M7.5 7.5l6.5 2.4-2.8 1.1-1.1 2.8z" fill="currentColor" stroke="none" />
                </svg>
              </button>
              <b>Elements</b>
              <span>Console</span>
            </div>
            <div className="pg-ie-tree" ref={treeRef} onMouseLeave={() => showHover(null)} onScroll={() => setMenu(null)}>
              {NODES.map((x) => (
                <div
                  key={x.key}
                  ref={(n) => (rows.current[x.key] = n)}
                  className={'pg-ie-row' + (sel?.key === x.key ? ' on' : '') + (hover?.key === x.key ? ' hov' : '')}
                  style={{ paddingLeft: 10 + x.depth * 14 }}
                  onMouseEnter={() => showHover(x.key)}
                  onClick={() => select(x.key, '코드에서 선택')}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setMenu({ key: x.key, y: e.currentTarget.getBoundingClientRect().bottom - wrapRef.current.getBoundingClientRect().top })
                  }}
                >
                  <span className="pg-ie-arrow">{x.children.length ? '▾' : ''}</span>
                  <span className="t">&lt;{x.tag}</span>
                  {x.id && (
                    <>
                      {' '}
                      <span className="a">id</span>=<span className="v">"{x.id}"</span>
                    </>
                  )}
                  {x.cls && (
                    <>
                      {' '}
                      <span className="a">class</span>=<span className="v">"{x.cls}"</span>
                    </>
                  )}
                  <span className="t">&gt;</span>
                  {x.text}
                  {!x.children.length && <span className="t">&lt;/{x.tag}&gt;</span>}
                </div>
              ))}
            </div>
            <div className="pg-ie-crumb">{node ? pathOf(node).map(nameOf).join(' › ') : '요소를 고르면 여기에 위치가 나와요'}</div>
            {copied && (
              <div className="pg-ie-clip">
                <span>클립보드</span>
                <pre>{copied}</pre>
              </div>
            )}
          </div>
          <AnimatePresence>
            {menu && (
              <motion.div className="pg-ie-menu" style={{ top: menu.y }} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} onClick={(e) => e.stopPropagation()}>
                <span className="dim">복사 ▸</span>
                {Object.entries(COPY).map(([k, c]) => (
                  <button key={k} onClick={() => copy(menu.key, k)}>
                    {c.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
      controls={
        <>
          <Toggle label="요소 선택 모드 (Cmd+Shift+C)" value={pick} onChange={togglePick} />
          <Segmented label="AI에게 보낼 것 (요소 우클릭 → 복사)" value={mode} onChange={changeMode} options={Object.entries(COPY).map(([value, c]) => ({ value, label: c.label.replace(' 복사', '') }))} />
          <Segmented label="시킬 일" value={ask} onChange={setAsk} options={[{ value: 'size', label: '크게' }, { value: 'color', label: '주황색' }, { value: 'hide', label: '숨기기' }]} />
          <Toggle
            label="화면에 보이는 글자도 함께 적기"
            value={withText}
            onChange={(v) => {
              setWithText(v)
              push('option', v ? '보이는 글자를 같이 적으면 AI가 코드에서 더 빨리 찾아요' : '글자 없이 선택자만 보내면 비슷한 요소와 헷갈릴 수 있어요')
            }}
          />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Console로 값 바꾸기 ───────── */

const ORIG = { title: '오늘의 매출', revenue: '₩1,240,000', orders: '38', visitors: '1,024', percent: '62%', bar: '62%' }
const FIELD = { title: '제목', revenue: '매출', orders: '주문 수', visitors: '방문자', percent: '목표 달성률', bar: '진행 막대 너비' }

// 격리된 iframe 안의 진짜 페이지. 부모가 보낸 명령을 eval하고, 결과와 화면 값을 돌려보낸다
const DASH = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:14px 16px;font-family:-apple-system,BlinkMacSystemFont,'Pretendard',sans-serif;color:#1f1f24;background:#fff}
h2{font-size:15px;margin:0 0 10px;letter-spacing:-.01em}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}
.card{border:1px solid #ece8e0;border-radius:12px;padding:9px 12px;min-width:0}
.card span{display:block;font-size:11px;color:#8a857b;margin-bottom:3px}
.card b{display:block;font-size:19px;white-space:nowrap;letter-spacing:-.02em}
.goal{margin-top:10px;font-size:11px;color:#8a857b}.goal b{color:#1f1f24}
.track{height:8px;background:#f0ede6;border-radius:99px;margin-top:5px;overflow:hidden}
.bar{height:100%;width:62%;background:#FF6B2C;border-radius:99px;transition:width .5s}
[contenteditable=true] :is(h2,b):hover{outline:1.5px dashed #FF6B2C;outline-offset:2px}
@media (max-width:360px){.grid{grid-template-columns:1fr 1fr}.card b{font-size:15px}}
</style>
<h2 class="title">${ORIG.title}</h2>
<div class="grid">
<div class="card"><span>매출</span><b class="revenue">${ORIG.revenue}</b></div>
<div class="card"><span>주문 수</span><b id="orders">${ORIG.orders}</b></div>
<div class="card"><span>방문자</span><b class="visitors">${ORIG.visitors}</b></div>
</div>
<div class="goal">이번 달 목표 <b class="percent">${ORIG.percent}</b><div class="track"><div class="bar"></div></div></div>
<script>
const q = (s) => document.querySelector(s)
window.$ = q
window.$$ = (s) => [...document.querySelectorAll(s)]
const fmt = (v) => v === undefined ? 'undefined' : typeof v === 'string' ? JSON.stringify(v) : v instanceof Element ? '<' + v.tagName.toLowerCase() + (v.id ? '#' + v.id : '') + (v.className ? '.' + v.className.split(' ').join('.') : '') + '>' : Array.isArray(v) ? '[' + v.map(fmt).join(', ') + ']' : String(v)
const snap = () => {
  const over = [...document.querySelectorAll('.card')].find((c) => c.scrollWidth > c.clientWidth + 1)
  return { title: q('.title').textContent, revenue: q('.revenue').textContent, orders: q('#orders').textContent, visitors: q('.visitors').textContent, percent: q('.percent').textContent, bar: q('.bar').style.width || '62%', over: over ? over.querySelector('span').textContent : null, editable: document.body.isContentEditable }
}
const send = (m) => parent.postMessage(m, '*')
console.log = (...a) => send({ type: 'log', v: a.map((x) => (typeof x === 'string' ? x : fmt(x))).join(' ') })
addEventListener('message', (e) => {
  if (e.source !== parent || typeof (e.data && e.data.cmd) !== 'string') return
  try { send({ type: 'result', ok: true, v: fmt((0, eval)(e.data.cmd)) }) }
  catch (err) { send({ type: 'result', ok: false, v: 'Uncaught ' + err }) }
  requestAnimationFrame(() => send({ type: 'snap', s: snap() }))
})
document.addEventListener('input', () => send({ type: 'snap', s: snap() }))
send({ type: 'ready', s: snap() })
<\/script>`

const PRESETS = [
  ['매출 숫자 바꾸기', "document.querySelector('.revenue').textContent = '₩9,999,999'"],
  ['주문 수 바꾸기', "document.querySelector('#orders').textContent = 1200"],
  ['아주 긴 숫자 넣기', "document.querySelector('.revenue').textContent = '₩123,456,789,000'"],
  ['목표 100% 채우기', "document.querySelector('.bar').style.width = '100%'; document.querySelector('.percent').textContent = '100%'"],
  ['지금 값 읽기', "document.querySelector('.revenue').textContent"],
  ['화면 글자 직접 고치기', 'document.body.contentEditable = true'],
]

function ConsoleEditPG() {
  const frame = useRef(null)
  const listRef = useRef(null)
  const prev = useRef(null)
  const hist = useRef({ list: [], i: 0 })
  const [gen, setGen] = useState(0)
  const [lines, setLines] = useState([])
  const [snap, setSnap] = useState(null)
  const [input, setInput] = useState('')
  const { logs, push, clear } = useEventLog()

  useEffect(() => {
    const on = (e) => {
      if (!frame.current || e.source !== frame.current.contentWindow) return
      const d = e.data
      if (d.type === 'result') setLines((l) => [...l, { k: d.ok ? 'out' : 'err', s: d.v }])
      if (d.type === 'result' && !d.ok) push('close', /null/.test(d.v) ? '그 이름의 요소가 화면에 없어요(null). 점(.)이나 #까지 이름을 다시 확인해보세요' : '명령에 오타가 있어요. 빨간 줄을 읽어보세요')
      if (d.type === 'log') setLines((l) => [...l, { k: 'log', s: d.v }])
      if (d.type === 'snap' && prev.current) {
        for (const k of Object.keys(FIELD)) if (d.s[k] !== prev.current[k]) push('end', `${FIELD[k]}: ${prev.current[k]} → ${d.s[k]}`)
        if (d.s.over && !prev.current.over) push('close', `${d.s.over} 숫자가 길어서 카드 밖으로 넘쳤어요`)
        if (d.s.editable && !prev.current.editable) push('child', '이제 화면 속 제목과 숫자를 클릭해서 직접 고쳐보세요')
      }
      if (d.type === 'snap' || d.type === 'ready') {
        prev.current = d.s
        setSnap(d.s)
      }
    }
    addEventListener('message', on)
    return () => removeEventListener('message', on)
  }, [push])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [lines])

  const run = (cmd) => {
    if (!cmd.trim() || !frame.current) return
    setLines((l) => [...l, { k: 'in', s: cmd }])
    frame.current.contentWindow.postMessage({ cmd }, '*')
    hist.current.list.push(cmd)
    hist.current.i = hist.current.list.length
    setInput('')
  }
  const reload = () => {
    setGen((g) => g + 1)
    setLines((l) => [...l, { k: 'nav', s: '새로고침함 — 콘솔로 바꾼 값은 모두 원래대로' }])
    push('child', '새로고침 → 코드에 적힌 원래 화면으로 돌아옴')
  }
  const onKey = (e) => {
    const h = hist.current
    if (e.key === 'Enter') run(input)
    else if (e.key === 'ArrowUp' && h.i > 0) setInput(h.list[--h.i])
    else if (e.key === 'ArrowDown' && h.i < h.list.length) setInput(h.list[++h.i] ?? '')
    else return
    e.preventDefault()
  }

  const changed = snap ? Object.keys(FIELD).filter((k) => snap[k].trim() !== ORIG[k]) : []
  const prompt = snap?.over
    ? `대시보드의 ${snap.over} 카드에 "${snap[Object.keys(FIELD).find((k) => FIELD[k] === snap.over)]}"처럼 긴 숫자가 들어가면 글자가 카드 밖으로 넘쳐. (개발자 도구 콘솔로 숫자를 바꿔서 확인해봤어.) 숫자가 아무리 길어도 카드 안에 들어가도록 글자 크기를 자동으로 줄이거나, 1억 이상은 "1,234억"처럼 줄여서 보여줘.`
    : changed.length
      ? `개발자 도구 콘솔로 대시보드 화면의 값을 임시로 바꿔봤어: ${changed.map((k) => `${FIELD[k]} ${ORIG[k]} → ${snap[k].trim()}`).join(', ')}. 새로고침하면 사라지니까, 실제 코드에서도 이 값으로 보이게 바꿔줘. 값이 코드에 직접 적혀 있으면 데이터(JSON)로 따로 빼서.`
      : '브라우저 개발자 도구의 콘솔(Console)에서 지금 보이는 화면의 숫자를 임시로 바꿔보고 싶어. document.querySelector로 매출 숫자를 바꾸는 한 줄짜리 명령을 알려주고, 새로고침하면 왜 원래대로 돌아오는지도 쉽게 설명해줘.'

  return (
    <Shell
      hint="조절판의 명령을 누르거나 콘솔에 직접 입력해보세요"
      stage={
        <div className="pg-ce">
          <iframe key={gen} ref={frame} className="pg-ce-frame" title="대시보드" sandbox="allow-scripts" srcDoc={DASH} />
          <div className="pg-con-panel mono">
            <div className="pg-con-tabs">
              <span>Elements</span>
              <b>Console</b>
            </div>
            <div className="pg-con-list pg-ce-list" ref={listRef}>
              {lines.length === 0 && <div className="pg-con-row dim">아래에 명령을 입력하고 Enter를 눌러보세요</div>}
              {lines.map((l, i) => (
                <div key={i} className={'pg-con-row pg-ce-' + l.k + (l.k === 'err' ? ' error' : '')}>
                  <span>{{ in: '›', out: '‹', err: '✕', log: ' ', nav: '↻' }[l.k]}</span>
                  <div>{l.s}</div>
                </div>
              ))}
            </div>
            <label className="pg-ce-input">
              <span>›</span>
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} placeholder="document.querySelector('.revenue').textContent = '₩5,000'" spellCheck={false} autoCapitalize="off" />
            </label>
          </div>
        </div>
      }
      controls={
        <>
          <div className="ctl">
            <span className="ctl-top">
              <span>눌러서 콘솔에 입력하기</span>
            </span>
            <div className="pg-ce-presets">
              {PRESETS.map(([label, cmd]) => (
                <button key={label} className="chip-btn" onClick={() => run(cmd)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button className="btn small" onClick={reload}>
            ↻ 새로고침 (Cmd+R)
          </button>
          <p className="pg-note">콘솔로 바꾼 건 내 화면에만 잠깐 보이는 거예요. 진짜 코드와 다른 사람 화면은 그대로예요.</p>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

export const DEVTOOLS_PGS = {
  'inspect-element': InspectElementPG,
  'console-edit': ConsoleEditPG,
}
