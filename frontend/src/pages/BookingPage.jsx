import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function BookingPage(){
  const [form, setForm] = useState({ guest: { name:'', phone:'', idProof:'' }, roomType:'AC', checkIn:'', checkOut:'' })
  const [result, setResult] = useState(null)
  const [rooms, setRooms] = useState([])

  useEffect(()=>{
    api.get('/rooms/list').then(r=>setRooms(r.data.rooms||[])).catch(()=>{});
  },[])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/booking/create', form)
      setResult(res.data.booking)
    } catch (err) {
      setResult({ error: err?.response?.data || err.message })
    }
  }

  const doCheckin = async (bookingId) => {
    try{
      const r = await api.post('/booking/checkin', { bookingId });
      setResult(r.data.booking);
      // reload rooms
      const rr = await api.get('/rooms/list'); setRooms(rr.data.rooms||[])
    }catch(e){ alert('Check-in failed') }
  }

  const doCheckout = async (bookingId) => {
    try{
      const r = await api.post('/booking/checkout', { bookingId });
      setResult(r.data.booking);
      const rr = await api.get('/rooms/list'); setRooms(rr.data.rooms||[])
    }catch(e){ alert('Check-out failed') }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-900 text-white shadow-2xl shadow-slate-900/15">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Guest flow</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">Create a booking in a few clicks.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/80">Capture guest details, select room type, and move directly to check-in when needed.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 bg-white/5 p-6 md:p-8">
            {rooms.slice(0, 4).map(room => (
              <div key={room._id} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.3em] text-amber-100">Room</div>
                <div className="mt-2 text-2xl font-semibold">{room.number}</div>
                <div className="text-sm text-white/75">{room.type} • ₹ {room.pricePerNight}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={submit} className="space-y-4 rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/70 md:p-8">
          <div>
            <h3 className="text-2xl font-semibold">New Booking</h3>
            <p className="text-sm text-slate-600">Owner-facing guest booking form.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input value={form.guest.name} onChange={e=>setForm({...form, guest:{...form.guest, name:e.target.value}})} placeholder="Guest name" className="rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" />
            <input value={form.guest.phone} onChange={e=>setForm({...form, guest:{...form.guest, phone:e.target.value}})} placeholder="Phone" className="rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" />
            <input value={form.guest.idProof} onChange={e=>setForm({...form, guest:{...form.guest, idProof:e.target.value}})} placeholder="ID proof" className="rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" />
            <select value={form.roomType} onChange={e=>setForm({...form, roomType:e.target.value})} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white">
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
            </select>
            <input type="date" value={form.checkIn} onChange={e=>setForm({...form, checkIn:e.target.value})} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" />
            <input type="date" value={form.checkOut} onChange={e=>setForm({...form, checkOut:e.target.value})} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" />
          </div>
          <button className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800">Create Booking</button>
        </form>

        <aside className="space-y-4 rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/70 md:p-8">
          <div>
            <h3 className="text-2xl font-semibold">Available Rooms</h3>
            <p className="text-sm text-slate-600">Live room list for quick assignment.</p>
          </div>
          <div className="space-y-3">
            {rooms.map(room => (
              <div key={room._id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div>
                  <div className="font-semibold">Room {room.number}</div>
                  <div className="text-sm text-slate-600">{room.type} • ₹ {room.pricePerNight}</div>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{room.status}</div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      {result && (
        <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/70 md:p-8">
          {result.error ? (
            <div className="text-red-600 font-semibold">Error: {JSON.stringify(result.error)}</div>
          ) : (
            <>
              <h3 className="text-2xl font-semibold mb-4">Booking Created Successfully</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-600">Guest Name</div>
                  <div className="mt-2 text-xl font-semibold">{result.guest?.name || 'N/A'}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-600">Phone</div>
                  <div className="mt-2 text-xl font-semibold">{result.guest?.phone || 'N/A'}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-600">ID Proof</div>
                  <div className="mt-2 text-xl font-semibold">{result.guest?.idProof || 'N/A'}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-600">Room Type</div>
                  <div className="mt-2 text-xl font-semibold">{result.roomType || 'N/A'}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-600">Check-In</div>
                  <div className="mt-2 text-xl font-semibold">{new Date(result.checkIn).toLocaleDateString()}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-600">Check-Out</div>
                  <div className="mt-2 text-xl font-semibold">{new Date(result.checkOut).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {result._id && result.status !== 'checked_in' && result.status !== 'checked_out' && <button onClick={()=>doCheckin(result._id)} className="rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700">Check In Guest</button>}
                {result._id && result.status === 'checked_in' && <button onClick={()=>doCheckout(result._id)} className="rounded-2xl bg-rose-600 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700">Early Checkout</button>}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  )
}
