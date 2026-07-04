export function splitCountdown(targetDate) {
  const diff = Math.max(0, targetDate.getTime() - Date.now())
  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isPast: diff <= 0,
  }
}

const dtf = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
})

export function formatSessionTime(date) {
  return dtf.format(date)
}

export function pad2(n) {
  return String(n).padStart(2, '0')
}
