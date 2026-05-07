import Link from 'next/link';
import { LogoutButton } from '@/components/navigation/LogoutButton';

export default function NavMenu() {
  return (
    <div className='flex flex-col justify-between h-full'>
      <div className='flex flex-col gap-4'>
        <Link href='/account'>Mon compte</Link>
        <Link href='/dashboard'>Tableau de bord</Link>
        <LogoutButton />
      </div>
      <Link href='/mentions'>Mentions légales</Link>
    </div>
  );
}
