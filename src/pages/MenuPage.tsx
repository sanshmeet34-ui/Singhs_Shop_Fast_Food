import { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { MenuItem, CATEGORIES } from '@/types';
import FoodCard from '@/components/FoodCard';

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
    supabase
      .from('menu_items')
      .select('*')
      .order('rating', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setItems((data as MenuItem[]) ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchCat = active === 'All' || i.category === active;
      const matchQuery = !query || i.name.toLowerCase().includes(query.toLowerCase()) || i.description.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [items, active, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Our Menu</h1>
        <p className="text-gray-500">Browse all your favourites, freshly made to order.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for burgers, pizza, wraps..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-1 px-1">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              active === cat
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No items found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
