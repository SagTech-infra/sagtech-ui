'use client';

import { useCallback, useState, useEffect } from 'react';
import { hideDocumentScroll } from '../utils/document';

const useModals = () => {
  const [openedModal, setOpenedModal] = useState<boolean>(false);

  const closeModal = useCallback(() => {
    setOpenedModal(false);
  }, []);

  const openModal = useCallback(() => {
    hideDocumentScroll(true);
    setOpenedModal(true);
  }, []);

  useEffect(() => {
    if (openedModal) {
      const timeoutId = setTimeout(() => {
        closeModal();
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [openedModal, closeModal]);

  return {
    closeModal,
    openModal,
  };
};

export default useModals;
