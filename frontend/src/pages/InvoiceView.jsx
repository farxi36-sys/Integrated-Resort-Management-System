import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useParams } from 'react-router-dom'

export default function InvoiceView(){
  const { id } = useParams()
  const [invoice, setInvoice] = useState(null)
  useEffect(()=>{
    api.get(`/invoice/${id}`).then(r=> setInvoice(r.data.invoice)).catch(()=>{})
  },[id])

  if (!invoice) return <div>Loading...</div>
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Wood Stone Corbett</h1>
          <div className="text-sm text-gray-600">Chunakhan, Nainital</div>
        </div>
        <div className="text-right">
          <div className="font-semibold">Invoice: {invoice.invoiceNumber}</div>
          <div className="text-sm">{new Date(invoice.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="font-semibold">Guest</div>
        <div>{invoice.booking?.guest?.name}</div>
        <div className="text-sm text-gray-600">{invoice.booking?.guest?.phone}</div>
      </div>

      <table className="w-full border-collapse mb-4">
        <thead>
          <tr className="text-left">
            <th className="pb-2">Description</th>
            <th className="pb-2">Qty</th>
            <th className="pb-2">Rate</th>
            <th className="pb-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((it,i)=> (
            <tr key={i} className="border-t">
              <td className="py-2">{it.description}</td>
              <td className="py-2">{it.qty || 1}</td>
              <td className="py-2">₹ {it.rate?.toFixed(2)}</td>
              <td className="py-2 text-right">₹ {((it.qty||1)*(it.rate||0)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right">
        <div>Subtotal: ₹ {invoice.subtotal.toFixed(2)}</div>
        <div className="font-semibold text-lg mt-2">Total: ₹ {invoice.total.toFixed(2)}</div>
      </div>

      <div className="mt-6 flex gap-2">
        <button onClick={()=> window.print()} className="px-3 py-2 bg-blue-600 text-white rounded">Print / Save PDF</button>
      </div>
    </div>
  )
}
