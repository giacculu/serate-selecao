import React from 'react'
import EventForm from '../components/EventForm'
import EventCard from '../components/EventCard'
import { supabase } from '../lib/supabaseClient'

export default function Home(){
  const [events, setEvents] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(()=>{ fetchEvents() }, [])

  async function fetchEvents(){
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('id,title,date,created_at,participants(*)')
      .order('created_at',{ascending:false})
    if(error) console.error(error)
    else setEvents(data || [])
    setLoading(false)
  }

  function handleDeleted(eventId){
    setEvents(events.filter(ev => ev.id !== eventId))
  }


  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 card">
        <h2 className="text-lg font-semibold mb-3">Crea nuovo evento</h2>
        <EventForm onCreated={fetchEvents} />
      </div>

      <div className="md:col-span-2 card">
        <h2 className="text-lg font-semibold mb-3">Eventi pubblici</h2>
        {loading && <div>Caricamento...</div>}
        {!loading && events.length===0 && <div className="text-gray-300">Nessun evento — crea il primo!</div>}
        <div className="space-y-3 mt-3">
          {events.map(ev => (
            <EventCard key={ev.id} ev={ev} onDeleted={handleDeleted}/>
          ))}
        </div>
      </div>
    </div>
  )
}
