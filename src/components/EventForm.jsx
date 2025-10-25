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
      if(hostName || hostAmount){
        await supabase.from('participants').insert({ event_id: data.id, name: hostName || 'Host', amount: Number(Number(hostAmount||0).toFixed(2)) })
      }
      setTitle(''); setDate(''); setHostAmount(''); setHostName('')
      onCreated && onCreated()
      alert('Evento creato!')
    }
  }

  return (
    <form onSubmit={create} className="space-y-4">
      <div>
        <label className="block small mb-1">Titolo</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} 
               className="w-full p-3 rounded-xl border border-[#009C3B]/40 bg-[#009C3B]/5 placeholder-[#FFCC29]/50 focus:ring-2 focus:ring-[#FFCC29]/50 transition" 
               placeholder="Serata al Club XYZ" />
      </div>
      <div>
        <label className="block small mb-1">Data</label>
        <input value={date} onChange={e=>setDate(e.target.value)} type="datetime-local" 
               className="w-full p-3 rounded-xl border border-[#009C3B]/40 bg-[#009C3B]/5 placeholder-[#FFCC29]/50 focus:ring-2 focus:ring-[#FFCC29]/50 transition" />
      </div>
      <div>
        <label className="block small mb-1">Host (opzionale)</label>
        <input value={hostName} onChange={e=>setHostName(e.target.value)} 
               className="w-full p-3 rounded-xl border border-[#009C3B]/40 bg-[#009C3B]/5 placeholder-[#FFCC29]/50 focus:ring-2 focus:ring-[#FFCC29]/50 transition" 
               placeholder="Tuo nome" />
      </div>
      <div>
        <label className="block small mb-1">Contributo iniziale (€)</label>
        <input value={hostAmount} onChange={e=>setHostAmount(e.target.value)} type="number" step="0.01" 
               className="w-full p-3 rounded-xl border border-[#009C3B]/40 bg-[#009C3B]/5 placeholder-[#FFCC29]/50 focus:ring-2 focus:ring-[#FFCC29]/50 transition" 
               placeholder="10.00" />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="btn-selecao">Crea evento</button>
      </div>
    </form>
  )
}
