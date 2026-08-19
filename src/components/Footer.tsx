import { ShoppingBag, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useRouter } from '@/lib/router';

export default function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Singhs<span className="text-red-500"> Shop</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Fresh Food. Great Taste. Fast Delivery. Your favourite fast-food, delivered hot to your door.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('/home')} className="hover:text-red-400">Home</button></li>
              <li><button onClick={() => navigate('/menu')} className="hover:text-red-400">Menu</button></li>
              <li><button onClick={() => navigate('/offers')} className="hover:text-red-400">Offers</button></li>
              <li><button onClick={() => navigate('/orders')} className="hover:text-red-400">My Orders</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>123 Food Street, London</li>
              <li>+44 20 1234 5678</li>
              <li>hello@singhsshop.com</li>
              <li>Open 10am - 11pm daily</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Singhs Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
