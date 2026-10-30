import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Shell, EventLog, useEventLog, Slider, Segmented, Toggle } from '../components/kit'
import { C, PALETTE, Icon } from '../demos/parts'

// 코드 입력 칸 (탭 키로 들여쓰기)
export const CodeArea = ({ value, onChange, rows = 10, ...p }) => (
  <textarea
    className="pg-code"
    spellCheck={false}
    rows={rows}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={(e) => {
      if (e.key !== 'Tab') return
      e.preventDefault()
      const el = e.currentTarget
      const s = el.selectionStart
      onChange(value.slice(0, s) + '  ' + value.slice(el.selectionEnd))
      requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2))
    }}
    {...p}
  />
)

/* ───────── Markdown ───────── */

const MD_SAMPLES = {
  readme: '# 할 일 앱\n\n**말로 만든** 첫 번째 앱이에요.\n\n## 기능\n- 할 일 추가\n- 완료 체크\n- `localStorage`에 저장\n\n> 바이브코딩으로 하루 만에 만들었어요.\n\n[사이트 보기](https://example.com)',
  memo: '## 오늘 회의\n1. 로그인 화면 디자인 확정\n2. 배포는 **금요일**\n3. 버그 목록 정리\n\n---\n\n다음 회의: 월요일',
}

