import { useEffect, useRef, useState } from 'react'
import './App.css'

const initialMessages = [
  {
    id: 'welcome',
    role: 'ai',
    content: '你好，我是你的 AI 助手。有任何想法都可以直接告诉我，我们一起把它变成现实。',
  },
]

const quickStarters = [
  '帮我头脑风暴一个产品创意',
  '把下面这段话润色一下',
  '我想做一份学习计划',
  '根据提示生成一段营销文案',
]

const createMessageId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

const craftAgentReply = (prompt) => {
  const normalized = prompt.toLowerCase()

  if (normalized.includes('计划')) {
    return '收到，我们可以把目标拆成若干小块，再为每块安排优先级与节奏。先告诉我你的时间周期与关键里程碑吧。'
  }

  if (normalized.includes('文案') || normalized.includes('营销')) {
    return '营销文案通常需要突出人群痛点、产品优势以及明确的行动号召。我们可以先锁定受众，然后一层层搭建结构。'
  }

  if (normalized.includes('创意') || normalized.includes('idea')) {
    return '好的，我会先从目标用户出发列举几个方向，再帮你筛选可行的方案，并附上下一步建议。'
  }

  return `已记录：“${prompt}”。我会结合背景与目标给出一个有条理的回答，必要时也会继续向你提问确认细节。`
}

function App() {
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const scrollAnchorRef = useRef(null)
  const replyTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (replyTimerRef.current) {
        clearTimeout(replyTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed || isThinking) return

    appendUserMessage(trimmed)
    simulateAgentReply(trimmed)
  }

  const appendUserMessage = (content) => {
    setMessages((prev) => [
      ...prev,
      {
        id: createMessageId(),
        role: 'user',
        content,
      },
    ])
    setInputValue('')
  }

  const simulateAgentReply = (prompt) => {
    setIsThinking(true)
    replyTimerRef.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: 'ai',
          content: craftAgentReply(prompt),
        },
      ])
      setIsThinking(false)
    }, 800 + Math.random() * 900)
  }

  const handleStarterClick = (prompt) => {
    if (isThinking) return
    setInputValue(prompt)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">AI Co-pilot</p>
          <h1>智能对话工作台</h1>
          <p className="subtitle">
            直接开聊，或选择下方提示。AI 会即时反馈、总结并提出下一步建议。
          </p>
        </div>
      </header>

      <section className="quick-starters">
        {quickStarters.map((starter) => (
          <button
            key={starter}
            type="button"
            className="starter-chip"
            onClick={() => handleStarterClick(starter)}
          >
            {starter}
          </button>
        ))}
      </section>

      <main className="chat-panel">
        <div className="message-list">
          {messages.map((message) => (
            <article key={message.id} className={`message ${message.role}`}>
              <div className="avatar">{message.role === 'ai' ? 'AI' : '我'}</div>
              <div className="bubble">{message.content}</div>
            </article>
          ))}

          {isThinking && (
            <article className="message ai thinking">
              <div className="avatar">AI</div>
              <div className="bubble typing">
                <span />
                <span />
                <span />
              </div>
            </article>
          )}

          <div ref={scrollAnchorRef} />
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <textarea
            placeholder="输入你的问题，Shift + Enter 换行"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                handleSubmit(event)
              }
            }}
            disabled={isThinking}
          />
          <button type="submit" disabled={isThinking}>
            {isThinking ? '思考中…' : '发送'}
          </button>
        </form>
      </main>
    </div>
  )
}

export default App
