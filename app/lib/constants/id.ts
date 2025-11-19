export const ACCESS_STATUS = {
  PENDING: 'PENDING',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
} as const;

export const ACCESS_ACTIVITY = {
  SUBMIT: 'SUBMIT',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
} as const;

export const MAINTAIN_ACTIVITY = {
  SUBMIT: 'SUBMIT',
  IN_PRO: 'IN_PRO',
  COMPLETE: 'COMPLETE',
  SUBMIT_FEED: 'SUBMIT_FEED',
} as const;

export const INVOICE_STATUS = {
  UNPAID: "UNPAID",
  PARTIAL: "PARTIAL",
  PAID: "PAID"
} as const;

export const INVOICE_ACTIVITY = {
  UNPAID: "UNPAID",
  PARTIAL: "PARTIAL",
  PAID: "PAID"
} as const;