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
  if(!event) return <d
