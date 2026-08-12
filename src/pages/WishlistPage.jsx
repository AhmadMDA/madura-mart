import { HeartOff } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'

export default function WishlistPage() {
  const { wishlistProducts, removeFromWishlist } = useStore()

  if (wishlistProducts.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <HeartOff className="mx-auto h-12 w-12 text-slate-400" />
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Wishlist Anda masih kosong</h2>
          <p className="mt-2 text-slate-600">Tambah produk favorit Anda dari katalog.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-3xl font-black text-slate-900">Wishlist</h2>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {wishlistProducts.map((product) => (
          <div key={product.id} className="space-y-3">
            <ProductCard product={product} />
            <button
              type="button"
              onClick={() => removeFromWishlist(product.id)}
              className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              Hapus dari wishlist
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
