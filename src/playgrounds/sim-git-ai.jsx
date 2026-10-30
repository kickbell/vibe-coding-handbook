import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Shell, EventLog, useEventLog, Slider, Segmented, Toggle } from '../components/kit'
import { C, PALETTE } from '../demos/parts'
import { CodeArea } from './sim-dev'

const hash = () => Math.random().toString(16).slice(2, 9)

/* ───────── Commit ───────── */

const FILES0 = [
  { name: 'src/App.jsx', changed: true },
  { name: 'src/style.css', changed: true },
  { name: 'README.md', changed: false },
]
const MSG_EXAMPLES = ['로그인 버튼 색을 주황색으로 변경', '할 일 삭제 기능 추가', '모바일에서 메뉴 겹치는 문제 수정']

function CommitPG() {
  const [files, setFiles] = useState(FILES0)
  const [staged, setStaged] = useState([])
  const [msg, setMsg] = useState('')
  const [history, setHistory] = useState([{ id: 'a1f3c9e', msg: '첫 커밋: 프로젝트 시작', files: 3 }])
  const [err, setErr] = useState('')
  const { logs, push, clear } = useEventLog()
  const changed = files.filter((f) => f.changed)

  const stage = (name) => {
    setStaged(staged.includes(name) ? staged.filter((x) => x !== name) : [...staged, name])
    push(staged.includes(name) ? 'close' : 'open', staged.includes(name) ? `git restore --staged ${name}` : `git add ${name} → 커밋할 목록에 담음`)
  }
  const commit = () => {
    if (!staged.length) return setErr('커밋할 파일을 먼저 담아주세요 (git add)')
    if (!msg.trim()) return setErr('무엇을 바꿨는지 메시지를 적어주세요')
    const id = hash()
    setHistory([{ id, msg: msg.trim(), files: staged.length }, ...history])
    setFiles(files.map((f) => (staged.includes(f.name) ? { ...f, changed: false } : f)))
    setStaged([])
    setMsg('')
    setErr('')
    push('end', `git commit -m "${msg.trim()}" → ${id} 저장 지점 생성`)
  }
  const edit = () => {
    const f = files.find((x) => !x.changed) || files[0]
    setFiles(files.map((x) => (x === f ? { ...x, changed: true } : x)))
    push('child', `${f.name} 수정함 → 바뀐 파일 목록에 나타남`)
  }

  const prompt = `지금까지 바꾼 내용을 커밋(Commit)해줘. ${staged.length ? `${staged.join(', ')} 파일만 골라 담고(git add)` : '바뀐 파일을 확인해서 관련 있는 것만 담고(git add)'}, 커밋 메시지는 ${msg.trim() ? `"${msg.trim()}"` : '무엇을 왜 바꿨는지 한 줄로 알기 쉽게'} 적어줘. 서로 다른 작업은 커밋을 나눠서, 나중에 이 지점으로 되돌아올 수 있게.`

  return (
    <Shell
      hint="파일을 담고(add) 메시지를 써서 커밋해 보세요"
      stage={
        <div className="pg-git">
          <div className="pg-git-col">
            <span className="pg-md-tag mono">바뀐 파일 (git status)</span>
            {changed.length === 0 && <small className="pg-help">바뀐 파일이 없어요 · 아래 '파일 수정하기'</small>}
            {changed.map((f) => (
              <button key={f.name} className={'pg-git-file' + (staged.includes(f.name) ? ' on' : '')} onClick={() => stage(f.name)}>
                <span className="pg-cb" style={staged.includes(f.name) ? { background: C.acc, borderColor: C.acc } : {}}>{staged.includes(f.name) && '✓'}</span>
                <span className="mono">{f.name}</span>
                <em>M</em>
              </button>
            ))}
            <input className="pg-input" placeholder="커밋 메시지" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && commit()} />
            <AnimatePresence>{err && <motion.span className="pg-help err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{err}</motion.span>}</AnimatePresence>
            <div className="pg-row" style={{ gap: 6, justifyContent: 'flex-start' }}>
              <button className="btn small" onClick={commit}>
                커밋 ({staged.length})
              </button>
              <button className="btn small ghost" onClick={edit}>
                파일 수정하기
              </button>
            </div>
          </div>
          <div className="pg-git-col">
            <span className="pg-md-tag mono">커밋 기록 (git log)</span>
            <div className="pg-git-log">
              <AnimatePresence initial={false}>
                {history.map((h, i) => (
                  <motion.div layout key={h.id} className="pg-git-commit" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <i style={{ background: i ? '#cfcac0' : C.acc }} />
                    <div>
                      <b>{h.msg}</b>
                      <small className="mono">
                        {h.id} · 파일 {h.files}개{i === 0 && ' · HEAD'}
                      </small>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      }
      controls={
        <>
          <div className="ctl">
            <span className="ctl-top">
              <span>좋은 메시지 예시</span>
            </span>
            <div className="presets">
              {MSG_EXAMPLES.map((m) => (
                <button key={m} className="chip-btn" style={{ fontSize: 12 }} onClick={() => setMsg(m)}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <button
            className="chip-btn"
            onClick={() => {
              setStaged(changed.map((f) => f.name))
              push('open', `git add . → 바뀐 파일 ${changed.length}개 전부 담음`)
            }}
          >
            전부 담기 (git add .)
          </button>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Branch ───────── */

const LANE = { main: 0, feature: 1 }
const BR_COLOR = { main: C.acc, feature: C.sky }

function BranchPG() {
  const init = () => ({ commits: [{ id: 0, br: 'main', parents: [], msg: '시작' }, { id: 1, br: 'main', parents: [0], msg: '홈 화면' }], heads: { main: 1 }, cur: 'main' })
  const [g, setG] = useState(init)
  const [name, setName] = useState('login')
  const { logs, push, clear } = useEventLog()
  const fname = `feature/${name || 'new'}`

  const commit = () => {
    const id = g.commits.length
    setG({ ...g, commits: [...g.commits, { id, br: g.cur, parents: [g.heads[g.cur]], msg: g.cur === 'main' ? '수정' : '로그인 작업' }], heads: { ...g.heads, [g.cur]: id } })
    push('child', `${g.cur === 'main' ? 'main' : fname}에 커밋`)
  }
  const branch = () => {
    if (g.heads.feature !== undefined) return push('option', '이미 기능 브랜치가 있어요')
    setG({ ...g, heads: { ...g.heads, feature: g.heads.main }, cur: 'feature' })
    push('open', `git switch -c ${fname} → main에서 갈라져 나옴`)
  }
  const checkout = (br) => {
    if (g.heads[br] === undefined) return
    setG({ ...g, cur: br })
    push('move', `git switch ${br === 'main' ? 'main' : fname}`)
  }
  const merge = () => {
    if (g.heads.feature === undefined) return push('option', '합칠 브랜치가 없어요')
    if (g.heads.feature === g.heads.main) return push('option', '합칠 새 커밋이 없어요')
    const id = g.commits.length
    setG({ commits: [...g.commits, { id, br: 'main', parents: [g.heads.main, g.heads.feature], msg: '합치기', merge: true }], heads: { main: id }, cur: 'main' })
    push('end', `git merge ${fname} → main에 합침, 브랜치 정리`)
  }

  const X = (id) => 24 + id * 46
  const Y = (br) => 34 + LANE[br] * 56
  const w = Math.max(320, X(g.commits.length) + 10)

  const prompt = `로그인 기능은 main 브랜치에서 바로 작업하지 말고 ${fname} 브랜치(Branch)를 새로 만들어서 작업해줘. 작업 중간중간 커밋하고, 다 되면 main으로 전환(switch)해서 ${fname}를 합쳐줘(merge). 합친 뒤에는 다 쓴 브랜치를 지워서 정리하고, 지금 어느 브랜치에 있는지 항상 알려줘.`

  return (
    <Shell
      hint="브랜치를 만들고 → 커밋 → main으로 합쳐보세요"
      stage={
        <div className="pg-branch">
          <div className="pg-branch-graph">
            <svg width={w} height={130}>
              {g.commits.flatMap((c) =>
                c.parents.map((p) => {
                  const pc = g.commits[p]
                  const fromFeature = c.merge && p !== c.parents[0]
                  return <path key={c.id + '-' + p} d={`M${X(p)} ${Y(pc.br)} C ${X(p) + 23} ${Y(pc.br)}, ${X(c.id) - 23} ${Y(c.br)}, ${X(c.id)} ${Y(c.br)}`} stroke={BR_COLOR[fromFeature ? 'feature' : c.br]} strokeWidth="3" fill="none" />
                }),
              )}
              {g.commits.map((c) => (
                <motion.g key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <circle cx={X(c.id)} cy={Y(c.br)} r={c.merge ? 9 : 8} fill="#fff" stroke={BR_COLOR[c.br]} strokeWidth="3" />
                  <text x={X(c.id)} y={Y(c.br) + 24} fontSize="9" textAnchor="middle" fill="#9a958b">
                    {c.msg}
                  </text>
                </motion.g>
              ))}
              {Object.entries(g.heads).map(([br, id]) => (
                <text key={br} x={X(id) + 12} y={Y(br) - 12} fontSize="10" fontWeight="800" fill={BR_COLOR[br]}>
                  {br === 'main' ? 'main' : fname}
                  {g.cur === br ? ' ●' : ''}
                </text>
              ))}
            </svg>
          </div>
          <div className="pg-branch-btns">
            <button className="btn small" onClick={commit}>
              커밋
            </button>
            <button className="btn small ghost" onClick={branch} disabled={g.heads.feature !== undefined}>
              브랜치 만들기
            </button>
            <button className="btn small ghost" onClick={() => checkout(g.cur === 'main' ? 'feature' : 'main')} disabled={g.heads.feature === undefined}>
              {g.cur === 'main' ? '기능 브랜치로' : 'main으로'} 이동
            </button>
            <button className="btn small ghost" onClick={merge} disabled={g.heads.feature === undefined}>
              main에 합치기
            </button>
          </div>
          <span className="pg-help">
            지금 위치: <b style={{ color: BR_COLOR[g.cur] }}>{g.cur === 'main' ? 'main' : fname}</b>
          </span>
        </div>
      }
      controls={
        <>
          <label className="ctl">
            <span className="ctl-top">
              <span>기능 브랜치 이름</span>
            </span>
            <input className="pg-input mono" value={name} maxLength={14} onChange={(e) => setName(e.target.value.replace(/[^a-z0-9-]/gi, ''))} />
          </label>
          <button
            className="link"
            onClick={() => {
              setG(init())
              push('option', '처음으로')
            }}
          >
            처음으로
          </button>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Merge Conflict ───────── */

const CONFLICTS = {
  color: { file: 'style.css', before: '.buy-button {', after: '}', mine: '  background: orange;', theirs: '  background: royalblue;', preview: (v) => <span className="pg-mc-btn" style={{ background: v.includes('orange') && v.includes('royalblue') ? 'linear-gradient(90deg, orange 50%, royalblue 50%)' : v.includes('royalblue') ? 'royalblue' : v.includes('orange') ? 'orange' : '#ccc' }}>구매하기</span> },
  title: { file: 'Hero.jsx', before: '<h1>', after: '</h1>', mine: '  지금 시작하세요', theirs: '  무료로 써보세요', preview: (v) => <b style={{ fontSize: 18 }}>{v.split('\n').map((l) => l.trim()).filter(Boolean).join(' / ') || '(비어 있음)'}</b> },
}

function MergeConflictPG() {
  const [kind, setKind] = useState('color')
  const [resolved, setResolved] = useState(null)
  const [committed, setCommitted] = useState(false)
  const { logs, push, clear } = useEventLog()
  const c = CONFLICTS[kind]

  const choose = (how) => {
    const v = { mine: c.mine, theirs: c.theirs, both: `${c.mine}\n${c.theirs}` }[how]
    setResolved(v)
    setCommitted(false)
    push('end', { mine: '내 변경(main)을 남김', theirs: '상대 변경(feature)을 남김', both: '둘 다 남김' }[how] + ' → 표시(<<< === >>>) 지움')
  }
  const reset = (k = kind) => {
    setKind(k)
    setResolved(null)
    setCommitted(false)
  }

  const prompt = `git merge를 했더니 ${c.file}에서 충돌(Merge Conflict)이 났어. <<<<<<<, =======, >>>>>>> 표시 사이에 내 쪽은 "${c.mine.trim()}", 상대 쪽은 "${c.theirs.trim()}"이야. ${resolved ? `"${resolved.trim().replace(/\n\s*/g, ' + ')}"로 정리해서` : '어느 쪽을 남길지 나에게 먼저 물어보고'} 충돌 표시를 모두 지운 다음, 다시 커밋해줘.`

  return (
    <Shell
      hint="충돌 난 부분에서 남길 쪽을 골라보세요"
      stage={
        <div className="pg-mc">
          <span className="pg-md-tag mono">
            {c.file} {resolved ? '· 해결됨' : '· 충돌!'}
          </span>
          <pre className="pg-mc-code">
            <span>{c.before}</span>
            {resolved ? (
              <motion.span className="res" initial={{ background: '#d9f5ec' }} animate={{ background: 'rgba(0,0,0,0)' }} transition={{ duration: 1.2 }}>
                {resolved}
              </motion.span>
            ) : (
              <>
                <span className="mk">{'<<<<<<< HEAD (내 것: main)'}</span>
                <span className="mine">{c.mine}</span>
                <span className="mk">=======</span>
                <span className="theirs">{c.theirs}</span>
                <span className="mk">{'>>>>>>> feature/redesign (상대 것)'}</span>
              </>
            )}
            <span>{c.after}</span>
          </pre>
          <div className="pg-branch-btns">
            <button className="btn small" style={{ background: '#2ec4a0' }} onClick={() => choose('mine')}>
              내 것 남기기
            </button>
            <button className="btn small" style={{ background: C.sky }} onClick={() => choose('theirs')}>
              상대 것 남기기
            </button>
            <button className="btn small ghost" onClick={() => choose('both')}>
              둘 다
            </button>
          </div>
          <div className="pg-mc-preview">
            <small>결과 미리보기</small>
            {resolved ? c.preview(resolved) : <span className="pg-help err">충돌을 해결하기 전에는 앱이 실행되지 않아요</span>}
          </div>
          <button
            className="btn small"
            disabled={!resolved || committed}
            onClick={() => {
              setCommitted(true)
              push('settle', 'git add + git commit → 합치기 완료')
            }}
          >
            {committed ? '합치기 완료 ✓' : '해결 후 커밋'}
          </button>
        </div>
      }
      controls={
        <>
          <Segmented label="충돌 예시" value={kind} onChange={(v) => reset(v)} options={[{ value: 'color', label: '버튼 색' }, { value: 'title', label: '제목 문구' }]} />
          <button
            className="link"
            onClick={() => {
              reset()
              push('option', '충돌 다시 내기')
            }}
          >
            충돌 다시 내기
          </button>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── .gitignore ───────── */

const PROJECT_FILES = ['src/App.jsx', 'src/main.jsx', 'package.json', 'README.md', '.env', '.env.example', 'node_modules/react/index.js', 'node_modules/vite/bin.js', 'dist/index.html', 'debug.log', '.DS_Store']

function ignoredBy(rules, path) {
  let hit = null
  for (const raw of rules) {
    const neg = raw.startsWith('!')
    const r = neg ? raw.slice(1) : raw
    const base = path.split('/').pop()
    let m = false
    if (r.endsWith('/')) m = path.startsWith(r)
    else if (r.startsWith('*.')) m = base.endsWith(r.slice(1))
    else m = path === r || base === r
    if (m) hit = neg ? null : raw
  }
  return hit
}

function GitignorePG() {
  const [src, setSrc] = useState('node_modules/\n.env\n')
  const { logs, push, clear } = useEventLog()
  const rules = src
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
  const rows = PROJECT_FILES.map((f) => ({ f, by: ignoredBy(rules, f) }))
  const uploaded = rows.filter((r) => !r.by).length
  const envLeak = rows.some((r) => r.f === '.env' && !r.by)
  const addRule = (r) => {
    if (rules.includes(r)) return
    setSrc((s) => (s.endsWith('\n') || !s ? s : s + '\n') + r + '\n')
    push('child', `규칙 "${r}" 추가 → ${PROJECT_FILES.filter((f) => ignoredBy([...rules, r], f) && !ignoredBy(rules, f)).length}개 파일 제외`)
  }

  const prompt = `이 프로젝트에 .gitignore 파일을 만들어줘. ${rules.length ? rules.join(', ') : 'node_modules/, .env, dist/, *.log, .DS_Store'}는 GitHub에 올라가지 않게 하고, 비밀번호·API 키가 든 .env는 절대 올리지 마. 대신 어떤 값이 필요한지 알 수 있게 .env.example은 올려줘. 이미 올라간 파일이 있으면 git rm --cached로 빼는 방법도.`

  return (
    <Shell
      hint="왼쪽 규칙을 고치면 오른쪽 파일이 바로 제외돼요"
      stage={
        <div className="pg-md split">
          <div className="pg-md-col">
            <span className="pg-md-tag mono">.gitignore</span>
            <CodeArea value={src} onChange={setSrc} rows={10} />
          </div>
          <div className="pg-md-col">
            <span className={'pg-md-tag mono ' + (envLeak ? 'bad' : 'good')}>
              GitHub에 올라가는 파일 {uploaded}개{envLeak && ' · .env 노출 위험!'}
            </span>
            <ul className="pg-gi-list">
              {rows.map(({ f, by }) => (
                <motion.li layout key={f} className={by ? 'ign' : f === '.env' ? 'leak' : ''}>
                  <span className="mono">{f}</span>
                  <small>{by ? `제외 (${by})` : f === '.env' ? '⚠ 비밀값 업로드됨' : '올라감'}</small>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      }
      controls={
        <>
          <div className="ctl">
            <span className="ctl-top">
              <span>자주 쓰는 규칙 추가</span>
            </span>
            <div className="presets">
              {['node_modules/', '.env', 'dist/', '*.log', '.DS_Store', '!.env.example'].map((r) => (
                <button key={r} className={'chip-btn mono' + (rules.includes(r) ? ' on' : '')} style={{ fontSize: 12 }} onClick={() => addRule(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="pg-cheat">
            <b>규칙 읽는 법</b>
            <span><code>폴더/</code> 그 폴더 통째로</span>
            <span><code>*.log</code> 끝이 .log인 모든 파일</span>
            <span><code>.env</code> 그 이름의 파일</span>
            <span><code>!이름</code> 제외하지 않기 (예외)</span>
          </div>
          <button className="link" onClick={() => setSrc('')}>
            규칙 모두 지우기
          </button>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Token ───────── */

const TOKEN_SAMPLES = {
  ko: '로그인 버튼을 주황색으로 바꿔줘',
  en: 'Change the login button to orange',
  code: 'const total = items.reduce((a, b) => a + b.price, 0)',
}

// 실제 토크나이저를 흉내 낸 대략적인 쪼개기 (모델마다 다름)
function roughTokens(text) {
  const out = []
  const re = /([가-힣]+)|([A-Za-z]+)|(\d+)|(\s+)|([^\sA-Za-z\d가-힣])/g
  let m
  while ((m = re.exec(text))) {
    const [t, ko, en, num, sp] = m
    if (sp) {
      if (out.length) out[out.length - 1] += t
      else out.push(t)
    } else if (ko) for (let i = 0; i < ko.length; i += 1) out.push(ko.slice(i, i + 1))
    else if (en) for (let i = 0; i < en.length; i += en.length <= 6 ? en.length : 4) out.push(en.slice(i, i + (en.length <= 6 ? en.length : 4)))
    else if (num) for (let i = 0; i < num.length; i += 3) out.push(num.slice(i, i + 3))
    else out.push(t)
  }
  return out
}

function TokenPG() {
  const [text, setText] = useState(TOKEN_SAMPLES.ko)
  const [sample, setSample] = useState('ko')
  const [bounds, setBounds] = useState(true)
  const { logs, push, clear } = useEventLog()
  const tokens = useMemo(() => roughTokens(text), [text])
  const chars = [...text].length

  const prompt = `지금 대화가 길어져서 토큰(Token)을 많이 쓰는 것 같아. 지금까지 정한 규칙과 진행 상황을 핵심만 짧게 요약해줘 (새 대화에 붙여넣을 수 있게). 그리고 같은 내용을 더 적은 토큰으로 요청하려면 어떻게 쓰면 좋은지도 알려줘.`

  return (
    <Shell
      hint="문장을 바꿔 쓰면 토큰으로 어떻게 쪼개지는지 보여요"
      stage={
        <div className="pg-token">
          <textarea className="pg-code" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
          <div className="pg-token-chips">
            {tokens.map((t, i) => (
              <motion.span key={i + t} className={bounds ? 'b' : ''} style={bounds ? { background: PALETTE[i % 5] + '33', borderColor: PALETTE[i % 5] } : {}} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                {t.replace(/ /g, '·')}
              </motion.span>
            ))}
          </div>
          <div className="pg-token-stats">
            <div>
              <small>글자 수</small>
              <b className="mono">{chars}</b>
            </div>
            <div>
              <small>토큰 (대략)</small>
              <b className="mono" style={{ color: C.acc }}>
                {tokens.length}
              </b>
            </div>
            <div>
              <small>글자당 토큰</small>
              <b className="mono">{chars ? (tokens.length / chars).toFixed(2) : 0}</b>
            </div>
          </div>
          <small className="pg-help">실제 개수는 AI 모델마다 달라요. 쪼개지는 느낌을 보여주는 예시예요.</small>
        </div>
      }
      controls={
        <>
          <Segmented
            label="예시 문장"
            value={sample}
            onChange={(v) => {
              setSample(v)
              setText(TOKEN_SAMPLES[v])
              const n = roughTokens(TOKEN_SAMPLES[v]).length
              push('child', `${{ ko: '한국어', en: '영어', code: '코드' }[v]} 예시 → ${[...TOKEN_SAMPLES[v]].length}글자, 약 ${n}토큰`)
            }}
            options={[{ value: 'ko', label: '한국어' }, { value: 'en', label: '영어' }, { value: 'code', label: '코드' }]}
          />
          <Toggle label="토큰 경계 색으로 보기" value={bounds} onChange={setBounds} />
          <p className="pg-note" style={{ margin: 0 }}>
            같은 뜻이라도 한국어가 영어보다 토큰을 더 쓰는 경우가 많아요. 토큰이 곧 사용량·비용이에요.
          </p>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Context Window ───────── */

const MSG_TYPES = {
  rule: { who: '나', text: '규칙: 색은 주황색만 써줘', size: 40 },
  ask: { who: '나', text: '버튼 하나 더 만들어줘', size: 30 },
  code: { who: '나', text: '(긴 코드 300줄 붙여넣기)', size: 320 },
  reply: { who: 'AI', text: '네, 만들었어요! (코드 포함 답변)', size: 140 },
}

function ContextWindowPG() {
  const [msgs, setMsgs] = useState([{ ...MSG_TYPES.rule, id: 0 }])
  const [cap, setCap] = useState(600)
  const [answer, setAnswer] = useState(null)
  const [seq, setSeq] = useState(1)
  const { logs, push, clear } = useEventLog()

  // 최근 메시지부터 용량만큼만 기억
  let used = 0
  const remembered = new Set()
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (used + msgs[i].size > cap) break
    used += msgs[i].size
    remembered.add(msgs[i].id)
  }
  const ruleKept = msgs.some((m) => m.text.startsWith('규칙') && remembered.has(m.id))
  const forgot = msgs.filter((m) => !remembered.has(m.id)).length

  const add = (k) => {
    const m = { ...MSG_TYPES[k], id: seq }
    setSeq(seq + 1)
    setMsgs([...msgs, m])
    setAnswer(null)
    push('child', `${m.who}: ${m.text} (+${m.size} 토큰)`)
  }
  const ask = () => {
    setAnswer(ruleKept)
    push(ruleKept ? 'end' : 'close', ruleKept ? '처음 규칙이 아직 창 안에 있음 → 기억함' : '처음 규칙이 창 밖으로 밀려남 → 잊어버림')
  }
  const summarize = () => {
    const sum = { who: '요약', text: '요약: 색은 주황색만 · 버튼 작업 중', size: 50, id: seq }
    setSeq(seq + 1)
    setMsgs([sum])
    setAnswer(null)
    push('settle', `대화 ${msgs.length}개를 요약 1개(50토큰)로 압축 → 새로 시작`)
  }

  const prompt = `대화가 너무 길어져서 앞에서 정한 규칙을 잊는 것 같아(Context Window). 지금까지 정한 규칙과 진행 상황을 10줄 이내로 요약해줘. 이 요약을 새 대화 맨 처음에 붙여넣고 이어서 작업할게. 앞으로 꼭 지켜야 할 규칙은 따로 표시해줘.`

  return (
    <Shell
      hint="메시지를 계속 보내서 처음 규칙이 밀려나게 해보세요"
      stage={
        <div className="pg-ctx">
          <div className="pg-ctx-bar">
            <motion.i animate={{ width: `${Math.min(100, (used / cap) * 100)}%`, background: used / cap > 0.85 ? '#e5484d' : C.acc }} />
            <span className="mono">
              기억 중 {used} / {cap} 토큰{forgot ? ` · 잊은 메시지 ${forgot}개` : ''}
            </span>
          </div>
          <div className="pg-ctx-chat">
            <AnimatePresence initial={false}>
              {msgs.map((m) => (
                <motion.div layout key={m.id} className={'pg-ctx-msg ' + (m.who === 'AI' ? 'ai' : m.who === '요약' ? 'sum' : 'me') + (remembered.has(m.id) ? '' : ' gone')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: remembered.has(m.id) ? 1 : 0.35, y: 0 }}>
                  <span>{m.text}</span>
                  <small className="mono">
                    {m.size}토큰{remembered.has(m.id) ? '' : ' · 잊음'}
                  </small>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="pg-branch-btns">
            {[
              ['ask', '질문'],
              ['reply', 'AI 답변'],
              ['code', '긴 코드'],
            ].map(([k, l]) => (
              <button key={k} className="btn small ghost" onClick={() => add(k)}>
                + {l}
              </button>
            ))}
            <button className="btn small" onClick={ask}>
              "처음 규칙 기억해?"
            </button>
          </div>
          <AnimatePresence mode="wait">
            {answer !== null && (
              <motion.div key={String(answer)} className={'pg-ctx-answer ' + (answer ? 'ok' : 'bad')} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                AI: {answer ? '네, 색은 주황색만 쓰기로 했어요.' : '음… 어떤 규칙이었죠? 파란색도 괜찮을 것 같아요.'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
      controls={
        <>
          <Slider label="기억할 수 있는 양 (Context Window)" value={cap} min={200} max={1500} step={50} unit="토큰" onChange={setCap} />
          <button className="btn" onClick={summarize}>
            요약해서 새로 시작
          </button>
          <button
            className="link"
            onClick={() => {
              setMsgs([{ ...MSG_TYPES.rule, id: seq }])
              setSeq(seq + 1)
              setAnswer(null)
            }}
          >
            처음으로
          </button>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Prompt ───────── */

const PARTS = [
  { k: 'where', label: '어디에', text: '로그인 화면 맨 아래에', score: 15 },
  { k: 'look', label: '어떤 모양', text: '주황색 배경, 흰 글씨, 모서리가 둥근', score: 20 },
  { k: 'size', label: '크기', text: '가로로 꽉 차고 높이 48px인', score: 15 },
  { k: 'act', label: '누르면', text: '누르면 로딩 표시가 돌다가 홈으로 이동하는', score: 20 },
  { k: 'cond', label: '조건', text: '이메일을 다 입력하기 전엔 회색으로 비활성화된', score: 20 },
]

function PromptPG() {
  const [on, setOn] = useState({ where: false, look: false, size: false, act: false, cond: false })
  const { logs, push, clear } = useEventLog()
  const picked = PARTS.filter((p) => on[p.k])
  const score = 10 + picked.reduce((s, p) => s + p.score, 0)
  const text = picked.length ? `${picked.map((p) => p.text).join(', ')} "로그인" 버튼을 만들어줘.` : '버튼 예쁘게 만들어줘.'
  const disabled = on.cond

  return (
    <Shell
      hint="오른쪽에서 정보를 하나씩 더해보세요"
      stage={
        <div className="pg-prompt">
          <div className="pg-prompt-meter">
            <span>구체적인 정도</span>
            <div>
              <motion.i animate={{ width: `${score}%`, background: score > 70 ? '#2ec4a0' : score > 40 ? C.butter : '#e5484d' }} />
            </div>
            <b className="mono">{score}%</b>
          </div>
          <div className="pg-prompt-chat">
            <div className="pg-ctx-msg me">
              <span>{text}</span>
            </div>
            <div className="pg-prompt-result">
              <small>AI가 만든 결과 (예상)</small>
              <div className="pg-prompt-screen" style={{ justifyContent: on.where ? 'flex-end' : 'center' }}>
                {on.where && (
                  <>
                    <i />
                    <i style={{ width: '70%' }} />
                  </>
                )}
                <motion.button
                  layout
                  className="pg-prompt-btn"
                  style={{
                    background: disabled ? '#d6d2c8' : on.look ? C.acc : ['#7b61ff', '#4d9cff', '#2ec4a0'][picked.length % 3],
                    color: on.look || disabled ? '#fff' : '#fff',
                    borderRadius: on.look ? 14 : 4,
                    width: on.size ? '100%' : 'auto',
                    height: on.size ? 48 : 34,
                    alignSelf: on.size ? 'stretch' : 'center',
                  }}
                  onClick={() => push(disabled ? 'option' : on.act ? 'end' : 'move', disabled ? '비활성화 상태라 눌리지 않음' : on.act ? '로딩 → 홈으로 이동' : '눌러도 무엇을 할지 정하지 않아서 아무 일 없음')}
                >
                  {on.act && !disabled ? '로그인 →' : '로그인'}
                </motion.button>
              </div>
              <small className="pg-help">{picked.length < 2 ? '정보가 적으면 AI가 마음대로 정해요 (매번 결과가 달라요)' : picked.length < 5 ? '좋아요, 조금만 더 구체적이면 한 번에 맞아요' : '원하는 결과가 한 번에 나올 가능성이 높아요'}</small>
            </div>
          </div>
        </div>
      }
      controls={
        <>
          {PARTS.map((p) => (
            <Toggle
              key={p.k}
              label={`${p.label}: ${p.text}`}
              value={on[p.k]}
              onChange={(v) => {
                setOn({ ...on, [p.k]: v })
                push(v ? 'open' : 'close', `${p.label} ${v ? '추가' : '뺌'} → 구체성 ${v ? '+' : '−'}${p.score}`)
              }}
            />
          ))}
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={`내가 쓴 요청을 더 구체적인 프롬프트(Prompt)로 다듬어줘: "${text}" — 어디에, 어떤 모양·크기로, 누르면 무슨 일이 일어나는지, 어떤 조건에서 비활성화되는지가 빠졌다면 나에게 먼저 물어봐줘.`}
    />
  )
}

export const SIM_GIT_AI_PGS = {
  'git-commit': CommitPG,
  'git-branch': BranchPG,
  'merge-conflict': MergeConflictPG,
  gitignore: GitignorePG,
  token: TokenPG,
  'context-window': ContextWindowPG,
  prompt: PromptPG,
}
