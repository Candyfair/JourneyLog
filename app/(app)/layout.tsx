import NavHeader from '@/components/navigation/NavHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavHeader />

      <main className='min-h-screen px-4 pb-8 pt-14'>
        <div className='w-full max-w-2xl mx-auto'>{children}</div>
      </main>
    </>
  );
}
