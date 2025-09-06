import { DENOMINATIONS } from '../constants/payments';
import Modal from './common/Modal';

type CashModalProps = {
  inserted: number;
  price: number;
  handleInsertCash: (amount: number) => void;
  handleCancelCash: () => void;
};

export default function CashModal({
  inserted,
  price,
  handleInsertCash,
  handleCancelCash,
}: CashModalProps) {
  return (
    <Modal title="현금 결제">
      <p className="muted">
        투입 금액: <span className="font-semibold text-gray-900">{inserted}원</span>
        <br />
        상품 가격: <span className="font-semibold text-gray-900">{price}원</span>
      </p>
      <div className="grid grid-cols-3 gap-2">
        {DENOMINATIONS.map((d) => (
          <button key={d} onClick={() => handleInsertCash(d)} className="btn btn-ghost">
            {d}원
          </button>
        ))}
      </div>

      <button onClick={handleCancelCash} className="btn btn-ghost">
        취소
      </button>
    </Modal>
  );
}
