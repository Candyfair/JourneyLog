'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// ------------------------------------
// Validation schema
// ------------------------------------

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ------------------------------------
// Component
// ------------------------------------

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError('Invalid email or password.');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold'>JourneyLog</h1>
        <p className='mt-1 text-sm'>Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <Input
          id='email'
          type='email'
          label='Email'
          placeholder='you@example.com'
          autoComplete='email'
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          id='password'
          type='password'
          label='Password'
          placeholder='••••••••'
          autoComplete='current-password'
          error={errors.password?.message}
          {...register('password')}
        />

        {serverError && <p className='text-mandatory text-sm'>{serverError}</p>}

        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className='text-center text-sm'>
        No account yet?{' '}
        <Link href='/register' className='text-booking underline'>
          Create one
        </Link>
      </p>
    </div>
  );
}
