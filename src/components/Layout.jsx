import { NavLink, Outlet } from 'react-router-dom'
import { ShoppingCart, Heart, PackageCheck, ShieldCheck } from 'lucide-react'

const navItems = [
  { label: 'Produk', to: '/' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Cart', to: '/cart' },
  { label: 'Checkout', to: '/checkout' },
  { label: 'Orders', to: '/orders' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Admin', to: '/admin' },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
              Madura Mart
            </p>
            <h1 className="text-xl font-black">Storefront</h1>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
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
              <Heart className="h-4 w-4 text-red-500" />
              Wishlist
            </div>
            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1.5 text-sm font-medium">
              <ShoppingCart className="h-4 w-4 text-emerald-600" />
              Cart
            </div>
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