// 한 줄 안의 **굵게**, `코드`, [링크](주소)
function inline(text, key = 0) {
  const parts = []
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
  let last = 0
  let m
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const t = m[0]
    if (t.startsWith('**')) parts.push(<b key={key + '-' + m.index}>{t.slice(2, -2)}</b>)
    else if (t.startsWith('`')) parts.push(<code key={key + '-' + m.index}>{t.slice(1, -1)}</code>)
    else {
      const [, label] = t.match(/\[([^\]]+)\]/)
      parts.push(<a key={key + '-' + m.index}>{label}</a>)
    }
    last = m.index + t.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function renderMd(src) {
  const out = []
  const stats = { 제목: 0, 목록: 0, 굵게: (src.match(/\*\*[^*]+\*\*/g) || []).length, 링크: (src.match(/\[[^\]]+\]\([^)]+\)/g) || []).length }
  let list = null
  const flush = () => {
    if (list) out.push(list.ordered ? <ol key={out.length}>{list.items}</ol> : <ul key={out.length}>{list.items}</ul>)
    list = null
  }
  src.split('\n').forEach((line, i) => {
    let m
    if ((m = line.match(/^(#{1,3})\s+(.*)/))) {
      flush()
      stats.제목++
      const H = 'h' + (m[1].length + 1)
      out.push(<H key={i}>{inline(m[2], i)}</H>)
    } else if ((m = line.match(/^\s*([-*]|\d+\.)\s+(.*)/))) {
      const ordered = /\d/.test(m[1])
      if (!list || list.ordered !== ordered) {
        flush()
        list = { ordered, items: [] }
      }
      stats.목록++
      list.items.push(<li key={i}>{inline(m[2], i)}</li>)
    } else if ((m = line.match(/^>\s?(.*)/))) {
      flush()
      out.push(<blockquote key={i}>{inline(m[1], i)}</blockquote>)
    } else if (/^---+$/.test(line.trim())) {
      flush()
      out.push(<hr key={i} />)
    } else if (line.trim()) {
      flush()
      out.push(<p key={i}>{inline(line, i)}</p>)
    } else flush()
  })
  flush()
  return { out, stats }
}

function MarkdownPG() {
  const [src, setSrc] = useState(MD_SAMPLES.readme)
  const [sample, setSample] = useState('readme')
  const [view, setView] = useState('split')
  const { logs, push, clear } = useEventLog()
  const { out, stats } = useMemo(() => renderMd(src), [src])
  const summary = Object.entries(stats)
    .filter(([, n]) => n)
    .map(([k, n]) => `${k} ${n}`)
    .join(' · ')
  const prev = useRef('')
  useEffect(() => {
    const id = setTimeout(() => {
      if (summary !== prev.current) push('child', `인식: ${summary || '일반 글만'}`)
      prev.current = summary
    }, 500)
    return () => clearTimeout(id)
  }, [summary, push])

  const prompt = `이 프로젝트의 README.md를 마크다운(Markdown)으로 써줘. 맨 위에 "# 앱 이름" 제목, 한 줄 소개, "## 기능"에 글머리 목록(-)으로 기능 정리, "## 실행 방법"에는 명령어를 \`코드\`로 감싸서. 중요한 말은 **굵게**, 배포 주소는 [링크](주소) 형식으로.`

  return (
    <Shell
      hint="왼쪽 원본을 고치면 오른쪽 결과가 바로 바뀌어요"
      stage={
        <div className={'pg-md ' + view}>
          {view !== 'preview' && (
            <div className="pg-md-col">
              <span className="pg-md-tag mono">README.md (원본)</span>
              <CodeArea value={src} onChange={setSrc} rows={14} />
            </div>
          )}
          {view !== 'source' && (
            <div className="pg-md-col">
              <span className="pg-md-tag mono">보이는 모습</span>
              <div className="pg-md-out">{out}</div>
            </div>
          )}
        </div>
      }
      controls={
        <>
          <Segmented
            label="예시"
            value={sample}
            onChange={(v) => {
              setSample(v)
              setSrc(MD_SAMPLES[v])
              push('option', v === 'readme' ? 'README 예시 불러옴' : '회의 메모 예시 불러옴')
            }}
            options={[{ value: 'readme', label: 'README' }, { value: 'memo', label: '회의 메모' }]}
          />
          <Segmented label="보기" value={view} onChange={setView} options={[{ value: 'split', label: '나란히' }, { value: 'source', label: '원본만' }, { value: 'preview', label: '결과만' }]} />
          <div className="pg-cheat">
            <b>자주 쓰는 기호</b>
            <span><code># 제목</code> 큰 제목</span>
            <span><code>- 항목</code> 글머리 목록</span>
            <span><code>**굵게**</code> 굵은 글씨</span>
            <span><code>`코드`</code> 코드 표시</span>
            <span><code>[글](주소)</code> 링크</span>
          </div>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── JSON ───────── */

const JSON_SAMPLES = {
  ok: '{\n  "name": "할 일 앱",\n  "version": 1,\n  "done": false,\n  "tags": ["개인", "공부"],\n  "owner": { "id": 7, "nick": "지수" }\n}',
  comma: '{\n  "name": "할 일 앱"\n  "version": 1\n}',
  quote: "{\n  'name': '할 일 앱',\n  \"version\": 1\n}",
  trailing: '{\n  "name": "할 일 앱",\n  "tags": ["개인", "공부",],\n}',
}
const JSON_HINT = { comma: '줄 끝에 쉼표(,)가 빠졌어요', quote: '작은따옴표(\') 대신 큰따옴표(")를 써야 해요', trailing: '마지막 항목 뒤에는 쉼표를 쓰면 안 돼요' }

function JsonNode({ k, v, depth = 0 }) {
  const [open, setOpen] = useState(true)
  const isObj = v && typeof v === 'object'
  const color = typeof v === 'string' ? '#158a6c' : typeof v === 'number' ? '#2a6fd6' : typeof v === 'boolean' ? '#d23f78' : '#9a958b'
  return (
    <div className="pg-json-node" style={{ paddingLeft: depth ? 14 : 0 }}>
      {isObj ? (
        <>
          <button onClick={() => setOpen(!open)}>
            {open ? '▾' : '▸'} {k !== undefined && <em>{k}</em>} <small>{Array.isArray(v) ? `목록 ${v.length}개` : `묶음 ${Object.keys(v).length}개`}</small>
          </button>
          {open && Object.entries(v).map(([ck, cv]) => <JsonNode key={ck} k={Array.isArray(v) ? `[${ck}]` : ck} v={cv} depth={depth + 1} />)}
        </>
      ) : (
        <span>
          <em>{k}</em>: <b style={{ color }}>{JSON.stringify(v)}</b>
        </span>
      )}
    </div>
  )
}

function JsonPG() {
  const [src, setSrc] = useState(JSON_SAMPLES.ok)
  const [sample, setSample] = useState('ok')
  const [indent, setIndent] = useState(2)
  const { logs, push, clear } = useEventLog()
  const result = useMemo(() => {
    try {
      return { data: JSON.parse(src) }
    } catch (e) {
      const pos = Number((e.message.match(/position (\d+)/) || [])[1])
      const line = Number.isFinite(pos) ? src.slice(0, pos).split('\n').length : null
      return { error: e.message, line }
    }
  }, [src])
  const prev = useRef(null)
  useEffect(() => {
    const ok = !result.error
    if (prev.current !== ok) push(ok ? 'end' : 'close', ok ? '올바른 JSON → 읽기 성공' : `읽기 실패${result.line ? ` (${result.line}번째 줄 근처)` : ''}`)
    prev.current = ok
  }, [result, push])

  const prompt = `이 JSON에서 오류가 나는 곳을 찾아서 고쳐줘. 키와 문자열은 큰따옴표("), 항목 사이에는 쉼표, 마지막 항목 뒤에는 쉼표 없이. 고친 다음 들여쓰기 ${indent}칸으로 보기 좋게 정리해서 보여줘.`

  return (
    <Shell
      hint="왼쪽 JSON을 고쳐보세요 (쉼표 하나만 지워도 깨져요)"
      stage={
        <div className="pg-md split">
          <div className="pg-md-col">
            <span className="pg-md-tag mono">data.json</span>
            <CodeArea value={src} onChange={setSrc} rows={12} />
          </div>
          <div className="pg-md-col">
            <span className={'pg-md-tag mono ' + (result.error ? 'bad' : 'good')}>{result.error ? '✕ 읽을 수 없어요' : '✓ 컴퓨터가 읽은 구조'}</span>
            <div className="pg-md-out pg-json-out">
              {result.error ? (
                <div className="pg-json-err">
                  <b>{result.line ? `${result.line}번째 줄 근처에 문제가 있어요` : '형식이 맞지 않아요'}</b>
                  {JSON_HINT[sample] && <p>힌트: {JSON_HINT[sample]}</p>}
                  <code>{result.error}</code>
                </div>
              ) : (
                <JsonNode v={result.data} />
              )}
            </div>
          </div>
        </div>
      }
      controls={
        <>
          <div className="ctl">
            <span className="ctl-top">
              <span>예시 불러오기</span>
            </span>
            <div className="presets">
              {[
                ['ok', '정상'],
                ['comma', '쉼표 빠짐'],
                ['quote', '작은따옴표'],
                ['trailing', '끝에 쉼표'],
              ].map(([k, l]) => (
                <button
                  key={k}
                  className={'chip-btn' + (sample === k ? ' on' : '')}
                  onClick={() => {
                    setSample(k)
                    setSrc(JSON_SAMPLES[k])
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <Segmented label="들여쓰기" value={indent} onChange={setIndent} options={[{ value: 2, label: '2칸' }, { value: 4, label: '4칸' }, { value: 0, label: '한 줄로' }]} />
          <button
            className="btn"
            disabled={!!result.error}
            onClick={() => {
              setSrc(JSON.stringify(result.data, null, indent || undefined))
              push('option', indent ? `${indent}칸 들여쓰기로 정리` : '한 줄로 압축')
            }}
          >
            보기 좋게 정리하기
          </button>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── State ───────── */

const SHOP = [
  { id: 'tee', name: '티셔츠', price: 19000 },
  { id: 'cap', name: '모자', price: 15000 },
  { id: 'bag', name: '가방', price: 32000 },
]

function StatePG() {
  const [cart, setCart] = useState({ tee: 1 })
  const [saved, setSaved] = useState(null)
  const [persist, setPersist] = useState(false)
  const [flash, setFlash] = useState(0)
  const { logs, push, clear } = useEventLog()
  const count = Object.values(cart).reduce((a, b) => a + b, 0)
  const total = SHOP.reduce((s, p) => s + (cart[p.id] || 0) * p.price, 0)

  const change = (id, d) => {
    const before = cart[id] || 0
    const after = Math.max(0, before + d)
    if (after === before) return
    const next = { ...cart, [id]: after }
    if (!after) delete next[id]
    setCart(next)
    if (persist) setSaved(next)
    setFlash((f) => f + 1)
    push('move', `cart.${id}: ${before} → ${after} → 화면 다시 그림`)
  }
  const refresh = () => {
    setCart(persist && saved ? saved : {})
    setFlash((f) => f + 1)
    push(persist ? 'end' : 'close', persist ? '새로고침 → 저장해 둔 상태로 복원' : '새로고침 → 상태가 처음으로 초기화됨')
  }

  const prompt = `장바구니 개수와 담긴 상품을 상태(State)로 관리해줘. +/− 버튼을 누르면 상태가 바뀌고, 상단 장바구니 배지와 합계 금액이 그 상태를 보고 자동으로 다시 그려지게 (같은 상태를 여러 곳에서 함께 쓰도록). ${persist ? '새로고침해도 장바구니가 남아 있도록 localStorage에 저장해줘.' : '지금은 새로고침하면 비워져도 괜찮아.'}`

  return (
    <Shell
      hint="+/− 를 누르면 '상태'가 바뀌고 화면이 따라 바뀌어요"
      stage={
        <div className="pg-state">
          <div className="pg-page pg-state-app">
            <div className="pg-page-nav">
              <b>MyShop</b>
              <span className="pg-state-cart">
                🛒
                <motion.em key={count} initial={{ scale: 0.4 }} animate={{ scale: 1 }}>
                  {count}
                </motion.em>
              </span>
            </div>
            <div className="pg-state-list">
              {SHOP.map((p, i) => (
                <div key={p.id} className="pg-state-row">
                  <span style={{ background: PALETTE[i] }} />
                  <b>{p.name}</b>
                  <small>{p.price.toLocaleString()}원</small>
                  <div className="pg-qty">
                    <button onClick={() => change(p.id, -1)}>−</button>
                    <em>{cart[p.id] || 0}</em>
                    <button onClick={() => change(p.id, 1)}>+</button>
                  </div>
                </div>
              ))}
              <div className="pg-state-total">
                합계 <b>{total.toLocaleString()}원</b>
              </div>
            </div>
          </div>
          <div className="pg-state-mem">
            <span className="pg-md-tag mono">상태 (메모리 속 값)</span>
            <motion.pre key={flash} initial={{ background: '#fff3d1' }} animate={{ background: '#1f1f24' }} transition={{ duration: 0.8 }}>
              {`cart = ${JSON.stringify(cart, null, 1).replace(/\n\s*/g, ' ')}\ncount = ${count}\ntotal = ${total}`}
            </motion.pre>
            <button className="btn small" onClick={refresh}>
              ⟳ 새로고침
            </button>
          </div>
        </div>
      }
      controls={
        <>
          <Toggle
            label="새로고침해도 유지 (localStorage)"
            value={persist}
            onChange={(v) => {
              setPersist(v)
              if (v) setSaved(cart)
            }}
          />
          <p className="pg-note" style={{ margin: 0 }}>
            상태가 바뀔 때마다 오른쪽 값이 노랗게 깜빡이고, 그 값을 쓰는 배지·수량·합계가 한꺼번에 다시 그려져요.
          </p>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Component ───────── */

function ProductCard({ name, price, sale, color, radius }) {
  return (
    <motion.div layout className="pg-comp-card" style={{ borderRadius: radius }}>
      <span style={{ background: color, borderRadius: Math.max(0, radius - 6) }}>{sale && <em>SALE</em>}</span>
      <b>{name}</b>
      <small>{sale ? <><s>{price.toLocaleString()}</s> {(price * 0.8).toLocaleString()}원</> : `${price.toLocaleString()}원`}</small>
    </motion.div>
  )
}

function ComponentPG() {
  const [radius, setRadius] = useState(14)
  const [items, setItems] = useState([
    { name: '티셔츠', price: 19000, sale: false, color: C.sky },
    { name: '모자', price: 15000, sale: true, color: C.mint },
    { name: '가방', price: 32000, sale: false, color: C.pink },
  ])
  const [sel, setSel] = useState(1)
  const { logs, push, clear } = useEventLog()
  const it = items[sel]
  const edit = (patch, msg) => {
    setItems(items.map((x, i) => (i === sel ? { ...x, ...patch } : x)))
    push('child', `${sel + 1}번 카드만 바뀜: ${msg}`)
  }

  const prompt = `상품 카드를 재사용할 수 있는 컴포넌트(Component) <ProductCard />로 만들어줘. name, price, sale, color를 props로 받고, sale이 true면 원래 가격에 줄을 긋고 20% 할인된 가격과 SALE 표시. 모서리(${radius}px) 같은 공통 디자인은 컴포넌트 안에서 한 번만 정해서, 고치면 모든 카드에 한꺼번에 반영되게.`

  return (
    <Shell
      hint="카드를 골라 내용을 바꾸고, 공통 모서리도 바꿔보세요"
      stage={
        <div className="pg-comp">
          <div className="pg-comp-row">
            {items.map((x, i) => (
              <button key={i} className={'pg-comp-pick' + (i === sel ? ' on' : '')} onClick={() => setSel(i)}>
                <ProductCard {...x} radius={radius} />
              </button>
            ))}
          </div>
          <pre className="pg-comp-code">
            {`<ProductCard\n  name="${it.name}"\n  price={${it.price}}\n  sale={${it.sale}}\n  color="${it.color}"\n/>`}
          </pre>
        </div>
      }
      controls={
        <>
          <span className="pg-label">{sel + 1}번 카드의 props</span>
          <label className="ctl">
            <span className="ctl-top">
              <span>name</span>
            </span>
            <input className="pg-input" value={it.name} maxLength={10} onChange={(e) => edit({ name: e.target.value }, `name="${e.target.value}"`)} />
          </label>
          <Slider label="price" value={it.price} min={5000} max={50000} step={1000} unit="원" onChange={(v) => edit({ price: v }, `price=${v}`)} />
          <Toggle label="sale" value={it.sale} onChange={(v) => edit({ sale: v }, `sale=${v}`)} />
          <Slider
            label="공통: 모서리 (컴포넌트 안)"
            value={radius}
            min={0}
            max={28}
            step={2}
            unit="px"
            onChange={(v) => {
              setRadius(v)
              push('move', `컴포넌트 수정 → 카드 3개 모두 모서리 ${v}px`)
            }}
          />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── API ───────── */

const ENDPOINTS = {
  'GET /api/products': { status: 200, body: [{ id: 1, name: '티셔츠' }, { id: 2, name: '모자' }] },
  'GET /api/products/1': { status: 200, body: { id: 1, name: '티셔츠', price: 19000 } },
  'POST /api/products': { status: 201, body: { id: 3, name: '새 상품', created: true } },
  'GET /api/nope': { status: 404, body: { error: '그런 주소는 없어요' } },
}

function ApiPG() {
  const [ep, setEp] = useState('GET /api/products')
  const [latency, setLatency] = useState(0.8)
  const [crash, setCrash] = useState(false)
  const [phase, setPhase] = useState('idle')
  const [res, setRes] = useState(null)
  const timers = useRef([])
  const { logs, push, clear } = useEventLog()
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const send = () => {
    timers.current.forEach(clearTimeout)
    setRes(null)
    setPhase('req')
    push('start', `요청 보냄: ${ep}`)
    const r = crash ? { status: 500, body: { error: '서버 내부 오류' } } : ENDPOINTS[ep]
    timers.current = [
      setTimeout(() => (setPhase('server'), push('child', '서버가 요청을 받아 처리 중')), (latency * 1000) / 2),
      setTimeout(() => setPhase('res'), latency * 1000),
      setTimeout(() => {
        setPhase('done')
        setRes(r)
        push(r.status < 300 ? 'end' : 'close', `응답 도착: ${r.status} ${r.status < 300 ? '성공' : '실패'} (${latency}s)`)
      }, latency * 1500),
    ]
  }
  const [method, path] = ep.split(' ')
  const prompt = `프론트엔드에서 ${method === 'GET' ? '상품 목록을 가져오는' : '새 상품을 등록하는'} API를 호출해줘. ${method} ${path}로 fetch 요청을 보내고, 기다리는 동안 로딩 표시, 성공(2xx)하면 받은 JSON으로 화면을 그리고, 실패(404·500)하면 "잠시 후 다시 시도해주세요" 안내를 보여줘. 응답이 ${latency}초 넘게 걸릴 수 있으니 버튼은 중복 클릭을 막아줘.`

  return (
    <Shell
      hint="'요청 보내기'를 눌러보세요"
      stage={
        <div className="pg-api">
          <div className="pg-api-lanes">
            <div className={'pg-api-box' + (phase === 'req' || phase === 'done' ? ' on' : '')}>
              <Icon n="laptop" size={26} />
              <b>내 화면</b>
              <small>프론트엔드</small>
            </div>
            <div className="pg-api-wire">
              <AnimatePresence>
                {phase === 'req' && (
                  <motion.span key="q" className="pg-api-pkt req" initial={{ left: '0%' }} animate={{ left: '100%' }} transition={{ duration: latency / 2, ease: 'linear' }}>
                    {method}
                  </motion.span>
                )}
                {phase === 'res' && (
                  <motion.span key="s" className={'pg-api-pkt ' + ((crash ? 500 : ENDPOINTS[ep].status) < 300 ? 'ok' : 'bad')} initial={{ left: '100%' }} animate={{ left: '0%' }} transition={{ duration: latency / 2, ease: 'linear' }}>
                    {crash ? 500 : ENDPOINTS[ep].status}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className={'pg-api-box' + (phase === 'server' ? ' on' : '')}>
              <Icon n="server" size={26} />
              <b>서버</b>
              <small>백엔드 API</small>
              {phase === 'server' && <motion.span className="pg-spin" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />}
            </div>
          </div>
          <div className="pg-api-req mono">
            <b className={method}>{method}</b> {path}
            <button className="btn small" onClick={send} disabled={phase !== 'idle' && phase !== 'done'}>
              요청 보내기
            </button>
          </div>
          <pre className={'pg-api-res' + (res && res.status >= 300 ? ' bad' : '')}>{res ? `HTTP ${res.status}\n${JSON.stringify(res.body, null, 2)}` : '응답이 여기에 표시돼요'}</pre>
        </div>
      }
      controls={
        <>
          <div className="ctl">
            <span className="ctl-top">
              <span>요청 (메서드 + 주소)</span>
            </span>
            <div className="presets">
              {Object.keys(ENDPOINTS).map((k) => (
                <button key={k} className={'chip-btn mono' + (k === ep ? ' on' : '')} style={{ fontSize: 11.5 }} onClick={() => setEp(k)}>
                  {k}
                </button>
              ))}
            </div>
          </div>
          <Slider label="서버 응답 시간" value={latency} min={0.2} max={3} step={0.1} unit="s" onChange={setLatency} />
          <Toggle label="서버 고장 내기 (500)" value={crash} onChange={setCrash} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Terminal ───────── */

const FS = { '~': ['projects', 'Desktop'], '~/projects': ['todo-app'], '~/projects/todo-app': ['package.json', 'src', 'README.md'], '~/Desktop': [] }

function TerminalPG() {
  const [lines, setLines] = useState([{ t: 'out', s: '명령어를 입력하고 Enter. help 를 입력하면 쓸 수 있는 명령어가 나와요.' }])
  const [cwd, setCwd] = useState('~')
  const [input, setInput] = useState('')
  const [hist, setHist] = useState([])
  const [hi, setHi] = useState(-1)
  const [theme, setTheme] = useState('dark')
  const box = useRef(null)
  // 가짜 파일 시스템 (mkdir은 이 체험 화면 안에서만 남는다)
  const fs = useRef(JSON.parse(JSON.stringify(FS)))
  const { logs, push, clear } = useEventLog()
  useEffect(() => {
    box.current.scrollTop = box.current.scrollHeight
  }, [lines])

  const run = (cmd) => {
    const [c, ...args] = cmd.trim().split(/\s+/)
    const a = args.join(' ')
    const o = (s) => ({ t: 'out', s })
    let out = []
    let nextCwd = cwd
    if (!c) return
    if (c === 'help') out = [o('pwd · ls · cd 폴더 · cd .. · mkdir 이름 · echo 글자 · clear'), o('npm install · npm run dev · git status')]
    else if (c === 'pwd') out = [o(cwd.replace('~', '/Users/me'))]
    else if (c === 'ls') out = [o((fs.current[cwd] || []).join('   ') || '(비어 있음)')]
    else if (c === 'cd') {
      const target = !a || a === '~' ? '~' : a === '..' ? cwd.split('/').slice(0, -1).join('/') || '~' : `${cwd}/${a}`
      if (fs.current[target]) nextCwd = target
      else out = [{ t: 'err', s: `cd: no such file or directory: ${a}` }]
    } else if (c === 'mkdir') {
      if (!a) out = [{ t: 'err', s: 'mkdir: 폴더 이름이 필요해요' }]
      else {
        fs.current[cwd] = [...(fs.current[cwd] || []), a]
        fs.current[`${cwd}/${a}`] = []
      }
    } else if (c === 'echo') out = [o(a)]
    else if (c === 'clear') {
      setLines([])
      push('option', 'clear → 화면 지움')
      return setInput('')
    } else if (cmd.trim() === 'npm install') out = cwd.endsWith('todo-app') ? [o('added 142 packages in 3s'), o('✓ node_modules 폴더가 생겼어요')] : [{ t: 'err', s: 'npm ERR! package.json을 찾을 수 없어요 (프로젝트 폴더로 cd 하세요)' }]
    else if (cmd.trim() === 'npm run dev') out = cwd.endsWith('todo-app') ? [o('VITE ready in 312 ms'), o('➜  Local:   http://localhost:5173/')] : [{ t: 'err', s: 'npm ERR! Missing script: "dev"' }]
    else if (cmd.trim() === 'git status') out = [o('On branch main'), o('Changes not staged: src/App.jsx')]
    else out = [{ t: 'err', s: `zsh: command not found: ${c}` }]
    setLines((l) => [...l, { t: 'cmd', s: cmd, cwd }, ...out])
    setCwd(nextCwd)
    setHist((h) => [cmd, ...h])
    setHi(-1)
    setInput('')
    push(out.some((x) => x.t === 'err') ? 'close' : 'end', `$ ${cmd}${nextCwd !== cwd ? ` → ${nextCwd}로 이동` : ''}`)
  }

  const prompt = `터미널(Terminal)에서 지금 폴더 위치를 확인하고(pwd), 프로젝트 폴더로 이동해서(cd), 필요한 패키지를 설치(npm install)한 다음 개발 서버를 켜는(npm run dev) 순서를 알려줘. 명령어마다 무슨 뜻인지 한 줄씩 설명하고, 오류가 나면 어떤 메시지가 나오는지도.`

  return (
    <Shell
      hint="cd projects → cd todo-app → npm install 순서로 해보세요"
      stage={
        <div className={'pg-term ' + theme} onClick={() => box.current.querySelector('input')?.focus()}>
          <div className="pg-term-bar">
            <i />
            <i />
            <i />
            <span className="mono">zsh — {cwd}</span>
          </div>
          <div className="pg-term-body mono" ref={box}>
            {lines.map((l, i) => (
              <div key={i} className={'pg-term-line ' + l.t}>
                {l.t === 'cmd' && <span className="pg-term-ps">{l.cwd} $ </span>}
                {l.s}
              </div>
            ))}
            <div className="pg-term-line cmd">
              <span className="pg-term-ps">{cwd} $ </span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') run(input)
                  if (e.key === 'ArrowUp' && hist.length) {
                    const n = Math.min(hi + 1, hist.length - 1)
                    setHi(n)
                    setInput(hist[n])
                    e.preventDefault()
                  }
                }}
                spellCheck={false}
                autoCapitalize="off"
                aria-label="명령어 입력"
              />
            </div>
          </div>
        </div>
      }
      controls={
        <>
          <div className="ctl">
            <span className="ctl-top">
              <span>눌러서 실행</span>
            </span>
            <div className="presets">
              {['pwd', 'ls', 'cd projects', 'cd todo-app', 'npm install', 'npm run dev', 'cd ..', 'clear'].map((c) => (
                <button key={c} className="chip-btn mono" style={{ fontSize: 12 }} onClick={() => run(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <Segmented label="테마" value={theme} onChange={setTheme} options={[{ value: 'dark', label: '어둡게' }, { value: 'light', label: '밝게' }]} />
          <p className="pg-note" style={{ margin: 0 }}>
            ↑ 키를 누르면 방금 쓴 명령어를 다시 불러와요.
          </p>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Localhost · Port ───────── */

const SERVERS = [
  { id: 'web', name: '프론트엔드 (Vite)', port: 5173, page: '할 일 앱 화면' },
  { id: 'api', name: '백엔드 API (Express)', port: 3000, page: '{ "ok": true }' },
  { id: 'other', name: '다른 앱 하나 더', port: 3000, page: '다른 앱' },
]

function LocalhostPG() {
  const [on, setOn] = useState({ web: true, api: false, other: false })
  const [otherPort, setOtherPort] = useState(3000)
  const [url, setUrl] = useState('localhost:5173')
  const [view, setView] = useState(null)
  const { logs, push, clear } = useEventLog()
  const ports = { web: 5173, api: 3000, other: otherPort }

  const start = (s) => {
    if (on[s.id]) {
      setOn({ ...on, [s.id]: false })
      return push('close', `${s.name} 끔 → ${ports[s.id]}번 포트 비움`)
    }
    const taken = Object.keys(on).find((k) => on[k] && ports[k] === ports[s.id])
    if (taken) return push('close', `Error: listen EADDRINUSE :${ports[s.id]} → 이미 ${SERVERS.find((x) => x.id === taken).name}가 쓰는 포트`)
    setOn({ ...on, [s.id]: true })
    push('start', `${s.name} 켬 → http://localhost:${ports[s.id]}`)
  }
  const go = (e) => {
    e?.preventDefault()
    const port = Number((url.match(/:(\d+)/) || [])[1])
    const s = SERVERS.find((x) => on[x.id] && ports[x.id] === port)
    setView(s ? { ok: true, s, port } : { ok: false, port })
    push(s ? 'end' : 'close', s ? `localhost:${port} → ${s.name} 응답` : `localhost:${port} → 연결할 수 없음 (켜진 서버 없음)`)
  }

  const prompt = `개발 서버를 localhost에서 띄워줘. 프론트엔드는 ${ports.web}번 포트, 백엔드 API는 ${ports.api}번 포트로 따로 켜고, 프론트엔드에서 API를 부를 땐 http://localhost:${ports.api} 주소를 쓰게. 이미 그 포트를 쓰는 프로그램이 있어서 "EADDRINUSE" 오류가 나면 어떤 프로그램인지 찾아 끄는 방법이나 다른 포트로 바꾸는 방법도 알려줘.`

  return (
    <Shell
      hint="서버를 켜고 주소창에 localhost:포트 를 입력해 보세요"
      stage={
        <div className="pg-lh">
          <div className="pg-lh-servers">
            {SERVERS.map((s) => (
              <button key={s.id} className={'pg-lh-srv' + (on[s.id] ? ' on' : '')} onClick={() => start(s)}>
                <i />
                <b>{s.name}</b>
                <span className="mono">:{ports[s.id]}</span>
              </button>
            ))}
          </div>
          <div className="pg-page pg-lh-browser">
            <form className="pg-lh-url" onSubmit={go}>
              <span className="mono">http://</span>
              <input className="mono" value={url} onChange={(e) => setUrl(e.target.value)} />
              <button className="btn small">이동</button>
            </form>
            <div className="pg-lh-view">
              {!view ? (
                <span className="pg-help">주소를 입력하고 이동을 눌러보세요</span>
              ) : view.ok ? (
                <motion.div key={view.port} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pg-lh-ok">
                  <b>{view.s.page}</b>
                  <small className="mono">← {view.s.name}가 :{view.port}에서 보내준 화면</small>
                </motion.div>
              ) : (
                <motion.div key={'x' + view.port} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pg-lh-bad">
                  <b>사이트에 연결할 수 없음</b>
                  <small className="mono">localhost에서 연결을 거부했습니다 (:{view.port})</small>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      }
      controls={
        <>
          <div className="presets">
            {['localhost:5173', 'localhost:3000', 'localhost:8080'].map((u) => (
              <button
                key={u}
                className="chip-btn mono"
                style={{ fontSize: 12 }}
                onClick={() => {
                  setUrl(u)
                }}
              >
                {u}
              </button>
            ))}
          </div>
          <Segmented
            label="'다른 앱'이 쓸 포트"
            value={otherPort}
            onChange={(v) => {
              setOtherPort(v)
              setOn({ ...on, other: false })
            }}
            options={[{ value: 3000, label: '3000 (충돌)' }, { value: 3001, label: '3001' }, { value: 8080, label: '8080' }]}
          />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Cache ───────── */

function CachePG() {
  const [serverVer, setServerVer] = useState(1)
  const [cache, setCache] = useState(null)
  const [maxAge, setMaxAge] = useState(20)
  const [shown, setShown] = useState(null)
  const [loading, setLoading] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const { logs, push, clear } = useEventLog()
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(id)
  }, [])
  const left = cache ? Math.max(0, maxAge - (now - cache.at) / 1000) : 0

  const load = (hard) => {
    if (!hard && cache && left > 0) {
      setShown({ ver: cache.ver, from: 'cache' })
      return push('end', `캐시에서 바로 가져옴 (0.01s) · logo v${cache.ver}${cache.ver !== serverVer ? ' ← 서버엔 새 버전이 있는데 옛날 걸 보여줌!' : ''}`)
    }
    setLoading(true)
    push('start', hard ? '강력 새로고침 → 캐시 무시하고 서버에 요청' : cache ? '캐시 유효기간 지남 → 서버에 다시 요청' : '처음 방문 → 서버에 요청')
    setTimeout(() => {
      setLoading(false)
      setCache({ ver: serverVer, at: Date.now() })
      setShown({ ver: serverVer, from: 'server' })
      push('child', `서버에서 받음 (1.2s) · logo v${serverVer} → 캐시에 ${maxAge}초 저장`)
    }, 1200)
  }

  const prompt = `사이트 로고를 바꿨는데 내 화면에서는 예전 로고가 계속 보여. 브라우저 캐시(Cache) 때문인지 확인하는 방법과, 강력 새로고침(Cmd+Shift+R) 하는 법을 알려줘. 그리고 이미지·CSS 파일은 Cache-Control: max-age=${maxAge}로 저장하되, 파일을 바꾸면 이름에 버전(logo.v2.png)을 붙여서 바로 새 파일이 보이게 해줘.`

  return (
    <Shell
      hint="새로고침 → 서버에서 로고 바꾸기 → 다시 새로고침"
      stage={
        <div className="pg-cache">
          <div className="pg-cache-cols">
            <div className="pg-cache-box">
              <span className="pg-md-tag mono">내 브라우저 화면</span>
              <div className="pg-cache-view">
                {loading ? (
                  <motion.span className="pg-spin" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                ) : shown ? (
                  <>
                    <span className="pg-cache-logo" style={{ background: PALETTE[(shown.ver - 1) % 5] }}>
                      v{shown.ver}
                    </span>
                    <small>{shown.from === 'cache' ? '⚡ 캐시에서' : '🌐 서버에서'}</small>
                  </>
                ) : (
                  <small>아직 안 불러옴</small>
                )}
              </div>
              <div className="pg-cache-store">
                캐시 저장소: {cache ? <b className="mono">logo v{cache.ver} · {left > 0 ? `${Math.ceil(left)}초 남음` : '만료'}</b> : <span>비어 있음</span>}
              </div>
            </div>
            <div className="pg-cache-box">
              <span className="pg-md-tag mono">서버</span>
              <div className="pg-cache-view">
                <span className="pg-cache-logo" style={{ background: PALETTE[(serverVer - 1) % 5] }}>
                  v{serverVer}
                </span>
                <small>지금 서버에 있는 로고</small>
              </div>
              <button
                className="chip-btn"
                onClick={() => {
                  setServerVer((v) => v + 1)
                  push('option', `서버의 로고를 v${serverVer + 1}로 교체`)
                }}
              >
                로고 바꾸기
              </button>
            </div>
          </div>
          <div className="pg-row" style={{ gap: 8 }}>
            <button className="btn small" onClick={() => load(false)} disabled={loading}>
              ⟳ 새로고침
            </button>
            <button className="btn small ghost" onClick={() => load(true)} disabled={loading}>
              강력 새로고침
            </button>
          </div>
        </div>
      }
      controls={
        <>
          <Slider label="캐시 보관 시간 (max-age)" value={maxAge} min={5} max={60} step={5} unit="초" onChange={setMaxAge} />
          <button
            className="link"
            onClick={() => {
              setCache(null)
              push('close', '캐시 비우기')
            }}
          >
            캐시 비우기
          </button>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── CORS ───────── */

const ORIGINS = ['http://localhost:5173', 'https://myshop.com', 'https://evil-site.com']

function CorsPG() {
  const [origin, setOrigin] = useState(ORIGINS[0])
  const [allow, setAllow] = useState(['https://myshop.com'])
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const { logs, push, clear } = useEventLog()

  const send = () => {
    setBusy(true)
    setResult(null)
    push('start', `${origin} 에서 api.myshop.com 으로 요청`)
    setTimeout(() => {
      const ok = allow.includes(origin)
      setBusy(false)
      setResult(ok)
      push(ok ? 'end' : 'close', ok ? `서버 응답 헤더에 허용 목록 포함 → 브라우저 통과` : `허용 목록에 없음 → 브라우저가 응답을 막음 (CORS 오류)`)
    }, 900)
  }
  const toggleAllow = (o) => setAllow(allow.includes(o) ? allow.filter((x) => x !== o) : [...allow, o])

  const prompt = `프론트엔드(${origin})에서 백엔드 API(https://api.myshop.com)를 부르면 콘솔에 CORS 오류가 나. 서버 쪽에서 허용할 출처를 ${allow.length ? allow.join(', ') : '(아직 없음)'}로 정해서 Access-Control-Allow-Origin 헤더를 보내도록 고쳐줘. 모든 사이트를 다 허용하는 "*"는 쓰지 말고, 왜 브라우저가 막는지도 쉽게 설명해줘.`

  return (
    <Shell
      hint="보내는 사이트와 서버 허용 목록을 바꿔가며 요청해 보세요"
      stage={
        <div className="pg-cors">
          <div className="pg-cors-row">
            <div className="pg-cors-box">
              <span className="pg-md-tag mono">요청하는 사이트 (출처)</span>
              <b className="mono">{origin.replace(/^https?:\/\//, '')}</b>
            </div>
            <span className="pg-cors-arrow">{busy ? '…' : '→'}</span>
            <div className="pg-cors-box">
              <span className="pg-md-tag mono">api.myshop.com 허용 목록</span>
              {allow.length ? allow.map((a) => <small key={a} className="mono">✓ {a.replace(/^https?:\/\//, '')}</small>) : <small>(아무도 허용 안 함)</small>}
            </div>
          </div>
          <button className="btn small" onClick={send} disabled={busy}>
            fetch 요청 보내기
          </button>
          <div className="pg-cors-console mono">
            <span className="pg-md-tag">콘솔</span>
            {result === null ? (
              <div className="dim">{busy ? '요청 중…' : '결과가 여기에 표시돼요'}</div>
            ) : result ? (
              <div className="ok">✓ 200 OK · [{'{'} id: 1, name: "티셔츠" {'}'}]</div>
            ) : (
              <div className="err">✕ Access to fetch at 'https://api.myshop.com' from origin '{origin}' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present.</div>
            )}
          </div>
        </div>
      }
      controls={
        <>
          <Segmented label="요청하는 사이트" value={origin} onChange={setOrigin} options={ORIGINS.map((o) => ({ value: o, label: o.replace(/^https?:\/\//, '').replace('localhost', 'local') }))} />
          <span className="pg-label">서버가 허용할 사이트</span>
          {ORIGINS.map((o) => (
            <Toggle key={o} label={o.replace(/^https?:\/\//, '')} value={allow.includes(o)} onChange={() => toggleAllow(o)} />
          ))}
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── 404 · 500 ───────── */

const ROUTES = { '/': '홈', '/about': '소개', '/products': '상품 목록' }

function ErrorPagesPG() {
  const [path, setPath] = useState('/abuot')
  const [page, setPage] = useState(null)
  const [friendly, setFriendly] = useState(true)
  const [broken, setBroken] = useState(false)
  const { logs, push, clear } = useEventLog()

  const go = (p = path) => {
    setPath(p)
    let status = ROUTES[p] ? 200 : 404
    if (p === '/products' && broken) status = 500
    setPage({ p, status })
    push(status === 200 ? 'end' : 'close', `${p} → ${status} ${status === 200 ? 'OK' : status === 404 ? 'Not Found (주소 없음)' : 'Internal Server Error (서버 고장)'}`)
  }

  const prompt = `${friendly ? '' : '지금은 기본 오류 화면이 나오는데, '}사이트에 친절한 404 페이지와 500 페이지를 만들어줘. 404(없는 주소)는 "찾는 페이지가 없어요" 문구와 홈으로 가는 버튼, 비슷한 메뉴 추천. 500(서버 오류)은 "잠시 문제가 생겼어요, 곧 고칠게요" 문구와 다시 시도 버튼. 오류 내용은 사용자에겐 숨기고 서버 로그에만 남겨줘.`

  return (
    <Shell
      hint="주소를 바꿔 이동해 보세요 (오타도 내보고)"
      stage={
        <div className="pg-page pg-err-page">
          <form
            className="pg-lh-url"
            onSubmit={(e) => {
              e.preventDefault()
              go()
            }}
          >
            <span className="mono">myshop.com</span>
            <input className="mono" value={path} onChange={(e) => setPath(e.target.value)} />
            <button className="btn small">이동</button>
          </form>
          <div className="pg-err-view">
            <AnimatePresence mode="wait">
              {!page ? (
                <span key="n" className="pg-help">이동을 눌러보세요</span>
              ) : page.status === 200 ? (
                <motion.div key={page.p} className="pg-err-ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <b>{ROUTES[page.p]}</b>
                  <i />
                  <i style={{ width: '60%' }} />
                </motion.div>
              ) : friendly ? (
                <motion.div key={page.status + page.p} className="pg-err-nice" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <span className="mono">{page.status}</span>
                  <b>{page.status === 404 ? '찾는 페이지가 없어요' : '잠시 문제가 생겼어요'}</b>
                  <small>{page.status === 404 ? '주소에 오타가 없는지 확인해 주세요.' : '곧 고칠게요. 잠시 후 다시 시도해 주세요.'}</small>
                  <button className="btn small" style={{ background: C.acc }} onClick={() => go(page.status === 404 ? '/' : page.p)}>
                    {page.status === 404 ? '홈으로' : '다시 시도'}
                  </button>
                </motion.div>
              ) : (
                <motion.div key={'raw' + page.status} className="pg-err-raw mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <b>{page.status === 404 ? '404 Not Found' : '500 Internal Server Error'}</b>
                  <small>{page.status === 404 ? 'nginx/1.25.3' : 'TypeError: Cannot read properties of undefined (reading "price")\n    at getProducts (server.js:42)'}</small>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      }
      controls={
        <>
          <div className="presets">
            {['/', '/about', '/abuot', '/products'].map((p) => (
              <button key={p} className="chip-btn mono" onClick={() => go(p)}>
                {p}
              </button>
            ))}
          </div>
          <Toggle label="서버 고장 내기 (/products → 500)" value={broken} onChange={setBroken} />
          <Toggle label="친절한 오류 페이지" value={friendly} onChange={setFriendly} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Console Error ───────── */

function ConsoleErrorPG() {
  const [fixed, setFixed] = useState(false)
  const [entries, setEntries] = useState([])
  const [count, setCount] = useState(0)
  const [level, setLevel] = useState('all')
  const { logs, push, clear } = useEventLog()

  const add = (product) => {
    if (!fixed && !product) {
      setEntries((e) => [...e, { t: 'error', s: "Uncaught TypeError: Cannot read properties of undefined (reading 'price')", at: 'at addToCart (Cart.jsx:12:24)' }])
      return push('close', '버튼이 반응 없음 → 콘솔에 빨간 오류')
    }
    setCount((c) => c + 1)
    setEntries((e) => [...e, { t: 'log', s: `장바구니에 담음: ${product ? product.name : '(상품 없음, 건너뜀)'}` }])
    push('end', fixed && !product ? '고친 코드: 상품이 없으면 조용히 건너뜀' : '정상 동작')
  }
  const warn = () => {
    setEntries((e) => [...e, { t: 'warn', s: 'Warning: Each child in a list should have a unique "key" prop.', at: 'at ProductList (List.jsx:8)' }])
    push('option', '노란 경고 추가 (앱은 동작하지만 고치면 좋은 것)')
  }
  const shown = entries.filter((e) => level === 'all' || e.t === 'error')
  const lastErr = [...entries].reverse().find((e) => e.t === 'error')

  const prompt = lastErr
    ? `"장바구니 담기" 버튼을 누르면 아무 반응이 없고, 콘솔(Console)에 이런 빨간 오류가 나와:\n${lastErr.s}\n${lastErr.at}\n원인을 찾아서 고쳐줘. 상품 정보가 없을 때도 앱이 멈추지 않게 해줘.`
    : `브라우저 개발자 도구의 콘솔(Console)을 여는 방법(F12 또는 Cmd+Option+J)과, 빨간 오류(Error)와 노란 경고(Warning)의 차이를 알려줘. 오류가 나면 메시지와 파일 이름·줄 번호를 그대로 복사해서 너에게 보내면 되지?`

  return (
    <Shell
      hint="'품절 상품 담기'를 눌러 오류를 내보세요"
      stage={
        <div className="pg-con">
          <div className="pg-page pg-con-app">
            <div className="pg-page-nav">
              <b>MyShop</b>
              <span>🛒 {count}</span>
            </div>
            <div className="pg-row" style={{ gap: 8, padding: 16 }}>
              <button className="btn small" onClick={() => add({ name: '티셔츠' })}>
                티셔츠 담기
              </button>
              <button className="btn small ghost" onClick={() => add(undefined)}>
                품절 상품 담기
              </button>
            </div>
          </div>
          <div className="pg-con-panel mono">
            <div className="pg-con-tabs">
              <b>Console</b>
              <span>{entries.filter((e) => e.t === 'error').length} errors</span>
              <span>{entries.filter((e) => e.t === 'warn').length} warnings</span>
            </div>
            <div className="pg-con-list">
              {shown.length === 0 && <div className="pg-con-row dim">콘솔이 깨끗해요</div>}
              {shown.map((e, i) => (
                <motion.div key={i} className={'pg-con-row ' + e.t} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
                  <span>{e.t === 'error' ? '✕' : e.t === 'warn' ? '⚠' : '›'}</span>
                  <div>
                    {e.s}
                    {e.at && <small>{e.at}</small>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      }
      controls={
        <>
          <Toggle
            label="버그 고친 코드로 바꾸기"
            value={fixed}
            onChange={(v) => {
              setFixed(v)
              push('option', v ? 'product?.price 로 고침 (없으면 건너뜀)' : '버그 있는 코드로 되돌림')
            }}
          />
          <Segmented label="콘솔에 보이는 것" value={level} onChange={setLevel} options={[{ value: 'all', label: '전부' }, { value: 'error', label: '오류만' }]} />
          <button className="chip-btn" onClick={warn}>
            경고(Warning) 하나 만들기
          </button>
          <button className="link" onClick={() => setEntries([])}>
            콘솔 지우기
          </button>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── HTML · CSS · JS ───────── */

const HTML0 = '<h1>안녕하세요</h1>\n<p>바이브코딩 첫 페이지</p>\n<button id="btn">눌러보세요</button>'
const CSS0 = 'body { font-family: sans-serif; text-align: center; padding: 24px; }\nh1 { color: #ff6b2c; }\nbutton {\n  background: #1f1f24; color: white;\n  border: 0; padding: 10px 18px; border-radius: 99px;\n}'
const JS0 = "let n = 0\ndocument.getElementById('btn').onclick = () => {\n  n++\n  document.querySelector('p').textContent = n + '번 눌렀어요'\n}"

function HtmlCssJsPG() {
  const [html, setHtml] = useState(HTML0)
  const [css, setCss] = useState(CSS0)
  const [js, setJs] = useState(JS0)
  const [tab, setTab] = useState('html')
  const [cssOn, setCssOn] = useState(true)
  const [jsOn, setJsOn] = useState(true)
  const [doc, setDoc] = useState('')
  const { logs, push, clear } = useEventLog()

  useEffect(() => {
    const id = setTimeout(() => {
      setDoc(`<!doctype html><meta charset="utf-8"><style>${cssOn ? css : ''}</style>${html}${jsOn ? `<script>try{${js}}catch(e){document.body.insertAdjacentHTML('beforeend','<pre style="color:#e5484d;text-align:left">'+e+'</pre>')}<\/script>` : ''}`)
      push('child', `결과 다시 그림 (HTML ${cssOn ? '+ CSS ' : ''}${jsOn ? '+ JS' : ''})`)
    }, 400)
    return () => clearTimeout(id)
  }, [html, css, js, cssOn, jsOn, push])

  const code = { html: [html, setHtml], css: [css, setCss], js: [js, setJs] }[tab]
  const prompt = `HTML·CSS·JavaScript 세 가지로 간단한 페이지를 만들어줘. HTML로 제목·문단·버튼 뼈대를 만들고, CSS로 제목은 주황색·버튼은 둥근 검정 알약 모양으로 꾸미고, JavaScript로 버튼을 누를 때마다 "N번 눌렀어요"로 문장이 바뀌게. 세 파일(index.html, style.css, script.js)로 나눠서.`

  return (
    <Shell
      hint="탭을 바꿔 코드를 고치거나, CSS·JS를 꺼보세요"
      stage={
        <div className="pg-md split pg-hcj">
          <div className="pg-md-col">
            <div className="pg-hcj-tabs">
              {['html', 'css', 'js'].map((t) => (
                <button key={t} className={t === tab ? 'on' : ''} onClick={() => setTab(t)}>
                  {{ html: 'HTML 뼈대', css: 'CSS 꾸미기', js: 'JS 동작' }[t]}
                </button>
              ))}
            </div>
            <CodeArea value={code[0]} onChange={code[1]} rows={11} />
          </div>
          <div className="pg-md-col">
            <span className="pg-md-tag mono">결과</span>
            <iframe className="pg-hcj-frame" title="결과" sandbox="allow-scripts" srcDoc={doc} />
          </div>
        </div>
      }
      controls={
        <>
          <Toggle
            label="CSS 적용 (꾸미기)"
            value={cssOn}
            onChange={(v) => {
              setCssOn(v)
              push('option', v ? 'CSS 켬 → 색과 모양이 생김' : 'CSS 끔 → 뼈대만 남은 기본 모양')
            }}
          />
          <Toggle
            label="JavaScript 실행 (동작)"
            value={jsOn}
            onChange={(v) => {
              setJsOn(v)
              push('option', v ? 'JS 켬 → 버튼이 반응함' : 'JS 끔 → 버튼을 눌러도 아무 일 없음')
            }}
          />
          <button
            className="link"
            onClick={() => {
              setHtml(HTML0)
              setCss(CSS0)
              setJs(JS0)
            }}
          >
            처음 코드로
          </button>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Tailwind ───────── */

const TW = [
  ['배경', [['bg-white', { background: '#fff', color: C.ink }], ['bg-orange-500', { background: '#f97316', color: '#fff' }], ['bg-slate-900', { background: '#0f172a', color: '#fff' }]]],
  ['안쪽 여백', [['px-3 py-1.5', { padding: '6px 12px' }], ['px-5 py-2.5', { padding: '10px 20px' }], ['px-8 py-4', { padding: '16px 32px' }]]],
  ['모서리', [['rounded-none', { borderRadius: 0 }], ['rounded-lg', { borderRadius: 8 }], ['rounded-full', { borderRadius: 999 }]]],
  ['글자', [['font-normal', { fontWeight: 400 }], ['font-bold', { fontWeight: 700 }], ['font-bold text-lg', { fontWeight: 700, fontSize: 18 }]]],
  ['그림자', [['shadow-none', { boxShadow: 'none' }], ['shadow-md', { boxShadow: '0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1)' }], ['shadow-xl', { boxShadow: '0 20px 25px -5px rgba(0,0,0,.15), 0 8px 10px -6px rgba(0,0,0,.1)' }]]],
]

function TailwindPG() {
  const [pick, setPick] = useState([1, 1, 2, 1, 1])
  const [border, setBorder] = useState(false)
  const { logs, push, clear } = useEventLog()
  const classes = TW.map(([, opts], i) => opts[pick[i]][0]).concat(border ? ['border-2 border-orange-500'] : [])
  const style = Object.assign({}, ...TW.map(([, opts], i) => opts[pick[i]][1]), border ? { border: '2px solid #f97316' } : { border: '2px solid transparent' })

  const prompt = `"구매하기" 버튼을 Tailwind CSS로 만들어줘. class="${classes.join(' ')}" 를 쓰고, 마우스를 올리면 살짝 진해지게(hover:) 해줘. 별도 CSS 파일은 만들지 말고 클래스 이름만으로.`

  return (
    <Shell
      hint="클래스를 골라 버튼을 꾸며보세요"
      stage={
        <div className="pg-tw">
          <motion.button layout className="pg-tw-btn" style={style} transition={{ duration: 0.25 }}>
            구매하기
          </motion.button>
          <pre className="pg-tw-code">
            {'<button class="'}
            {classes.map((c, i) => (
              <motion.span key={c} initial={{ background: '#ffb38f' }} animate={{ background: 'rgba(0,0,0,0)' }} transition={{ duration: 1 }}>
                {(i ? ' ' : '') + c}
              </motion.span>
            ))}
            {'">'}
            {'\n  구매하기\n</button>'}
          </pre>
        </div>
      }
      controls={
        <>
          {TW.map(([label, opts], i) => (
            <div key={label} className="ctl">
              <span className="ctl-top">
                <span>{label}</span>
              </span>
              <div className="presets">
                {opts.map(([c], j) => (
                  <button
                    key={c}
                    className={'chip-btn mono' + (pick[i] === j ? ' on' : '')}
                    style={{ fontSize: 11.5 }}
                    onClick={() => {
                      setPick(pick.map((x, k) => (k === i ? j : x)))
                      push('move', `${label}: ${c}`)
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <Toggle label="테두리 (border-2)" value={border} onChange={setBorder} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

export const SIM_DEV_PGS = {
  markdown: MarkdownPG,
  json: JsonPG,
  state: StatePG,
  component: ComponentPG,
  api: ApiPG,
  terminal: TerminalPG,
  'localhost-port': LocalhostPG,
  cache: CachePG,
  cors: CorsPG,
  'error-404-500': ErrorPagesPG,
  'console-error': ConsoleErrorPG,
  'html-css-js': HtmlCssJsPG,
  tailwind: TailwindPG,
}
