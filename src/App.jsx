import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import EventPage from './pages/EventPage'
import { supabase } from './lib/supabaseClient'

export default function App(){
  return (
    <Router>
      <div className="p-6 max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="header-flag">
            <div style={{width:44,height:28,background:'linear-gradient(90deg,#009C3B 50%, #FFCC29 50%)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'#002776',fontWeight:800}}>BR</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Serate — Seleção</h1>
              <div className="text-sm text-gray-300">Crea eventi e condividi il link. Tema: Brasil!</div>
            </div>
          </div>
          <div>
            <AuthButtons />
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/event/:id" element={<EventPage/>} />
        </Routes>

      </div>
    </Router>
  )
}

function AuthButtons(){
  const [session, setSession] = React.useState(null)
  React.useEffect(()=>{
    (async ()=>{
      const s = await supabase.auth.getSession()
      setSession(s.data?.session || null)
    })()
    const { data:listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return ()=> listener?.subscription?.unsubscribe?.()
  },[])

  async function signIn(){
    const email = prompt('Inserisci la tua email per il magic link:')
    if(!email) return
    await supabase.auth.signInWithOtp({email})
    alert('Controlla la tua email per il link di accesso.')
  }
  async function signOut(){
    await supabase.auth.signOut();
    setSession(null)
  }

  return (
    <div>
    </div>
  )
}
