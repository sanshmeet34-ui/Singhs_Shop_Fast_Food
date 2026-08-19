import { useState } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, ShoppingCart, User, LogOut, Package, Home, Tag, Info, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from '@/lib/router';

export default function Navbar() {
  const { profile, signOut } = useAuth();
  const { itemCount } = useCart();
  const { path, navigate } = useRouter();
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Menu', path: '/menu', icon: MenuIcon },
    { label: 'Offers', path: '/offers', icon: Tag },
    { label: 'About Us', path: '/about', icon: Info },
    { label: 'Contact', path: '/contact', icon: Phone },
    { label: 'My Orders', path: '/orders', icon: Package },
  ];

  const go = (p: string) => {
    navigate(p);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => go('/home')} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-md">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">
              Singhs<span className="text-red-600"> Shop</span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => {
              const active = path === l.path;
              return (
                <button
                  key={l.path}
                  onClick={() => go(l.path)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'text-red-600 bg-red-50' : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  }`}
                >
                  {l.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => go('/cart')}
              className="relative p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => go('/profile')}
              className="hidden sm:flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium max-w-24 truncate">
                {profile?.name || 'Profile'}
              </span>
            </button>
            <button
              onClick={signOut}
              className="hidden sm:flex p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {links.map((l) => {
              const Icon = l.icon;
              const active = path === l.path;
              return (
                <button
                  key={l.path}
                  onClick={() => go(l.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'text-red-600 bg-red-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {l.label}
                </button>
              );
            })}
            <button
              onClick={() => go('/profile')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <User className="w-4 h-4" /> Profile
            </button>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
