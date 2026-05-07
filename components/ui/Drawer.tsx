'use client';

import { X } from 'lucide-react';

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Drawer({ isOpen, onClose, children }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 w-full z-20'>
      <button onClick={onClose} className='absolute right-3 top-3'>
        <X />
      </button>

      {children}
    </div>
  );
}
