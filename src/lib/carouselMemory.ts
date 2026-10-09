/** Último projeto ativo no carrossel, preservado entre navegações. */
let lastIndex: number | null = null

export const carouselMemory = {
  get: () => lastIndex,
  set: (index: number) => {
    lastIndex = index
  },
}
