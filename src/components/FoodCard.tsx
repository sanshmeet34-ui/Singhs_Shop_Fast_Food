import { Star, Plus, Flame } from 'lucide-react';
import { MenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { useRouter } from '@/lib/router';

export default function FoodCard({ item }: { item: MenuItem }) {
  const { addToCart } = useCart();
  const { navigate } = useRouter();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <button onClick={() => navigate(`/food/${item.id}`)} className="block w-full text-left overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </button>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 leading-tight">{item.name}</h3>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-semibold text-amber-700">{item.rating}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.description}</p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-extrabold text-gray-900">${item.price.toFixed(2)}</span>
          {item.spice_level !== 'Mild' && (
            <span className="flex items-center gap-1 text-xs font-medium text-red-600">
              <Flame className="w-3 h-3" /> {item.spice_level}
            </span>
          )}
        </div>
        <button
          onClick={() => addToCart(item, 1, [])}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
}
