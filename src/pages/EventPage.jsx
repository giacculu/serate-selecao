import React from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function EventPage(){
  const { id } = useParams()
  const [event, setEvent] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  const [name, setName] = React.useState('')
  const [amount, setAmount] = React.useState('')
  const [gender, setGender] = React.useState('')

  React.useEffect(()=>{ fetchEvent() }, [id])

  async function fetchEvent(){
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*, participants(*)')
      .eq('id', id)
      .single()
    if(error){ console.error(error) }
    else setEvent(data)
    setLoading(false)
  }

  async function join(){
    if(!name) return alert('Inserisci il tuo nome')
    if(isNaN(Number(amount))) return alert('Importo non valido')

    // massimo partecipanti
    if(event.max_participants && event.participants.length >= event.max_participants){
      return alert(`Spiacente, il numero massimo di partecipanti (${event.max_participants}) è stato raggiunto`)
    }

    // contributo minimo
    if(Number(amount) < Number(event.min_contribution)){
      return alert(`Il contributo minimo per partecipare è €${event.min_contribution}`)
    }

    // percentuale solo ragazze
    if(event.female_percentage){
      const currentFemale = event.participants.filter(p=>p.gender==='female').length
      const total = event.participants.length + 1
      const femaleRatio = (currentFemale / total) * 100
      if(gender==='male' && femaleRatio > (100 - event.female_percentage)){
        return alert('Spiacente, questo evento è a percentuale limitata di uomini')
      }
    }

    await supabase.from('participants').insert({ event_id: id, name, amount: Number(Number(amount).toFixed(2)), gender })
    setName(''); setAmount(''); setGender('')
    fetchEvent()
  }

  if(loading) return <div>Caricamento...</div>
  if(!event) return <div>Evento non trovato</div>

  const total = (event.participants||[]).reduce((s,p)=> s + Number(p.amount||0), 0)

  const inputClass = "flex-1 p-3 rounded-xl border border-[#009C3B]/40 bg-[#000]/30 text-green placeholder-[#FFCC29]/50 focus:ring-2 focus:ring-[#FFCC29]/50 transition"

  return (
    <div className="card bg-gradient-to-br from-[#009C3B]/10 to-[#FFCC29]/10 p-6 space-y-6">
      <h2 className="text-2xl font-bold">{event.title}</h2>
      {event.date && <div className="small">{new Date(event.date).toLocaleString()}</div>}

      {/* Mostra le nuove proprietà dell'evento */}
      <div className="space-y-1 small">
        {event.max_participants && <div>Massimo partecipanti: {event.max_participants}</div>}
        {event.min_contribution && <div>Contributo minimo: €{event.min_contribution}</div>}
        {event.female_percentage && <div>Percentuale solo ragazze: {event.female_percentage}%</div>}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Partecipanti</h3>
        <div className="space-y-2">
          {(event.participants||[]).map(p => (
            <div key={p.id} className="participant">
              <div>{p.name} {p.gender==='female'?'♀':'♂'}</div>
              <div>€{Number(p.amount||0).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 font-bold text-lg">Totale: €{total.toFixed(2)}</div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Unisciti</h3>
        <div className="flex flex-col md:flex-row gap-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Tuo nome" className={inputClass} />
          <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Importo" className={inputClass} />
          {/* Select gender corretto: sfondo scuro e testo bianco */}
          <select value={gender} onChange={e=>setGender(e.target.value)} className={inputClass}>
            <option value="female">Donna</option>
            <option value="male">Uomo</option>
          </select>
          <button onClick={join} className="btn-selecao">Partecipa</button>
        </div>
        <div className="small mt-2">Condividi: 
          <button onClick={()=>{ navigator.clipboard.writeText(window.location.href); alert('Link copiato!') }} 
                  className="underline ml-2">Copia link</button>
        </div>
      </div>
    </div>
  )
}
