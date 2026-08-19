import { useEffect, useState } from 'react';
import { Tag, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Offer } from '@/types';
import { useRouter } from '@/lib/router';

export default function OffersPage() {
  const { navigate } = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    supabase.from('offers').select('*').then(({ data }) => setOffers((data as Offer[]) ?? []));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-6 h-6 text-red-600" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Offers & Deals</h1>
        </div>
        <p className="text-gray-500">Save big on your favourite meals with our latest promotions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div key={offer.id} className="group relative overflow-hidden rounded-3xl shadow-sm border border-gray-100 bg-white">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              {offer.badge}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-extrabold text-gray-900 mb-1">{offer.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{offer.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold text-red-600">{offer.discount}</span>
                <button
                  onClick={() => navigate('/menu')}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  Order Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
