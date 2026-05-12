import React, { useEffect, useState } from 'react'
import api from '../services/api'
import InvoicePreviewModal from '../components/InvoicePreviewModal'

export default function InvoicesPage(){
  const [list, setList] = useState([])
  const [previewId, setPreviewId] = useState(null)
  useEffect(()=>{
    api.get('/invoice/list').then(r=> setList(r.data.invoices || [])).catch(()=>{})
  },[])

  const download = async (id)=>{
    try {
      const response = await api.get(`/invoice/pdf?invoiceId=${id}`, { responseType: 'blob' })
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `${id}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to download PDF')
    }
  }

    return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Invoices</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Track every invoice from the owner portal.</h2>
        <p className="mt-3 max-w-2xl text-sm text-white/75 md:text-base">Preview, download, and review the latest bills generated for your resort guests.</p>
      </section>

      <div className="space-y-3">
        {list.map(inv=> (
          <div key={inv._id} className="flex flex-col justify-between gap-4 rounded-[1.5rem] bg-white p-4 shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/70 md:flex-row md:items-center md:p-5">
            <div>
              <div className="text-lg font-semibold">{inv.invoiceNumber}</div>
              <div className="text-sm text-slate-600">Total: ₹ {inv.total}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>setPreviewId(inv._id)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100">Preview</button>
              <button onClick={()=>download(inv._id)} className="rounded-2xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800">Download PDF</button>
            </div>
          </div>
        ))}
      </div>
      {previewId && <InvoicePreviewModal invoiceId={previewId} onClose={()=>setPreviewId(null)} />}
    </div>
  )
}
