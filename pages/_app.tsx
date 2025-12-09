import type { AppProps } from 'next/app'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Global client-side initialization if needed
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: 0 }}>
      <Component {...pageProps} />
    </div>
  )
}