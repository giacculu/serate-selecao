import React from 'react'
import { Link } from 'react-router-dom'

export default function EventCard({ ev }){
  const participants = ev.participants || []
  const total = participants.reduce((s,p)=> s + Number(p.amount||0), 0)
  
  return (
    <div className="event-card p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4
                    bg-gradient-to-b from-[#009C3B]/10 to-[#FFCC29]/10 shadow-lg hover:shadow-2xl transition-all
                    border border-[#009C3B]/20 rounded-2xl">
      
      <div className="flex flex-col">
        <div className="font-semibold text-lg md:text-xl">{ev.title}</div>
        {ev.date && <div className="small mt-1">{new Date(ev.date).toLocaleString()}</div>}
        <div className="small mt-1">Partecipanti: {participants.length} • Totale: €{total.toFixed(2)}</div>
      </div>

      <div className="flex gap-3 mt-3 md:mt-0">
        <Link to={`/event/${ev.id}`} 
              className="btn-selecao">
          Apri
        </Link>
        <button 
          className="btn-ghost text-xs"
          onClick={()=>{ navigator.clipboard.writeText(window.location.origin + '/event/' + ev.id); alert('Link copiato!') }}>
          Copia link
        </button>
      </div>
    </div>
  )
}
