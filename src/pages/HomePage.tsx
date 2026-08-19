import { useEffect, useState } from 'react';
import { ShoppingBag, ArrowRight, Tag, Truck, Clock, ShieldCheck } from 'lucide-react';
import { useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { MenuItem } from '@/types';
import FoodCard from '@/components/FoodCard';

export default function HomePage() {
  const { navigate } = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    supabase
      .from('menu_items')
      .select('*')
      .order('rating', { ascending: false })
      .limit(8)
      .then(({ data }) => setItems((data as MenuItem[]) ?? []));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/35896422/pexels-photo-35896422.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Fast food feast"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-red-600/90 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              <ShoppingBag className="w-4 h-4" /> Now delivering in your area
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-4">
              Delicious Food,<br />Made Fresh for You!
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-lg">
              From juicy burgers to wood-fired pizzas, every order is prepared fresh and delivered hot to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/menu')}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg"
              >
                Explore Menu <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/offers')}
                className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/30 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
              >
                <Tag className="w-4 h-4" /> View Offers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Truck, title: 'Fast Delivery', desc: 'Hot food at your door in 30-45 minutes.' },
            { icon: ShieldCheck, title: 'Quality Ingredients', desc: 'Fresh, hygienic and prepared with care.' },
            { icon: Clock, title: 'Open Daily', desc: '10am to 11pm, every day of the week.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <f.icon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Popular Right Now</h2>
            <p className="text-gray-500 mt-1">Top-rated picks from our customers</p>
          </div>
          <button onClick={() => navigate('/menu')} className="text-red-600 font-semibold hover:text-red-700 text-sm flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 to-amber-600 px-6 sm:px-12 py-12">
          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl font-extrabold text-white mb-3">Get 20% off your first order</h2>
            <p className="text-white/90 mb-6">Create an account today and your first order is on us — no minimum spend.</p>
            <button
              onClick={() => navigate('/offers')}
              className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-amber-50 transition-colors"
            >
              Claim Offer
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute right-16 top-8 w-32 h-32 rounded-full bg-white/10" />
        </div>
      </section>
    </div>
  );
}
