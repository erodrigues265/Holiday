import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart, MapPin, Star, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function Favorites() {
  const { isAuthenticated, refreshUser, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = () => {
    setLoading(true);
    api.get('/favorites').then(res => {
      setItems(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated) fetchFavorites();
  }, [isAuthenticated]);

  const removeFavorite = async (itemType, itemId) => {
    try {
      await api.delete(`/favorites/${itemType}/${itemId}`);
      setItems(items.filter(i => !(i.id === itemId && i.item_type === itemType)));
      await refreshUser();
    } catch (_) {}
  };

  if (authLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const grouped = {
    destination: items.filter(i => i.item_type === 'destination'),
    hotel: items.filter(i => i.item_type === 'hotel'),
    restaurant: items.filter(i => i.item_type === 'restaurant'),
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="gradient-sunset py-16 px-4 mb-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <Heart className="inline mr-2 fill-white" size={36} />
            Saved Places
          </h1>
          <p className="text-white/80 text-lg">Your curated collection of Goa favorites</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-ocean-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">💝</span>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved places yet</h3>
            <p className="text-gray-500 mb-6">Start exploring and save your favorite destinations, hotels, and restaurants!</p>
            <Link to="/destinations" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ocean-500 text-white font-medium hover:bg-ocean-400 transition-all">
              <MapPin size={18} />
              Explore Destinations
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([type, groupItems]) => {
              if (groupItems.length === 0) return null;
              const label = type === 'destination' ? '🏖️ Beaches & Destinations'
                : type === 'hotel' ? '🏨 Hotels & Stays'
                : '🍽️ Restaurants & Spots';
              return (
                <div key={type}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {label}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupItems.map((item) => (
                      <div key={`${type}-${item.id}`} className="relative group">
                        <Link to={`/${type}s/${item.id}`} className="block">
                          <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            <div className="relative h-44 overflow-hidden">
                              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.name}</h3>
                              <div className="flex items-center gap-1 text-gray-500 text-sm">
                                <MapPin size={12} />{item.location}
                                <span className="ml-auto flex items-center gap-1">
                                  <Star size={12} className="fill-sand-500 text-sand-500" />{item.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={() => removeFavorite(type, item.id)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-coral-500 hover:bg-coral-500 hover:text-white transition-all shadow-md opacity-0 group-hover:opacity-100"
                          title="Remove from favorites"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
