import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Heart, Clock, Tag, Utensils, Wifi, Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function Detail() {
  const { id } = useParams();
  const location = useLocation();
  const { isAuthenticated, user, refreshUser } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  // Determine type from URL path
  const pathType = location.pathname.includes('/destinations') ? 'destination'
    : location.pathname.includes('/hotels') ? 'hotel'
    : 'restaurant';

  const apiPath = pathType === 'destination' ? 'destinations'
    : pathType === 'hotel' ? 'hotels' : 'restaurants';

  useEffect(() => {
    api.get(`/${apiPath}/${id}`).then(res => {
      setItem(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, apiPath]);

  // Sync favorite status with user data
  useEffect(() => {
    if (user && user.favorites) {
      const isFavorited = user.favorites.some(fav => fav.item_id === id && fav.item_type === pathType);
      setIsFav(isFavorited);
    } else {
      setIsFav(false);
    }
  }, [user, id, pathType]);

  const handleFavorite = async () => {
    if (!isAuthenticated) return;
    try {
      if (isFav) {
        await api.delete(`/favorites/${pathType}/${id}`);
      } else {
        await api.post('/favorites', { item_id: id, item_type: pathType });
      }
      await refreshUser();
    } catch (_) {}
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-ocean-200 border-t-ocean-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl mb-4 block">😕</span>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Not Found</h2>
          <Link to="/" className="text-ocean-500 hover:underline">Go home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero image */}
      <div className="relative h-[50vh] sm:h-[60vh]">
        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Back button */}
        <Link
          to={`/${apiPath}`}
          className="absolute top-6 left-6 p-2.5 rounded-full glass text-white hover:bg-white/30 transition-all"
        >
          <ArrowLeft size={20} />
        </Link>

        {/* Favorite button */}
        {isAuthenticated && (
          <button
            onClick={handleFavorite}
            className="absolute top-6 right-6 p-2.5 rounded-full glass text-white hover:bg-white/30 transition-all"
          >
            <Heart size={20} className={isFav ? 'fill-coral-400 text-coral-400' : ''} />
          </button>
        )}

        {/* Overlay info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-4xl">
            {(item.category || item.type) && (
              <span className="inline-block px-3 py-1 rounded-full bg-ocean-500/90 text-white text-xs font-medium capitalize mb-3 backdrop-blur-sm">
                {item.category || item.type}
              </span>
            )}
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {item.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <span className="flex items-center gap-1">
                <MapPin size={16} /> {item.location}
              </span>
              <span className="flex items-center gap-1">
                <Star size={16} className="fill-sand-400 text-sand-400" /> {item.rating}
              </span>
              {item.price_per_night && (
                <span className="font-semibold text-palm-300">
                  ₹{item.price_per_night.toLocaleString()}/night
                </span>
              )}
              {item.cuisine && (
                <span className="flex items-center gap-1">
                  <Utensils size={16} /> {item.cuisine}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>About</h2>
            <p className="text-gray-600 leading-relaxed mb-8">{item.description}</p>

            {/* Highlights */}
            {item.highlights && item.highlights.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-ocean-50 text-ocean-800 text-sm">
                      <Star size={14} className="text-ocean-500 shrink-0" />
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specialties */}
            {item.specialties && item.specialties.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Specialties</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {item.specialties.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-coral-50 text-coral-800 text-sm">
                      <Utensils size={14} className="text-coral-500 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {item.amenities && item.amenities.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {item.amenities.map((a, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-palm-50 text-palm-700 text-sm border border-palm-200">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag size={16} /> Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-ocean-50 text-ocean-700 text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Best time */}
            {item.best_time && (
              <div className="p-6 rounded-2xl bg-sand-50 border border-sand-200">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Clock size={16} /> Best Time to Visit
                </h4>
                <p className="text-gray-600 text-sm">{item.best_time}</p>
              </div>
            )}

            {/* Vibe */}
            {item.vibe && (
              <div className="p-6 rounded-2xl bg-coral-50 border border-coral-200">
                <h4 className="font-semibold text-gray-900 mb-2">Vibe</h4>
                <p className="text-coral-700 capitalize font-medium">{item.vibe}</p>
              </div>
            )}

            {/* Nearby beach */}
            {item.nearby_beach && (
              <div className="p-6 rounded-2xl bg-ocean-50 border border-ocean-200">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin size={16} /> Nearby Beach
                </h4>
                <p className="text-ocean-700 font-medium">{item.nearby_beach}</p>
              </div>
            )}

            {/* Price info for hotels */}
            {item.price_per_night && (
              <div className="p-6 rounded-2xl gradient-ocean text-white">
                <h4 className="font-semibold mb-1">Starting from</h4>
                <p className="text-3xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  ₹{item.price_per_night.toLocaleString()}
                </p>
                <p className="text-white/70 text-sm">per night</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
