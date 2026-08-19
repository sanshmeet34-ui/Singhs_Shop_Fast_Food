import { useEffect, useState } from 'react';
import { Package, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Order, OrderItem, ORDER_STATUSES } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/lib/router';

export default function OrdersPage() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [itemsByOrder, setItemsByOrder] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: o } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      const orderList = (o as Order[]) ?? [];
      setOrders(orderList);
      if (orderList.length > 0) {
        const { data: items } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', orderList.map((ord) => ord.id));
        const map: Record<string, OrderItem[]> = {};
        (items as OrderItem[] | null)?.forEach((i) => {
          map[i.order_id] = [...(map[i.order_id] ?? []), i];
        });
        setItemsByOrder(map);
      }
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center text-gray-500">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">No orders yet</h1>
        <p className="text-gray-500 mb-6">Your past orders will appear here.</p>
        <button onClick={() => navigate('/menu')} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          Start Ordering
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const step = ORDER_STATUSES.indexOf(order.status as typeof ORDER_STATUSES[number]);
          const items = itemsByOrder[order.id] ?? [];
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-bold text-gray-900">Order #{order.order_number}</span>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">{order.status}</span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {items.map((i) => (
                  <img key={i.id} src={i.image} alt={i.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                ))}
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">{items.length} item(s)</span>
                <span className="font-extrabold text-gray-900">${order.grand_total.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {ORDER_STATUSES.map((s, idx) => (
                  <div key={s} className="flex-1">
                    <div className={`h-1.5 rounded-full ${idx <= step ? 'bg-green-500' : 'bg-gray-200'}`} />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mb-3">Estimated delivery: {order.estimated_delivery}</p>

              <button
                onClick={() => navigate(`/confirmation/${order.id}`)}
                className="flex items-center gap-1 text-red-600 font-semibold text-sm hover:text-red-700"
              >
                View details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
