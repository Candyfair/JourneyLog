'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import Drawer from '@/components/ui/Drawer';
import NavMenu from '@/components/navigation/NavMenu';

export default function NavHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className='fixed w-full flex items-center p-8 z-20'>
      <button onClick={() => setIsOpen(true)}>
        <Menu />
      </button>

      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <NavMenu />
      </Drawer>
    </header>
  );
}
