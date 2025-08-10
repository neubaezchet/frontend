'use client'
import React, { useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://backend-jg7g.onrender.com'

export default function IncapacityUploader() {
  const [cedula, setCedula] = useState('')
  const [employee, setEmployee] = useState(null)
  const [step, setStep] = useState(1)
  const [eventType, setEventType] = useState(null)
  const [files, setFiles] = useState({})
  const [alerts, setAlerts] = useState([])

  async function fetchEmployeeByCedula(cc) {
    try {
      const res = await fetch(`${API_BASE}/api/kactus/employee/${cc}`)
      const data = await res.json()
      if (data && data.found) return data.employee
      return null
    } catch (e) {
      return null
    }
  }

  async function handleSearch(e) {
    e.preventDefault()
    const emp = await fetchEmployeeByCedula(cedula)
    if (!emp) { setAlerts([`Usuario ${cedula} no encontrado.`]); return }
    setEmployee(emp); setStep(1.5)
  }

  function handleFile(e, key) { setFiles(prev => ({...prev, [key]: e.target.files[0]})) }

  async function submitAll() {
    const form = new FormData();
    form.append('cedula', cedula); form.append('incapacity_type', eventType || 'other')
    Object.keys(files).forEach(k => form.append('files', files[k], files[k].name))
    try {
      const res = await fetch(`${API_BASE}/api/incapacities`, { method: 'POST', body: form })
      const data = await res.json()
      if (data.status === 'complete') { setAlerts([`Radicado: ${data.radicado?.radicado_id || 'N/A'}`]); setStep(4) }
      else setAlerts([`Incompleto: ${data.missing.join(', ')}`])
    } catch (err) { setAlerts(['Error comunicándose con backend']) }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">Registro de Incapacidades (Demo)</h1>
      {step === 1 && (
        <form onSubmit={handleSearch} className="space-y-3">
          <input value={cedula} onChange={e => setCedula(e.target.value)} className="w-full p-2 border rounded" placeholder="Cédula" />
          <div className="flex gap-2"><button className="px-4 py-2 bg-blue-600 text-white rounded">Buscar</button></div>
        </form>
      )}

      {step === 1.5 && employee && (
        <div className="p-4 border rounded">
          <p>¿Eres <strong>{employee.name}</strong> vinculado a <strong>{employee.company}</strong>?</p>
          <div className="mt-3 flex gap-2"><button onClick={() => setStep(2)} className="px-4 py-2 bg-green-600 text-white rounded">Sí</button>
          <button onClick={() => { setEmployee(null); setCedula(''); setStep(1) }} className="px-4 py-2 border rounded">No</button></div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="font-medium mb-3">Tipo</h2>
          <div className="flex gap-3">
            <button onClick={() => setEventType('enfermedad-general')} className="p-3 border rounded">Enfermedad</button>
            <button onClick={() => setEventType('maternidad')} className="p-3 border rounded">Maternidad</button>
            <button onClick={() => setEventType('paternidad')} className="p-3 border rounded">Paternidad</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="font-semibold">Subir documentos</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3"><label className="min-w-[200px]">Incapacidad</label><input type="file" onChange={e => handleFile(e, 'incapacidad')} /></div>
            <div className="flex items-center gap-3"><label className="min-w-[200px]">Epicrisis</label><input type="file" onChange={e => handleFile(e, 'epicrisis')} /></div>
            <div className="mt-4 flex gap-2"><button onClick={submitAll} className="px-4 py-2 bg-blue-600 text-white rounded">Enviar</button></div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="p-4 border rounded">
          <p>Proceso completado. Revisa tu correo (demo).</p>
        </div>
      )}

      <div className="mt-3">
        {alerts.map((a,i) => <div key={i} className="p-2 bg-yellow-50 border rounded mb-2">{a}</div>)}
      </div>
    </div>
  )
}
