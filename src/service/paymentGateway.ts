import { ERROR_MSG, TEST_CARDS } from '../constants/payments';

export type CardInput = { number: string; expiry: string; cvv: string };

type InvalidResult = {
  status: 'invalid';
  errors: Partial<Record<'number' | 'expiry' | 'cvv', string>>;
};
type ApprovedResult = { status: 'approved' };
type DeclinedResult = { status: 'declined'; reason?: string };
export type AuthResult = InvalidResult | ApprovedResult | DeclinedResult;

const normalizeNumber = (n: string) => n.replace(/\s|-/g, '');

// Luhn (16자리 고정)
function validateCardNumberByluhnCheck(num16: string): boolean {
  if (!/^\d{16}$/.test(num16)) return false;
  let sum = 0;
  for (let i = 0; i < 16; i++) {
    let d = Number(num16[15 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

function validateExpiry(expiry: string): string | undefined {
  const m = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return '형식은 MM/YY 입니다 (예: 09/25).';
  const mm = Number(m[1]);
  const yy = Number(m[2]);
  if (mm < 1 || mm > 12) return '유효한 월(MM: 01~12)이 아닙니다.';
  const now = new Date();
  const year = 2000 + yy;
  const expEnd = new Date(year, mm, 0, 23, 59, 59);
  if (expEnd < now) return '만료된 카드입니다.';
  return undefined;
}

function validateCvv(cvv: string): string | undefined {
  if (!/^\d{3}$/.test(cvv)) return 'CVV는 숫자 3자리여야 합니다.';
  return undefined;
}

export async function simulateCardAuth(card: CardInput): Promise<AuthResult> {
  const number = normalizeNumber(card.number);
  const { expiry, cvv } = card;

  const errors: InvalidResult['errors'] = {};
  if (!/^\d{16}$/.test(number)) errors.number = '카드번호는 숫자 16자리여야 합니다.';
  else if (!validateCardNumberByluhnCheck(number)) errors.number = '유효하지 않은 카드번호입니다.';

  const expErr = validateExpiry(expiry);
  if (expErr) errors.expiry = expErr;

  const cvvErr = validateCvv(cvv);
  if (cvvErr) errors.cvv = cvvErr;

  if (Object.keys(errors).length > 0) {
    return { status: 'invalid', errors };
  }

  const { APPROVE, DECLINE } = TEST_CARDS;

  if (number === APPROVE.number) {
    if (cvv !== APPROVE.cvv) {
      return { status: 'invalid', errors: { cvv: ERROR_MSG.cvvMismatch } };
    }
    // 네트워크 지연 시뮬
    await new Promise((r) => setTimeout(r, 1200));
    return { status: 'approved' };
  }

  if (number === DECLINE.number) {
    if (cvv !== DECLINE.cvv) {
      return { status: 'invalid', errors: { cvv: ERROR_MSG.cvvMismatch } };
    }
    await new Promise((r) => setTimeout(r, 1200));
    return { status: 'declined', reason: 'issuer_declined' };
  }

  await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));
  return Math.random() < 0.8
    ? { status: 'approved' }
    : { status: 'declined', reason: 'random_decline' };
}
