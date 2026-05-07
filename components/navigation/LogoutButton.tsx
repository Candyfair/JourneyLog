'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleClick() {
    setServerError(null);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setServerError('Server error when logging out.');
      console.error('Logout error:', error);
      return;
    }

    router.push('/login');
    router.refresh();
  }

  return <button onClick={handleClick}>Se déconnecter</button>;
}
