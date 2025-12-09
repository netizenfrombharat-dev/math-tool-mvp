import { useState } from 'react'
import { usePyodide } from '@/hooks/usePyodide'

interface Message {
  role: 'user' | 'assistant'
  content: string
  plan?: string
  code?: string
  explanation?: string
  result?: any
}

export default function MathChat({ userId }: { userId?: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { runPython, loadPyodide } = usePyodide()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Call Bhindi proxy
      const response = await fetch('/api/bhindi-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          sessionId: userId || 'anonymous',
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'API error')
      }

      // Execute code based on engine
      let result = null
      const engine = data.engine?.toLowerCase() || ''

      if (data.code) {
        try {
          if (engine.includes('pyodide') || engine.includes('python')) {
            // Execute Python code
            await loadPyodide()
            result = await runPython(data.code)
          } else {
            // Execute JavaScript code (Algebrite/Nerdamer/math.js)
            const Algebrite = require('algebrite')
            const nerdamer = require('nerdamer')
            const math = require('mathjs')
            
            // Make libraries available in eval scope
            const evalScope = { Algebrite, nerdamer, math }
            const func = new Function(...Object.keys(evalScope), data.code)
            result = func(...Object.values(evalScope))
          }
        } catch (execError) {
          console.error('Code execution error:', execError)
          result = `Error: ${execError instanceof Error ? execError.message : 'Execution failed'}`
        }
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: 'Response received',
        plan: data.plan,
        code: data.code,
        explanation: data.explanation,
        result,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
      <div style={{ height: '400px', overflowY: 'auto', marginBottom: '1rem', padding: '0.5rem', background: '#f9f9f9' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '1rem', padding: '0.5rem', background: msg.role === 'user' ? '#e3f2fd' : '#fff', borderRadius: '4px' }}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
            <div style={{ marginTop: '0.5rem' }}>{msg.content}</div>
            
            {msg.plan && (
              <details style={{ marginTop: '0.5rem' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>A) Computation Plan</summary>
                <pre style={{ background: '#f5f5f5', padding: '0.5rem', overflow: 'auto' }}>{msg.plan}</pre>
              </details>
            )}
            
            {msg.code && (
              <details style={{ marginTop: '0.5rem' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>B) Client-Side Code</summary>
                <pre style={{ background: '#f5f5f5', padding: '0.5rem', overflow: 'auto' }}>{msg.code}</pre>
              </details>
            )}
            
            {msg.explanation && (
              <details open style={{ marginTop: '0.5rem' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>C) Plain Explanation</summary>
                <div style={{ padding: '0.5rem' }}>{msg.explanation}</div>
              </details>
            )}
            
            {msg.result !== null && msg.result !== undefined && (
              <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#e8f5e9', borderRadius: '4px' }}>
                <strong>Result:</strong> <code>{String(msg.result)}</code>
              </div>
            )}
          </div>
        ))}
        {loading && <div style={{ textAlign: 'center', color: '#666' }}>Thinking...</div>}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a math question..."
          style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.5rem 1.5rem',
            background: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  )
}