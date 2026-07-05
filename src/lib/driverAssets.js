const F1_CDN = 'https://media.formula1.com/image/upload/c_lfill,w_128/q_auto'

const TEAM_COLORS = {
  'Red Bull Racing': { bg: '#1a1a2e', accent: '#3671c6' },
  'Ferrari': { bg: '#1a0a0a', accent: '#e8002d' },
  'Mercedes': { bg: '#0a1a1a', accent: '#27f4d2' },
  'McLaren': { bg: '#0a0a1a', accent: '#ff8700' },
  'Aston Martin': { bg: '#0a1a0a', accent: '#229971' },
  'Alpine': { bg: '#0a0a1a', accent: '#0090ff' },
  'Williams': { bg: '#0a0a1a', accent: '#005aff' },
  'RB': { bg: '#1a0a1a', accent: '#6692ff' },
  'Haas F1 Team': { bg: '#0a0a0a', accent: '#b6babd' },
  'Audi': { bg: '#0a0a0a', accent: '#800000' },
  'Cadillac': { bg: '#0a0a0a', accent: '#003f72' },
  'Kick Sauber': { bg: '#0a0a0a', accent: '#00e701' },
  'Racing Bulls': { bg: '#1a0a1a', accent: '#6692ff' },
}

const DRIVER_MAP = {
  VER: { team: 'redbullracing', code6: 'maxver01', year: '2026' },
  PER: { team: 'cadillac', code6: 'serper01', year: '2026' },
  HAM: { team: 'ferrari', code6: 'lewham01', year: '2026' },
  LEC: { team: 'ferrari', code6: 'chalec01', year: '2026' },
  NOR: { team: 'mclaren', code6: 'lannor01', year: '2026' },
  PIA: { team: 'mclaren', code6: 'oscpia01', year: '2026' },
  RUS: { team: 'mercedes', code6: 'georus01', year: '2026' },
  ANT: { team: 'mercedes', code6: 'andant01', year: '2026' },
  ALO: { team: 'astonmartin', code6: 'feralo01', year: '2026' },
  STR: { team: 'astonmartin', code6: 'lanstr01', year: '2026' },
  GAS: { team: 'alpine', code6: 'piegas01', year: '2026' },
  OCO: { team: 'haasf1team', code6: 'estoco01', year: '2026' },
  HUL: { team: 'audi', code6: 'nichul01', year: '2026' },
  BOT: { team: 'cadillac', code6: 'valbot01', year: '2026' },
  TSU: { team: 'racingbulls', code6: 'yuitsu01', year: '2025' },
  COL: { team: 'alpine', code6: 'fracol01', year: '2026' },
  BEA: { team: 'haasf1team', code6: 'olibea01', year: '2026' },
  ALB: { team: 'williams', code6: 'alealb01', year: '2026' },
  SAI: { team: 'williams', code6: 'carsai01', year: '2026' },
  HAD: { team: 'redbullracing', code6: 'isahad01', year: '2026' },
  LAW: { team: 'racingbulls', code6: 'lialaw01', year: '2026' },
  LIN: { team: 'racingbulls', code6: 'arvlin01', year: '2026' },
  BOR: { team: 'audi', code6: 'gabbor01', year: '2026' },
}

export function driverImg(code) {
  const m = DRIVER_MAP[code]
  if (!m) return null
  const fallback = `d_common:f1:${m.year}:fallback:driver:${m.year}fallbackdriverright.webp`
  const path = `v1740000001/common/f1/${m.team}/${m.code6}/${m.year}${m.team}${m.code6}right.webp`
  return `${F1_CDN}/${fallback}/${path}`
}

export function constructorColor(constructor) {
  return TEAM_COLORS[constructor] || { bg: '#16181c', accent: '#ffb000' }
}

export function initials(name) {
  if (!name) return '--'
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}
