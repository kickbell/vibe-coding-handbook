import { useEffect, useRef, useState } from 'react'
import { PromptBox, Segmented } from './components/kit'

// 체험 화면 대신 보여주는 "실제 크롬에서는 이렇게" 단계별 안내. 용어 id로 등록한다.
// 스크린샷은 public/devtools/ 에 둔다.

// layout: side(글 옆에 그림) · wide(글 아래 넓게) · tall(세로로 긴 그림)
function Step({ no, title, img, alt, layout = 'side', children }) {
  return (
    <div className={'guide-step is-' + (img ? layout : 'text')}>
      <div className="guide-text">
        <span className="guide-no mono">STEP {no}</span>
        <h3>{title}</h3>
        {children}
      </div>
      {img && (
        <a className="guide-img" href={img} target="_blank" rel="noreferrer" title="크게 보기">
          <img src={img} alt={alt} loading="lazy" />
        </a>
      )}
    </div>
  )
}

/* ───────── 가짜 은행·증권 앱 + 콘솔 ───────── */

// 격리된 iframe 안에서 명령을 eval하고 결과를 부모에게 돌려준다
const BRIDGE = `<script>
window.$ = (s) => document.querySelector(s)
const fmt = (v) => v === undefined ? 'undefined' : typeof v === 'string' ? JSON.stringify(v) : v instanceof Element ? '<' + v.tagName.toLowerCase() + (v.className ? '.' + v.className.split(' ').join('.') : '') + '>' : String(v)
const send = (m) => parent.postMessage(m, '*')
addEventListener('message', (e) => {
  if (e.source !== parent || typeof (e.data && e.data.cmd) !== 'string') return
  try { send({ ok: true, v: fmt((0, eval)(e.data.cmd)) }) }
  catch (err) { send({ ok: false, v: 'Uncaught ' + err }) }
})
<\/script>`

const BASE = `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Pretendard',sans-serif;color:#191f28;background:#fff;-webkit-font-smoothing:antialiased}
small{color:#6b7684;font-size:13px}button{font:inherit;border:0;border-radius:8px;cursor:pointer}
[contenteditable=true] :is(h1,h2,b,p):hover{outline:1.5px dashed #FF6B2C;outline-offset:2px}
.up{color:#f04452}`

const BANK = `${BASE}
.top{display:flex;justify-content:space-between;padding:16px 18px 6px;font-size:15px;color:#4e5968}
.tabs{display:flex;justify-content:space-around;border-bottom:1px solid #eef0f3;font-size:15px;color:#8b95a1}
.tabs span{padding:12px 4px}.tabs b{padding:12px 6px;color:#191f28;border-bottom:2px solid #191f28}
section{padding:20px 20px 4px}.row{display:flex;align-items:center;justify-content:space-between;gap:8px}
h1{font-size:23px;margin:4px 0 0;letter-spacing:-.02em;white-space:nowrap}h2{font-size:19px;margin:4px 0 0}
.go{background:#3182f6;color:#fff;padding:9px 13px;font-weight:600}
ul{list-style:none;margin:6px 0 0;padding:0 20px}li{display:flex;align-items:center;gap:12px;padding:10px 0}
li i{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;font-style:normal;font-weight:800;font-size:13px;flex:none}
li div{flex:1;display:grid;gap:2px;min-width:0}li span{font-size:13px;color:#6b7684}li b{font-size:16px;white-space:nowrap}
li button{background:#f2f4f6;color:#4e5968;padding:7px 11px;font-size:13px}
</style>
<div class="top"><span>←</span><span>편집</span></div>
<div class="tabs"><b>자산</b><span>계좌 추천</span><span>대출 찾기</span></div>
<section><small>총자산</small><div class="row"><h1 class="total-asset">1,284,560원</h1><button class="go">분석</button></div></section>
<section><small>계좌</small><h2 class="account-total">276,931원</h2></section>
<section style="padding-bottom:0"><small>입출금</small></section>
<ul>
<li id="main"><i style="background:#3182f6">XX</i><div><span>XX뱅크 통장</span><b class="balance">37,210원</b></div><button>송금</button></li>
<li id="savings"><i style="background:#f5b31c">₩</i><div><span>저축예금</span><b class="balance">239,339원</b></div><button>송금</button></li>
<li id="dream"><i style="background:#16a34a">S</i><div><span>XX은행 적금</span><b class="balance">1,008,011원</b></div><button>송금</button></li>
</ul>${BRIDGE}`

