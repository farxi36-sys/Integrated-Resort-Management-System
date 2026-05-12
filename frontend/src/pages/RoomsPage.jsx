import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function RoomsPage(){
  const [rooms, setRooms] = useState([])
  const [form, setForm] = useState({ number:'', type:'AC', pricePerNight:0 })

  async function load(){
    try{ const res = await api.get('/rooms/list'); setRooms(res.data.rooms || []) }catch(e){}
  }
  useEffect(()=>{ load() },[])

  async function submit(e){
    e.preventDefault();
    try{ await api.post('/rooms/create', form); setForm({ number:'', type:'AC', pricePerNight:0 }); load() }catch(e){ alert('Error') }
  }

  async function remove(id){
    if (!confirm('Delete this room?')) return;
    try{ await api.post(`/rooms/delete/${id}`); load(); }catch(e){ alert('Delete failed') }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-8 text-white shadow-2xl shadow-slate-900/20">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Rooms</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Manage your room inventory with clarity.</h2>
        <p className="mt-3 max-w-2xl text-sm text-white/75 md:text-base">Create rooms, check status, and keep the owner view clean and fast.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={submit} className="space-y-4 rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/70 md:p-8">
          <h3 className="text-2xl font-semibold">Create Room</h3>
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" placeholder="Room number" value={form.number} onChange={e=>setForm({...form, number:e.target.value})} />
          <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
            <option>AC</option>
            <option>Non-AC</option>
          </select>
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" placeholder="Price per night" type="number" value={form.pricePerNight} onChange={e=>setForm({...form, pricePerNight:parseFloat(e.target.value)||0})} />
          <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800">Create Room</button>
        </form>

        <div className="space-y-3">
          {rooms.map(r=> (
            <div key={r._id} className="flex flex-col gap-3 rounded-[1.5rem] bg-white p-4 shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/70 md:flex-row md:items-center md:justify-between md:p-5">
              <div>
                <div className="text-lg font-semibold">Room {r.number} — {r.type}</div>
                <div className="text-sm text-slate-600">₹ {r.pricePerNight}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{r.status}</div>
                <button onClick={()=>remove(r._id)} className="rounded-2xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
