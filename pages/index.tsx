import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import MathChat from '@/components/MathChat'
import ExpressionInput from '@/components/ExpressionInput'
import PlotCanvas from '@/components/PlotCanvas'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [projectName, setProjectName] = useState('')

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) console.error('Sign in error:', error)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const handleSaveProject = async () => {
    if (!user || !projectName.trim()) {
      alert('Please sign in and enter a project name')
      return
    }
    // Save to Supabase table 'projects' (placeholder)
    const { error } = await supabase
      .from('projects')
      .insert([{ user_id: user.id, name: projectName, data: {} }])
    
    if (error) {
      console.error('Save error:', error)
      alert('Failed to save project')
    } else {
      alert('Project saved!')
    }
  }

  const handleLoadProject = async () => {
    if (!user) {
      alert('Please sign in')
      return
    }
    // Load from Supabase table 'projects' (placeholder)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error) {
      console.error('Load error:', error)
      alert('No projects found')
    } else {
      setProjectName(data.name)
      alert(`Loaded project: ${data.name}`)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '2px solid #333', paddingBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Math Tool MVP</h1>
        <p style={{ color: '#666', margin: '0.5rem 0' }}>
          Powered by Bhindi AI + Client-Side CAS (Algebrite/Pyodide)
        </p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          {user ? (
            <>
              <span>Signed in as {user.email}</span>
              <button onClick={handleSignOut} style={buttonStyle}>Sign Out</button>
              <input
                type="text"
                placeholder="Project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                style={inputStyle}
              />
              <button onClick={handleSaveProject} style={buttonStyle}>Save Project</button>
              <button onClick={handleLoadProject} style={buttonStyle}>Load Project</button>
            </>
          ) : (
            <button onClick={handleSignIn} style={buttonStyle}>Sign In with Google</button>
          )}
        </div>
      </header>

      <main>
        <section style={{ marginBottom: '2rem' }}>
          <h2>Quick Example: Differentiate sin(x)*e^x</h2>
          <ExpressionInput
            onSubmit={(expr) => {
              // Example using Algebrite (client-side JS CAS)
              try {
                const Algebrite = require('algebrite')
                const derivative = Algebrite.run(`d(${expr}, x)`)
                alert(`Derivative: ${derivative}`)
              } catch (err) {
                console.error(err)
                alert('Error computing derivative')
              }
            }}
          />
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2>AI Math Chat</h2>
          <MathChat userId={user?.id} />
        </section>

        <section>
          <h2>Plot Canvas (Placeholder)</h2>
          <PlotCanvas />
        </section>
      </main>
    </div>
  )
}

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  background: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
}

const inputStyle: React.CSSProperties = {
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
}