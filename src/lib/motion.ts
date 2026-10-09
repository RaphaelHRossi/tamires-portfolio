export type Bezier = [number, number, number, number]

export const EASE_OUT: Bezier = [0.16, 1, 0.3, 1]
export const EASE_IN_OUT: Bezier = [0.7, 0, 0.2, 1]
export const EASE_IN: Bezier = [0.7, 0, 0.84, 0]

export const CAROUSEL_SPRING = { stiffness: 140, damping: 24, mass: 1 }

/** Duração da transição card ↔ banner, em segundos. */
export const FLIGHT_DURATION = 0.95
