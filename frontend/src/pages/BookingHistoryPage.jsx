import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function BookingHistoryPage(){
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingBookingId, setEditingBookingId] = useState(null)
  const [editForm, setEditForm] = useState({
    guest: { name: '', phone: '', idProof: '' },
    roomType: 'AC',
    checkIn: '',
    checkOut: '',
    notes: '',
  })

  useEffect(()=>{
    loadBookings()
  },[])

  const loadBookings = async () => {
    try {
      const res = await api.get('/booking/list')
      setBookings(res.data.bookings || [])
    } catch (err) {
      console.error('Failed to load bookings', err)
      alert('Failed to load booking history')
    } finally {
      setLoading(false)
    }
  }

  const doCheckout = async (bookingId) => {
    try {
      await api.post('/booking/checkout', { bookingId })
      await loadBookings()
    } catch (err) {
      alert('Check-out failed')
    }
  }

  const startEdit = (booking) => {
    setEditingBookingId(booking._id)
    setEditForm({
      guest: {
        name: booking.guest?.name || '',
        phone: booking.guest?.phone || '',
        idProof: booking.guest?.idProof || '',
      },
      roomType: booking.roomType || 'AC',
      checkIn: booking.checkIn ? booking.checkIn.slice(0, 10) : '',
      checkOut: booking.checkOut ? booking.checkOut.slice(0, 10) : '',
      notes: booking.notes || '',
    })
  }

  const saveEdit = async (bookingId) => {
    try {
      await api.put(`/booking/${bookingId}`, editForm)
      setEditingBookingId(null)
      await loadBookings()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update booking')
    }
  }

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await api.post(`/booking/${bookingId}/cancel`)
      await loadBookings()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to cancel booking')
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-900 text-white shadow-2xl shadow-slate-900/15">
        <div className="p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">History</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">Guest Booking History</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/80">View all bookings with guest details, room assignments, and check-in/check-out dates.</p>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/70 md:p-8">
        {loading ? (
          <div className="text-center py-8">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-slate-600">No bookings found</div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-6">Total Bookings: {bookings.length}</h3>
            {bookings.map((booking) => (
              <div key={booking._id} className="rounded-2xl border border-slate-200 p-4 hover:shadow-lg transition">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Guest Name</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{booking.guest?.name || 'Unknown'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Phone</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{booking.guest?.phone || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Room Type</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{booking.roomType}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</div>
                    <div className="mt-2">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${booking.status === 'checked_in' ? 'bg-emerald-100 text-emerald-700' : booking.status === 'checked_out' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Check-In</div>
                    <div className="mt-2 text-sm text-slate-700">{new Date(booking.checkIn).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Check-Out</div>
                    <div className="mt-2 text-sm text-slate-700">{new Date(booking.checkOut).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total Nights</div>
                    <div className="mt-2 text-sm text-slate-700">{booking.totalNights}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">ID Proof</div>
                    <div className="mt-2 text-sm text-slate-700">{booking.guest?.idProof || 'N/A'}</div>
                  </div>
                </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={()=>startEdit(booking)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    Edit Booking
                  </button>
                  {booking.status !== 'checked_out' && booking.status !== 'canceled' && (
                    <button onClick={()=>cancelBooking(booking._id)} className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">
                      Cancel Booking
                    </button>
                  )}
                    {booking.status === 'checked_in' && (
                      <button onClick={()=>doCheckout(booking._id)} className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">
                        Early Checkout
                      </button>
                    )}
                  </div>
                {editingBookingId === booking._id && (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Edit Booking</div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <input value={editForm.guest.name} onChange={e=>setEditForm({...editForm, guest:{...editForm.guest, name:e.target.value}})} placeholder="Guest name" className="rounded-2xl border border-slate-200 bg-white p-3 outline-none focus:border-slate-400" />
                      <input value={editForm.guest.phone} onChange={e=>setEditForm({...editForm, guest:{...editForm.guest, phone:e.target.value}})} placeholder="Phone" className="rounded-2xl border border-slate-200 bg-white p-3 outline-none focus:border-slate-400" />
                      <input value={editForm.guest.idProof} onChange={e=>setEditForm({...editForm, guest:{...editForm.guest, idProof:e.target.value}})} placeholder="ID proof" className="rounded-2xl border border-slate-200 bg-white p-3 outline-none focus:border-slate-400" />
                      <select value={editForm.roomType} onChange={e=>setEditForm({...editForm, roomType:e.target.value})} className="rounded-2xl border border-slate-200 bg-white p-3 outline-none focus:border-slate-400">
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non-AC</option>
                      </select>
                      <input type="date" value={editForm.checkIn} onChange={e=>setEditForm({...editForm, checkIn:e.target.value})} className="rounded-2xl border border-slate-200 bg-white p-3 outline-none focus:border-slate-400" />
                      <input type="date" value={editForm.checkOut} onChange={e=>setEditForm({...editForm, checkOut:e.target.value})} className="rounded-2xl border border-slate-200 bg-white p-3 outline-none focus:border-slate-400" />
                    </div>
                    <textarea value={editForm.notes} onChange={e=>setEditForm({...editForm, notes:e.target.value})} placeholder="Notes" className="mt-3 w-full rounded-2xl border border-slate-200 bg-white p-3 outline-none focus:border-slate-400" rows={3} />
                    <div className="mt-3 flex flex-wrap gap-3">
                      <button onClick={()=>saveEdit(booking._id)} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Save Changes</button>
                      <button onClick={()=>setEditingBookingId(null)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
