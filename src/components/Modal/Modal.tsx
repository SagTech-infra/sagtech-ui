import React from 'react';

interface ModalProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  toggle?: () => void;
  isPartnershipForm?: boolean;
}

export function Modal({ children, isOpen, toggle, isPartnershipForm = false }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape' && typeof toggle === 'function') {
      toggle();
    }
  };

  return (
    <div data-tid="modal" className="fixed inset-0 z-[200] flex w-full justify-center h-full items-center">
      <div
        onClick={toggle}
        onKeyDown={handleKeyDown}
        role="button"
        className="fixed left-0px top-0px z-[200] h-full w-full bg-backdrop"
        tabIndex={0}
        aria-label="Close modal"
      />
      <div
        className={`modalAnim z-[300] mx-8px inline-flex w-full h-[90%] sm:h-[78%] rounded-24px border-[1px] border-solid border-black_3 bg-black_1 p-24px shadow-4xl xs:w-[454px] max-h-screen ${isPartnershipForm ? 'xs:w-[670px] overflow-y-auto custom-scrollbar' : 'xs:w-[454px]'
          } xs:p-32px sm:rounded-40px`}
      >
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
