export const ROLE = {
  REQUESTER: 'REQUESTER',
  APPROVER: 'APPROVER',
  ADMIN: 'ADMIN',
} as const;

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