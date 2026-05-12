import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate, Link } from 'react-router-dom'

export default function RegisterPage(){
  const [form, setForm] = useState({ name:'', businessName:'', email:'', password:'' })
  const [err, setErr] = useState(null)
  const navigate = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    try{
      const res = await api.post('/auth/register', form)
      const token = res.data.token
      const userId = res.data.user?.id
      localStorage.setItem('token', token)
      if (userId) localStorage.setItem('userId', userId)
      if (userId) localStorage.setItem('ownerId', userId)
      navigate('/dashboard')
    }catch(e){ setErr(e?.response?.data?.message || e.message) }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Create an owner account</h2>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-2">
        <input className="w-full p-2 border" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="w-full p-2 border" placeholder="Resort or business name" value={form.businessName} onChange={e=>setForm({...form,businessName:e.target.value})} />
        <input className="w-full p-2 border" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input className="w-full p-2 border" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button className="w-full bg-green-600 text-white p-2 rounded">Create account & continue</button>
        {err && <div className="text-red-600">{String(err)}</div>}
      </form>
      <div className="mt-3 text-sm">
        Already registered? <Link to="/login" className="text-blue-600">Sign in here</Link>
      </div>
    </div>
  )
}
