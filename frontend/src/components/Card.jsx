import { Link } from 'react-router-dom';
import { Star, Heart, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function Card({ item, type = 'destination', onFavoriteToggle }) {
  const { isAuthenticated } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    try {
      if (isFav) {
        await api.delete(`/favorites/${type}/${item.id}`);
      } else {
        await api.post('/favorites', { item_id: item.id, item_type: type });
      }
      setIsFav(!isFav);
      onFavoriteToggle?.();
    } catch (_) {}
  };

  const detailPath = `/${type}s/${item.id}`;
  
  const priceDisplay = type === 'hotel' 
    ? `₹${item.price_per_night?.toLocaleString()}/night` 
    : type === 'restaurant' 
    ? item.price_range === 'budget' ? '₹' : item.price_range === 'mid' ? '₹₹' : '₹₹₹'
    : null;

  return (
    <Link to={detailPath} className="group block">
      <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-shimmer rounded-t-2xl" />
          )}
          <img
            src={item.image_url}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Favorite button */}
          {isAuthenticated && (
            <button
              onClick={handleFavorite}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all"
            >
              <Heart
                size={18}
                className={isFav ? 'fill-coral-400 text-coral-400' : 'text-white'}
              />
            </button>
          )}
          
          {/* Category badge */}
          {item.category && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-ocean-500/90 text-white text-xs font-medium backdrop-blur-sm">
              {item.category}
            </span>
          )}
          {item.type && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-ocean-500/90 text-white text-xs font-medium capitalize backdrop-blur-sm">
              {item.type}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-gray-900 group-hover:text-ocean-600 transition-colors line-clamp-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {item.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star size={14} className="fill-sand-500 text-sand-500" />
              <span className="text-sm font-medium text-gray-700">{item.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
            <MapPin size={13} />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          
          <p className="text-gray-500 text-sm line-clamp-2 mb-3 leading-relaxed">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              {(item.tags || []).slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-ocean-50 text-ocean-700 text-xs">
                  {tag}
                </span>
              ))}
            </div>
            {priceDisplay && (
              <span className="text-sm font-semibold text-palm-600">
                {priceDisplay}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
