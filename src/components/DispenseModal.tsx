import { useEffect, useState } from 'react';
import Modal from './common/Modal';

type DispenseModalProps = {
  change?: number;
  isRefund?: boolean;
  productName?: string;
  onComplete: () => void;
};

export default function DispenseModal({
  change,
  isRefund,
  productName,
  onComplete,
}: DispenseModalProps) {
  const [resultMsg, setResultMsg] = useState('');

  useEffect(() => {
    setResultMsg(`결제가 완료되었습니다. ${productName}(이)가 출고 중입니다.`);
    if (productName) {
      setTimeout(() => {
        setResultMsg(`${productName}(이)가 출고 되었습니다.`);
      }, 2000);
    }
  }, [productName]);

  return (
    <Modal title={isRefund ? '환불 안내' : '출고 안내'} role={isRefund ? 'alertdialog' : 'dialog'}>
      {isRefund ? (
        <p className="danger">투입하신 금액 {change ?? 0}원이 반환되었습니다.</p>
      ) : (
        <>
          <p className="success">{resultMsg}</p>
          {typeof change === 'number' && change > 0 && (
            <p className="muted">거스름돈: {change}원</p>
          )}
        </>
      )}
      <div className="flex justify-end">
        <button onClick={onComplete} className="btn btn-primary">
          완료
        </button>
      </div>
    </Modal>
  );
}
