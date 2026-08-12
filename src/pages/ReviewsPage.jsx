const reviews = [
  {
    id: 1,
    customer: 'Dina',
    product: 'Madura Smart TV 43 inch',
    rating: 5,
    comment: 'Gambar sangat tajam dan pengiriman cepat.',
  },
  {
    id: 2,
    customer: 'Rafi',
    product: 'Madura Laptop Pro 14',
    rating: 4,
    comment: 'Baterai cukup awet untuk kerja harian.',
  },
]

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-3xl font-black text-slate-900">Ulasan Pelanggan</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900">{review.customer}</p>
                <p className="text-sm text-slate-500">{review.product}</p>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-sm font-semibold text-amber-700">
                {'★'.repeat(review.rating)}
              </span>
            </div>
            <p className="mt-4 text-slate-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
