import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import ProductFilters from '../components/ProductFilters'
import { getProductCategories, getProducts } from '../services/products'

export default function ProductCatalog() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('featured')
  const [maxPrice, setMaxPrice] = useState(20000000)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const [catalog, categoryList] = await Promise.all([
          getProducts({ search, category, sort, maxPrice }),
          getProductCategories(),
        ])

        setProducts(catalog)
        setCategories(categoryList)
      } catch (error) {
        console.error(error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [search, category, sort, maxPrice])

  const resultSummary = useMemo(() => {
    if (loading) {
      return 'Memuat produk...'
    }

    if (products.length === 0) {
      return 'Tidak ada produk yang cocok.'
    }

    return `${products.length} produk ditampilkan`
  }, [loading, products.length])

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Katalog Produk
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            Temukan produk terbaik untuk kebutuhan Anda
          </h2>
        </div>
        <div className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
          {resultSummary}
        </div>
      </div>

      <ProductFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        categories={categories}
        sort={sort}
        setSort={setSort}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      {loading ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-3">
              <div className="h-52 rounded-xl bg-slate-200" />
              <div className="mt-4 h-4 w-1/3 rounded bg-slate-200" />
              <div className="mt-3 h-6 w-2/3 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-full rounded bg-slate-200" />
              <div className="mt-3 h-10 w-full rounded-xl bg-slate-200" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="text-lg font-semibold text-slate-700">Belum ada produk yang sesuai pencarian Anda.</p>
          <p className="mt-2 text-sm text-slate-500">Coba ubah kata kunci atau filter kategori.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
