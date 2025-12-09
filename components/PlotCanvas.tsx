import { useEffect, useRef } from 'react'

export default function PlotCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simple placeholder plot: y = sin(x)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#0070f3'
    ctx.lineWidth = 2
    ctx.beginPath()

    const width = canvas.width
    const height = canvas.height
    const centerY = height / 2
    const amplitude = height / 4
    const frequency = 0.02

    for (let x = 0; x < width; x++) {
      const y = centerY - amplitude * Math.sin(x * frequency)
      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()

    // Draw axes
    ctx.strokeStyle = '#ccc'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()
  }, [])

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', background: '#f9f9f9' }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        style={{ display: 'block', background: 'white', borderRadius: '4px' }}
      />
      <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
        Placeholder plot: y = sin(x). Future: integrate with Pyodide matplotlib or plotly.js
      </p>
    </div>
  )
}