const STOCK = `${BASE}
header{display:flex;align-items:baseline;gap:8px;padding:22px 20px 8px}header h1{font-size:21px;margin:0;letter-spacing:-.02em}header span{font-size:12px;color:#6b7684}
.acct{display:flex;justify-content:space-between;padding:8px 20px;font-size:14px;font-weight:700}.acct span{font-weight:400;font-size:12px;color:#8b95a1}
.cash{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:6px 20px 14px}.cash div{background:#f2f4f6;border-radius:14px;padding:12px;display:grid;gap:4px}.cash b{font-size:15px}
.inv{padding:14px 20px 6px;border-top:8px solid #f2f4f6}h2{font-size:23px;margin:4px 0;letter-spacing:-.02em;white-space:nowrap}p{margin:0;font-size:13px}
.stock{display:flex;align-items:center;gap:12px;padding:16px 20px}.stock i{width:36px;height:36px;border-radius:50%;background:#e8344e;color:#fff;display:grid;place-items:center;font-style:normal;font-weight:800;font-size:12px;flex:none}
.stock div{display:grid;gap:2px}.stock .r{margin-left:auto;text-align:right}.stock b{font-size:15px;white-space:nowrap}.stock span{font-size:12px;color:#8b95a1}
.more{margin:4px 20px;border-top:1px solid #eef0f3;text-align:center;padding:14px;font-size:14px;color:#4e5968}
.menu{border-top:8px solid #f2f4f6;padding:4px 20px}.menu div{display:flex;justify-content:space-between;padding:12px 0;font-size:14px;font-weight:600}.menu span{font-weight:400;color:#6b7684;font-size:13px}
</style>
<header><h1>XX증권</h1><span>코스피 <em class="up" style="font-style:normal">2,857.40 +0.6%</em></span></header>
<div class="acct">기본계좌 ⌄<span>계좌 보기</span></div>
<div class="cash"><div><small>원화</small><b class="krw">94,367원</b></div><div><small>달러</small><b class="usd">$0.18</b></div></div>
<div class="inv"><small>내 투자</small><h2 class="my-invest">1,920,000원</h2><p class="profit up">+21,000원 (1.1%)</p></div>
<div class="stock"><i>XX</i><div><b>XX전자</b><span class="shares">24주</span></div><div class="r"><b class="stock-value">1,920,000원</b><span class="stock-profit up">+21,000원 (1.1%)</span></div></div>
<div class="more">전체보기</div>
<div class="menu"><div>주문내역<span>이번 달 3건 ›</span></div><div>판매수익<span class="sold">이번 달 +12,400원 ›</span></div><div>배당금<span>이번 달 1,820원 ›</span></div></div>${BRIDGE}`

const APPS = {
  bank: {
    label: 'XX뱅크 · 내 자산',
    doc: BANK,
    presets: [
      ['총자산 바꾸기', "document.querySelector('.total-asset').textContent = '2,446,063,347원'"],
      ['통장 잔액 바꾸기', "document.querySelector('#main .balance').textContent = '370,000,000원'"],
      ['지금 총자산 읽기', "document.querySelector('.total-asset').textContent"],
    ],
  },
  stock: {
    label: 'XX증권 · 내 주식',
    doc: STOCK,
    presets: [
      ['내 투자 금액 바꾸기', "document.querySelector('.my-invest').textContent = '5,111,920,000원'"],
      ['수익 바꾸기', "document.querySelector('.profit').textContent = '+1,221,522,000원 (31.3%)'"],
      ['보유 주식 수 바꾸기', "document.querySelector('.shares').textContent = '2,512주'"],
    ],
  },
}
const EDIT = ['화면 글자 직접 고치기', 'document.body.contentEditable = true']

