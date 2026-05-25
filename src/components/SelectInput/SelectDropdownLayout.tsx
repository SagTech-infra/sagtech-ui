'use client';

import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

const dropdownVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

type Props = {
  onClose: () => void;
} & PropsWithChildren;

export default function SelectDropdownLayout({ onClose, children }: Props) {
  return (
    <motion.div
      initial="closed"
      animate="open"
      exit="closed"
      variants={dropdownVariants}
      transition={{ duration: 0.15 }}
      onAnimationComplete={(definition) => {
        if (definition === 'closed') {
          onClose();
        }
      }}
      className="absolute mt-8px z-20 py-8px bg-[#1B1B27] border-pr_purple top-[100%] border-[1px] border-solid font-medium w-full leading-24 outline-none rounded-16px"
    >
      {children}
    </motion.div>
  );
}
