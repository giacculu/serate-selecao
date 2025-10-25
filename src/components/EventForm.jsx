import React from 'react'
import { supabase } from '../lib/supabaseClient'

export default function EventForm({ onCreated }){
  const [title, setTitle] = React.useState('')
  const [date, setDate] = React.useState('')
  const [hostAmount, setHostAmount] = React.useState('')
  const [hostName, setHostName] = React.useState('')

  async function create(e){
    e.preventDefault()
    if(!title) return alert('Inserisci un titolo')
    const { data, error } = await supabase.from('events').insert({ title, date }).select().single()
    if(error){ console.error(error); alert('Errore creando evento') }
    else{
      // if host name & amount provided, insert participant
      if(hostName || hostAmount){
        await supabase.from('participants').insert({ event_id: data.id, name: hostName || 'Host', amount: Number(Number(hostAmount||0).toFixed(2)) })
      }
      setTitle(''); setDate(''); setHostAmount(''); setHostName('')
      onCreated && onCreated()
      alert('Evento creato!')
    }
  }

  return (
    <form onSubmit={create} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-300">Titolo</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-2 rounded bg-transparent border border-gray-700" placeholder="Serata al Club XYZ" />
      </div>
      <div>
        <label className="block text-sm text-gray-300">Data</label>
        <input value={date} onChange={e=>setDate(e.target.value)} type="datetime-local" className="w-full p-2 rounded bg-transparent border border-gray-700" />
      </div>
      <div>
        <label className="block text-sm text-gray-300">Host (opzionale)</label>
        <input value={hostName} onChange={e=>setHostName(e.target.value)} className="w-full p-2 rounded bg-transparent border border-gray-700" placeholder="Tuo nome" />
      </div>
      <div>
        <label className="block text-sm text-gray-300">Contributo iniziale (€)</label>
        <input value={hostAmount} onChange={e=>setHostAmount(e.target.value)} type="number" step="0.01" className="w-full p-2 rounded bg-transparent border border-gray-700" placeholder="10.00" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-selecao">Crea evento</button>
      </div>
    </form>
  )
}
