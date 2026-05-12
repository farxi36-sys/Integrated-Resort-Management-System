import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage(){
  const [form, setForm] = useState({ email:'', password:'' })
  const [err, setErr] = useState(null)
  const navigate = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    try{
      const res = await api.post('/auth/login', form)
      const token = res.data.token
      const userId = res.data.user?.id
      localStorage.setItem('token', token)
      if (userId) localStorage.setItem('userId', userId)
      if (userId) localStorage.setItem('ownerId', userId) // Also store as ownerId for public booking page
      navigate('/dashboard')
    }catch(e){ setErr(e?.response?.data?.message || e.message) }
  }

  return (
    <div className="grid min-h-[calc(100vh-5rem)] gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-900 text-white shadow-2xl shadow-slate-900/20">
        <div className="absolute inset-0 grid grid-cols-3 opacity-25">
          <img src="/assets/room-01.jpg" alt="Lobby" className="h-full w-full object-cover" />
          <img src="/assets/img-001.jpg" alt="Dining" className="h-full w-full object-cover" />
          <img src="/assets/corbett-fall.jpg" alt="Nature" className="h-full w-full object-cover" />
        </div>
        <div className="relative z-10 flex h-full flex-col justify-between bg-gradient-to-br from-black/75 via-black/45 to-black/70 p-8 md:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Owner access</p>
            <h2 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight md:text-6xl">Sign in to your resort command center.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/80 md:text-base">Manage rooms, bookings, billing, invoices, team, and monthly expense history from one premium dashboard made for Wood Stone Corbett.</p>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {[
              ['Bookings', 'Fast guest entry and check-in flow'],
              ['Billing', 'Generate simple invoices'],
              ['Expenses', 'Track monthly spend history']
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="text-sm font-semibold text-amber-100">{title}</div>
                <div className="mt-1 text-xs leading-5 text-white/75">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200/70 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Owner Login</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight">Welcome back</h3>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white" placeholder="Owner email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800">Sign in to owner space</button>
          {err && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{String(err)}</div>}
        </form>

        <div className="mt-4 text-sm text-slate-600">
          New here? <Link to="/register" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4">Create an owner account</Link>
        </div>
      </section>
    </div>
  )
}
