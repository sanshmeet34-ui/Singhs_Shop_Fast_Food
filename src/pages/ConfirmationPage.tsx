import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, MapPin, Receipt, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Order, OrderItem } from '@/types';
import { useRouter } from '@/lib/router';
import { ORDER_STATUSES } from '@/types';

export default function ConfirmationPage({ id }: { id: string }) {
  const { navigate } = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: o } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
      if (o) {
        setOrder(o as Order);
        const { data: items } = await supabase.from('order_items').select('*').eq('order_id', id);
        setOrderItems((items as OrderItem[]) ?? []);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-gray-500 mb-4">Order not found.</p>
        <button onClick={() => navigate('/home')} className="text-red-600 font-semibold hover:text-red-700">
          Back home
        </button>
      </div>
    );
  }

  const currentStep = ORDER_STATUSES.indexOf(order.status as typeof ORDER_STATUSES[number]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500">Your order is now being prepared. Sit tight!</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-red-600" />
            <span className="font-bold text-gray-900">Order #{order.order_number}</span>
          </div>
          <span className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          {orderItems.map((i) => (
            <div key={i.id} className="flex items-center gap-3 text-sm">
              <img src={i.image} alt={i.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{i.name}</p>
                <p className="text-gray-500">x{i.quantity}</p>
              </div>
              <span className="font-semibold text-gray-700">${(i.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span><span>${order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery</span><span>{order.delivery_charge === 0 ? 'FREE' : `$${order.delivery_charge.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-extrabold text-gray-900 text-base pt-2 border-t border-gray-100">
            <span>Total</span><span>${order.grand_total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-2 mb-4">
          <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-gray-900">Delivery Address</h3>
            <p className="text-sm text-gray-600">{order.delivery_address}</p>
            {order.landmark && <p className="text-sm text-gray-500">Landmark: {order.landmark}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-red-600" />
          <span className="text-sm text-gray-600">Estimated delivery: {order.estimated_delivery}</span>
        </div>
      </div>

      {/* Tracking */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-red-600" />
          <h3 className="font-bold text-gray-900">Order Tracking</h3>
        </div>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-green-500 transition-all duration-500"
            style={{ width: `${(currentStep / (ORDER_STATUSES.length - 1)) * 100}%` }}
          />
          {ORDER_STATUSES.map((status, idx) => {
            const done = idx <= currentStep;
            return (
              <div key={status} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {idx + 1}
                </div>
                <span className={`text-xs font-medium text-center w-16 ${done ? 'text-gray-900' : 'text-gray-400'}`}>{status}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={() => navigate('/orders')} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors">
          View My Orders
        </button>
        <button onClick={() => navigate('/home')} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-colors">
          Back Home
        </button>
      </div>
    </div>
  );
}
