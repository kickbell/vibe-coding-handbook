import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Shell, EventLog, useEventLog, Slider, Segmented, Toggle } from '../components/kit'
import { C, PALETTE, Check, CartIcon, Icon } from '../demos/parts'
import { PgPhone } from './ui-layout'

const ACC_COLORS = { orange: C.acc, mint: C.mint, ink: C.ink }

/* ───────── Toggle Switch ───────── */

const SW_SIZE = { s: [36, 20], m: [48, 28], l: [60, 34] }

function ToggleSwitchPG() {
  const [vals, setVals] = useState([true, false, true])
  const [size, setSize] = useState('m')
  const [color, setColor] = useState('orange')
  const [disabled, setDisabled] = useState(false)
  const { logs, push, clear } = useEventLog()
  const [w, h] = SW_SIZE[size]
  const labels = ['알림 받기', '다크 모드', '자동 저장']

  const flip = (i) => {
    if (i === 2 && disabled) return push('option', "'자동 저장'은 비활성화 상태라 바뀌지 않아요")
    setVals(vals.map((v, j) => (j === i ? !v : v)))
    push(vals[i] ? 'close' : 'open', `'${labels[i]}' ${vals[i] ? '끔' : '켬'} → 바로 저장`)
  }
  const colorKo = { orange: '주황', mint: '초록', ink: '검정' }[color]
  const prompt = `설정 화면에 토글 스위치(Toggle Switch)를 만들어줘. ${labels.join(', ')} 3개, 크기는 ${w}x${h}px. 켜면 배경이 ${colorKo}색으로 바뀌고 흰 동그라미가 오른쪽으로 spring처럼 미끄러지게. 누르는 즉시 저장(별도 저장 버튼 없음).${disabled ? ' "자동 저장"은 비활성화 상태로 흐리게, 눌러도 안 바뀌게.' : ''} 스크린리더용 role="switch"와 aria-checked도 넣어줘.`

  return (
    <Shell
      hint="스위치를 눌러보세요"
      stage={
        <div className="pg-card pg-settings">
          {labels.map((l, i) => {
            const off = i === 2 && disabled
            return (
              <button key={l} role="switch" aria-checked={vals[i]} className={'pg-set-row' + (off ? ' off' : '')} onClick={() => flip(i)}>
                <span>{l}</span>
                <motion.span className="pg-sw" style={{ width: w, height: h, padding: 3 }} animate={{ background: vals[i] ? ACC_COLORS[color] : '#d6d2c8' }}>
                  <motion.span style={{ width: h - 6, height: h - 6 }} animate={{ x: vals[i] ? w - h : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }} />
                </motion.span>
              </button>
            )
          })}
        </div>
      }
      controls={
        <>
          <Segmented label="크기" value={size} onChange={setSize} options={[{ value: 's', label: '작게' }, { value: 'm', label: '보통' }, { value: 'l', label: '크게' }]} />
          <Segmented label="켜졌을 때 색" value={color} onChange={setColor} options={[{ value: 'orange', label: '주황' }, { value: 'mint', label: '초록' }, { value: 'ink', label: '검정' }]} />
          <Toggle label="마지막 스위치 비활성화" value={disabled} onChange={setDisabled} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Checkbox / Radio ───────── */

const Box = ({ on, radio, some }) => (
  <span className={'pg-cb' + (radio ? ' radio' : '') + (on || some ? ' on' : '')}>
    {radio ? on && <motion.i layoutId="pg-radio-dot" /> : some ? <b>−</b> : on && <Check size={12} color="#fff" />}
  </span>
)

const INTERESTS = ['디자인', '개발', '기획', '마케팅', '영상']
const AGES = ['10대', '20대', '30대', '40대 이상']

function CheckboxRadioPG() {
  const [checked, setChecked] = useState(['개발'])
  const [age, setAge] = useState(null)
  const [max, setMax] = useState(0)
  const [chip, setChip] = useState(false)
  const [all, setAll] = useState(true)
  const { logs, push, clear } = useEventLog()

  const toggle = (x) => {
    if (checked.includes(x)) {
      setChecked(checked.filter((c) => c !== x))
      return push('close', `'${x}' 체크 해제`)
    }
    if (max && checked.length >= max) return push('option', `최대 ${max}개까지만 고를 수 있어요`)
    setChecked([...checked, x])
    push('open', `'${x}' 체크 (${checked.length + 1}개 선택됨)`)
  }
  const allState = checked.length === 0 ? 'none' : checked.length === INTERESTS.length ? 'all' : 'some'
  const toggleAll = () => {
    const next = allState === 'all' ? [] : INTERESTS.slice(0, max || INTERESTS.length)
    setChecked(next)
    push('child', allState === 'all' ? '전체 해제' : `전체 선택 (${next.length}개)`)
  }

  const prompt = `설문 폼을 만들어줘. "관심 분야"(${INTERESTS.join('/')})는 체크박스(Checkbox)로 여러 개 선택${max ? `, 최대 ${max}개까지만` : ''}${all ? ', 맨 위에 "전체 선택" 체크박스 (일부만 선택되면 − 표시)' : ''}. "연령대"(${AGES.join('/')})는 라디오 버튼(Radio)으로 하나만 선택. ${chip ? '둘 다 동그란 버튼(칩) 모양으로 보여주고 선택되면 주황 배경으로.' : '체크되면 주황색으로 채워지게.'}`

  return (
    <Shell
      hint="여러 개 vs 하나만 선택해 보세요"
      stage={
        <div className={'pg-card pg-form' + (chip ? ' chips' : '')}>
          <fieldset>
            <legend>관심 분야 <small>여러 개 선택{max ? ` (최대 ${max}개)` : ''}</small></legend>
            {all && !chip && (
              <button className="pg-opt all" onClick={toggleAll}>
                <Box on={allState === 'all'} some={allState === 'some'} />
                전체 선택
              </button>
            )}
            <div className="pg-opts">
              {INTERESTS.map((x) => (
                <button key={x} className={'pg-opt' + (checked.includes(x) ? ' sel' : '')} role="checkbox" aria-checked={checked.includes(x)} onClick={() => toggle(x)}>
                  {!chip && <Box on={checked.includes(x)} />}
                  {x}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>연령대 <small>하나만 선택</small></legend>
            <div className="pg-opts" role="radiogroup">
              {AGES.map((x) => (
                <button
                  key={x}
                  className={'pg-opt' + (age === x ? ' sel' : '')}
                  role="radio"
                  aria-checked={age === x}
                  onClick={() => {
                    if (age && age !== x) push('close', `'${age}' 자동 해제`)
                    setAge(x)
                    push('open', `'${x}' 선택`)
                  }}
                >
                  {!chip && <Box on={age === x} radio />}
                  {x}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      }
      controls={
        <>
          <Slider label="최대 선택 개수 (0 = 제한 없음)" value={max} min={0} max={4} step={1} unit="개" onChange={setMax} />
          <Toggle label="전체 선택 체크박스" value={all} onChange={setAll} />
          <Toggle label="칩(버튼) 모양으로" value={chip} onChange={setChip} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Text Field ───────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function TextFieldPG() {
  const [v, setV] = useState('')
  const [focus, setFocus] = useState(false)
  const [touched, setTouched] = useState(false)
  const [labelStyle, setLabelStyle] = useState('top')
  const [when, setWhen] = useState('blur')
  const [counter, setCounter] = useState(true)
  const { logs, push, clear } = useEventLog()
  const valid = EMAIL_RE.test(v)
  const showErr = v && !valid && (when === 'live' || touched)
  const float = labelStyle === 'float'
  const up = !float || focus || v

  const prompt = `회원가입 폼에 이메일 입력 칸(Text Field)을 만들어줘. ${float ? '라벨 "이메일"은 처음엔 칸 안에 있다가, 클릭하거나 글자가 있으면 위로 작게 떠오르게(floating label).' : '칸 위에 "이메일" 라벨.'} 입력 중엔 테두리가 주황색, 이메일 형식이 틀리면 ${when === 'live' ? '입력하는 즉시' : '칸을 벗어날 때'} 빨간 테두리와 "올바른 이메일을 입력해주세요" 문구, 맞으면 초록 체크 표시.${counter ? ' 오른쪽 아래에 글자 수 (최대 40자) 표시.' : ''}`

  return (
    <Shell
      hint="이메일을 입력해 보세요"
      stage={
        <div className="pg-tf">
          {!float && <span className="pg-label">이메일</span>}
          <div className={'pg-tf-box' + (focus ? ' focus' : '') + (showErr ? ' err' : '') + (v && valid ? ' ok' : '')}>
            {float && (
              <motion.span className="pg-tf-float" animate={{ y: up ? -13 : 0, scale: up ? 0.78 : 1, color: focus ? C.acc : '#9a958b' }} transition={{ duration: 0.18 }}>
                이메일
              </motion.span>
            )}
            <input
              value={v}
              maxLength={40}
              style={float ? { paddingTop: 14 } : {}}
              onChange={(e) => setV(e.target.value)}
              onFocus={() => {
                setFocus(true)
                push('start', '칸 선택 (포커스) → 주황 테두리')
              }}
              onBlur={() => {
                setFocus(false)
                setTouched(true)
                push(v && !valid ? 'close' : 'end', v ? (valid ? '칸 벗어남 → 형식 맞음' : '칸 벗어남 → 형식 틀림, 오류 표시') : '칸 벗어남 (비어 있음)')
              }}
            />
            <AnimatePresence>{v && valid && <motion.span className="pg-tf-ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={12} color="#fff" /></motion.span>}</AnimatePresence>
          </div>
          <div className="pg-tf-foot">
            <AnimatePresence mode="wait">
              <motion.span key={showErr ? 'e' : 'h'} className={'pg-help' + (showErr ? ' err' : '')} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {showErr ? '올바른 이메일을 입력해주세요' : '로그인할 때 쓸 이메일이에요'}
              </motion.span>
            </AnimatePresence>
            {counter && <span className="mono">{v.length}/40</span>}
          </div>
        </div>
      }
      controls={
        <>
          <Segmented label="라벨 모양" value={labelStyle} onChange={setLabelStyle} options={[{ value: 'top', label: '위에 고정' }, { value: 'float', label: '떠오르는 라벨' }]} />
          <Segmented label="오류 검사 시점" value={when} onChange={setWhen} options={[{ value: 'blur', label: '칸 벗어날 때' }, { value: 'live', label: '입력하는 즉시' }]} />
          <Toggle label="글자 수 표시" value={counter} onChange={setCounter} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Placeholder ───────── */

function PlaceholderPG() {
  const [text, setText] = useState('예: 홍길동')
  const [shade, setShade] = useState(165)
  const [asLabel, setAsLabel] = useState(false)
  const [v, setV] = useState('')
  const typing = useRef(false)
  const { logs, push, clear } = useEventLog()
  const color = `rgb(${shade}, ${shade - 4}, ${shade - 12})`
  // 흰 배경 대비 (WCAG 상대 휘도 대략값)
  const lum = (x) => {
    const c = x / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const ratio = (1.05 / (0.2126 * lum(shade) + 0.7152 * lum(shade - 4) + 0.0722 * lum(shade - 12) + 0.05)).toFixed(1)

  const prompt = `이름 입력 칸에 플레이스홀더(Placeholder) "${text}"를 넣어줘. 글자색은 ${color}${ratio < 3 ? ' (너무 연해서 잘 안 보이니 조금 더 진하게)' : ''}. ${asLabel ? '' : '칸 위에는 "이름" 라벨을 따로 두고, '}플레이스홀더는 입력하면 사라지는 예시 문구로만 써줘. 라벨 대신 플레이스홀더만 쓰면 입력하는 순간 무엇을 쓰는 칸인지 사라지니 주의.`

  return (
    <Shell
      hint="칸에 글자를 입력해 보세요"
      stage={
        <div className="pg-tf">
          {!asLabel && <span className="pg-label">이름</span>}
          <input
            className="pg-input pg-ph"
            style={{ '--ph': color }}
            placeholder={asLabel ? '이름' : text}
            value={v}
            onChange={(e) => {
              const nv = e.target.value
              if (!v && nv && !typing.current) {
                typing.current = true
                push('close', asLabel ? '입력 시작 → "이름" 안내가 사라져서 무슨 칸인지 안 보임!' : '입력 시작 → 예시 문구 사라짐 (라벨은 그대로)')
              }
              if (!nv) {
                typing.current = false
                push('open', '다 지움 → 안내 문구 다시 보임')
              }
              setV(nv)
            }}
          />
          <div className="pg-tf-foot">
            <span className="pg-help">흰 배경 대비 {ratio} : 1 {ratio < 3 ? '· 너무 연해요' : ratio > 7 ? '· 입력한 글자처럼 보일 만큼 진해요' : '· 적당해요'}</span>
          </div>
        </div>
      }
      controls={
        <>
          <label className="ctl">
            <span className="ctl-top">
              <span>안내 문구</span>
            </span>
            <input className="pg-input" value={text} maxLength={20} onChange={(e) => setText(e.target.value)} />
          </label>
          <Slider label="글자 밝기 (높을수록 연함)" value={shade} min={90} max={230} step={5} onChange={setShade} />
          <Toggle label="라벨 없이 플레이스홀더만 (안 좋은 예)" value={asLabel} onChange={setAsLabel} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Select ───────── */

const REGIONS = { 수도권: ['서울', '경기', '인천'], 영남: ['부산', '대구', '울산'], 호남: ['광주', '전주'] }

function SelectPG() {
  const [v, setV] = useState('')
  const [groups, setGroups] = useState(true)
  const [ph, setPh] = useState(true)
  const [required, setRequired] = useState(true)
  const [err, setErr] = useState(false)
  const [done, setDone] = useState(false)
  const { logs, push, clear } = useEventLog()
  const flat = Object.values(REGIONS).flat()
  const value = !ph && !v ? flat[0] : v

  const prompt = `주소 입력 폼에 지역 선택 칸(Select)을 만들어줘. 선택지는 ${groups ? Object.entries(REGIONS).map(([g, l]) => `${g}(${l.join('/')})`).join(', ') + '처럼 그룹으로 묶어서(optgroup)' : flat.join('/')}. ${ph ? '처음 값은 회색 "선택해주세요"로 두고' : `처음엔 "${flat[0]}"이 선택된 상태로 두고`}, 오른쪽에 아래 화살표 아이콘.${required ? ' 필수 항목이라 고르지 않고 "다음"을 누르면 빨간 테두리와 "지역을 선택해주세요" 문구.' : ''}`

  return (
    <Shell
      hint="지역을 골라보세요"
      stage={
        <div className="pg-tf">
          <span className="pg-label">지역{required && <em style={{ color: '#e5484d' }}> *</em>}</span>
          <div className={'pg-select' + (err ? ' err' : '')}>
            <select
              value={value}
              style={{ color: value ? C.ink : '#9a958b' }}
              onChange={(e) => {
                setV(e.target.value)
                setErr(false)
                setDone(false)
                push('end', `'${e.target.value}' 선택`)
              }}
            >
              {ph && (
                <option value="" disabled>
                  선택해주세요
                </option>
              )}
              {groups
                ? Object.entries(REGIONS).map(([g, list]) => (
                    <optgroup key={g} label={g}>
                      {list.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </optgroup>
                  ))
                : flat.map((x) => <option key={x}>{x}</option>)}
            </select>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <AnimatePresence mode="wait">
            {(err || done) && (
              <motion.span key={err ? 'e' : 'd'} className={'pg-help ' + (err ? 'err' : 'ok')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {err ? '지역을 선택해주세요' : `${value} → 다음 단계로`}
              </motion.span>
            )}
          </AnimatePresence>
          <button
            className="btn"
            onClick={() => {
              if (required && !value) {
                setErr(true)
                return push('close', '선택 안 함 → 필수 오류')
              }
              setDone(true)
              push('open', `제출: ${value || '(선택 안 함)'}`)
            }}
          >
            다음
          </button>
        </div>
      }
      controls={
        <>
          <Toggle label="'선택해주세요'로 시작" value={ph} onChange={setPh} />
          <Toggle label="그룹으로 묶기 (optgroup)" value={groups} onChange={setGroups} />
          <Toggle label="필수 항목" value={required} onChange={setRequired} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Search Bar ───────── */

const WORDS = ['바이브코딩', '바이브 코딩 강의', '바텀 내비게이션', '반응형 웹', '배포하기', '버튼 디자인', '브레드크럼', '스크롤 애니메이션', '스켈레톤 로딩', '스프링 애니메이션', '아코디언', '애니메이션 이징', '토글 스위치', '토스트 알림']

function SearchBarPG() {
  const [q, setQ] = useState('')
  const [hl, setHl] = useState(-1)
  const [focus, setFocus] = useState(false)
  const [debounce, setDebounce] = useState(300)
  const [max, setMax] = useState(5)
  const [recentOn, setRecentOn] = useState(true)
  const [recent, setRecent] = useState(['토글 스위치', '반응형 웹'])
  const [results, setResults] = useState([])
  const { logs, push, clear } = useEventLog()

  useEffect(() => {
    if (!q.trim()) return setResults([])
    const id = setTimeout(() => {
      const r = WORDS.filter((w) => w.includes(q.trim())).slice(0, max)
      setResults(r)
      setHl(-1)
      push('child', `"${q}" 검색 요청 (입력 멈춘 뒤 ${debounce}ms) → ${r.length}개`)
    }, debounce)
    return () => clearTimeout(id)
  }, [q, debounce, max, push])

  const pick = (w) => {
    setQ(w)
    setResults([])
    setRecent((r) => [w, ...r.filter((x) => x !== w)].slice(0, 4))
    push('end', `'${w}' 검색 실행`)
  }
  const list = q.trim() ? results : recentOn ? recent : []
  const onKey = (e) => {
    if (e.key === 'ArrowDown') setHl((h) => Math.min(h + 1, list.length - 1))
    else if (e.key === 'ArrowUp') setHl((h) => Math.max(h - 1, -1))
    else if (e.key === 'Enter') pick(hl >= 0 ? list[hl] : q)
    else if (e.key === 'Escape') e.currentTarget.blur()
    else return
    e.preventDefault()
  }
  const bold = (w) => {
    const i = w.indexOf(q.trim())
    if (!q.trim() || i < 0) return w
    return (
      <>
        {w.slice(0, i)}
        <b>{w.slice(i, i + q.trim().length)}</b>
        {w.slice(i + q.trim().length)}
      </>
    )
  }

  const prompt = `상단에 둥근 검색창(Search Bar)을 만들어줘. 왼쪽에 돋보기 아이콘, 오른쪽에 입력 지우기(×) 버튼. 글자를 입력하고 ${debounce}ms 동안 멈추면 그때 검색 요청을 보내고(debounce), 아래에 추천 검색어를 최대 ${max}개 보여주며 입력한 글자와 일치하는 부분은 굵게.${recentOn ? ' 빈 칸을 누르면 최근 검색어를 보여줘.' : ''} 키보드 위/아래와 Enter로 고를 수 있게.`

  return (
    <Shell
      hint="'바' 또는 '스'를 입력해 보세요"
      stage={
        <div className="pg-search">
          <div className={'pg-search-box' + (focus ? ' focus' : '')}>
            <Icon n="search" size={18} color="#9a958b" />
            <input value={q} placeholder="용어 검색" onChange={(e) => setQ(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)} onKeyDown={onKey} />
            {q && (
              <button
                onClick={() => {
                  setQ('')
                  push('close', '입력 지움')
                }}
              >
                ×
              </button>
            )}
          </div>
          <AnimatePresence>
            {focus && list.length > 0 && (
              <motion.ul className="pg-search-list" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
                {!q.trim() && <li className="cap">최근 검색어</li>}
                {list.map((w, i) => (
                  <li key={w} className={i === hl ? 'hl' : ''} onMouseDown={() => pick(w)} onMouseEnter={() => setHl(i)}>
                    <Icon n={q.trim() ? 'search' : 'gear'} size={14} color="#b5b0a6" />
                    <span>{bold(w)}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      }
      controls={
        <>
          <Slider label="입력 멈추고 기다리는 시간 (debounce)" value={debounce} min={0} max={1000} step={50} unit="ms" onChange={setDebounce} />
          <Slider label="추천 검색어 최대 개수" value={max} min={2} max={8} step={1} unit="개" onChange={setMax} />
          <Toggle label="빈 칸이면 최근 검색어" value={recentOn} onChange={setRecentOn} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── CTA Button ───────── */

const CTA_COPY = ['무료로 시작하기', '14일 무료 체험', '지금 바로 만들기']
const CTA_SIZE = { s: [36, 14, 13], m: [46, 22, 15], l: [56, 30, 17] }

function CTAButtonPG() {
  const [size, setSize] = useState('m')
  const [effect, setEffect] = useState('glow')
  const [copy, setCopy] = useState(0)
  const [arrow, setArrow] = useState(true)
  const [n, setN] = useState(0)
  const { logs, push, clear } = useEventLog()
  const [h, px, fs] = CTA_SIZE[size]

  const effKo = { none: '', glow: ' 버튼 주변에 주황빛이 은은하게 퍼졌다 줄어드는 효과(glow)를 2초 주기로 반복하고,', pulse: ' 3초마다 살짝 커졌다 돌아오며 눈길을 끌게 하고,' }[effect]
  const prompt = `히어로 섹션의 핵심 CTA 버튼을 가장 눈에 띄게 만들어줘. 문구는 "${CTA_COPY[copy]}"${arrow ? ' + 오른쪽 화살표(→), 마우스를 올리면 화살표가 살짝 오른쪽으로 이동' : ''}. 주황색 배경, 흰 글씨, 높이 ${h}px의 둥근 알약 모양.${effKo} 다른 버튼은 이보다 덜 눈에 띄게 (보조 버튼은 테두리만).`

  return (
    <Shell
      hint="버튼을 눌러보세요"
      stage={
        <div className="pg-col">
          <div className="pg-cta-hero">
            <b>아이디어를 바로 앱으로</b>
            <span>코드 없이 말로 만들어요</span>
            <div className="pg-row" style={{ gap: 10 }}>
              <motion.button
                className="pg-cta"
                style={{ height: h, padding: `0 ${px}px`, fontSize: fs }}
                animate={effect === 'glow' ? { boxShadow: ['0 0 0 0 rgba(255,107,44,.45)', '0 0 0 12px rgba(255,107,44,0)'] } : effect === 'pulse' ? { scale: [1, 1.06, 1] } : { scale: 1, boxShadow: '0 0 0 0 rgba(0,0,0,0)' }}
                transition={effect === 'none' ? { duration: 0.2 } : { duration: effect === 'glow' ? 2 : 0.6, repeat: Infinity, repeatDelay: effect === 'pulse' ? 2.4 : 0 }}
                whileHover="hover"
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setN(n + 1)
                  push('end', `CTA 클릭 → 가입 페이지로 (${n + 1}번째)`)
                }}
              >
                {CTA_COPY[copy]}
                {arrow && <motion.span variants={{ hover: { x: 4 } }}>→</motion.span>}
              </motion.button>
              <button className="btn ghost" style={{ height: h }} onClick={() => push('move', '보조 버튼 클릭')}>
                둘러보기
              </button>
            </div>
          </div>
        </div>
      }
      controls={
        <>
          <Segmented label="문구" value={copy} onChange={setCopy} options={CTA_COPY.map((c, i) => ({ value: i, label: c }))} />
          <Segmented label="크기" value={size} onChange={setSize} options={[{ value: 's', label: '작게' }, { value: 'm', label: '보통' }, { value: 'l', label: '크게' }]} />
          <Segmented label="눈길 끄는 효과" value={effect} onChange={setEffect} options={[{ value: 'none', label: '없음' }, { value: 'glow', label: '빛 퍼짐' }, { value: 'pulse', label: '커졌다 작아짐' }]} />
          <Toggle label="화살표 아이콘" value={arrow} onChange={setArrow} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Primary / Secondary ───────── */

const BTN_NAMES = ['취소', '미리보기', '저장']
const LEVEL_KO = { primary: 'Primary(주황 배경)', secondary: 'Secondary(주황 테두리)', text: 'Text(글자만)' }

function ButtonHierarchyPG() {
  const [levels, setLevels] = useState(['text', 'secondary', 'primary'])
  const { logs, push, clear } = useEventLog()
  const primaries = levels.filter((l) => l === 'primary').length
  const setLevel = (i) => (v) => {
    setLevels(levels.map((l, j) => (j === i ? v : l)))
    push('option', `'${BTN_NAMES[i]}' → ${v}`)
  }

  const prompt = `글쓰기 폼 아래 버튼들을 중요도에 따라 정리해줘. ${BTN_NAMES.map((n, i) => `"${n}"은 ${LEVEL_KO[levels[i]]}`).join(', ')} 버튼으로. 가장 중요한 행동은 오른쪽 끝에 두고, 버튼 높이는 모두 같게.${primaries > 1 ? ' (Primary가 여러 개면 무엇을 눌러야 할지 헷갈리니 하나만 남겨줘.)' : ''}`

  return (
    <Shell
      hint="버튼마다 중요도를 바꿔보세요"
      stage={
        <div className="pg-card pg-bh">
          <span className="pg-label">새 글 쓰기</span>
          <div className="pg-bh-field" />
          <div className="pg-bh-btns">
            {BTN_NAMES.map((n, i) => (
              <motion.button layout key={n} className={'pg-lv ' + levels[i]} onClick={() => push('end', `'${n}' 클릭`)}>
                {n}
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {primaries !== 1 && (
              <motion.p className="pg-help err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                {primaries > 1 ? `Primary가 ${primaries}개예요. 가장 중요한 행동이 뭔지 헷갈려요.` : 'Primary가 없어요. 사용자가 무엇을 눌러야 할지 몰라요.'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      }
      controls={
        <>
          {BTN_NAMES.map((n, i) => (
            <Segmented key={n} label={`'${n}' 버튼`} value={levels[i]} onChange={setLevel(i)} options={[{ value: 'primary', label: 'Primary' }, { value: 'secondary', label: 'Secondary' }, { value: 'text', label: 'Text' }]} />
          ))}
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── FAB ───────── */

const FAB_ACTIONS = [
  ['pen', '글쓰기'],
  ['image', '사진'],
  ['mail', '초대'],
]

function FABPG() {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState('right')
  const [hideOnScroll, setHideOnScroll] = useState(true)
  const [hidden, setHidden] = useState(false)
  const last = useRef(0)
  const { logs, push, clear } = useEventLog()

  const onScroll = (e) => {
    const y = e.currentTarget.scrollTop
    if (hideOnScroll) {
      const h = y > last.current && y > 30
      if (h !== hidden && Math.abs(y - last.current) > 3) {
        setHidden(h)
        if (h) setOpen(false)
        push(h ? 'close' : 'open', h ? '아래로 스크롤 → FAB 숨김' : '위로 스크롤 → FAB 다시 보임')
      }
    }
    last.current = y
  }
  const prompt = `모바일 화면 ${pos === 'right' ? '오른쪽 아래' : '가운데 아래'}에 FAB(플로팅 액션 버튼)를 만들어줘. 주황색 동그라미에 + 아이콘, 누르면 45도 회전해서 ×가 되고 ${FAB_ACTIONS.map((a) => a[1]).join('/')} 작은 버튼이 아래부터 차례로 위로 펼쳐지게(이름표 포함). 바깥을 누르면 접혀.${hideOnScroll ? ' 아래로 스크롤하면 FAB를 아래로 숨기고 위로 스크롤하면 다시 보여줘.' : ''}`

  return (
    <Shell
      hint="+ 버튼을 누르고, 목록도 스크롤해 보세요"
      stage={
        <PgPhone>
          <div className="pg-hb-head">
            <b>피드</b>
          </div>
          <div className="pg-fab-feed" onScroll={onScroll}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="pg-fab-post">
                <span style={{ background: PALETTE[i % 5] }} />
                <i />
              </div>
            ))}
          </div>
          <AnimatePresence>{open && <motion.div className="pg-fab-dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => (setOpen(false), push('close', '바깥 클릭 → 접힘'))} />}</AnimatePresence>
          <motion.div className={'pg-fab ' + pos} animate={{ y: hidden ? 100 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
            <AnimatePresence>
              {open &&
                FAB_ACTIONS.map(([ic, t], i) => (
                  <motion.button
                    key={t}
                    className="pg-fab-mini"
                    initial={{ opacity: 0, y: 20, scale: 0.6 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: (FAB_ACTIONS.length - 1 - i) * 0.05 } }}
                    exit={{ opacity: 0, y: 20, scale: 0.6, transition: { delay: i * 0.03 } }}
                    onClick={() => {
                      setOpen(false)
                      push('end', `'${t}' 선택`)
                    }}
                  >
                    <em>{t}</em>
                    <span>
                      <Icon n={ic} size={16} />
                    </span>
                  </motion.button>
                ))}
            </AnimatePresence>
            <motion.button
              className="pg-fab-main"
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              onClick={() => {
                setOpen(!open)
                push(open ? 'close' : 'open', open ? '접힘' : '펼침 → 작은 버튼 3개')
              }}
            >
              <Icon n="plus" size={24} color="#fff" w={2.6} />
            </motion.button>
          </motion.div>
        </PgPhone>
      }
      controls={
        <>
          <Segmented label="위치" value={pos} onChange={setPos} options={[{ value: 'right', label: '오른쪽 아래' }, { value: 'center', label: '가운데 아래' }]} />
          <Toggle
            label="스크롤 내리면 숨기기"
            value={hideOnScroll}
            onChange={(v) => {
              setHideOnScroll(v)
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

/* ───────── Pull to Refresh ───────── */

function PullToRefreshPG() {
  const [items, setItems] = useState([3, 2, 1])
  const [threshold, setThreshold] = useState(70)
  const [wait, setWait] = useState(1.2)
  const [resist, setResist] = useState(0.5)
  const [pull, setPull] = useState(0)
  const [loading, setLoading] = useState(false)
  const start = useRef(null)
  const passed = useRef(false)
  const { logs, push, clear } = useEventLog()

  const down = (e) => {
    if (loading) return
    start.current = e.clientY
    passed.current = false
    e.currentTarget.setPointerCapture(e.pointerId)
    push('drag', '당기기 시작')
  }
  const move = (e) => {
    if (start.current == null) return
    const d = Math.max(0, (e.clientY - start.current) * resist)
    setPull(d)
    if (d >= threshold && !passed.current) {
      passed.current = true
      push('child', `${threshold}px 넘음 → 놓으면 새로고침`)
    }
  }
  const up = () => {
    if (start.current == null) return
    start.current = null
    if (pull >= threshold) {
      setLoading(true)
      setPull(56)
      push('start', '새로고침 중…')
      setTimeout(() => {
        setItems((it) => [it[0] + 1, ...it])
        setLoading(false)
        setPull(0)
        push('end', '새 글 1개 도착 → 맨 위에 추가')
      }, wait * 1000)
    } else {
      setPull(0)
      push('release', '덜 당김 → 제자리로')
    }
  }

  const prompt = `피드 목록에 당겨서 새로고침(Pull to Refresh)을 넣어줘. 목록 맨 위에서 아래로 당기면 손가락 움직임의 ${Math.round(resist * 100)}%만큼만 따라 내려오고(저항감), 위에 화살표가 보이다가 ${threshold}px 이상 당기면 화살표가 뒤집히며 "놓으면 새로고침". 놓으면 로딩 스피너를 보여주며 새 글을 불러오고(약 ${wait}초), 끝나면 맨 위에 추가하면서 제자리로 올라가게.`

  const ready = pull >= threshold
  return (
    <Shell
      hint="목록을 마우스로 잡고 아래로 당겼다 놓아보세요"
      stage={
        <PgPhone>
          <div className="pg-hb-head">
            <b>새 소식</b>
          </div>
          <div className="pg-ptr" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
            <div className="pg-ptr-top" style={{ height: pull }}>
              {loading ? (
                <motion.span className="pg-spin" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              ) : (
                pull > 6 && (
                  <>
                    <motion.span animate={{ rotate: ready ? 180 : 0 }}>↓</motion.span>
                    <small>{ready ? '놓으면 새로고침' : '당겨서 새로고침'}</small>
                  </>
                )
              )}
            </div>
            <div>
              <AnimatePresence initial={false}>
                {items.map((n) => (
                  <motion.div key={n} className="pg-fab-post" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <span style={{ background: PALETTE[n % 5] }} />
                    <b>새 글 #{n}</b>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </PgPhone>
      }
      controls={
        <>
          <Slider label="새로고침되는 당김 거리" value={threshold} min={40} max={140} step={5} unit="px" onChange={setThreshold} />
          <Slider label="저항감 (따라오는 비율)" value={resist} min={0.2} max={1} step={0.05} onChange={setResist} />
          <Slider label="불러오는 시간 (가짜)" value={wait} min={0.3} max={3} step={0.1} unit="s" onChange={setWait} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Infinite Scroll ───────── */

const INF_MAX = 60

function InfiniteScrollPG() {
  const [count, setCount] = useState(10)
  const [batch, setBatch] = useState(10)
  const [wait, setWait] = useState(0.8)
  const [margin, setMargin] = useState(100)
  const [button, setButton] = useState(false)
  const [loading, setLoading] = useState(false)
  const root = useRef(null)
  const sentinel = useRef(null)
  const { logs, push, clear } = useEventLog()

  const load = (why) => {
    if (loading || count >= INF_MAX) return
    setLoading(true)
    push('start', `${why} → ${batch}개 불러오는 중`)
    const n = Math.min(count + batch, INF_MAX)
    setTimeout(() => {
      setCount(n)
      setLoading(false)
      push(n >= INF_MAX ? 'settle' : 'end', n >= INF_MAX ? `${n}개 · 더 없음 → 끝 표시` : `${n}개 표시 중`)
    }, wait * 1000)
  }
  const loadRef = useRef(load)
  loadRef.current = load

  useEffect(() => {
    if (button) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && loadRef.current(`바닥 ${margin}px 전에 도달`), { root: root.current, rootMargin: `0px 0px ${margin}px 0px` })
    io.observe(sentinel.current)
    return () => io.disconnect()
  }, [button, margin, count])

  const prompt = `상품 목록을 ${button ? '"더보기" 버튼 방식' : '무한 스크롤(Infinite Scroll)'}으로 만들어줘. 처음엔 10개, ${button ? '맨 아래 "더보기" 버튼을 누르면' : `목록 끝에서 ${margin}px 전에 닿으면 미리`} ${batch}개씩 더 불러오고, 불러오는 동안 아래에 로딩 스피너. 더 불러올 게 없으면 "모두 봤어요" 문구. IntersectionObserver 사용, 같은 요청이 두 번 가지 않게 막아줘.`

  return (
    <Shell
      hint="안쪽 목록을 끝까지 스크롤해 보세요"
      stage={
        <div className="pg-scroller pg-inf" ref={root}>
          <div className="pg-inf-grid">
            {Array.from({ length: count }).map((_, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: (i % batch) * 0.03 }}>
                <span style={{ background: PALETTE[i % 5] }} />
                <b className="mono">#{i + 1}</b>
              </motion.div>
            ))}
          </div>
          <div ref={sentinel} className="pg-inf-foot">
            {count >= INF_MAX ? (
              <span>모두 봤어요 ({INF_MAX}개)</span>
            ) : loading ? (
              <motion.span className="pg-spin" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
            ) : (
              button && (
                <button className="btn small" onClick={() => load('더보기 클릭')}>
                  더보기
                </button>
              )
            )}
          </div>
        </div>
      }
      controls={
        <>
          <Slider label="한 번에 불러오는 개수" value={batch} min={4} max={20} step={2} unit="개" onChange={setBatch} />
          <Slider label="불러오는 시간 (가짜)" value={wait} min={0.2} max={2.5} step={0.1} unit="s" onChange={setWait} />
          <Slider label="미리 불러오는 거리" value={margin} min={0} max={300} step={20} unit="px" onChange={setMargin} />
          <Toggle label="'더보기' 버튼 방식으로" value={button} onChange={setButton} />
          <button
            className="link"
            onClick={() => {
              setCount(10)
              root.current.scrollTop = 0
              push('option', '처음으로')
            }}
          >
            처음부터 다시
          </button>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Badge ───────── */

function BadgePG() {
  const [counts, setCounts] = useState([3, 12, 0])
  const [max, setMax] = useState(9)
  const [dot, setDot] = useState(false)
  const [hideZero, setHideZero] = useState(true)
  const { logs, push, clear } = useEventLog()
  const icons = [
    ['bell', '알림'],
    ['mail', '메시지'],
    ['cart', '장바구니'],
  ]
  const label = (n) => (n > max ? `${max}+` : n)

  const prompt = `아이콘 오른쪽 위에 배지(Badge)를 붙여줘. ${dot ? '숫자 대신 작은 빨간 점만' : `빨간 동그라미에 흰 숫자, ${max}개가 넘으면 "${max}+"로`} 표시${hideZero ? ', 0이면 배지를 숨기고' : ''}. 숫자가 바뀔 때마다 배지가 톡 튀어나오는(scale) 애니메이션. 배지 테두리는 배경색과 같은 2px 선으로 아이콘과 분리.`

  return (
    <Shell
      hint="+1 / 읽음 버튼을 눌러보세요"
      stage={
        <div className="pg-badges">
          {icons.map(([ic, t], i) => {
            const n = counts[i]
            const show = !(hideZero && n === 0)
            return (
              <div key={t} className="pg-badge-col">
                <div className="pg-badge-ic">
                  {ic === 'cart' ? <CartIcon size={28} /> : <Icon n={ic} size={28} />}
                  <AnimatePresence>
                    {show && (
                      <motion.span key={dot ? 'dot' : label(n)} className={'pg-badge' + (dot ? ' dot' : '')} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 16 }}>
                        {!dot && label(n)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <small>{t}</small>
                <div className="pg-row" style={{ gap: 4 }}>
                  <button
                    className="chip-btn"
                    onClick={() => {
                      setCounts((cs) => cs.map((c, j) => (j === i ? c + 1 : c)))
                      push('open', `${t} ${n + 1}개${n + 1 > max && !dot ? ` → "${max}+"로 표시` : ''}`)
                    }}
                  >
                    +1
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => {
                      setCounts(counts.map((c, j) => (j === i ? 0 : c)))
                      push('close', `${t} 모두 읽음 → 0`)
                    }}
                  >
                    읽음
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      }
      controls={
        <>
          <Segmented label="모양" value={dot} onChange={setDot} options={[{ value: false, label: '숫자' }, { value: true, label: '점만' }]} />
          <Segmented label="최대 표시 숫자" value={max} onChange={setMax} options={[{ value: 9, label: '9+' }, { value: 99, label: '99+' }]} />
          <Toggle label="0이면 숨기기" value={hideZero} onChange={setHideZero} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Avatar ───────── */

const PEOPLE = [
  { n: '김지수', photo: true, on: true },
  { n: '박민', photo: false, on: false },
  { n: 'Alex', photo: false, on: true },
  { n: '이서연', photo: true, on: false },
  { n: '최도윤', photo: false, on: false },
  { n: '정하은', photo: true, on: true },
]

function AvatarPG() {
  const [size, setSize] = useState(44)
  const [shape, setShape] = useState('circle')
  const [fallback, setFallback] = useState('initial')
  const [status, setStatus] = useState(true)
  const [group, setGroup] = useState(false)
  const [people, setPeople] = useState(PEOPLE)
  const { logs, push, clear } = useEventLog()
  const r = shape === 'circle' ? '50%' : `${Math.round(size * 0.28)}px`

  const av = (p, i, extra = {}) => (
    <motion.span
      layout
      key={p.n}
      className="pg-av"
      style={{ width: size, height: size, borderRadius: r, fontSize: size * 0.38, background: p.photo ? `linear-gradient(135deg, ${PALETTE[i % 5]}, ${PALETTE[(i + 2) % 5]})` : PALETTE[i % 5] + '33', color: PALETTE[i % 5], ...extra }}
      title={p.n}
      onClick={() => {
        setPeople(people.map((x) => (x === p ? { ...x, on: !x.on } : x)))
        push(p.on ? 'close' : 'open', `${p.n} ${p.on ? '오프라인' : '접속 중'}`)
      }}
    >
      {p.photo ? <Icon n="user" size={size * 0.5} color="rgba(255,255,255,.85)" /> : fallback === 'initial' ? [...p.n][0] : <Icon n="user" size={size * 0.5} />}
      {status && <i className={p.on ? 'on' : ''} style={{ width: Math.max(9, size * 0.26), height: Math.max(9, size * 0.26) }} />}
    </motion.span>
  )

  const prompt = `댓글과 멤버 목록에 아바타(Avatar)를 보여줘. 크기 ${size}px, ${shape === 'circle' ? '동그라미' : '모서리가 둥근 사각형'} 모양. 프로필 사진이 없으면 ${fallback === 'initial' ? '이름 첫 글자를 연한 색 배경 위에' : '기본 사람 아이콘을'} 보여주고${status ? ', 오른쪽 아래에 접속 중이면 초록 점, 아니면 회색 점' : ''}.${group ? ' 여러 명일 땐 살짝 겹쳐서 최대 4명까지 보여주고 나머지는 "+2"로.' : ''}`

  return (
    <Shell
      hint="아바타를 누르면 접속 상태가 바뀌어요"
      stage={
        <div className="pg-card pg-avs">
          {group ? (
            <div className="pg-av-group">
              {people.slice(0, 4).map((p, i) => av(p, i, { marginLeft: i ? -size * 0.3 : 0, boxShadow: '0 0 0 3px #fff' }))}
              <span className="pg-av more" style={{ width: size, height: size, borderRadius: r, marginLeft: -size * 0.3, fontSize: size * 0.32 }}>
                +{people.length - 4}
              </span>
            </div>
          ) : (
            people.slice(0, 4).map((p, i) => (
              <div key={p.n} className="pg-av-row">
                {av(p, i)}
                <div>
                  <b>{p.n}</b>
                  <span>{['좋은 아이디어예요!', '저도 동의해요', 'Looks good 👍', '내일 같이 봐요'][i]}</span>
                </div>
              </div>
            ))
          )}
        </div>
      }
      controls={
        <>
          <Slider label="크기" value={size} min={24} max={72} step={4} unit="px" onChange={setSize} />
          <Segmented label="모양" value={shape} onChange={setShape} options={[{ value: 'circle', label: '동그라미' }, { value: 'rounded', label: '둥근 사각' }]} />
          <Segmented label="사진 없을 때" value={fallback} onChange={setFallback} options={[{ value: 'initial', label: '첫 글자' }, { value: 'icon', label: '기본 아이콘' }]} />
          <Toggle label="접속 상태 점" value={status} onChange={setStatus} />
          <Toggle label="겹쳐서 그룹으로" value={group} onChange={setGroup} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Chip / Tag ───────── */

const CHIP_POSTS = [
  ['디자인', '버튼 색 고르는 법'],
  ['개발', 'React 시작하기'],
  ['기획', '기능 우선순위 정하기'],
  ['디자인', '여백의 법칙'],
  ['마케팅', '첫 1000명 모으기'],
  ['개발', '배포 자동화'],
]

function ChipTagPG() {
  const [tags, setTags] = useState(['디자인', '개발', '기획', '마케팅'])
  const [sel, setSel] = useState(['디자인'])
  const [multi, setMulti] = useState(true)
  const [removable, setRemovable] = useState(false)
  const [style, setStyle] = useState('fill')
  const [input, setInput] = useState('')
  const { logs, push, clear } = useEventLog()
  const shown = sel.length ? CHIP_POSTS.filter(([t]) => sel.includes(t)) : CHIP_POSTS

  const tap = (t) => {
    if (sel.includes(t)) {
      setSel(sel.filter((x) => x !== t))
      return push('close', `'${t}' 필터 해제`)
    }
    setSel(multi ? [...sel, t] : [t])
    push('open', multi ? `'${t}' 필터 추가` : `'${t}'만 선택`)
  }
  const add = (e) => {
    e.preventDefault()
    const t = input.trim()
    if (!t || tags.includes(t)) return
    setTags([...tags, t])
    setInput('')
    push('child', `태그 '${t}' 추가`)
  }

  const prompt = `글 목록 위에 카테고리 필터 칩(Chip/Tag)을 만들어줘. ${tags.join('/')} 칩을 가로로 나열하고, ${multi ? '여러 개를 동시에 선택' : '하나만 선택'}할 수 있게. 선택된 칩은 ${style === 'fill' ? '검정 배경에 흰 글씨' : '주황 테두리와 주황 글씨'}, 선택된 칩에 맞는 글만 아래에 보여줘.${removable ? ' 각 칩에 × 버튼을 달아 지울 수 있게 하고, 입력 칸에서 Enter를 누르면 새 태그가 추가되게.' : ''} 칩이 많으면 가로로 스크롤.`

  return (
    <Shell
      hint="칩을 눌러 글을 걸러보세요"
      stage={
        <div className="pg-card pg-chips">
          <div className={'pg-chip-row ' + style}>
            <AnimatePresence initial={false}>
              {tags.map((t) => (
                <motion.button layout key={t} className={'pg-chip' + (sel.includes(t) ? ' on' : '')} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} onClick={() => tap(t)}>
                  {t}
                  {removable && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        setTags(tags.filter((x) => x !== t))
                        setSel(sel.filter((x) => x !== t))
                        push('close', `태그 '${t}' 삭제`)
                      }}
                    >
                      ×
                    </span>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
            {removable && (
              <form onSubmit={add}>
                <input className="pg-chip-input" value={input} placeholder="+ 태그" onChange={(e) => setInput(e.target.value)} />
              </form>
            )}
          </div>
          <ul className="pg-chip-list">
            <AnimatePresence initial={false}>
              {shown.map(([t, title]) => (
                <motion.li layout key={title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <em>{t}</em>
                  {title}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      }
      controls={
        <>
          <Segmented
            label="선택 방식"
            value={multi}
            onChange={(v) => {
              setMulti(v)
              if (!v) setSel(sel.slice(0, 1))
            }}
            options={[{ value: true, label: '여러 개' }, { value: false, label: '하나만' }]}
          />
          <Segmented label="선택된 칩 모양" value={style} onChange={setStyle} options={[{ value: 'fill', label: '채움' }, { value: 'outline', label: '테두리' }]} />
          <Toggle label="지우기(×)·추가 가능" value={removable} onChange={setRemovable} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Progress Bar ───────── */

function ProgressBarPG() {
  const [p, setP] = useState(0)
  const [running, setRunning] = useState(false)
  const [shape, setShape] = useState('bar')
  const [mode, setMode] = useState('determinate')
  const [percent, setPercent] = useState(true)
  const [stripes, setStripes] = useState(true)
  const [speed, setSpeed] = useState(4)
  const { logs, push, clear } = useEventLog()
  const marks = useRef(new Set())

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setP((v) => Math.min(100, v + (100 / (speed * 10)) * (0.5 + Math.random()))), 100)
    return () => clearInterval(id)
  }, [running, speed])

  useEffect(() => {
    if (!running) return
    ;[25, 50, 75].forEach((m) => {
      if (p >= m && !marks.current.has(m)) {
        marks.current.add(m)
        push('child', `${m}% 업로드됨`)
      }
    })
    if (p >= 100) {
      setRunning(false)
      push('end', '업로드 완료 ✓')
    }
  }, [p, running, push])

  const start = () => {
    marks.current = new Set()
    setP(0)
    setRunning(true)
    push('start', '파일 업로드 시작 (photo.jpg 4.2MB)')
  }
  const indet = mode === 'indeterminate'
  const pct = Math.round(p)
  const R = 34
  const CIRC = 2 * Math.PI * R

  const prompt = `파일 업로드 중에 진행률 ${shape === 'bar' ? '막대(Progress Bar)' : '원형 표시(Circular Progress)'}를 보여줘. ${indet ? '전체 크기를 알 수 없으니 정해진 끝 없이 계속 흐르는 표시(indeterminate)로' : '실제 진행률만큼 주황색이 차오르고'}${percent && !indet ? ', 옆에 퍼센트 숫자' : ''}${stripes && shape === 'bar' ? ', 막대 안에 사선 줄무늬가 흐르게' : ''}. 100%가 되면 초록색 체크로 바뀌게.`

  return (
    <Shell
      hint="'업로드'를 눌러보세요"
      stage={
        <div className="pg-card pg-prog">
          <div className="pg-prog-file">
            <span className="pg-prog-thumb" />
            <div>
              <b>photo.jpg</b>
              <small>{p >= 100 ? '완료' : running ? (indet ? '업로드 중…' : `${((4.2 * p) / 100).toFixed(1)} / 4.2MB`) : '대기 중'}</small>
            </div>
            {percent && !indet && shape === 'bar' && <span className="mono pg-prog-pct">{p >= 100 ? <Check size={16} color={C.mint} /> : `${pct}%`}</span>}
          </div>
          {shape === 'bar' ? (
            <div className="pg-prog-track">
              {indet && running ? (
                <motion.i className="indet" animate={{ x: ['-100%', '250%'] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} />
              ) : (
                <motion.i className={stripes && running ? 'stripes' : ''} animate={{ width: `${indet ? (p >= 100 ? 100 : 0) : p}%`, background: p >= 100 ? C.mint : C.acc }} transition={{ duration: 0.15 }} />
              )}
            </div>
          ) : (
            <div className="pg-prog-ring">
              <svg width="90" height="90" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r={R} fill="none" stroke="#ece8e0" strokeWidth="8" />
                {indet && running ? (
                  <motion.circle cx="45" cy="45" r={R} fill="none" stroke={C.acc} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${CIRC * 0.25} ${CIRC}`} animate={{ rotate: 360 }} style={{ originX: '50%', originY: '50%' }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                ) : (
                  <motion.circle cx="45" cy="45" r={R} fill="none" stroke={p >= 100 ? C.mint : C.acc} strokeWidth="8" strokeLinecap="round" strokeDasharray={CIRC} animate={{ strokeDashoffset: CIRC * (1 - (indet ? (p >= 100 ? 1 : 0) : p) / 100) }} transform="rotate(-90 45 45)" transition={{ duration: 0.15 }} />
                )}
              </svg>
              {percent && !indet && <span className="mono">{p >= 100 ? '✓' : `${pct}%`}</span>}
            </div>
          )}
          <button className="btn small" onClick={start} disabled={running}>
            {p >= 100 ? '다시 업로드' : '업로드'}
          </button>
        </div>
      }
      controls={
        <>
          <Segmented label="모양" value={shape} onChange={setShape} options={[{ value: 'bar', label: '막대' }, { value: 'ring', label: '원형' }]} />
          <Segmented label="진행률을 아나요?" value={mode} onChange={setMode} options={[{ value: 'determinate', label: '안다 (%)' }, { value: 'indeterminate', label: '모른다' }]} />
          <Slider label="업로드 시간 (가짜)" value={speed} min={1} max={10} step={0.5} unit="s" onChange={setSpeed} />
          <Toggle label="퍼센트 숫자" value={percent} onChange={setPercent} />
          <Toggle label="흐르는 줄무늬 (막대)" value={stripes} onChange={setStripes} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Spinner ───────── */

function SpinnerView({ kind, size, speed, color }) {
  if (kind === 'ring')
    return <motion.span className="pg-spinner-ring" style={{ width: size, height: size, borderWidth: Math.max(3, size / 9), borderTopColor: color }} animate={{ rotate: 360 }} transition={{ duration: speed, repeat: Infinity, ease: 'linear' }} />
  if (kind === 'dots')
    return (
      <span className="pg-row" style={{ gap: size / 6 }}>
        {[0, 1, 2].map((i) => (
          <motion.i key={i} style={{ width: size / 3.4, height: size / 3.4, borderRadius: 99, background: color, display: 'block' }} animate={{ y: [0, -size / 4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: speed, repeat: Infinity, delay: (i * speed) / 6 }} />
        ))}
      </span>
    )
  return (
    <span className="pg-row" style={{ gap: size / 10, height: size, alignItems: 'center' }}>
      {[0, 1, 2, 3].map((i) => (
        <motion.i key={i} style={{ width: size / 7, height: size, borderRadius: 99, background: color, display: 'block' }} animate={{ scaleY: [0.35, 1, 0.35] }} transition={{ duration: speed, repeat: Infinity, delay: (i * speed) / 8 }} />
      ))}
    </span>
  )
}

function SpinnerPG() {
  const [kind, setKind] = useState('ring')
  const [size, setSize] = useState(36)
  const [speed, setSpeed] = useState(0.8)
  const [color, setColor] = useState('orange')
  const [wait, setWait] = useState(1.5)
  const [delayed, setDelayed] = useState(true)
  const [state, setState] = useState('idle')
  const timers = useRef([])
  const { logs, push, clear } = useEventLog()
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const load = () => {
    timers.current.forEach(clearTimeout)
    setState('waiting')
    push('start', `요청 보냄 (응답까지 ${wait}s)`)
    const show = delayed ? 0.3 : 0
    timers.current = []
    if (wait > show) timers.current.push(setTimeout(() => (setState('spin'), push('child', `${show}s 지남 → 스피너 표시`)), show * 1000))
    else push('option', `${wait}s 만에 끝나서 스피너 안 보여줌 (깜빡임 방지)`)
    timers.current.push(setTimeout(() => (setState('done'), push('end', '응답 도착 → 결과 표시')), wait * 1000))
  }

  const kindKo = { ring: '도는 원형 테두리', dots: '위아래로 통통 튀는 점 3개', bars: '높이가 변하는 막대 4개' }[kind]
  const prompt = `데이터를 불러오는 동안 로딩 스피너(Spinner)를 보여줘. ${kindKo} 모양, 크기 ${size}px, 한 바퀴 ${speed}초, ${{ orange: '주황', ink: '검정', mint: '초록' }[color]}색.${delayed ? ' 응답이 0.3초 안에 오면 스피너가 번쩍 깜빡이지 않게 0.3초가 지난 뒤에만 보여줘.' : ''} 화면을 막지 않고 불러오는 영역 가운데에만 표시.`

  return (
    <Shell
      hint="'불러오기'를 눌러보세요"
      stage={
        <div className="pg-card pg-spinner">
          <div className="pg-spinner-area">
            {state === 'spin' && <SpinnerView kind={kind} size={size} speed={speed} color={ACC_COLORS[color]} />}
            {state === 'idle' && <span className="pg-help">버튼을 눌러 불러오세요</span>}
            {state === 'waiting' && <span className="pg-help">　</span>}
            {state === 'done' && (
              <motion.div className="pg-spinner-done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {PALETTE.slice(0, 3).map((c) => (
                  <span key={c} style={{ background: c }} />
                ))}
              </motion.div>
            )}
          </div>
          <div className="pg-spinner-preview">
            <SpinnerView kind={kind} size={22} speed={speed} color={ACC_COLORS[color]} />
            <small>미리보기</small>
          </div>
          <button className="btn small" onClick={load}>
            불러오기
          </button>
        </div>
      }
      controls={
        <>
          <Segmented label="모양" value={kind} onChange={setKind} options={[{ value: 'ring', label: '원형' }, { value: 'dots', label: '점 3개' }, { value: 'bars', label: '막대' }]} />
          <Slider label="크기" value={size} min={16} max={64} step={4} unit="px" onChange={setSize} />
          <Slider label="한 바퀴 시간 (속도)" value={speed} min={0.3} max={2} step={0.1} unit="s" onChange={setSpeed} />
          <Segmented label="색" value={color} onChange={setColor} options={[{ value: 'orange', label: '주황' }, { value: 'ink', label: '검정' }, { value: 'mint', label: '초록' }]} />
          <Slider label="응답 걸리는 시간 (가짜)" value={wait} min={0.1} max={4} step={0.1} unit="s" onChange={setWait} />
          <Toggle label="0.3초 지나야 보여주기" value={delayed} onChange={setDelayed} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Empty State ───────── */

const TONE = {
  friendly: { t: '아직 작성한 글이 없어요', d: '첫 글을 남겨서 이야기를 시작해 보세요!' },
  plain: { t: '글 없음', d: '작성된 글이 없습니다.' },
}

function EmptyStatePG() {
  const [posts, setPosts] = useState(['오늘 배운 것', '주말 계획'])
  const [illu, setIllu] = useState(true)
  const [cta, setCta] = useState(true)
  const [tone, setTone] = useState('friendly')
  const { logs, push, clear } = useEventLog()

  const prompt = `글 목록이 비어 있을 때 빈 화면(Empty State)을 보여줘. 가운데에 ${illu ? '연한 색 일러스트(빈 상자 아이콘), ' : ''}제목 "${TONE[tone].t}", 설명 "${TONE[tone].d}"${cta ? ', 그리고 주황색 "첫 글 쓰기" 버튼(누르면 글쓰기 화면으로)' : ''}. 그냥 하얀 빈 화면으로 두지 말고, 다음에 무엇을 하면 되는지 알려줘.`

  return (
    <Shell
      hint="글을 모두 지워보세요"
      stage={
        <div className="pg-card pg-empty">
          <div className="pg-empty-head">
            <b>내 글</b>
            <span className="mono">{posts.length}개</span>
          </div>
          <AnimatePresence mode="popLayout" initial={false}>
            {posts.length ? (
              posts.map((p) => (
                <motion.div layout key={p} className="pg-empty-row" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
                  <span>{p}</span>
                  <button
                    onClick={() => {
                      setPosts(posts.filter((x) => x !== p))
                      push('close', `'${p}' 삭제${posts.length === 1 ? ' → 목록이 비어서 빈 화면 표시' : ''}`)
                    }}
                  >
                    삭제
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div key="empty" className="pg-empty-box" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                {illu && (
                  <span className="pg-empty-illu">
                    <Icon n="box" size={34} color="#c9b8a8" />
                  </span>
                )}
                <b>{TONE[tone].t}</b>
                <span>{TONE[tone].d}</span>
                {cta && (
                  <button
                    className="btn small"
                    style={{ background: C.acc }}
                    onClick={() => {
                      setPosts(['나의 첫 글'])
                      push('open', "'첫 글 쓰기' → 글 추가됨")
                    }}
                  >
                    첫 글 쓰기
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
      controls={
        <>
          <Toggle label="일러스트" value={illu} onChange={setIllu} />
          <Toggle label="다음 행동 버튼" value={cta} onChange={setCta} />
          <Segmented label="문구 말투" value={tone} onChange={setTone} options={[{ value: 'friendly', label: '친근하게' }, { value: 'plain', label: '딱딱하게' }]} />
          <button
            className="link"
            onClick={() => {
              setPosts(['오늘 배운 것', '주말 계획'])
              push('option', '글 되돌리기')
            }}
          >
            글 되돌리기
          </button>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

export const UI_INPUT_PGS = {
  'toggle-switch': ToggleSwitchPG,
  'checkbox-radio': CheckboxRadioPG,
  'text-field': TextFieldPG,
  placeholder: PlaceholderPG,
  select: SelectPG,
  'search-bar': SearchBarPG,
  'cta-button': CTAButtonPG,
  'button-hierarchy': ButtonHierarchyPG,
  fab: FABPG,
  'pull-to-refresh': PullToRefreshPG,
  'infinite-scroll': InfiniteScrollPG,
  badge: BadgePG,
  avatar: AvatarPG,
  'chip-tag': ChipTagPG,
  'progress-bar': ProgressBarPG,
  spinner: SpinnerPG,
  'empty-state': EmptyStatePG,
}
