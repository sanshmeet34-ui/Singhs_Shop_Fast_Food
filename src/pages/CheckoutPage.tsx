import { FormEvent, useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';

export default function CheckoutPage() {
  const { items, subtotal, deliveryCharge, total, clearCart } = useCart();
  const { profile, user } = useAuth();
  const { navigate } = useRouter();
  const [name, setName] = useState(profile?.name ?? '');
  const [mobile, setMobile] = useState(profile?.phone ?? '');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [payment, setPayment] = useState('Cash on Delivery');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (items.length === 0) {
      navigate('/menu');
      return;
    }
    setPlacing(true);
    try {
      const orderNumber = `SS${Date.now().toString().slice(-8)}`;
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          total: subtotal,
          delivery_charge: deliveryCharge,
          grand_total: total,
          customer_name: name,
          mobile_number: mobile,
          delivery_address: address,
          landmark,
          payment_method: payment,
          estimated_delivery: '30-45 minutes',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((i) => ({
        order_id: order.id,
        menu_item_id: i.menu_item_id,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
        customizations: i.customizations,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      navigate(`/confirmation/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <button onClick={() => navigate('/menu')} className="text-red-600 font-semibold hover:text-red-700">
          Browse menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-gray-500 hover:text-red-600 mb-6 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to cart
      </button>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Checkout</h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Delivery Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Customer Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address</label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House number, street, city, postcode"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition resize-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Landmark (optional)</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near the park"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Payment Method</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {['Cash on Delivery', 'Online Payment'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPayment(m)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                    payment === m ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payment === m ? 'border-red-600' : 'border-gray-300'}`}>
                    {payment === m && <span className="w-2.5 h-2.5 rounded-full bg-red-600" />}
                  </span>
                  <span className="font-medium text-gray-800 text-sm">{m}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map((i) => (
                <div key={i.id} className="flex items-center gap-3 text-sm">
                  <img src={i.image} alt={i.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{i.name}</p>
                    <p className="text-gray-500">x{i.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-700">${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span><span>{deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-extrabold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={placing}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              {placing ? 'Placing order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
