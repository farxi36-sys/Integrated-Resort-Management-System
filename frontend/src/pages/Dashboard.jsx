import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Dashboard(){
  const [stats, setStats] = useState({ dailyRevenue: 0, totalBookings: 0, pendingPayments: 0 })
  const [me, setMe] = useState(null)

  useEffect(()=>{
    api.get('/dashboard/stats').then(r=> setStats(r.data)).catch(()=>{})
    api.get('/auth/me').then(r=> setMe(r.data.user)).catch(()=>{})
  },[])

  const options = [
    { to: '/owner/booking', title: 'New Booking', desc: 'Create a new booking request', icon: '📅', color: 'from-blue-400 to-blue-600' },
    { to: '/owner/booking-history', title: 'Booking History', desc: 'View all your bookings', icon: '📋', color: 'from-indigo-400 to-indigo-600' },
    { to: '/owner/invoices', title: 'Invoices', desc: 'Track and manage invoices', icon: '💼', color: 'from-amber-400 to-amber-600' },
    { to: '/owner/expenses', title: 'Expenses', desc: 'Record and track expenses', icon: '💰', color: 'from-green-400 to-green-600' },
    { to: '/owner/billing', title: 'Billing', desc: 'View billing and payments', icon: '📊', color: 'from-purple-400 to-purple-600' },
    { to: '/owner/rooms', title: 'Rooms', desc: 'Manage room inventory', icon: '🛏️', color: 'from-pink-400 to-pink-600' },
    { to: '/owner/team', title: 'Team', desc: 'Manage team members', icon: '👥', color: 'from-rose-400 to-rose-600' },
    { to: '/owner/notifications', title: 'Notifications', desc: 'View all notifications', icon: '🔔', color: 'from-orange-400 to-orange-600' },
    { to: '/owner/profile', title: 'Profile', desc: 'Edit your profile', icon: '⚙️', color: 'from-slate-400 to-slate-600' }
  ]

  return (
    <div className="space-y-8">
      {/* Hero with Background */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-20 grid grid-cols-4">
          <img src="https://woodstonecorbett.com/img/site/corbett-fall.jpg" alt="bg" className="h-full w-full object-cover" />
          <img src="https://woodstonecorbett.com/img/site/resort.jpg" alt="bg" className="h-full w-full object-cover" />
          <img src="https://woodstonecorbett.com/img/site/nainital.jpg" alt="bg" className="h-full w-full object-cover" />
          <img src="https://woodstonecorbett.com/img/site/nature.jpg" alt="bg" className="h-full w-full object-cover" />
        </div>
        <div className="relative z-10 p-8 md:p-12 bg-gradient-to-r from-black/80 to-black/40">
          <p className="uppercase tracking-[0.35em] text-xs text-amber-300">Welcome back</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-black">Your Owner Portal{me?.name ? `, ${me.name}` : ''}</h2>
          <p className="mt-3 max-w-3xl text-white/85">Everything you need to manage your resort and business in one place. Access bookings, invoices, expenses, team, and more.</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <div className="rounded-full bg-white/15 px-4 py-2 backdrop-blur">Daily Revenue: ₹{stats.dailyRevenue}</div>
            <div className="rounded-full bg-white/15 px-4 py-2 backdrop-blur">Total Bookings: {stats.totalBookings}</div>
            <div className="rounded-full bg-white/15 px-4 py-2 backdrop-blur">Pending: {stats.pendingPayments}</div>
          </div>
        </div>
      </section>

      {/* Main Options Grid */}
      <section>
        <h3 className="mb-6 text-2xl font-black text-slate-900">All Options</h3>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {options.map((opt) => (
            <Link
              key={opt.to}
              to={opt.to}
              className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200 transition hover:shadow-lg hover:ring-slate-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition" />
              <div className="relative z-10">
                <div className="text-4xl mb-3">{opt.icon}</div>
                <h4 className="text-lg font-bold text-slate-900">{opt.title}</h4>
                <p className="mt-2 text-sm text-slate-600">{opt.desc}</p>
                <div className="mt-4 inline-flex items-center text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition">
                  Open →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Stats Cards with Cozy Style */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-6 ring-1 ring-amber-200">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-amber-700">Today's Revenue</p>
          <p className="mt-3 text-3xl font-black text-amber-900">₹{stats.dailyRevenue}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 ring-1 ring-blue-200">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-blue-700">Total Bookings</p>
          <p className="mt-3 text-3xl font-black text-blue-900">{stats.totalBookings}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 p-6 ring-1 ring-rose-200">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-rose-700">Pending Payments</p>
          <p className="mt-3 text-3xl font-black text-rose-900">₹{stats.pendingPayments}</p>
        </div>
      </section>
    </div>
  )
}
