export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='min-h-screen flex flex-col items-center justify-center px-4'>
      <div className='w-full sm:max-w-[580px]'>{children}</div>
    </main>
  );
}
