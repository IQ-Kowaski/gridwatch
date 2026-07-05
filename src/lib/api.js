// ---------------------------------------------------------------------------
// Grid Watch data layer
//
// Standings + race calendar come from Jolpica (api.jolpi.ca), the open,
// community-run, Ergast-compatible F1 data API. This is the authoritative
// source for schedule dates, rounds, and championship points. "Live" status
// is derived from these session times — see src/lib/streamProvider.js for
// the (currently stubbed) playback layer.
// ---------------------------------------------------------------------------

const JOLPICA = 'https://api.jolpi.ca/ergast/f1'

async function getJSON(url, { timeout = 8000 } = {}) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeout)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    return await res.json()
  } finally {
    clearTimeout(t)
  }
}

/** Current season race calendar. */
export async function fetchSchedule() {
  const data = await getJSON(`${JOLPICA}/current.json`)
  const races = data?.MRData?.RaceTable?.Races ?? []
  return races.map((r) => ({
    round: Number(r.round),
    name: r.raceName,
    circuit: r.Circuit?.circuitName,
    locality: r.Circuit?.Location?.locality,
    country: r.Circuit?.Location?.country,
    date: r.date,
    time: r.time ?? null,
    sessions: extractSessions(r),
  }))
}

function extractSessions(r) {
  const combine = (d, t) => (d ? new Date(`${d}T${t ?? '00:00:00Z'}`) : null)
  const list = [
    ['FP1', r.FirstPractice],
    ['FP2', r.SecondPractice],
    ['FP3', r.ThirdPractice],
    ['Sprint Qualifying', r.SprintQualifying],
    ['Sprint', r.Sprint],
    ['Qualifying', r.Qualifying],
    ['Race', { date: r.date, time: r.time }],
  ]
  return list
    .filter(([, v]) => v?.date)
    .map(([label, v]) => ({ label, at: combine(v.date, v.time) }))
}

/** Current driver championship standings. */
export async function fetchDriverStandings() {
  const data = await getJSON(`${JOLPICA}/current/driverstandings.json`)
  const list = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? []
  return list.map((d) => ({
    position: Number(d.position),
    points: Number(d.points),
    wins: Number(d.wins),
    driverId: d.Driver?.driverId,
    code: d.Driver?.code || d.Driver?.familyName?.slice(0, 3).toUpperCase(),
    name: `${d.Driver?.givenName} ${d.Driver?.familyName}`,
    nationality: d.Driver?.nationality,
    constructor: d.Constructors?.[0]?.name,
  }))
}

/** Current constructor championship standings. */
export async function fetchConstructorStandings() {
  const data = await getJSON(`${JOLPICA}/current/constructorstandings.json`)
  const list = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? []
  return list.map((c) => ({
    position: Number(c.position),
    points: Number(c.points),
    wins: Number(c.wins),
    constructorId: c.Constructor?.constructorId,
    name: c.Constructor?.name,
    nationality: c.Constructor?.nationality,
  }))
}

/** Race results for a given round. */
export async function fetchRaceResults(round) {
  const data = await getJSON(`${JOLPICA}/current/${round}/results.json`)
  const results = data?.MRData?.RaceTable?.Races?.[0]?.Results ?? []
  return results.map((r) => ({
    position: Number(r.position),
    driverId: r.Driver?.driverId,
    code: r.Driver?.code || r.Driver?.familyName?.slice(0, 3).toUpperCase(),
    name: `${r.Driver?.givenName} ${r.Driver?.familyName}`,
    constructor: r.Constructors?.[0]?.name,
    constructorId: r.Constructors?.[0]?.constructorId,
    laps: Number(r.laps),
    time: r.Time?.time || r.status,
    status: r.status,
    points: Number(r.points),
    grid: Number(r.grid),
  }))
}

/** Qualifying results for a given round. */
export async function fetchQualifyingResults(round) {
  const data = await getJSON(`${JOLPICA}/current/${round}/qualifying.json`)
  const results = data?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults ?? []
  return results.map((r) => ({
    position: Number(r.position),
    driverId: r.Driver?.driverId,
    code: r.Driver?.code || r.Driver?.familyName?.slice(0, 3).toUpperCase(),
    name: `${r.Driver?.givenName} ${r.Driver?.familyName}`,
    constructor: r.Constructors?.[0]?.name,
    constructorId: r.Constructors?.[0]?.constructorId,
    q1: r.Q1,
    q2: r.Q2,
    q3: r.Q3,
  }))
}

/** Sprint results for a given round. */
export async function fetchSprintResults(round) {
  const data = await getJSON(`${JOLPICA}/current/${round}/sprint.json`)
  const results = data?.MRData?.RaceTable?.Races?.[0]?.SprintResults ?? []
  return results.map((r) => ({
    position: Number(r.position),
    driverId: r.Driver?.driverId,
    code: r.Driver?.code || r.Driver?.familyName?.slice(0, 3).toUpperCase(),
    name: `${r.Driver?.givenName} ${r.Driver?.familyName}`,
    constructor: r.Constructors?.[0]?.name,
    constructorId: r.Constructors?.[0]?.constructorId,
    laps: Number(r.laps),
    time: r.Time?.time || r.status,
    status: r.status,
    points: Number(r.points),
    grid: Number(r.grid),
  }))
}

/**
 * Is any session currently live, based on schedule times alone (race weekend
 * sessions are treated as "live" from their start time for a 3h window,
 * which comfortably covers races, qualifying, and practice sessions).
 */
export function deriveLiveSession(schedule) {
  const now = Date.now()
  const all = schedule.flatMap((r) => r.sessions.map((s) => ({ ...s, race: r })))
  return (
    all.find((s) => s.at && now - s.at.getTime() > -15 * 60_000 && now - s.at.getTime() < 3 * 3600_000) ??
    null
  )
}
