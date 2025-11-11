import React from 'react'

export default function ListaContactos({ contacts = [], pageSize = 15, currentPage = 0 }) {
  const totalPages = Math.max(1, Math.ceil(contacts.length / pageSize))
  const start = currentPage * pageSize
  const pageItems = contacts.slice(start, start + pageSize)

  return (
    <>
      <div className="grid">
        {pageItems.length === 0 ? null : pageItems.map((c, idx) => (
          <article key={start + idx} className="card">
            <h3>{(c.nombre || '') + ' ' + (c.apellido || '')}</h3>
            <p className="meta">Contacto</p>
            <div className="phone">{c.telefono || ''}</div>
          </article>
        ))}

        { /* llenar los espacios restantes para mantener el layout */ }
        {Array.from({ length: pageSize - pageItems.length }).map((_, i) => (
          <article
            key={'empty-' + i}
            className="card"
            style={{ opacity: 0 }}
            aria-hidden="true"
          >
            <div></div>
          </article>
        ))}
      </div>

      { /* Mensaje accesible si no hay contactos */ }
      {pageItems.length === 0 && (
        <p
          id="emptyState"
          className="empty"
          role="status"
          aria-live="polite"
        >
          No hay contactos cargados.
        </p>
      )}
    </>
  )
}
