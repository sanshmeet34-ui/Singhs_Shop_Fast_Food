import { ShoppingBag, Heart, ShieldCheck, Truck, UtensilsCrossed } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">About Singhs Shop</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          We are passionate about serving fresh, tasty and hygienically prepared fast food, made with quality ingredients and delivered fast.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        {[
          { icon: Heart, title: 'Made with Love', desc: 'Every dish is prepared fresh by our chefs who care about flavour as much as you do.' },
          { icon: ShieldCheck, title: 'Quality & Hygiene', desc: 'We use only quality ingredients and maintain the highest hygiene standards in our kitchen.' },
          { icon: Truck, title: 'Fast Delivery', desc: 'Hot food delivered to your door in 30-45 minutes, so you never have to wait long.' },
          { icon: UtensilsCrossed, title: 'Something for Everyone', desc: 'From burgers and pizzas to wraps, desserts and cold drinks — there is a favourite for every craving.' },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4">
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

      <div className="bg-gradient-to-r from-red-600 to-amber-600 rounded-3xl p-8 sm:p-12 text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Our Promise</h2>
        <p className="text-white/90 max-w-2xl mx-auto">
          Fresh Food. Great Taste. Fast Delivery. That is our promise to every customer, every order, every day. Thank you for choosing Singhs Shop.
        </p>
      </div>
    </div>
  );
}