function RichSim() {
  const frame = useRef(null)
  const listRef = useRef(null)
  const [app, setApp] = useState('bank')
  const [gen, setGen] = useState(0)
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    const on = (e) => {
      if (!frame.current || e.source !== frame.current.contentWindow) return
      setLines((l) => [...l, { k: e.data.ok ? 'out' : 'err', s: e.data.v }])
    }
    addEventListener('message', on)
    return () => removeEventListener('message', on)
  }, [])
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [lines])

  const run = (cmd) => {
    if (!cmd.trim() || !frame.current) return
    setLines((l) => [...l, { k: 'in', s: cmd }])
    frame.current.contentWindow.postMessage({ cmd }, '*')
    setInput('')
  }
  const reload = (note) => {
    setGen((g) => g + 1)
    setLines((l) => [...l, { k: 'nav', s: note }])
  }

  return (
    <div className="rich">
      <div className="rich-phone">
        <iframe key={app + gen} ref={frame} title={APPS[app].label} sandbox="allow-scripts" srcDoc={APPS[app].doc} />
      </div>
      <div className="rich-side">
        <Segmented
          label="앱 고르기"
          value={app}
          onChange={(v) => {
            setApp(v)
            setLines([])
          }}
          options={Object.entries(APPS).map(([value, a]) => ({ value, label: a.label }))}
        />
        <div className="rich-presets">
          {[...APPS[app].presets, EDIT].map(([label, cmd]) => (
            <button key={label} className="chip-btn" onClick={() => run(cmd)}>
              {label}
            </button>
          ))}
        </div>
        <div className="pg-con-panel mono">
          <div className="pg-con-tabs">
            <span>요소</span>
            <b>콘솔</b>
          </div>
          <div className="pg-con-list rich-list" ref={listRef}>
            {lines.length === 0 && <div className="pg-con-row dim">위 버튼을 누르거나, 아래에 명령을 입력하고 Enter</div>}
            {lines.map((l, i) => (
              <div key={i} className={'pg-con-row rich-' + l.k + (l.k === 'err' ? ' error' : '')}>
                <span>{{ in: '›', out: '‹', err: '✕', nav: '↻' }[l.k]}</span>
                <div>{l.s}</div>
              </div>
            ))}
          </div>
          <label className="rich-input">
            <span>›</span>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && run(input)} placeholder={APPS[app].presets[0][1]} spellCheck={false} autoCapitalize="off" />
          </label>
        </div>
        <button className="btn small" onClick={() => reload('새로고침함 — 바꾼 숫자가 모두 원래대로')}>
          ↻ 새로고침
        </button>
      </div>
    </div>
  )
}

/* ───────── DevTools ───────── */

const ASK = `<a href="https://signinssl.gmarket.co.kr/login/login?url=https%3A%2F%2Fwww.gmarket.co.kr%2F" class="link__usermenu" data-montelena-acode="200003391">로그인</a> 이 부분을 '홍길동 로그인 됨'으로 바꾸고 싶어. 개발자 도구 콘솔에서 입력할 수 있는 명령어를 알려줘.`

