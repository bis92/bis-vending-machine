import type { ReactNode } from 'react';

type ModalProps = {
  title?: string;
  children: ReactNode;
  role?: 'dialog' | 'alertdialog';
  onClose?: () => void;
};

export default function Modal({ title, children, role = 'dialog', onClose }: ModalProps) {
  return (
    <div className="modal-overlay" role="presentation" aria-hidden={false}>
      <div
        className="modal-panel"
        role={role}
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <h2 id="modal-title" className="mb-4 text-lg text-[#213547] font-semibold">
            {title}
          </h2>
        )}
        <div className="space-y-4">{children}</div>
        {onClose && (
          <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="btn btn-ghost">
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
