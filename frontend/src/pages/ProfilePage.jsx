import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function ProfilePage(){
  const [form, setForm] = useState({ name:'', businessName:'', email:'' })
  const [message, setMessage] = useState('')

  useEffect(()=>{
    api.get('/auth/me').then(r=> setForm({ name:r.data.user.name || '', businessName:r.data.user.businessName || '', email:r.data.user.email || '' })).catch(()=>{})
  },[])

  const submit = async (e)=>{
    e.preventDefault()
    try{
      const res = await api.put('/users/profile', form)
      setMessage('Profile updated')
      setForm({ name: res.data.user.name || '', businessName: res.data.user.businessName || '', email: res.data.user.email || '' })
    }catch(err){ setMessage(err?.response?.data?.message || 'Update failed') }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <section className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Profile</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Keep your owner profile polished.</h2>
        <p className="mt-3 max-w-2xl text-sm text-white/75 md:text-base">Update your name, resort business name, and email details from one clean screen.</p>
      </section>
      <form onSubmit={submit} className="space-y-3 rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/70 md:p-8">
        <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" placeholder="Business name" value={form.businessName} onChange={e=>setForm({...form,businessName:e.target.value})} />
        <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <button className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800">Save Profile</button>
      </form>
      {message && <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-lg shadow-slate-900/5">{message}</div>}
    </div>
  )
}
