import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ExpensePage from './ExpensePage'

export default function AdminExpenses(){
  const navigate = useNavigate()
  const handleLogout = ()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('adminMode')
    localStorage.removeItem('userId')
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Wood Stone Corbett</h1>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Admin panel</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/')} className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800">View Public Site</button>
            <button onClick={handleLogout} className="rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-100">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {[{to: '/admin/dashboard', label: 'Bookings'}, {to: '/admin/expenses', label: 'Expenses'}, {to: '/admin/invoices', label: 'Invoices'}].map(tab => (
            <Link key={tab.to} to={tab.to} className={`rounded-full px-4 py-2 text-sm font-medium transition ${window.location.pathname === tab.to ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}>
              {tab.label}
            </Link>
          ))}
        </div>

        <ExpensePage />
      </main>
    </div>
  )
}
