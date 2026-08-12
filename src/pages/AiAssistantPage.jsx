import { useState } from 'react'
import { askShoppingAssistant } from '../services/ai'

export default function AiAssistantPage() {
  const [message, setMessage] = useState('Saya mencari laptop untuk programming budget 15 juta.')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAsk() {
    setLoading(true)
    try {
      const result = await askShoppingAssistant(message)
      setAnswer(result.answer)
    } catch (error) {
      setAnswer(error.message || 'AI assistant tidak tersedia saat ini.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-black text-slate-900">AI Shopping Assistant</h2>
      <p className="mt-2 text-slate-600">Cari rekomendasi berdasarkan katalog yang tersedia.</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-[120px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500"
          placeholder="Contoh: Saya mencari laptop untuk programming budget 15 juta."
        />

        <button
          type="button"
          onClick={handleAsk}
          disabled={loading}
          className="mt-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-emerald-400"
        >
          {loading ? 'Menganalisa katalog...' : 'Tanya AI'}
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-900 p-5 text-slate-100 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">AI response</p>
        <p className="mt-3 text-base leading-7 text-slate-100">
          {answer || 'Jawaban AI akan muncul di sini berdasarkan produk yang tersedia di katalog.'}
        </p>
      </div>
    </div>
  )
}
