export const DENOMINATIONS = [10000, 5000, 1000, 500, 100] as const;
export const TEST_CARDS = {
  APPROVE: { number: '4111111111111111', cvv: '123' },
  DECLINE: { number: '4000000000000002', cvv: '000' },
} as const;

export const ERROR_MSG = {
  fillAll: '카드 정보를 모두 입력하세요.',
  cvvMismatch: 'CVV가 카드 정보와 일치하지 않습니다.',
  declined: '승인 거절: 카드 정보를 확인하시고 다시 시도하세요.',
} as const;
