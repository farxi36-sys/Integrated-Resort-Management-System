import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function InvoicePreviewModal({ invoiceId, onClose }){
  if (!invoiceId) return null
  const [src, setSrc] = useState('')

  useEffect(()=>{
    let objectUrl = ''
    api.get(`/invoice/pdf?invoiceId=${invoiceId}`, { responseType: 'blob' })
      .then(response => {
        objectUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
        setSrc(objectUrl)
      })
      .catch(() => setSrc(''))

    return () => {
      if (objectUrl) window.URL.revokeObjectURL(objectUrl)
    }
  }, [invoiceId])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-11/12 md:w-3/4 h-4/5 flex flex-col">
        <div className="p-2 border-b flex justify-between items-center">
          <div className="font-semibold">Invoice Preview</div>
          <div>
            <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">Close</button>
            {src && <a href={src} target="_blank" rel="noreferrer" className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">Open PDF</a>}
          </div>
        </div>
        <div className="flex-1">
          {src ? <iframe title="invoice-preview" src={src} className="w-full h-full" /> : <div className="p-6 text-center text-slate-600">Loading preview...</div>}
        </div>
      </div>
    </div>
  )
}
