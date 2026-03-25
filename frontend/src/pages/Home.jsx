import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, ArrowRight, Star, Waves, UtensilsCrossed, Building2 } from 'lucide-react';
import api from '../lib/api';

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/destinations?limit=4').catch(() => ({ data: [] })),
      api.get('/hotels?limit=4').catch(() => ({ data: [] })),
      api.get('/restaurants?limit=4').catch(() => ({ data: [] })),
    ]).then(([d, h, r]) => {
      setDestinations(d.data);
      setHotels(h.data);
      setRestaurants(r.data);
      setLoaded(true);
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80"
            alt="Goa Beach"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-white/90 text-sm">
              <span className="text-lg">🌴</span>
              <span>Your gateway to paradise</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Discover the Magic<br />
              of <span className="text-gradient-sunset bg-gradient-to-r from-sand-400 via-coral-400 to-sunset-400 bg-clip-text text-transparent">Goa</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Explore stunning beaches, hidden restaurants, cozy stays, and local gems — 
              all curated with AI-powered recommendations just for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/destinations"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-ocean-500 text-white font-semibold hover:bg-ocean-400 transition-all hover:scale-105 shadow-lg shadow-ocean-500/30"
              >
                <MapPin size={20} />
                Explore Destinations
              </Link>
              <Link
                to="/ai"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl glass text-white font-semibold hover:bg-white/20 transition-all hover:scale-105"
              >
                <Sparkles size={20} />
                Ask AI Guide
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="relative -mt-16 z-20 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Waves, label: 'Beaches', value: '12+', color: 'ocean' },
            { icon: Building2, label: 'Stays', value: '10+', color: 'palm' },
            { icon: UtensilsCrossed, label: 'Restaurants', value: '10+', color: 'sunset' },
            { icon: Star, label: 'Top Rated', value: '4.5★', color: 'sand' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-lg text-center hover:shadow-xl transition-shadow">
              <stat.icon size={24} className={`mx-auto mb-2 text-${stat.color}-500`} />
              <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Beaches */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-ocean-500 text-sm font-semibold uppercase tracking-wider">Explore</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Stunning Beaches
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg">Sun-kissed sands and crystal-clear waters await you at Goa's most beautiful coastlines.</p>
          </div>
          <Link to="/destinations" className="hidden sm:flex items-center gap-1 text-ocean-500 font-medium hover:gap-2 transition-all">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(loaded ? destinations : Array(4).fill(null)).map((item, i) => (
            item ? (
              <Link key={item.id} to={`/destinations/${item.id}`} className="group block">
                <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-56 overflow-hidden">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.name}</h3>
                      <div className="flex items-center gap-1 text-white/80 text-sm">
                        <MapPin size={12} />{item.location}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs">
                      <Star size={12} className="fill-sand-400 text-sand-400" />{item.rating}
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div key={i} className="rounded-2xl h-56 animate-shimmer" />
            )
          ))}
        </div>
        <Link to="/destinations" className="sm:hidden flex items-center justify-center gap-1 mt-6 text-ocean-500 font-medium">
          View all beaches <ArrowRight size={16} />
        </Link>
      </section>

      {/* Featured Hotels */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-palm-500 text-sm font-semibold uppercase tracking-wider">Stay</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Where to Stay
              </h2>
              <p className="text-gray-500 mt-2 max-w-lg">From luxury resorts to cozy beach huts, find your perfect home in Goa.</p>
            </div>
            <Link to="/hotels" className="hidden sm:flex items-center gap-1 text-palm-500 font-medium hover:gap-2 transition-all">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(loaded ? hotels : Array(4).fill(null)).map((item, i) => (
              item ? (
                <Link key={item.id} to={`/hotels/${item.id}`} className="group block">
                  <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-palm-500/90 text-white text-xs capitalize backdrop-blur-sm">
                        {item.type}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.name}</h3>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                        <MapPin size={12} />{item.location}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-palm-600">₹{item.price_per_night?.toLocaleString()}<span className="text-xs text-gray-400 font-normal">/night</span></span>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-sand-500 text-sand-500" />
                          <span className="text-sm text-gray-600">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div key={i} className="rounded-2xl h-72 animate-shimmer" />
              )
            ))}
          </div>
        </div>
      </section>

      {/* AI CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-ocean rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm mb-4">
                <Sparkles size={16} />
                Powered by Gemini AI
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Get Personalized Recommendations
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Our AI travel assistant knows everything about Goa. Ask about beaches, food, nightlife, hidden gems, and more!
              </p>
              <Link
                to="/ai"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-ocean-700 font-semibold hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
              >
                <Sparkles size={20} />
                Start Chatting
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Taste</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Best Dining Spots
              </h2>
              <p className="text-gray-500 mt-2 max-w-lg">From beachside shacks to fine dining — savor every flavor of Goa.</p>
            </div>
            <Link to="/restaurants" className="hidden sm:flex items-center gap-1 text-coral-500 font-medium hover:gap-2 transition-all">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(loaded ? restaurants : Array(4).fill(null)).map((item, i) => (
              item ? (
                <Link key={item.id} to={`/restaurants/${item.id}`} className="group block">
                  <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.name}</h3>
                      <p className="text-gray-500 text-sm mb-2">{item.cuisine}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-coral-500 text-sm font-medium">{item.vibe}</span>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-sand-500 text-sand-500" />
                          <span className="text-sm text-gray-600">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div key={i} className="rounded-2xl h-72 animate-shimmer" />
              )
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
