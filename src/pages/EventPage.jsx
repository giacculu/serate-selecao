import React from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function EventPage(){
  const { id } = useParams()
  const [event, setEvent] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  const [name, setName] = React.useState('')
  const [amount, setAmount] = React.useState('')

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
    await supabase.from('participants').insert({ event_id: id, name, amount: Number(Number(amount).toFixed(2)) })
    setName(''); setAmount('')
    fetchEvent()
  }

  if(loading) return <div>Caricamento...</div>
  if(!event) return <div>Evento non trovato</div>

  const total = (event.participants||[]).reduce((s,p)=> s + Number(p.amount||0), 0)

  return (
    <div className="card">
      <h2 className="text-xl font-semibold">{event.title}</h2>
      <div className="text-sm text-gray-300">{event.date? new Date(event.date).toLocaleString() : ''}</div>
      <div className="mt-4">
        <h3 className="font-semibold">Partecipanti</h3>
        <div className="space-y-2 mt-2">
          {(event.participants||[]).map(p => (
            <div key={p.id} className="flex justify-between border-b border-gray-800 py-2">
              <div>{p.name}</div>
              <div>€{Number(p.amount||0).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 font-bold">Totale: €{total.toFixed(2)}</div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Unisciti</h3>
        <div className="flex gap-2 mt-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Tuo nome" className="p-2 rounded bg-transparent border border-gray-700" />
          <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Importo" className="p-2 rounded bg-transparent border border-gray-700" />
          <button onClick={join} className="btn-selecao">Partecipa</button>
        </div>
        <div className="text-sm text-gray-400 mt-2">Condividi: <button onClick={()=>{ navigator.clipboard.writeText(window.location.href); alert('Link copiato!') }} className="underline">Copia link</button></div>
      </div>
    </div>
  )
}
