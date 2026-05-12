import React from 'react'
import { Link } from 'react-router-dom'
import { rooms as sharedRooms } from '../data/rooms'
// IMPORTANT: place your exact resort image at `src/assets/resort-hero.jpg`
// This file must exist before starting the dev server.
import resortHero from '../assets/resort-hero.jpg'

export default function PublicLandingPage() {
  const [expandedSection, setExpandedSection] = React.useState(null)
  const [expandedAttraction, setExpandedAttraction] = React.useState(null)
  const attractions = [
    { name: 'Nainital', image: 'https://woodstonecorbett.com/img/site/nainital.jpg', distance: '35 km', desc: 'The heart of the hill station. Enjoy boating on the pristine Naina Lake, explore the famous Mall Road with shops and cafes, visit the ancient Naina Devi Temple, and soak in panoramic views of the surrounding hills.' },
    { name: 'Pangot', image: '/assets/pangot.jpg', distance: '56 km', desc: 'A serene birdwatcher\'s paradise surrounded by thick oak, pine, and rhododendron forests. Perfect for nature lovers and adventure seekers. Ideal spot for trekking and wildlife spotting.' },
    { name: 'Barati Rao Waterfall', image: '/assets/corbett-fall.jpg', distance: '3 km', desc: 'A scenic waterfall surrounded by dense teak wood forests. Perfect spot for a quick picnic, nature photography, and refreshing water activities. A hidden gem close to the resort.' },
    { name: 'Hanuman Dham', image: '/assets/hanuman-dham.jpg', distance: '10 km', desc: 'A unique and magnificent temple famous for the darshan of 21 divine forms of Lord Hanuman. Located near Corbett National Park, it\'s a spiritual destination for devotees and a cultural landmark.' },
    { name: 'Jim Corbett', image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1200&auto=format&fit=crop', distance: '20 km', desc: 'India\'s oldest and most famous national park. Embark on thrilling jungle safaris to spot magnificent tigers, elephants, leopards, and rare bird species. An unforgettable wildlife experience in natural habitat.' }
  ]

  const rooms = sharedRooms.map(r => ({
    title: r.name,
    price: `₹${r.price}`,
    image: r.image,
    fallbackImage: r.fallbackImage,
    type: r.type
  }))

  const services = [
    { icon: '🍽️', title: 'All-Day Dining', desc: 'Breakfast, lunch, dinner, and custom menus' },
    { icon: '🎉', title: 'Event Venue', desc: 'Weddings, birthdays, corporate meets' },
    { icon: '🛏️', title: 'Comfortable Stay', desc: 'Well-furnished rooms with modern amenities' },
    { icon: '🌳', title: 'Outdoor Seating', desc: 'Enjoy meals amidst fresh air and scenic views' }
  ]

  const offerings = [
    { id: 'dining', title: 'All Day Dining', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop', desc: 'Savor delicious multi-cuisine food items prepared fresh daily. From aromatic breakfasts to gourmet dinners, pastries, desserts, and beverages. Available for dine-in and takeaway.' },
    { id: 'events', title: 'Event Venue', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop', desc: 'Our versatile banquet area is designed to host grand celebrations with breathtaking views. Venue-only rental or full event management with specialized decor and catering.' },
    { id: 'wedding', title: 'Weddings', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop', desc: 'Create unforgettable memories at your dream wedding. Elegant settings, specialized theme decor, premium multi-cuisine catering, and complete hospitality services for your special day.' },
    { id: 'birthday', title: 'Birthday Celebrations', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop', desc: 'Celebrate special moments with family and friends. Custom decorations, themed party setups, delicious cakes and food, making your birthday truly memorable and joyful.' },
    { id: 'outdoor', title: 'Outdoor Seating', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop', desc: 'Dine amidst nature on our beautiful swing seating with fresh mountain breeze and stunning Nainital views. Perfect for a relaxed and scenic dining experience in the lap of nature.' }
  ]

  return (
    <div className="min-h-screen bg-white">
      <header className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 shadow-2xl">
        <div className="absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-emerald-400/30 to-transparent blur-2xl" />
        <div className="absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-amber-300/30 to-transparent blur-2xl" />
        <div className="absolute left-6 top-5 text-white/70 text-2xl rotate-[-10deg]">🐦</div>
        <div className="absolute right-12 top-8 text-white/70 text-2xl rotate-[12deg]">🐦</div>
        <div className="absolute inset-0 opacity-40">
          <svg className="absolute bottom-0 w-full h-40 text-slate-950" viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: 'currentColor', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: 'currentColor', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            {/* Mountain range from left to right */}
            <path d="M0,200 L150,80 L300,150 L450,60 L600,140 L750,70 L900,160 L1050,90 L1200,180 L1200,300 L0,300 Z" fill="url(#mountainGrad)" />
            <path d="M0,250 L200,120 L400,200 L600,110 L800,220 L1000,130 L1200,250 L1200,300 L0,300 Z" fill="currentColor" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white drop-shadow-lg">Wood Stone Corbett</h1>
              <p className="text-xs uppercase tracking-[0.35em] text-amber-300 mt-1 drop-shadow-md">Himalayan Escape</p>
            </div>
            <div>
              <Link to="/admin" className="rounded-full border-2 border-white bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">Admin</Link>
            </div>
          </div>
        </div>
      </header>

      <section
        className="relative w-full min-h-screen text-white overflow-hidden"
        style={{
          // Use only the exact uploaded resort image (imported above)
          backgroundImage: `url(${resortHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-emerald-400/25 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-amber-300/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        <div className="relative z-10 mx-auto max-w-7xl h-full flex flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">Wood Stone Corbett</p>
          <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">Simple public booking entry point</h2>
          <p className="mt-4 max-w-2xl text-slate-300">Book your perfect getaway in the heart of Nainital. Experience comfort, nature, birdsong, and unforgettable mountain moments with us.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book" className="rounded-full bg-white px-6 py-3 font-black text-slate-900 transition hover:bg-slate-100">Open Booking</Link>
            <Link to="/admin" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-black text-white transition hover:bg-white/15">Open Admin</Link>
          </div>
        </div>
      </section>

      <main className="px-4 py-16 sm:px-6 lg:px-8">
        <section id="explore" className="mx-auto max-w-7xl">
          <h3 className="mb-6 text-2xl font-black text-slate-900">Explore Our Offerings</h3>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {offerings.map((offering) => (
              <div
                key={offering.id}
                onClick={() => setExpandedSection(expandedSection === offering.id ? null : offering.id)}
                className="cursor-pointer rounded-2xl overflow-hidden shadow-md ring-1 ring-slate-200 transition hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative h-40 overflow-hidden bg-slate-200">
                  <img src={offering.image} alt={offering.title} className="h-full w-full object-cover hover:scale-105 transition duration-300" />
                </div>
                <div className="bg-white p-4">
                  <h4 className="text-lg font-bold text-slate-900">{offering.title}</h4>
                  <p className="mt-2 text-xs text-slate-500">Click to explore</p>
                </div>
              </div>
            ))}
          </div>

          {expandedSection && (
            <div className="mt-8 rounded-3xl bg-gradient-to-br from-slate-50 to-white p-8 shadow-lg ring-1 ring-slate-200">
              <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
                <div>
                  <img
                    src={offerings.find(o => o.id === expandedSection)?.image}
                    alt={offerings.find(o => o.id === expandedSection)?.title}
                    className="rounded-2xl shadow-lg w-full object-cover h-80"
                  />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900">{offerings.find(o => o.id === expandedSection)?.title}</h3>
                  <p className="mt-4 text-slate-700 leading-relaxed">{offerings.find(o => o.id === expandedSection)?.desc}</p>
                  <button
                    onClick={() => setExpandedSection(null)}
                    className="mt-6 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <section id="rooms" className="mt-12 mx-auto max-w-7xl">
          <h3 className="mb-6 text-2xl font-black text-slate-900">Our Rooms</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {rooms.map((room) => (
              <div key={room.title} className="rounded-3xl overflow-hidden shadow-lg ring-1 ring-slate-200 transition hover:shadow-xl">
                <div className="relative h-64 overflow-hidden bg-slate-200">
                  <img
                    src={room.image}
                    alt={room.title}
                    onError={(e) => {
                      if (e.currentTarget.dataset.fallbackApplied === 'true') return
                      e.currentTarget.dataset.fallbackApplied = 'true'
                      e.currentTarget.src = room.fallbackImage || '/assets/img-003.jpg'
                    }}
                    className="h-full w-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="bg-white p-6">
                  <h4 className="text-lg font-black text-slate-900">{room.title}</h4>
                  <p className="mt-1 text-xl font-bold text-amber-600">{room.price} / night</p>
                  <p className="mt-2 text-sm text-slate-600">{room.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 mx-auto max-w-7xl">
          <h3 className="mb-6 text-2xl font-black text-slate-900">Nearby Attractions</h3>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {attractions.map((item) => (
              <div
                key={item.name}
                onClick={() => setExpandedAttraction(expandedAttraction === item.name ? null : item.name)}
                className="cursor-pointer rounded-2xl overflow-hidden shadow-md ring-1 ring-slate-200 transition hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative h-40 overflow-hidden bg-slate-200">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover hover:scale-105 transition duration-300" />
                </div>
                <div className="bg-white p-4">
                  <h4 className="text-lg font-bold text-slate-900">{item.name}</h4>
                  <p className="mt-1 text-sm text-amber-600 font-semibold">{item.distance}</p>
                  <p className="mt-1 text-xs text-slate-500">Click to explore</p>
                </div>
              </div>
            ))}
          </div>

          {expandedAttraction && (
            <div className="mt-8 rounded-3xl bg-gradient-to-br from-slate-50 to-white p-8 shadow-lg ring-1 ring-slate-200">
              <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
                <div>
                  <img
                    src={attractions.find(a => a.name === expandedAttraction)?.image}
                    alt={expandedAttraction}
                    className="rounded-2xl shadow-lg w-full object-cover h-80"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.1em] text-amber-600">Distance</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{attractions.find(a => a.name === expandedAttraction)?.name}</h3>
                  <p className="text-xl font-bold text-slate-700 mt-2">{attractions.find(a => a.name === expandedAttraction)?.distance}</p>
                  <p className="mt-4 text-slate-700 leading-relaxed">{attractions.find(a => a.name === expandedAttraction)?.desc}</p>
                  <button
                    onClick={() => setExpandedAttraction(null)}
                    className="mt-6 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer id="contact" className="relative mt-16 overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-black text-white">
        <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500" />
        <svg className="absolute left-0 top-0 h-20 w-full text-black/35" viewBox="0 0 1200 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,180 L140,95 L260,160 L360,80 L500,150 L640,70 L760,145 L900,88 L1030,160 L1200,105 L1200,220 L0,220 Z" fill="currentColor" />
          <path d="M0,210 L120,145 L240,185 L350,120 L480,195 L620,130 L760,200 L900,135 L1080,205 L1200,160 L1200,220 L0,220 Z" fill="currentColor" opacity="0.75" />
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(110,231,183,0.16),transparent_45%),radial-gradient(circle_at_right,rgba(251,191,36,0.12),transparent_42%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <h4 className="text-xl font-black tracking-wide text-amber-300">Wood Stone Corbett</h4>
                <p className="mt-3 text-sm leading-relaxed text-slate-200">A peaceful mountain resort stay surrounded by forest views, fresh air, and warm hospitality near Jim Corbett.</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-300">
                  <span>📍</span>
                  <span>Near Corbett, Nainital Region</span>
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">Contact</h4>
                <div className="mt-4 space-y-3 text-sm">
                  <a href="mailto:woodstonecorbett@gmail.com" className="inline-flex items-center gap-2 text-slate-200 transition hover:text-amber-300 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.45)]">
                    <span>📧</span>
                    <span>woodstonecorbett@gmail.com</span>
                  </a>
                  <a href="tel:+911234567891" className="flex items-center gap-2 text-slate-200 transition hover:text-amber-300 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.45)]">
                    <span>📞</span>
                    <span>+91 1234567891</span>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">Quick Links</h4>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <a href="#rooms" className="text-slate-200 transition hover:text-amber-300 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.45)]">Rooms</a>
                  <Link to="/book" className="text-slate-200 transition hover:text-amber-300 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.45)]">Booking</Link>
                  <a href="#explore" className="text-slate-200 transition hover:text-amber-300 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.45)]">Explore</a>
                  <a href="#contact" className="text-slate-200 transition hover:text-amber-300 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.45)]">Contact</a>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-slate-200">Follow us</p>
                  <div className="mt-3 flex items-center gap-3">
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg transition hover:border-amber-300 hover:text-amber-300 hover:shadow-[0_0_12px_rgba(251,191,36,0.45)]">📸</a>
                    <a href="https://wa.me/911234567891" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg transition hover:border-emerald-300 hover:text-emerald-300 hover:shadow-[0_0_12px_rgba(110,231,183,0.45)]">💬</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/15 pt-6 text-center text-sm text-slate-300">
              <p>© 2026 Wood Stone Corbett. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
