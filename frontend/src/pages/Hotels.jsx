import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../lib/api';
import Card from '../components/Card';

export default function Hotels() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const types = ['all', 'hotel', 'resort', 'airbnb', 'guesthouse'];
  const prices = ['all', 'budget', 'mid', 'luxury'];

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (type && type !== 'all') params.append('type', type);
    if (priceRange && priceRange !== 'all') params.append('price_range', priceRange);
    if (search) params.append('search', search);
    api.get(`/hotels?${params}`).then(res => {
      setItems(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [type, priceRange, search]);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="bg-gradient-to-br from-palm-500 to-ocean-600 py-16 px-4 mb-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Hotels & Stays
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            From luxury resorts to beachside huts — find your perfect base in Goa
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hotels..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-500 self-center mr-1">Type:</span>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setType(t === 'all' ? '' : t)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                  (t === 'all' && !type) || type === t
                    ? 'bg-palm-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-500 self-center mr-1">Price:</span>
            {prices.map((p) => (
              <button
                key={p}
                onClick={() => setPriceRange(p === 'all' ? '' : p)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                  (p === 'all' && !priceRange) || priceRange === p
                    ? 'bg-palm-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(null).map((_, i) => (
              <div key={i} className="rounded-2xl h-72 animate-shimmer" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🏨</span>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No stays found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} item={item} type="hotel" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
