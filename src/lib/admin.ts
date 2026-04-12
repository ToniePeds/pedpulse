// lib/admin.ts
// Single source of truth for who counts as a PedsPulse admin.
// Add or remove emails here to grant/revoke dashboard access.

export const ADMIN_EMAILS = [
  'mbumarash1@gmail.com',
  'muhunzidavid@gmail.com',
] as const

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase() as (typeof ADMIN_EMAILS)[number])
}
