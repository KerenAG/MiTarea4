import React, { useRef } from 'react'

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export default function FormularioContacto({ onAdd, setMessage }) {
  const nombreRef = useRef()
  const apellidoRef = useRef()
  const telefonoRef = useRef()

  const onSubmit = async (e) => {
    e.preventDefault()
    const nombre = (nombreRef.current.value || '').trim()
    const apellido = (apellidoRef.current.value || '').trim()
    const telefono = (telefonoRef.current.value || '').trim()

    if (!nombre || !apellido || !telefono) {
      setMessage && setMessage('Por favor complete todos los campos antes de enviar.')
      return
    }

    // Validación básica de teléfono
    const telefonoRegex = /^[0-9()+\-\s]{4,}$/;
    if (!telefonoRegex.test(telefono)) {
      setMessage && setMessage('Ingrese un número de teléfono válido.')
      return
    }

    try {
      await onAdd({
        nombre: escapeHtml(nombre),
        apellido: escapeHtml(apellido),
        telefono: escapeHtml(telefono)
      })
      e.target.reset()
      setMessage && setMessage('Contacto agregado exitosamente.')
    } catch (err) {
      console.error(err)
      setMessage && setMessage('Error al agregar contacto: ' + err.message)
    }
  }

  return (
    <form id="addContactForm" onSubmit={onSubmit} noValidate>
      <label>
        Nombre
        <input type="text" id="nombre" name="nombre" required ref={nombreRef} />
      </label>
      <label>
        Apellido
        <input type="text" id="apellido" name="apellido" required ref={apellidoRef} />
      </label>
      <label>
        Teléfono
        <input
          type="tel"
          id="telefono"
          name="telefono"
          required
          pattern="[0-9()+\-\s]{4,}"
          ref={telefonoRef}
        />
      </label>
      <div className="form-actions">
        <button type="submit" id="btnAdd">Agregar</button>
        <button type="reset">Limpiar</button>
      </div>
      {/* Mensaje accesible */}
      {setMessage && <div id="formMessage" role="status" aria-live="polite" style={{ marginTop: '8px' }}></div>}
    </form>
  )
}
