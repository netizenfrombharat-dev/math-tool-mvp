import { useState, useEffect, useCallback } from 'react'

declare global {
  interface Window {
    loadPyodide: any
  }
}

export function usePyodide() {
  const [pyodide, setPyodide] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPyodideInstance = useCallback(async () => {
    if (pyodide) return pyodide
    if (loading) return null

    setLoading(true)
    setError(null)

    try {
      // Dynamically load Pyodide from CDN
      if (!window.loadPyodide) {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
        script.async = true
        document.head.appendChild(script)
        
        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
        })
      }

      const pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      })

      // Load common math packages
      await pyodideInstance.loadPackage(['numpy', 'sympy', 'matplotlib'])
      
      setPyodide(pyodideInstance)
      setLoading(false)
      return pyodideInstance
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load Pyodide'
      setError(errorMsg)
      setLoading(false)
      console.error('Pyodide load error:', err)
      return null
    }
  }, [pyodide, loading])

  const runPython = useCallback(async (code: string): Promise<any> => {
    try {
      const instance = pyodide || await loadPyodideInstance()
      if (!instance) throw new Error('Pyodide not loaded')
      
      const result = await instance.runPythonAsync(code)
      return result
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Python execution error'
      setError(errorMsg)
      throw err
    }
  }, [pyodide, loadPyodideInstance])

  return {
    pyodide,
    loading,
    error,
    loadPyodide: loadPyodideInstance,
    runPython,
  }
}