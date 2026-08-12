export async function getRecommendationSummary() {
  const response = await fetch('/api/ai/recommend')

  if (!response.ok) {
    throw new Error('Unable to load recommendations')
  }

  return response.json()
}

export async function askShoppingAssistant(message) {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    throw new Error('Unable to get AI shopping response')
  }

  return response.json()
}
