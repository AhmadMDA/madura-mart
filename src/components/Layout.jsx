import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, PackageCheck, ShieldCheck, Sparkles, Bot, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { signOut } from '../lib/auth'

const navItems = [
  { label: 'Produk', to: '/' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Cart', to: '/cart' },
  { label: 'Checkout', to: '/checkout' },
  { label: 'Orders', to: '/orders' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'AI Recommend', to: '/ai-recommend' },
  { label: 'AI Assistant', to: '/ai-assistant' },
  { label: 'Admin', to: '/admin' },
]

export default function Layout() {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, profile } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
              Madura Mart
            </p>
            <h1 className="text-xl font-black">Storefront</h1>
          </div>

          <nav className="hidden flex-wrap items-center gap-2 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    isActive ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-slate-600">
            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1.5 text-sm font-medium">
              <User className="h-4 w-4 text-slate-700" />
              <span className="hidden sm:inline">{isAuthenticated ? (isAdmin ? 'Admin' : profile?.full_name || 'Customer') : 'Guest'}</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1.5 text-sm font-medium">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="hidden sm:inline">Wishlist</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1.5 text-sm font-medium">
              <ShoppingCart className="h-4 w-4 text-emerald-600" />
              <span className="hidden sm:inline">Cart</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1.5 text-sm font-medium text-emerald-700">
              <Sparkles className="h-4 w-4" />
              <Bot className="h-4 w-4" />
            </div>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-emerald-600" />
            <span>Order tracking ready</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Secure checkout flow</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
