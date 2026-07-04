export const STREAM_PROVIDER_CONFIGURED = true

export async function getStreamsForSession(sessionId, raceName) {
  try {
    const res = await fetch('https://streamed.pk/api/matches/motor-sports')
    if (!res.ok) return []
    const matches = await res.json()

    const isF1 = (m) => /grand prix|formula 1/i.test(m.title)
    const f1Matches = matches.filter(isF1)

    const relevant = raceName
      ? f1Matches.filter((m) => {
          const short = raceName.replace(/ Grand Prix/i, '').trim().toLowerCase()
          return m.title.toLowerCase().includes(short)
        })
      : f1Matches

    const promises = relevant.flatMap((match) =>
      (match.sources || []).map(async (src) => {
        try {
          const sr = await fetch(
            `https://streamed.pk/api/stream/${src.source}/${src.id}`
          )
          if (!sr.ok) return []
          const streams = await sr.json()
          const cleanTitle = match.title.replace(/[🏁]/gu, '').trim()
          return streams.map((s) => ({
            id: `${s.source || src.source}-${s.id}-${s.streamNo}`,
            label: `[${src.source}] ${cleanTitle} · ${s.language}${s.hd ? ' HD' : ''}`,
            language: s.language,
            hd: s.hd,
            embedUrl: s.embedUrl,
            source: s.source || src.source,
            viewerCount: s.viewers ?? 0,
            eventTitle: cleanTitle,
            matchDate: match.date,
          }))
        } catch {
          return []
        }
      })
    )

    const results = await Promise.all(promises)
    return results.flat()
  } catch {
    return []
  }
}

const LIVE_CACHE = { ttl: 0, value: null }

export async function isProviderReportingLive() {
  if (Date.now() < LIVE_CACHE.ttl) return LIVE_CACHE.value
  try {
    const res = await fetch('https://streamed.pk/api/matches/live')
    if (!res.ok) return null
    const matches = await res.json()
    const live = matches.some((m) => /grand prix|formula 1/i.test(m.title))
    LIVE_CACHE.value = live
    LIVE_CACHE.ttl = Date.now() + 30_000
    return live
  } catch {
    return null
  }
}
