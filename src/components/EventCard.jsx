import React from 'react'
import { Link } from 'react-router-dom'

export default function EventCard({ ev }){
  const participants = ev.participants || []
  const total = participants.reduce((s,p)=> s + Number(p.amount||0), 0)
  return (
    <div className="p-3 rounded border border-gray-700 flex justify-between items-center">
      <div>
        <div className="font-semibold">{ev.title}</div>
        <div className="text-sm text-gray-300">{ev.date? new Date(ev.date).toLocaleString() : ''}</div>
        <div className="text-sm text-gray-300">Partecipanti: {participants.length} • Totale: €{total.toFixed(2)}</div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Link to={`/event/${ev.id}`} className="text-sm underline">Apri</Link>
        <button className="text-xs text-gray-400" onClick={()=>{ navigator.clipboard.writeText(window.location.origin + '/event/' + ev.id); alert('Link copiato!') }}>Copia link</button>
      </div>
    </div>
  )
}
