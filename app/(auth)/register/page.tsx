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

const registerSchema = z
  .object({
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// ------------------------------------
// Component
// ------------------------------------

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className='text-center flex flex-col gap-4'>
        <h1 className='text-3xl font-bold'>Check your inbox</h1>
        <p className='text-sm'>
          We sent a confirmation link to your email address. Click it to
          activate your account.
        </p>
        <Link href='/login' className='text-booking underline text-sm'>
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold'>JourneyLog</h1>
        <p className='mt-1 text-sm'>Create your account</p>
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
          autoComplete='new-password'
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          id='confirmPassword'
          type='password'
          label='Confirm password'
          placeholder='••••••••'
          autoComplete='new-password'
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {serverError && <p className='text-mandatory text-sm'>{serverError}</p>}

        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className='text-center text-sm'>
        Already have an account?{' '}
        <Link href='/login' className='text-booking underline'>
          Sign in
        </Link>
      </p>
    </div>
  );
}
