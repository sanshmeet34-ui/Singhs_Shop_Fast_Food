import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/lib/router';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import MenuPage from '@/pages/MenuPage';
import FoodDetailPage from '@/pages/FoodDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ConfirmationPage from '@/pages/ConfirmationPage';
import OffersPage from '@/pages/OffersPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import OrdersPage from '@/pages/OrdersPage';
import ProfilePage from '@/pages/ProfilePage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function Routes() {
  const { path, navigate } = useRouter();
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  const protectedRoutes = ['/checkout', '/orders', '/profile', '/cart'];
  if (protectedRoutes.some((p) => path.startsWith(p)) && !session) {
    navigate('/');
    return null;
  }

  let page;
  if (path === '/' || path === '/home') page = <HomePage />;
  else if (path === '/menu') page = <MenuPage />;
  else if (path.startsWith('/food/')) page = <FoodDetailPage id={path.split('/food/')[1]} />;
  else if (path === '/cart') page = <CartPage />;
  else if (path === '/checkout') page = <CheckoutPage />;
  else if (path.startsWith('/confirmation/')) page = <ConfirmationPage id={path.split('/confirmation/')[1]} />;
  else if (path === '/offers') page = <OffersPage />;
  else if (path === '/about') page = <AboutPage />;
  else if (path === '/contact') page = <ContactPage />;
  else if (path === '/orders') page = <OrdersPage />;
  else if (path === '/profile') page = <ProfilePage />;
  else page = <HomePage />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{page}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return <Routes />;
}
