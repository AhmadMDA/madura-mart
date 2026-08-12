import { useEffect, useState } from 'react'
import { getRecommendationSummary } from '../services/ai'

export default function AiRecommendationPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const result = await getRecommendationSummary()
        setItems(result.recommendations || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-black text-slate-900">AI Recommendation</h2>
      <p className="mt-2 text-slate-600">Rekomendasi dibuat dari produk yang tersedia di database katalog.</p>

      {loading ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
              <div className="h-36 rounded-xl bg-slate-200" />
              <div className="mt-4 h-4 w-1/3 rounded bg-slate-200" />
              <div className="mt-3 h-6 w-2/3 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <img src={item.image} alt={item.name} className="h-44 w-full object-cover" />
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{item.category}</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{item.name}</h3>
                <p className="mt-2 text-base font-black text-slate-900">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
