import Modal from './common/Modal';

type PaymentModalProps = {
  onCash: () => void;
  onCard: () => void;
  onClose: () => void;
};

export default function PaymentModal({ onCash, onCard, onClose }: PaymentModalProps) {
  return (
    <Modal title="결제 수단 선택" onClose={onClose}>
      <div className="flex justify-around">
        <button className="text-white" onClick={onCash}>
          현금 결제
        </button>
        <button className="text-white" onClick={onCard}>
          카드 결제
        </button>
      </div>
    </Modal>
  );
}
