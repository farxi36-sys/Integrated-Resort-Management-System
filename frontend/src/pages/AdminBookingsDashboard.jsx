import React, { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import api from '../services/api'

export default function AdminBookingsDashboard() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending') // pending, confirmed, rejected, all
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      const res = await api.get('/booking/pending')
      setBookings(res.data.bookings || [])
    } catch (err) {
      console.error('Failed to load bookings', err)
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (bookingId) => {
    try {
      await api.post(`/booking/${bookingId}/approve`)
      await loadBookings()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to approve booking')
    }
  }

  const handleReject = async (bookingId) => {
    if (!rejectReason.trim()) {
      alert('Please enter a reason for rejection')
      return
    }
    try {
      await api.post(`/booking/${bookingId}/reject`, { reason: rejectReason })
      setRejectingId(null)
      setRejectReason('')
      await loadBookings()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to reject booking')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('adminMode')
    localStorage.removeItem('userId')
    navigate('/admin')
  }

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true
    return b.status === filter
  })

  const pendingCount = bookings.filter(b => b.status === 'pending').length
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length
  const rejectedCount = bookings.filter(b => b.status === 'rejected').length

  const location = useLocation()

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
            <Link key={tab.to} to={tab.to} className={`rounded-full px-4 py-2 text-sm font-medium transition ${location.pathname === tab.to ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}>
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-600">Pending Bookings</p>
            <p className="mt-2 text-3xl font-black text-amber-600">{pendingCount}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-600">Confirmed</p>
            <p className="mt-2 text-3xl font-black text-emerald-600">{confirmedCount}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-600">Rejected</p>
            <p className="mt-2 text-3xl font-black text-rose-600">{rejectedCount}</p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { value: 'pending', label: 'Pending', count: pendingCount },
            { value: 'confirmed', label: 'Confirmed', count: confirmedCount },
            { value: 'rejected', label: 'Rejected', count: rejectedCount },
            { value: 'all', label: 'All Bookings', count: bookings.length }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === tab.value ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
              <p className="text-slate-600">Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 p-8 text-center border border-red-200">
              <p className="text-red-700">{error}</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
              <p className="text-lg font-semibold text-slate-900">No bookings</p>
              <p className="text-slate-600 mt-1">No {filter} bookings at the moment</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className={`rounded-2xl border p-6 shadow-sm transition ${
                  booking.status === 'pending'
                    ? 'bg-amber-50 border-amber-200'
                    : booking.status === 'confirmed'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-rose-50 border-rose-200'
                }`}
              >
                {rejectingId === booking._id ? (
                  // Rejection form
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900">Reject booking from {booking.guest?.name}?</h4>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Enter reason for rejection"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
                      rows="3"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReject(booking._id)}
                        className="flex-1 rounded-xl bg-rose-600 px-4 py-3 font-medium text-white hover:bg-rose-700"
                      >
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => {
                          setRejectingId(null)
                          setRejectReason('')
                        }}
                        className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Booking info
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900">{booking.guest?.name}</h3>
                        <div className="mt-2 space-y-1 text-sm text-slate-600">
                          <p>📞 {booking.guest?.phone}</p>
                          {booking.guest?.idProof && <p>🆔 ID: {booking.guest.idProof}</p>}
                        </div>
                      </div>
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${booking.status === 'pending' ? 'bg-amber-200 text-amber-800' : booking.status === 'confirmed' ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'}`}>
                        {booking.status === 'pending' ? 'Pending' : booking.status === 'confirmed' ? 'Confirmed' : 'Rejected'}
                      </span>
                    </div>

                    <div className="grid gap-3 rounded-xl bg-white p-4 text-sm ring-1 ring-slate-200 sm:grid-cols-4">
                      <div><p className="text-xs font-semibold uppercase text-slate-500">Room Type</p><p className="mt-1 font-semibold text-slate-900">{booking.roomType}</p></div>
                      <div><p className="text-xs font-semibold uppercase text-slate-500">Check-in</p><p className="mt-1 font-semibold text-slate-900">{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString('en-IN') : '-'}</p></div>
                      <div><p className="text-xs font-semibold uppercase text-slate-500">Check-out</p><p className="mt-1 font-semibold text-slate-900">{booking.checkOut ? new Date(booking.checkOut).toLocaleDateString('en-IN') : '-'}</p></div>
                      <div><p className="text-xs font-semibold uppercase text-slate-500">Nights</p><p className="mt-1 font-semibold text-slate-900">{booking.totalNights || '-'}</p></div>
                    </div>

                    {booking.notes && (
                      <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                        <p className="text-xs font-semibold uppercase text-slate-500">Notes</p>
                        <p className="mt-1 text-sm text-slate-800">{booking.notes}</p>
                      </div>
                    )}

                    {booking.status === 'pending' && (
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleApprove(booking._id)}
                          className="flex-1 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectingId(booking._id)}
                          className="flex-1 rounded-xl bg-rose-600 px-6 py-3 font-medium text-white hover:bg-rose-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
