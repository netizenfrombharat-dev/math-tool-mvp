import { useState } from 'react'

interface ExpressionInputProps {
  onSubmit: (expression: string) => void
}

export default function ExpressionInput({ onSubmit }: ExpressionInputProps) {
  const [expr, setExpr] = useState('sin(x)*exp(x)')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(expr)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <label htmlFor="expr-input" style={{ fontWeight: 'bold' }}>Expression:</label>
      <input
        id="expr-input"
        type="text"
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        style={{
          flex: 1,
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontFamily: 'monospace',
        }}
        placeholder="e.g., sin(x)*exp(x)"
      />
      <button
        type="submit"
        style={{
          padding: '0.5rem 1rem',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Compute
      </button>
    </form>
  )
}