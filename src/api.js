export const API_URL = 'http://www.raydelto.org/agenda.php'

export async function fetchContacts(){
  const res = await fetch(API_URL)
  if(!res.ok) throw new Error('Error al obtener contactos: ' + res.status)
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function postContact(payload){
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  })
  if(!res.ok){
    const text = await res.text().catch(()=> '')
    throw new Error('Error al agregar: ' + res.status + ' ' + text)
  }
  try{
    return await res.json()
  }catch{
    return true
  }
}
