import { useEffect, useState, FormEvent } from 'react';
import { User, Mail, Phone, MapPin, Plus, Trash2, Package, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Address, Order } from '@/types';
import { useRouter } from '@/lib/router';

export default function ProfilePage() {
  const { profile, user, updateProfile, signOut } = useAuth();
  const { navigate } = useRouter();
  const [name, setName] = useState(profile?.name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newAddr, setNewAddr] = useState('');
  const [newLabel, setNewLabel] = useState('Home');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: a } = await supabase.from('addresses').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setAddresses((a as Address[]) ?? []);
      const { data: o } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);
      setOrders((o as Order[]) ?? []);
    })();
  }, [user]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const addAddress = async () => {
    if (!user || !newAddr) return;
    const { data } = await supabase
      .from('addresses')
      .insert({ user_id: user.id, label: newLabel, full_address: newAddr })
      .select()
      .single();
    if (data) setAddresses((prev) => [data as Address, ...prev]);
    setNewAddr('');
    setNewLabel('Home');
  };

  const removeAddress = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">My Profile</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Account details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Account Details</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input value={user?.email ?? ''} disabled className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition" />
              </div>
            </div>
            {saved && <p className="text-sm text-green-600">Profile updated successfully!</p>}
            <button type="submit" disabled={saving} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Saved addresses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Saved Addresses</h2>
          <div className="space-y-3 mb-4">
            {addresses.length === 0 ? (
              <p className="text-sm text-gray-500">No saved addresses yet.</p>
            ) : (
              addresses.map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                  <MapPin className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{a.label}</p>
                    <p className="text-sm text-gray-600">{a.full_address}</p>
                  </div>
                  <button onClick={() => removeAddress(a.id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="space-y-2 pt-3 border-t border-gray-100">
            <div className="flex gap-2">
              <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Label" className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-red-500" />
              <input value={newAddr} onChange={(e) => setNewAddr(e.target.value)} placeholder="Full address" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-red-500" />
            </div>
            <button onClick={addAddress} className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition-colors text-sm">
              <Plus className="w-4 h-4" /> Add Address
            </button>
          </div>
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <button onClick={() => navigate('/orders')} className="text-sm text-red-600 font-semibold hover:text-red-700">
              View all
            </button>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">#{o.order_number}</p>
                      <p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">${o.grand_total.toFixed(2)}</p>
                    <p className="text-xs text-red-600">{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={signOut}
        className="mt-6 flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </div>
  );
}