function DevToolsGuide() {
  return (
    <div className="guide">
      <Step no={1} title="개발자 도구 열기" img="/devtools/1-open-devtools.png" alt="크롬 오른쪽 위 점 세 개 메뉴에서 도구 더보기, 개발자 도구를 차례로 누르는 화면" layout="tall">
        <p>
          크롬 오른쪽 위 ① <b>⋮</b> → ② <b>도구 더보기</b> → ③ <b>개발자 도구</b>를 누르면 화면 옆에 코드 창이 열려요.
        </p>
        <p className="guide-key">
          단축키: Mac <kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd> · Windows <kbd>F12</kbd>
        </p>
      </Step>
      <Step no={2} title="수정하고 싶은 부분 선택하기" img="/devtools/2-pick-element.png" alt="요소 선택 버튼을 누르고 화면의 로그인 글자를 클릭하자 해당 코드 줄이 강조된 화면" layout="wide">
        <p>
          ① 개발자 도구 왼쪽 위의 <b>요소 선택 버튼(↖)</b>을 누르고, ② 화면에서 고치고 싶은 곳을 클릭하세요. ③ 그 부분의 코드 한 줄이 오른쪽에 강조돼요.
        </p>
        <p className="guide-tip">더 빠른 방법: 고칠 곳을 바로 우클릭 → <b>검사</b></p>
      </Step>
      <Step no={3} title="요소 복사하기" img="/devtools/3-copy-element.png" alt="강조된 코드 줄을 우클릭해 복사, 요소 복사를 고르는 화면">
        <p>
          ① 강조된 줄을 <b>우클릭</b> → <b>복사</b> → ② <b>요소 복사</b>. 이제 클립보드에 그 부분의 코드가 담겼어요.
        </p>
      </Step>
      <Step no={4} title="복사한 요소를 AI 에이전트에게 붙여넣고 부탁하기" img="/devtools/4-ask-ai.png" alt="AI 채팅 입력창에 복사한 a 태그와 바꾸고 싶은 내용을 함께 적은 화면">
        <p>
          AI는 사람이 아니라 컴퓨터예요. 내 화면을 볼 수 없어서 <b>"위쪽 로그인 글씨"</b>라고 하면 추측해야 하지만, <b>코드 한 줄</b>을 주면 <code>link__usermenu</code> 같은 이름으로 정확히 찾아내요.
        </p>
        <PromptBox text={ASK} />
      </Step>
      <Step no={5} title="AI가 알려준 명령어 받기" img="/devtools/5-ai-answer.png" alt="AI가 document.querySelector로 글자를 바꾸는 자바스크립트 명령을 알려준 답변 화면">
        <p>
          AI가 콘솔에 넣을 명령어를 바로 만들어줘요. 복사한 요소 안의 이름(<code>.link__usermenu</code>)을 그대로 써서 정확히 그 글자를 가리켜요.
        </p>
      </Step>
      <Step no={6} title="콘솔에 붙여넣고 Enter" img="/devtools/6-run-in-console.png" alt="콘솔 탭에 명령을 넣고 실행하자 화면의 로그인 글자가 홍길동 로그인 됨으로 바뀐 화면" layout="wide">
        <p>
          개발자 도구의 <b>콘솔</b> 탭에 명령어를 붙여넣고 Enter를 누르면, 화면의 "로그인"이 바로 <b>"홍길동 로그인 됨"</b>으로 바뀌어요.
        </p>
        <p className="guide-tip">내 화면에서만 잠깐 바뀐 거예요. 새로고침하면 원래대로 돌아오고, 사이트의 진짜 코드는 그대로예요. 진짜로 고치려면 4번처럼 AI에게 "코드를 고쳐줘"라고 부탁하세요.</p>
      </Step>
      <Step no={7} title="직접 해보기: 콘솔로 부자 되기">
        <p>
          같은 방법이면 은행·증권 화면의 숫자도 바꿀 수 있어요. 아래 가짜 앱에서 버튼을 누르거나 명령을 직접 입력해보세요. <b>화면 글자 직접 고치기</b>를 누르면 숫자를 클릭해서 바로 고칠 수도 있어요.
        </p>
        <RichSim />
        <p className="guide-tip">바뀐 건 내 화면뿐이라 새로고침하면 원래대로 돌아오고, 실제 돈은 1원도 늘지 않아요. 이렇게 만든 화면으로 남을 속이는 건 절대 안 돼요.</p>
      </Step>
    </div>
  )
}

export const GUIDES = {
  devtools: DevToolsGuide,
}
