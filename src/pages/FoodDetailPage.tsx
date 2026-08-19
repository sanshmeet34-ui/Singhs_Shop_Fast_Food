import { useEffect, useState } from 'react';
import { Star, Flame, Minus, Plus, ShoppingCart, ArrowLeft, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { MenuItem, Customization } from '@/types';
import { useCart } from '@/context/CartContext';
import { useRouter } from '@/lib/router';

export default function FoodDetailPage({ id }: { id: string }) {
  const { addToCart } = useCart();
  const { navigate } = useRouter();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<Customization[]>([]);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setItem(data as MenuItem);
        setLoading(false);
      });
  }, [id]);

  const toggleCustomization = (c: Customization) => {
    setSelected((prev) =>
      prev.find((p) => p.name === c.name)
        ? prev.filter((p) => p.name !== c.name)
        : [...prev, c]
    );
  };

  const customizationPrice = selected.reduce((sum, c) => sum + c.price, 0);
  const unitPrice = (item?.price ?? 0) + customizationPrice;
  const total = unitPrice * quantity;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-gray-500 text-lg mb-4">This item could not be found.</p>
        <button onClick={() => navigate('/menu')} className="text-red-600 font-semibold hover:text-red-700">
          Back to menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate('/menu')} className="flex items-center gap-2 text-gray-500 hover:text-red-600 mb-6 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to menu
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-3xl overflow-hidden shadow-lg bg-gray-100">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover aspect-square" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">{item.category}</span>
            {item.spice_level !== 'Mild' && (
              <span className="flex items-center gap-1 text-sm font-medium text-red-600">
                <Flame className="w-4 h-4" /> {item.spice_level}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{item.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-lg">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-amber-700">{item.rating}</span>
              <span className="text-amber-600 text-sm">/ 5</span>
            </div>
            <span className="text-2xl font-extrabold text-gray-900">${item.price.toFixed(2)}</span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{item.taste}</p>

          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-1.5">Ingredients</h3>
              <p className="text-sm text-gray-600">{item.ingredients}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Spice Level</h3>
                <p className="text-sm text-gray-600">{item.spice_level}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Portion</h3>
                <p className="text-sm text-gray-600">{item.portion}</p>
              </div>
            </div>
          </div>

          {item.customizations && item.customizations.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Customise your order</h3>
              <div className="space-y-2">
                {item.customizations.map((c: Customization) => {
                  const checked = !!selected.find((p) => p.name === c.name);
                  return (
                    <button
                      key={c.name}
                      onClick={() => toggleCustomization(c)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${
                        checked ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${checked ? 'bg-red-600 border-red-600' : 'border-gray-300'}`}>
                          {checked && <Check className="w-3 h-3 text-white" />}
                        </span>
                        <span className="font-medium text-gray-800 text-sm">{c.name}</span>
                      </span>
                      <span className="text-sm font-semibold text-gray-600">+${c.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xl font-extrabold text-gray-900">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => {
              addToCart(item, quantity, selected);
              navigate('/cart');
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            <ShoppingCart className="w-5 h-5" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
