import { useEffect, useRef, useState } from 'react';
import Modal from './common/Modal';
import { simulateCardAuth } from '../service/paymentGateway';

type CardModalProps = {
  handleCardSubmit: () => void;
  handleChangePaymentMethod: () => void;
};

export default function CardModal({ handleCardSubmit, handleChangePaymentMethod }: CardModalProps) {
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(''); // 상단 에러(거절 등)
  const [fieldErrors, setFieldErrors] = useState<{
    number?: string;
    expiry?: string;
    cvv?: string;
  }>({});
  const cardNumberInputRef = useRef<HTMLInputElement>(null);

  const formatCardNumber = (val: string) =>
    val
      .replace(/\D/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1-')
      .slice(0, 19);

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length < 3) return digits;
    return digits.slice(0, 2) + '/' + digits.slice(2);
  };

  const formatCvv = (val: string) => val.replace(/\D/g, '').slice(0, 3);

  const allFilled = number.length === 19 && expiry.length === 5 && cvv.length === 3;

  const handlePay = async () => {
    if (!allFilled) {
      setFormError('카드 정보를 모두 입력하세요.');
      return;
    }
    setLoading(true);
    setFormError('');
    setFieldErrors({});
    const result = await simulateCardAuth({ number, expiry, cvv });
    setLoading(false);

    if (result.status === 'approved') {
      handleCardSubmit();
    } else if (result.status === 'declined') {
      setFormError('승인 거절: 카드 정보를 확인하시고 다시 시도하세요.');
    } else {
      // invalid: 필드별 에러 표시
      setFieldErrors(result.errors);
      setFormError('입력값을 확인해주세요.');
    }
  };

  useEffect(() => {
    if (cardNumberInputRef.current) {
      cardNumberInputRef.current.focus();
    }
  }, []);

  const disabled = loading || !allFilled;

  return (
    <Modal title="카드 결제">
      <div>
        <input
          ref={cardNumberInputRef}
          type="tel"
          inputMode="numeric"
          className="input"
          value={number}
          onChange={(e) => setNumber(formatCardNumber(e.target.value))}
          maxLength={19}
          placeholder="카드번호 (예: 4111-1111-1111-1111)"
          aria-invalid={!!fieldErrors.number}
        />
        {fieldErrors.number && <p className="mt-1 text-xs text-red-600">{fieldErrors.number}</p>}
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="tel"
            inputMode="numeric"
            className="input"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            maxLength={5}
            placeholder="만료일 (MM/YY)"
            aria-invalid={!!fieldErrors.expiry}
          />
          {fieldErrors.expiry && <p className="mt-1 text-xs text-red-600">{fieldErrors.expiry}</p>}
        </div>

        <div className="w-24">
          <input
            type="tel"
            inputMode="numeric"
            className="input"
            value={cvv}
            aria-invalid={!!fieldErrors.cvv}
            onChange={(e) => setCvv(formatCvv(e.target.value))}
            maxLength={3}
            placeholder="CVV"
          />
          {fieldErrors.cvv && <p className="danger mt-1">{fieldErrors.cvv}</p>}
        </div>
      </div>
      {formError && <p className="danger">{formError}</p>}
      <div className="flex gap-2">
        <button disabled={disabled} className="btn btn-primary flex-1" onClick={handlePay}>
          {loading ? '승인 요청 중…' : '결제'}
        </button>
        <button
          disabled={loading}
          className="btn btn-ghost flex-1"
          onClick={handleChangePaymentMethod}
        >
          결제수단 변경
        </button>
      </div>
    </Modal>
  );
}
