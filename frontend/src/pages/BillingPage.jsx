import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function BillingPage(){
  const [bookingId, setBookingId] = useState('')
  const [items, setItems] = useState([{ description:'Room Charges', qty:1, rate:0 }])
  const [invoice, setInvoice] = useState(null)
  const [totals, setTotals] = useState({ amount:0 })
  const [bookings, setBookings] = useState([])
  const selectedBooking = bookings.find((booking) => booking._id === bookingId) || null

  const addItem = ()=> setItems([...items, {description:'', qty:1, rate:0}])
  const updateItem = (i, k, v)=> { const copy=[...items]; copy[i][k]=v; setItems(copy) }

  const submit = async ()=>{
    try{
      if (!bookingId.trim()) {
        setInvoice({ error: { message: 'Please select a booking first.' } })
        return
      }
      const res = await api.post('/invoice/generate', { bookingId, lineItems: items })
      setInvoice(res.data.invoice)
    }catch(err){ setInvoice({ error: err?.response?.data || err.message }) }
  }

  useEffect(()=>{
    const amount = items.reduce((s,it)=> s + (it.qty||1)*(it.rate||0), 0);
    setTotals({ amount });
  }, [items])

  useEffect(()=>{
    api.get('/booking/list').then(r=> setBookings(r.data.bookings || [])).catch(()=>{})
  }, [])

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Billing desk</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Generate simple invoices with one total amount.</h2>
        <p className="mt-3 max-w-2xl text-sm text-white/75 md:text-base">Add charges, calculate the final booking amount instantly, and issue a professional invoice for the owner space.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/70 md:p-8">
          <div className="mb-5">
            <h3 className="text-2xl font-semibold">Invoice Builder</h3>
            <p className="text-sm text-slate-600">Select a booking and add line items to build a final bill.</p>
          </div>
          <select value={bookingId} onChange={e=>setBookingId(e.target.value)} className="mb-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white">
            <option value="">Select booking</option>
            {bookings.map((booking) => (
              <option key={booking._id} value={booking._id}>
                {booking.guest?.name || 'Unknown guest'} | {booking.roomType || 'Room'} | {booking.status || 'pending'} | {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'no check-in'}
              </option>
            ))}
          </select>

          {selectedBooking && (
            <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Selected Booking</div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <div className="text-xs text-slate-500">Guest</div>
                  <div className="font-semibold text-slate-900">{selectedBooking.guest?.name || 'Unknown guest'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Phone</div>
                  <div className="font-semibold text-slate-900">{selectedBooking.guest?.phone || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Room Type</div>
                  <div className="font-semibold text-slate-900">{selectedBooking.roomType || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Status</div>
                  <div className="font-semibold text-slate-900">{selectedBooking.status || 'pending'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Check-In</div>
                  <div className="font-semibold text-slate-900">{selectedBooking.checkIn ? new Date(selectedBooking.checkIn).toLocaleDateString() : 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Check-Out</div>
                  <div className="font-semibold text-slate-900">{selectedBooking.checkOut ? new Date(selectedBooking.checkOut).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {items.map((it,i)=> (
              <div key={i} className="grid gap-3 rounded-2xl bg-slate-50 p-3 md:grid-cols-[1.6fr_0.5fr_0.6fr]">
                <input placeholder="Description" value={it.description} onChange={e=>updateItem(i,'description',e.target.value)} className="rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-slate-400" />
                <input type="number" value={it.qty} onChange={e=>updateItem(i,'qty',parseFloat(e.target.value)||0)} className="rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-slate-400" />
                <input type="number" value={it.rate} onChange={e=>updateItem(i,'rate',parseFloat(e.target.value)||0)} className="rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-slate-400" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={addItem} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">Add Item</button>
            <button onClick={submit} className="rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700">Generate Invoice</button>
          </div>
        </div>

        <aside className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/70 md:p-8">
          <h3 className="text-2xl font-semibold">Totals</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-white"><span>Booking Amount</span><span className="text-lg font-semibold">₹ {totals.amount.toFixed(2)}</span></div>
          </div>
        </aside>
      </section>

      {invoice && <pre className="overflow-auto rounded-[2rem] bg-slate-950 p-6 text-sm text-slate-100 shadow-xl shadow-slate-900/10">{JSON.stringify(invoice,null,2)}</pre>}
    </div>
  )
}
