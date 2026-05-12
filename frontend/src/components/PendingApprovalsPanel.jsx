import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function PendingApprovalsPanel() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadPendingBookings()
  }, [])

  const loadPendingBookings = async () => {
    try {
      const res = await api.get('/booking/pending')
      setBookings(res.data.bookings || [])
    } catch (err) {
      console.error('Failed to load pending bookings', err)
      setError('Failed to load pending bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (bookingId) => {
    try {
      await api.post(`/booking/${bookingId}/approve`)
      await loadPendingBookings()
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
      await loadPendingBookings()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to reject booking')
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <p className="text-slate-600">Loading pending bookings...</p>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">✅ All caught up!</p>
        <p className="text-slate-600 mt-1">No pending booking approvals</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="rounded-2xl bg-white border border-amber-200 p-6 shadow-sm hover:shadow-md transition"
        >
          {rejectingId === booking._id ? (
            // Rejection form
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Reject booking from {booking.guest?.name}?</h4>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection (optional)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                rows="2"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleReject(booking._id)}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Confirm Reject
                </button>
                <button
                  onClick={() => {
                    setRejectingId(null)
                    setRejectReason('')
                  }}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Booking info
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{booking.guest?.name}</h4>
                  <div className="mt-2 space-y-1 text-sm text-slate-600">
                    <p>📞 {booking.guest?.phone}</p>
                    {booking.guest?.idProof && <p>🆔 {booking.guest.idProof}</p>}
                  </div>
                </div>
                <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  Pending
                </span>
              </div>

              <div className="grid gap-4 rounded-lg bg-slate-50 p-4 md:grid-cols-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Room Type</p>
                  <p className="font-semibold text-slate-900 mt-1">{booking.roomType}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Check-in</p>
                  <p className="font-semibold text-slate-900 mt-1">
                    {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Check-out</p>
                  <p className="font-semibold text-slate-900 mt-1">
                    {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Nights</p>
                  <p className="font-semibold text-slate-900 mt-1">{booking.totalNights}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleApprove(booking._id)}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => setRejectingId(booking._id)}
                  className="flex-1 rounded-lg bg-red-100 px-4 py-2 font-medium text-red-700 hover:bg-red-200"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
