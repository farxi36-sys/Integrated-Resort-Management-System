import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function TeamPage(){
  const [staff, setStaff] = useState([])
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [message, setMessage] = useState('')

  const load = ()=> api.get('/users/staff').then(r=> setStaff(r.data.users || [])).catch(()=>{})
  useEffect(()=>{ load() },[])

  const submit = async (e)=>{
    e.preventDefault()
    try{
      await api.post('/users/staff', form)
      setForm({ name:'', email:'', password:'' })
      setMessage('Staff member added')
      load()
    }catch(err){ setMessage(err?.response?.data?.message || 'Failed to add staff') }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-8 text-white shadow-2xl shadow-slate-900/20">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Team</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Bring your team into the owner workspace.</h2>
        <p className="mt-3 max-w-2xl text-sm text-white/75 md:text-base">Add resort staff, keep their access organized, and review everyone from one calm screen.</p>
      </section>
      <form onSubmit={submit} className="grid gap-3 rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/70 md:grid-cols-4 md:p-8">
        <input className="rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input className="rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800">Add Staff</button>
      </form>
      {message && <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-lg shadow-slate-900/5">{message}</div>}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {staff.map(member => (
          <div key={member._id} className="rounded-[1.5rem] bg-white p-4 shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/70">
            <div className="font-semibold">{member.name}</div>
            <div className="text-sm text-slate-600">{member.email}</div>
            <div className="mt-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">Staff</div>
          </div>
        ))}
      </div>
    </div>
  )
}
