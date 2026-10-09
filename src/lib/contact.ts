export interface ContactPayload {
  name: string
  email: string
  message: string
}

/** Envio simulado. Substituir pela integração de e-mail (ex.: Formspree, Resend). */
export async function sendContactMessage(payload: ContactPayload): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1200))
  if (import.meta.env.DEV) {
    console.info('[contact] mensagem simulada:', payload)
  }
}
