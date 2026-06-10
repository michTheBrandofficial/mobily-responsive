import { useState } from "react";

export const useModalsBuilder = <
  T extends {
    [index: string]: {
      open: boolean;
      [index: string]: any;
    };
  },
>(
  modalConfigs: T
) => {
  const [modals, setModals] = useState(modalConfigs);
  const modalFunctions = {
    openModal: <K extends keyof typeof modals>(
      modal: K,
      payload: Omit<(typeof modals)[K], "open">
    ) => {
      setModals((p) => ({
        ...p,
        [modal]: {
          ...p[modal],
          ...payload,
          open: true,
        },
      }));
    },
    closeModal: <K extends keyof typeof modals>(
      modal: K,
      payload?: Omit<(typeof modals)[K], "open">
    ) => {
      setModals((p) => ({
        ...p,
        [modal]: {
          ...p[modal],
          ...(payload || {}),
          // don't allow open to be updated, should only be updated by openModal and closeModal
          open: false,
        },
      }));
    },
    returnClose: function returnClose<K extends keyof typeof modals>(modal: K) {
      return () => this.closeModal(modal);
    },
    updateModalData: <K extends keyof typeof modals>(
      modal: K,
      payload: Omit<(typeof modals)[K], "open">
    ) => {
      setModals((p) => ({
        ...p,
        [modal]: {
          ...p[modal],
          ...payload,
          // don't allow open to be updated, should only be updated by openModal and closeModal
          open: p[modal]?.open,
        },
      }));
    },
  };
  return {
    modals,
    modalFunctions,
  };
};
