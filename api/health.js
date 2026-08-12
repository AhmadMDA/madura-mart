export default function handler(request, response) {
  response.status(200).json({
    ok: true,
    name: 'madura-mart',
    phase: 'Phase 1',
    message: 'Madura Mart API is healthy.',
    timestamp: new Date().toISOString(),
  })
}
