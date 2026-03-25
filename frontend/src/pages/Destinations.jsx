import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import api from '../lib/api';
import Card from '../components/Card';

export default function Destinations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = ['all', 'beach', 'fort', 'waterfall', 'temple', 'nature'];

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    api.get(`/destinations?${params}`).then(res => {
      setItems(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Header */}
      <div className="gradient-ocean py-16 px-4 mb-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Beaches & Destinations
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Explore the stunning coastline and incredible locations that make Goa unforgettable
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destinations..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === 'all' ? '' : cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                  (cat === 'all' && !category) || category === cat
                    ? 'bg-ocean-500 text-white shadow-md shadow-ocean-500/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(null).map((_, i) => (
              <div key={i} className="rounded-2xl h-72 animate-shimmer" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🏖️</span>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No destinations found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} item={item} type="destination" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
