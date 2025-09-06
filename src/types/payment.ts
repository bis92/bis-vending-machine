export const PaymentMode = {
  Idle: 'idle',
  Payment: 'payment',
  Cash: 'cash',
  Card: 'card',
  Dispense: 'dispense',
} as const;
export type PaymentMode = (typeof PaymentMode)[keyof typeof PaymentMode];
