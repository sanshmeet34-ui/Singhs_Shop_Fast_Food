import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from '@/lib/router';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, deliveryCharge, total, clearCart } = useCart();
  const { navigate } = useRouter();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some delicious items to get started.</p>
        <button onClick={() => navigate('/menu')} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Your Cart</h1>
        <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-600 font-medium">
          Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    {item.customizations.length > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.customizations.map((c) => c.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-600 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-md bg-white shadow-sm flex items-center justify-center hover:bg-gray-50"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-md bg-white shadow-sm flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-extrabold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery charge</span>
                <span>{deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}</span>
              </div>
              {deliveryCharge === 0 && subtotal > 0 && (
                <p className="text-xs text-green-600">Free delivery on orders over $20</p>
              )}
              <div className="border-t border-gray-100 my-3" />
              <div className="flex justify-between font-extrabold text-gray-900 text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
