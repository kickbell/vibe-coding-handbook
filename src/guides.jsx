import { useState } from 'react'

// 체험 화면 아래에 붙는 "실제 크롬에서는 이렇게" 안내. 용어 id로 등록한다.
// 스크린샷은 public/devtools/ 에 둔다.

function Step({ no, title, img, alt, children }) {
  return (
    <div className="guide-step">
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

const VAGUE = '위쪽에 있는 로그인 글씨 좀 키워줘.'
const EXACT = '이 요소의 글씨를 지금보다 크게 키워줘. <a href="https://signinssl.gmarket.co.kr/login/login?url=https%3A%2F%2Fwww.gmarket.co.kr%2F" class="link__usermenu" data-montelena-acode="200003391">로그인</a>'

function InspectGuide() {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(EXACT).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }
  return (
    <div className="guide">
      <Step no={1} title="개발자 도구 열기" img="/devtools/open-devtools.png" alt="크롬 오른쪽 위 점 세 개 메뉴에서 도구 더보기, 개발자 도구를 차례로 누르는 화면">
        <p>
          크롬 오른쪽 위 ① <b>⋮</b> → ② <b>도구 더보기</b> → ③ <b>개발자 도구</b>를 누르면 화면 옆에 코드 창이 열려요.
        </p>
        <p className="guide-key">
          단축키: Mac <kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd> · Windows <kbd>F12</kbd>
        </p>
      </Step>
      <Step no={2} title="고칠 곳을 콕 집기" img="/devtools/pick-element.png" alt="개발자 도구의 요소 선택 버튼을 누르고 화면의 로그인 글자를 클릭하자 해당 코드 줄이 강조된 화면">
        <p>
          ① 개발자 도구 왼쪽 위의 <b>요소 선택 버튼(↖)</b>을 누르고, ② 화면에서 고치고 싶은 곳을 클릭하세요. ③ 그 부분의 코드 한 줄이 오른쪽에 강조돼요.
        </p>
        <p className="guide-tip">더 빠른 방법: 고칠 곳을 바로 우클릭 → <b>검사</b></p>
      </Step>
      <Step no={3} title="요소 복사하기" img="/devtools/copy-element.png" alt="강조된 코드 줄을 우클릭해 복사, 요소 복사를 고르는 화면">
        <p>
          ① 강조된 줄을 <b>우클릭</b> → <b>복사</b> → ② <b>요소 복사</b>. 이제 클립보드에 그 부분의 코드가 담겼어요.
        </p>
      </Step>
      <Step no={4} title="AI에게 붙여넣어 부탁하기">
        <p>
          AI는 사람이 아니라 컴퓨터예요. 내 화면을 볼 수 없어서 <b>"위쪽 그거"</b>는 추측해야 하지만, <b>코드 한 줄</b>은 프로젝트 전체에서 글자 그대로 검색해 정확히 찾아내요.
        </p>
        <div className="guide-compare">
          <div className="guide-say bad">
            <span className="pg-md-tag bad">사람에게 하듯 말하면</span>
            <p>{VAGUE}</p>
            <small>헤더의 로그인? 팝업의 로그인 버튼? 로그인 페이지 제목? AI가 짐작으로 엉뚱한 곳을 고칠 수 있어요.</small>
          </div>
          <div className="guide-say good">
            <span className="pg-md-tag good">요소를 붙여서 말하면</span>
            <p className="mono">{EXACT}</p>
            <small>
              <code>link__usermenu</code> 같은 이름과 "로그인" 글자로 코드를 바로 찾아서, 딱 그 줄만 고쳐요.
            </small>
            <button className="btn small" onClick={copy}>
              {copied ? '복사됨' : '이 문장 복사'}
            </button>
          </div>
        </div>
        <p className="guide-tip">요소 복사는 내가 만들고 있는 사이트에서 써야 효과가 있어요. AI가 고치는 건 내 프로젝트의 코드니까요. (예시 화면은 G마켓이에요.)</p>
      </Step>
    </div>
  )
}

export const GUIDES = {
  'inspect-element': InspectGuide,
}
