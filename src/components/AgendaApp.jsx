import React, { useState, useEffect, useCallback } from 'react'
import ListaContactos from './ListaContactos'
import FormularioContacto from './FormularioContacto'
import { fetchContacts, postContact } from '../api'

const ROWS = 3
const COLS = 5
const PAGE_SIZE = ROWS * COLS

export default function AgendaApp() {
  const [contacts, setContacts] = useState([])
  const [loadingMessage, setLoadingMessage] = useState('')
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  const load = useCallback(async () => {
    setLoadingMessage('Cargando contactos...')
    try {
      const data = await fetchContacts()
      setContacts(data)
      setLoadingMessage('Contactos cargados: ' + data.length)
    } catch (err) {
      console.error(err)
      setLoadingMessage('No se pudieron cargar los contactos. ' + err.message)
      setContacts([])
    }
    setCurrentPage(0)
  }, [])

  useEffect(() => { load() }, [load])

  const handleAdd = async (payload) => {
    setLoadingMessage('Enviando...')
    await postContact(payload)
    setLoadingMessage('Contacto agregado. Actualizando lista...')
    await load()
    const total = filtered().length
    setCurrentPage(Math.max(0, Math.ceil(total / PAGE_SIZE) - 1))
  }

  const filtered = () => {
    const q = (query || '').toLowerCase().trim()
    if (!q) return contacts
    return contacts.filter(c =>
      ((c.nombre || '') + ' ' + (c.apellido || '') + ' ' + (c.telefono || '')).toLowerCase().includes(q)
    )
  }

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <h1>Agenda Web</h1>
          <p className="sub">Mis contactos — Keren Almonte Guilamo</p>
        </div>
      </header>

      <main className="container">
        {/* Panel Izquierdo */}
        <aside className="panel form-panel" aria-labelledby="form-title">
          <h2 id="form-title">Agregar Contacto</h2>
          <FormularioContacto onAdd={handleAdd} setMessage={setLoadingMessage} />

          <div id="message" className="message" role="status" aria-live="polite" style={{ marginTop: 8 }}>
            {loadingMessage}
          </div>

          <div className="controls-compact" style={{ display: 'none' }}>
            <input id="search" placeholder="Buscar..." aria-label="Buscar contactos" />
            <button id="refresh" title="Refrescar">↻</button>
          </div>

          {/* Footer dentro del panel */}
          <footer className="footer-small" style={{ textAlign: 'center', marginTop: '12px' }}>
            Agenda Web • Keren Almonte Guilamo
          </footer>
        </aside>

        {/* Panel Derecho */}
        <section className="panel list-panel" aria-labelledby="lista-title">
          <div className="panel-header">
            <h2 id="lista-title">Contactos</h2>
            <div className="header-controls">
              <input
                id="searchList"
                placeholder="Buscar contactos..."
                aria-label="Buscar contactos"
                value={query}
                onChange={e => { setQuery(e.target.value); setCurrentPage(0); }}
              />
              <div className="pager" aria-label="Paginación">
                <button id="prevPage" title="Página anterior" onClick={() => setCurrentPage(p => Math.max(0, p - 1))}>
                  ◀
                </button>
                <span id="pageInfo">
                  Página {Math.max(1, currentPage + 1)} de {Math.max(1, Math.ceil(filtered().length / PAGE_SIZE))}
                </span>
                <button id="nextPage" title="Página siguiente" onClick={() => {
                  const total = Math.max(1, Math.ceil(filtered().length / PAGE_SIZE))
                  setCurrentPage(p => Math.min(total - 1, p + 1))
                }}>
                  ▶
                </button>
                <button id="refresh" title="Refrescar" onClick={load}>↻</button>
              </div>
            </div>
          </div>

          <div className="list-wrap" id="listWrap">
            <ListaContactos
              contacts={filtered()}
              pageSize={PAGE_SIZE}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </section>
      </main>
    </>
  )
}
