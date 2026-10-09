/**
 * Geometria do carrossel. A posição e a escala de cada card derivam da distância
 * contínua até `progress`, mantendo os cards adjacentes durante toda a animação.
 */

export type CarouselMode = 'mobile' | 'tablet' | 'desktop'

export interface CarouselDims {
  w: number
  h: number
  aw: number
  ah: number
  s: number
  metaH: number
  top0: number
  mode: CarouselMode
}

/** Largura / altura dos cards. */
export const CARD_RATIO = 0.8
/** Alinhamento vertical dos cards inativos em relação ao ativo (0 = topo, 1 = base). */
const INACTIVE_DROP = 0.8
const META_GAP = 8

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function computeDims(w: number, h: number): CarouselDims {
  const mode: CarouselMode = w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'
  // Espelha os tamanhos fluidos de text-h3 e text-body-l definidos em index.css.
  const h3 = clamp(17.03 + 0.00762 * w, 20, 28)
  const bodyL = clamp(16.51 + 0.00381 * w, 18, 22)
  const metaH = (mode === 'mobile' ? bodyL * 1.35 : h3 * 1.2) + META_GAP + 4
  const s = mode === 'mobile' ? 0.42 : mode === 'tablet' ? 0.47 : 0.496
  const maxW = w * (mode === 'mobile' ? 0.68 : mode === 'tablet' ? 0.5 : 0.275)

  let ah = Math.max(140, h - metaH)
  let aw = ah * CARD_RATIO
  if (aw > maxW) {
    aw = maxW
    ah = aw / CARD_RATIO
  }
  const top0 = Math.max(0, (h - ah - metaH) / 2)
  return { w, h, aw, ah, s, metaH, top0, mode }
}

export const sameDims = (a: CarouselDims | null, b: CarouselDims) =>
  !!a && Math.abs(a.w - b.w) < 0.5 && Math.abs(a.h - b.h) < 0.5

export const stepPx = (D: CarouselDims) => D.aw / 2 + (D.aw * D.s) / 2

export const mod = (a: number, n: number) => ((a % n) + n) % n

/** Valor equivalente a `a` no intervalo [-n/2, n/2). */
export const wrapDelta = (a: number, n: number) => mod(a + n / 2, n) - n / 2

/** Quantidade mínima de slots para que a troca de posição ocorra fora da área visível. */
const MIN_SLOTS = 12
export const slotCount = (projects: number) => projects * Math.max(1, Math.ceil(MIN_SLOTS / projects))

/** `d`: distância em cards até o centro (0 = ativo, negativo = à esquerda). */
export function cardGeometry(d: number, D: CarouselDims) {
  const ad = Math.abs(d)
  const sign = Math.sign(d)
  const near = Math.min(ad, 1)
  const scale = 1 - (1 - D.s) * near
  const iw = D.aw * D.s
  const half = stepPx(D)
  const cx = ad <= 1 ? sign * ad * half : sign * (half + (ad - 1) * iw)
  const width = D.aw * scale
  const height = D.ah * scale
  const left = D.w / 2 + cx - width / 2
  const top = D.top0 + INACTIVE_DROP * D.ah * (1 - scale)
  return { ad, near, scale, width, height, left, top, metaTop: top + height + META_GAP }
}

export const activeRect = (D: CarouselDims) => ({
  left: D.w / 2 - D.aw / 2,
  top: D.top0,
  width: D.aw,
  height: D.ah,
})

/** Intensidade do escurecimento dos cards inativos (0–1), crescente com a distância. */
export const dimAmount = (ad: number) => Math.min(1, Math.min(ad, 1) * 0.6 + Math.max(0, Math.min(ad, 3) - 1) * 0.2)
