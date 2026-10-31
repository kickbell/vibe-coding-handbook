import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export function PromptBox({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* 클립보드 권한이 없으면 무시 */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }
  return (
    <div className="prompt">
      <div className="prompt-head">
        <span className="eyebrow">AI에게 이렇게 말해보세요</span>
        <button className="btn small" onClick={copy}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={copied ? 'y' : 'n'} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -6, opacity: 0 }} transition={{ duration: 0.15 }}>
              {copied ? '복사됨' : '복사'}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <p>{text}</p>
    </div>
  )
}

export function useEventLog() {
  const [logs, setLogs] = useState([])
  const t0 = useRef(performance.now())
  const push = useCallback((type, msg) => {
    const t = ((performance.now() - t0.current) / 1000).toFixed(2)
    setLogs((l) => [{ id: Math.random(), t, type, msg }, ...l].slice(0, 10))
  }, [])
  const clear = useCallback(() => {
    t0.current = performance.now()
    setLogs([])
  }, [])
  return { logs, push, clear }
}

export function EventLog({ logs, onClear }) {
  return (
    <div className="log">
      <div className="log-head">
        <span className="eyebrow">이벤트 로그</span>
        {logs.length > 0 && (
          <button className="link" onClick={onClear}>
            지우기
          </button>
        )}
      </div>
      {logs.length === 0 ? (
        <p className="log-empty">위에서 직접 눌러보면 여기에 무슨 일이 일어났는지 기록돼요.</p>
      ) : (
        <ul>
          {logs.map((l) => (
            <motion.li key={l.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
              <span className="log-t mono">{l.t}s</span>
              <span className={'log-type ' + l.type}>{l.type}</span>
              <span>{l.msg}</span>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function Slider({ label, value, min, max, step, unit = '', onChange }) {
  return (
    <label className="ctl">
      <span className="ctl-top">
        <span>{label}</span>
        <span className="mono">
          {value}
          {unit}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ '--p': ((value - min) / (max - min)) * 100 + '%' }} />
    </label>
  )
}

export function Segmented({ label, value, options, onChange }) {
  return (
    <div className="ctl">
      <span className="ctl-top">
        <span>{label}</span>
      </span>
      <div className="seg">
        {options.map((o) => (
          <button key={o.value} className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)}>
            {value === o.value && <motion.span layoutId={'seg-' + label} className="seg-bg" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
            <span style={{ position: 'relative' }}>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function Toggle({ label, value, onChange }) {
  return (
    <button className="ctl toggle-ctl" onClick={() => onChange(!value)}>
      <span>{label}</span>
      <motion.span className="sw small" animate={{ background: value ? '#FF6B2C' : '#D6D2C8' }}>
        <motion.span className="sw-knob" animate={{ x: value ? 16 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }} />
      </motion.span>
    </button>
  )
}

// 체험 화면 공통 틀: 무대 + 조절판 + 이벤트 로그 + 프롬프트
export function Shell({ stage, controls, log, prompt, hint }) {
  return (
    <div className="pg">
      <div className="pg-main">
        <div className="pg-stage">
          {stage}
          {hint && <span className="pg-hint">{hint}</span>}
        </div>
        {log}
      </div>
      <div className="pg-bottom">
        <div className="pg-controls">{controls}</div>
        <PromptBox text={prompt} />
      </div>
    </div>
  )
}
